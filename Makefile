NAME = app

COMPOSE_FILE = infra/docker-compose.yml

all: help

build: env ## build the images
	docker compose -p $(NAME) -f $(COMPOSE_FILE) build

up: build ## run the containers
	docker compose -p $(NAME) -f $(COMPOSE_FILE) up -d

down: ## stops all the containers
	docker compose -p $(NAME) -f $(COMPOSE_FILE) down

logs: ## show the logs of the containers
	docker compose -p $(NAME) -f $(COMPOSE_FILE) logs -f 

re: down up ## restart the containers

env: ## create .env files from .env.example files if not exist
	@find . -name ".*env.example" -exec sh -c 'cp -n "$$0" "$${0%.example}"' {} \;

clean: ## removes all unused Docker resources
	docker system prune -f

volume-clean: ## removes all unused Docker volumes
	docker volume prune -f

hard-clean: ## removes everything (containers, images, volumes, networks)
	@docker stop $$(docker ps -qa) || true
	@docker rm $$(docker ps -qa) || true
	@docker rmi -f $$(docker images -qa) || true
	@docker volume rm $$(docker volume ls -q) || true
	@docker network rm $$(docker network ls -q) 2>/dev/null || true

help: ## show this help message
	@echo "Usage: make [target]"
	@echo ""
	@echo "\033[0;36m[INFO]\033[0m	make sure to run 'make env' before running any other target."
	@echo "	fill in the .env files with the appropriate values."
	@echo ""
	@echo "Targets:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z0-9_.-]+[^:]*:.*?## / {printf "  \033[38;2;0;255;0m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST) | sed 's/:.*//'

.PHONY: all build up down re clean volume-clean hard-clean help