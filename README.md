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
- Docker Scout scan completed: health score A (94%).
- Latest scan: 0 critical, 1 high, 1 medium, and 26 low findings.
- Remaining findings: CVE-2026-85091 (zlib1g) and CVE-2025-45582 (tar); current Debian 13 repositories offer no candidate updates.
- Copyleft-license policy warning remains under review.
- SBOM and provenance generated using Docker Buildx.

## Skills Demonstrated

Docker, Docker Compose, Flask, PostgreSQL, container networking,
persistent volumes, health checks, troubleshooting, and basic security.

## Project Status

Application health, database connectivity, API operations, and
persistence have been verified. GitHub publication is complete.
Security scanning is complete for the current image, with the
remaining findings documented for follow-up.
