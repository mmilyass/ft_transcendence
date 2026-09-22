# Variables
COMPOSE = docker compose
APP = npm run start:dev

.PHONY: help all build ins start down restart logs clean

help:
	@echo "Available commands:"
	@echo "  make build    - Setup infrastructure, database, and prepare environment"
	@echo "  make start    - Start NestJS development server"
	@echo "  make down     - Stop Docker containers"
	@echo "  make restart  - Restart containers"
	@echo "  make logs     - View container logs"
	@echo "  make clean    - Reset database and stop containers"
	@echo "  make help     - Show this help message"

all: help

ins:
	touch .env
	cp .env.example .env
	npm i
	npx prisma generate

build: ins
	$(COMPOSE) up -d
	@echo "PostgreSQL is running..."
	npx prisma migrate dev --name init

start:
	$(APP)

down:
	$(COMPOSE) down

restart: down up

logs:
	$(COMPOSE) logs -f

clean:
	npx prisma migrate reset
	$(COMPOSE) down -v