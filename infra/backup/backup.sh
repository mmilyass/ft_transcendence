#!/bin/sh
# Automated Postgres backups for both databases in the stack.
#
# Runs in its own container (see infra/docker-compose.yml, service
# "backup"), joined to both auth-net and slots-net so it can reach
# auth_db and slots_db directly. Every $BACKUP_INTERVAL_SECONDS it takes a
# pg_dump of each database, gzips it into /backups (a named volume, so
# backups survive `docker compose down` and container recreation), and
# prunes anything past $BACKUP_RETENTION_COUNT per database.
#
# Disaster recovery: see infra/backup/restore.sh.
set -eu

BACKUP_DIR="/backups"
INTERVAL="${BACKUP_INTERVAL_SECONDS:-86400}"
RETENTION="${BACKUP_RETENTION_COUNT:-7}"

mkdir -p "$BACKUP_DIR"

wait_for_db() {
  host="$1"
  tries=0
  until PGPASSWORD="$DB_PASSWORD" pg_isready -h "$host" -U "$DB_USER" >/dev/null 2>&1; do
    tries=$((tries + 1))
    if [ "$tries" -ge 30 ]; then
      echo "[backup] $host never became ready after $tries attempts, giving up on this cycle" >&2
      return 1
    fi
    sleep 2
  done
  return 0
}

dump_one() {
  host="$1"
  db="$2"
  label="$3"

  if ! wait_for_db "$host"; then
    return 1
  fi

  timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
  target="$BACKUP_DIR/${label}_${timestamp}.sql.gz"
  raw_tmp="${target}.raw.tmp"

  echo "[backup] dumping $label ($db@$host) -> $target"

  # Dump to a plain temp file first and check pg_dump's own exit code
  # directly — piping straight into gzip hides pg_dump failures behind
  # gzip's exit status (gzip happily "succeeds" compressing zero bytes of
  # input), which is exactly how an earlier version of this script wrote
  # empty, useless .sql.gz files while logging "ok".
  if ! PGPASSWORD="$DB_PASSWORD" pg_dump -h "$host" -U "$DB_USER" -d "$db" > "$raw_tmp"; then
    echo "[backup] pg_dump FAILED for $label — leaving previous backups untouched" >&2
    rm -f "$raw_tmp"
    return 1
  fi

  if [ ! -s "$raw_tmp" ]; then
    echo "[backup] pg_dump produced an empty file for $label — treating as a failure" >&2
    rm -f "$raw_tmp"
    return 1
  fi

  gzip -c "$raw_tmp" > "$target"
  rm -f "$raw_tmp"
  echo "[backup] ok: $target ($(du -h "$target" | cut -f1))"

  # Retention: keep only the newest $RETENTION dumps for this database.
  ls -1t "$BACKUP_DIR"/"${label}"_*.sql.gz 2>/dev/null | tail -n +"$((RETENTION + 1))" | while read -r old; do
    echo "[backup] pruning old backup: $old"
    rm -f "$old"
  done
}

echo "[backup] automated backup service started. interval=${INTERVAL}s retention=${RETENTION} per database"

while true; do
  ok=1
  dump_one "$AUTH_DB_HOST" "$AUTH_DB_NAME" "auth_db" || ok=0
  dump_one "$SLOTS_DB_HOST" "$SLOTS_DB_NAME" "slots_db" || ok=0

  if [ "$ok" = "1" ]; then
    echo "[backup] cycle complete, all databases backed up successfully"
  else
    echo "[backup] cycle complete WITH ERRORS — check logs above" >&2
  fi

  sleep "$INTERVAL"
done
