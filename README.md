# Docker Two-Tier Application

A hands-on DevOps portfolio project using Flask, Gunicorn, PostgreSQL, Docker, and Docker Compose.

## Architecture

- Flask REST API served by Gunicorn.
- PostgreSQL 17 database.
- Docker Compose for service orchestration.
- Named volume for persistent database storage.
- Non-root application container.
- Health checks and private database networking.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | / | Application information |
| GET | /health | Application health |
| GET | /db-check | Database connectivity |
| POST | /items | Create an item |
| GET | /items | List items |

## Run the Project

Create a local `.env` file with a strong `DB_PASSWORD`, then run:

    docker compose up -d --build
    docker compose ps

## Verify

    curl http://localhost:8000/health
    curl http://localhost:8000/db-check
    curl http://localhost:8000/items

Create a test item:

    curl -X POST http://localhost:8000/items \
      -H "Content-Type: application/json" \
      -d '{"name":"Test item"}'

## Security

- Application runs as a non-root user.
- Database port is not published to the host.
- Web port binds to localhost.
- `.env` is excluded from Git.
- Python dependencies are pinned.
- Image vulnerability scanning remains pending.

## Skills Demonstrated

Docker, Docker Compose, Flask, PostgreSQL, container networking,
persistent volumes, health checks, troubleshooting, and basic security.

## Project Status

Application, database connectivity, API operations, and persistence
have been verified. GitHub publication and vulnerability scanning
remain to be completed.
