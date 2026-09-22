*This project has been created as part of the 42 curriculum by yaait-am, bamezoua, habenydi, ybounite, imeftah-.*

# Maou3idy

A microservices web platform for booking, managing and reviewing doctor appointments — patients search doctors, book and manage appointments in real time, and leave reviews; doctors manage their schedule, services and patients; admins moderate the whole platform.

## Description

Maou3idy ("my appointment") turns the classic ft_transcendence brief into a **healthcare booking system** — the subject explicitly allows this (see "Productivity and Tools → Booking System" in the module catalog: *"Reserve resources (rooms, equipment, appointments), calendar, and notifications"*).

Three roles share the platform:

- **Patients** register, search doctors by specialty/location, book an available slot, get reminded before their appointment, and leave a rating + review once it's completed.
- **Doctors** apply for verification (with a medical license upload), get approved by an admin, then manage their working hours/slots, services, and patient appointments from a dashboard.
- **Admins** verify or reject doctor applications, manage users (promote/ban/disable/delete), and watch platform activity (audit logs, registration trends, appointment volume) from an analytics dashboard.

Under the hood it's a genuine microservices system: five independently deployable services behind a single reverse proxy, communicating over both synchronous HTTP (via a gateway) and asynchronous events (via RabbitMQ) — not a monolith split into folders.

## Instructions

### Prerequisites

- Docker + Docker Compose (or Podman with compose compatibility)
- `make`
- A Google OAuth client ID/secret if you want "Sign in with Google" to work (optional — email/password auth works without it)

### Run it

```bash
git clone <this-repo-url>
cd ft_transcendence.1337

# 1. create every service's .env from its .env.example (only fills in files that don't exist yet)
make env

# 2. edit the generated .env files — at minimum set real values for:
#    apps/auth/.env        -> DATABASE_URL, JWT secrets, GOOGLE_CLIENT_ID/SECRET, mail creds
#    apps/auth/.db.env      apps/slots/.db.env   -> Postgres user/password/db name
#    apps/api-gateway/.env -> NGINX_URL (must be the exact HTTPS origin below, see note),
#                             AUTH_SERVICE_URI, APPOINTMENT_SERVICE_URI
#    apps/frontend/.env     -> NEXT_PUBLIC_URL (same HTTPS origin + /api), INTERNAL_API_URL

# 3. build and start every container
make up
```

That's it — one command (`make up`) builds and starts all ten containers (nginx, api-gateway, frontend, auth + auth_db, slots + slots_db, notification, rabbitmq, backup).

The app is served over **HTTPS with a self-signed certificate**, generated automatically on first boot (`apps/nginx/entrypoint.sh`) — your browser will warn about it being untrusted, which is expected for a self-signed cert; accept it to continue. It's reachable at **https://localhost:4430** (plain `http://localhost:8000` redirects there automatically). Port 4430 rather than the standard 443 is a local-dev workaround for environments that can't bind privileged ports without extra setup (e.g. rootless Docker) — if your host can bind 443 directly, change nginx's `"4430:443"` mapping in `infra/docker-compose.yml` to `"443:443"` and clear `HTTPS_REDIRECT_PORT` in that same service block, and update `NGINX_URL`/`NEXT_PUBLIC_URL` above to drop the `:4430`.

### Other Makefile targets

| Target | What it does |
|---|---|
| `make env` | Copies every `*.env.example` to `*.env` (skips files that already exist) |
| `make build` | Builds all images without starting them |
| `make up` | Builds (if needed) and starts everything, detached |
| `make down` | Stops and removes all containers |
| `make re` | `down` then `up` |
| `make logs` | Tails logs for every service |
| `make clean` / `make volume-clean` / `make hard-clean` | Prune unused Docker resources, volumes, or everything (containers/images/volumes/networks) |

### Seeding an admin account

The `auth` service seeds one admin account on startup from `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` in `apps/auth/.env`, and emits an event so the `slots` service creates the matching record — set those three variables before first boot if you want an admin ready immediately.

## Resources

- [NestJS documentation](https://docs.nestjs.com/)
- [Next.js documentation](https://nextjs.org/docs)
- [Prisma documentation](https://www.prisma.io/docs)
- [Spring Cloud Gateway documentation](https://spring.io/projects/spring-cloud-gateway)
- [RabbitMQ tutorials](https://www.rabbitmq.com/tutorials)
- [Tailwind CSS documentation](https://tailwindcss.com/docs)

## Team Information

| Login | Name | Primary area |
|---|---|---|
| yaait-am | Yassir Ait Ammi | Backend (auth/reviews/notifications), gateway CORS, Frontend API , integration debugging |
| bamezoua | Bouhcine Amezouar | appointments service/Slots, Frontend API |
| habenydi | Hassan Benydir | env/compose updates, register-flow fixes,  infra/Docker, Networking |
| ybounite | Youssef Bounite | create services logic, Frontend API |
| imeftah- | Ilyass Meftah El Menani | Platform design (UI/UX) — the Tailwind design system and page layouts implemented across the frontend are based on their designs

## Project Management

- **Workflow:** feature branches off `development`, merged back via pull requests (`feature/add-review`, `feature/https`, `feature/slots`, `feature/register-error`, `feature/doctor-services`, …) rather than committing straight to `development`.
- **Task splitting:** by service/domain — one service (auth, slots, gateway, frontend) tends to have one primary owner per feature branch, verified against the actual PR history rather than assumed.
- **Planning & Coordination:** Tasks were organized and tracked using **Trello**, while **GitHub** was used for pull requests, code reviews, issue tracking, and project collaboration. Team communication, coordination, and troubleshooting were handled through **Discord**, allowing members to discuss progress, resolve blockers, and coordinate feature development throughout the project.

- **Team Communication:** The team maintained regular communication through Discord and coordinated development activities using GitHub and Trello to ensure features were delivered and reviewed efficiently.
## Technical Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js 16 (App Router) + React 19 + Tailwind CSS v4 | App Router gives real server components where it matters (admin pages fetch server-side), Tailwind keeps a consistent design-token system across ~45 routes without hand-rolled CSS |
| Auth/Reviews/Notifications service | NestJS 11 + Prisma + Postgres | class-validator DTOs give backend input validation for free, Prisma keeps the schema and migrations explicit |
| Slots/Appointments service | NestJS 11 + Prisma + Postgres | Isolated database (`slots_db`) so booking-domain writes never contend with the auth domain |
| Notification service | NestJS 11 microservice (RabbitMQ transport only, no HTTP) | Pure event consumer — decouples "something happened" from "who needs to know about it" |
| API Gateway | Java 21 + Spring Cloud Gateway (WebMVC) | Single entry point for routing + CORS policy + service-availability checks, independent of the Node services' runtime |
| Messaging | RabbitMQ, topic exchange (`domain_events`), one queue per consuming service | Lets `auth`, `slots`, and `notification` each react to the same event (e.g. `appointment.completed`) without polling or direct service-to-service calls |
| Reverse proxy + TLS termination | nginx, self-signed cert generated on first boot | Single public HTTPS entrypoint, routes `/` to the frontend and `/api` to the gateway; plain HTTP redirects to HTTPS (including `/api` — the API is never served unencrypted) |
| Auth | JWT (httpOnly cookie) + Google OAuth 2.0 (Passport) | Stateless auth that still supports a social-login path |
| File storage | Cloudinary | Avatars and doctor medical-license documents, no local disk state to manage across containers |
| Containerization | Docker Compose, one `Makefile` entrypoint | Whole stack reproducible with `make up` |
| Backups | A dedicated `backup` container (`postgres:15` image, no custom build) running a small shell script | Daily `pg_dump` of both databases with retention pruning, joined to both `auth-net` and `slots-net` so it reaches each database directly without going through either app service |

## Database Schema

Two separate Postgres databases, one per owning service (this is the microservices boundary — no service reaches into another's tables directly; cross-service consistency is handled by RabbitMQ events, e.g. `doctor.updated`).

**`auth_db`** (owned by the `auth` service)
- `User` — email/password (bcrypt), role (`USER`/`DOCTOR`/`ADMIN`/`PENDING_DOCTOR`/`REJECTED`/`BANNED`), profile fields
- `Doctor` — 1:1 with `User`, specialty, bio, license info, rating/reviewCount/score, verified flag
- `DoctorLocation` — 1:many with `Doctor`
- `DoctorPatient` — join table tracking which patients a doctor has seen
- `Review` — 1 per (doctor, patient) pair, rating 1–5 + optional comment, enforced by upsert-on-conflict rather than allowing duplicates
- `Notification` — per-user, title/message/isRead, fed by RabbitMQ events from every service
- `Auditlog` — admin/doctor/patient action trail
- `UserStats` / `Stats` — per-user and platform-wide counters surfaced on the analytics dashboards

**`slots_db`** / `nest_db` (owned by the `slots` service)
- `User`, `Doctor` — thin mirrors of the auth-owned records, kept in sync via events, so booking logic never needs a cross-service call on the hot path
- `Category`, `Service` — what a doctor offers and how long/what it costs
- `Slots` — a doctor's bookable time windows
- `Appointment` — an actual booking made against a slot/service, status-tracked (`PENDING`/`CONFIRMED`/`COMPLETED`/`CANCELED`)

Booking correctness under concurrency is handled with a conditional `updateMany` (claim only if still free) instead of read-then-write, so two patients racing for the same slot can't both win it.

## Features List

| Feature | Owner (service) |
|---|---|
| Email/password + Google OAuth 2.0 login, JWT cookie sessions |  `yaait-am` |
| Role-based access control (patient/doctor/admin) with an admin panel to promote/ban/disable/delete users | `yaait-am` |
| Doctor application + admin verification workflow (license upload via Cloudinary) | `yaait-am` |
| Doctor search with specialty/location filters, pagination, and a scoring formula (rating + patient volume + experience) | `yaait-am` |
| Slot-based appointment booking with race-safe double-booking prevention | `bamezoua` + `ybounite` |
| Doctor schedule/service/category management | `bamezoua` + `ybounite` |
| Appointment reminders and status-change notifications | `bamezoua` → RabbitMQ → `habenydi` |
| Post-appointment rating + review, with live doctor rating recalculation | `yaait-am` |
| In-app notification center | `yaait-am` |
| Admin analytics dashboard — server-rendered stats, a live-polling "Platform Pulse" section, registration-trend chart with CSV export | `yaait-am` |
| Privacy Policy / Terms of Service pages | `imeftah-` |
| Public system status page (auth/appointment/message-broker health, server-rendered) | `yaait-am` |
| Automated daily database backups + documented disaster recovery | `habenydi` |
| Progressive Web App — installable, offline app-shell fallback | `yaait-am` |
| GDPR self-service: export my data (JSON download) + confirmed account deletion, both with confirmation emails | `yaait-am` |
| Multi-language UI (English/French/Arabic) with RTL support and a navbar language switcher | `imeftah-` |
| HTTPS (self-signed cert generated on boot, HTTP→HTTPS redirect, TLS 1.2/1.3) | `habenydi` |

## Modules

| Module | Type | Pts | Status |
|---|---|---|---|
| Use a framework/library, frontend and backend | Major | 2 | ✅ Done |
| Use an ORM (Prisma) | Minor | 1 | ✅ Done |
| Backend built as microservices | Major | 2 | ✅ Done |
| OAuth 2.0 (Google) | Minor | 1 | ✅ Done |
| Advanced user permissions (RBAC + admin panel) | Major | 2 | ✅ Done |
| File upload system (Cloudinary) | Minor | 1 | ✅ Done |
| Advanced search with filters, sort & pagination | Minor | 1 | ✅ Done |
| Custom design system (10+ reusable components) | Minor | 1 | ✅ Done |
| Complete notification system (create/update/delete) | Minor | 1 | ✅ Done |
| Server-side rendering | Minor | 1 | ✅ Done |
| Data analytics dashboard with visualization | Major | 2 | ✅ Done |
| Health check + status page + automated backups | Minor | 1 | ✅ Done |
| Progressive Web App (PWA) | Minor | 1 | ✅ Done |
| GDPR compliance (data export, confirmed deletion) | Minor | 1 | ✅ Done |
| Support for multiple languages (EN/FR/AR) | Minor | 1 | ✅ Done |
| **Total claimed** | | **19** | |


## Team Contributions

### yaait-am
- Designed and implemented the **Authentication Service**.
- Developed the **Notification Service** and notification workflows.
- Implemented **role management** and authorization logic.
- Built and maintained the **API Gateway** for service routing and communication.
- Developed the **Reviews** feature, including review creation and management.

### habenydi
- Designed and implemented the project's **DevOps infrastructure**.
- Configured **Docker** containers and development environments.
- Managed service networking and container communication.
- Contributed to the overall **system architecture** and deployment setup.

### bamezoua
- Implemented the core **booking logic**.
- Developed the **slot creation and management** functionality.
- Built the **appointment scheduling** workflow.
- Implemented appointment **cancellation** and **completion** processes.

### ybounite
- Developed the **Doctor Services** module.
- Implemented service creation and management for doctors.
- Contributed to the business logic related to healthcare services.

### imeftah
- Designed the overall **UI/UX** of the project.
- Created the application's visual identity and layouts.
- Defined the design system and styling guidelines used throughout the frontend.
- Worked on component appearance and user experience consistency.