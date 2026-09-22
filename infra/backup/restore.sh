#!/bin/sh
# Disaster recovery: restore one database from its most recent automated
# backup (or a specific one you name).
#
# Usage (run inside the backup container, e.g.
#   docker compose -p app -f infra/docker-compose.yml exec backup sh infra/backup/restore.sh auth_db
# or, from the host, `docker exec -it backup sh /app/restore.sh auth_db`):
#
#   ./restore.sh <auth_db|slots_db> [path/to/specific_backup.sql.gz]
#
# This DROPS and recreates the target database's data before restoring —
# it is destructive by design (that's what "restore" means) and asks for
# confirmation before doing anything.
set -eu

BACKUP_DIR="/backups"
LABEL="${1:?Usage: restore.sh <auth_db|slots_db> [backup_file]}"

case "$LABEL" in
  auth_db)
    HOST="$AUTH_DB_HOST"
    DB="$AUTH_DB_NAME"
    ;;
  slots_db)
    HOST="$SLOTS_DB_HOST"
    DB="$SLOTS_DB_NAME"
    ;;
  *)
    echo "Unknown target '$LABEL' — expected 'auth_db' or 'slots_db'" >&2
    exit 1
    ;;
esac

FILE="${2:-$(ls -1t "$BACKUP_DIR/${LABEL}"_*.sql.gz 2>/dev/null | head -n1)}"

if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
  echo "No backup found for $LABEL in $BACKUP_DIR" >&2
  exit 1
fi

echo "About to restore $DB@$HOST from $FILE"
echo "This will DROP all current data in that database. Type 'yes' to continue:"
read -r confirm
if [ "$confirm" != "yes" ]; then
  echo "Aborted."
  exit 1
fi

echo "[restore] dropping and recreating $DB..."
PGPASSWORD="$DB_PASSWORD" psql -h "$HOST" -U "$DB_USER" -d postgres \
  -c "DROP DATABASE IF EXISTS \"$DB\";" \
  -c "CREATE DATABASE \"$DB\" OWNER \"$DB_USER\";"

echo "[restore] restoring from $FILE..."
gunzip -c "$FILE" | PGPASSWORD="$DB_PASSWORD" psql -h "$HOST" -U "$DB_USER" -d "$DB"

echo "[restore] done. Restart the owning service (auth or slots) so its Prisma client reconnects cleanly."
