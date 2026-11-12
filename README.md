# Docker Two-Tier App

A containerized web application built using Flask, PostgreSQL, Docker, and Docker Compose.

## Features

- Professional responsive dashboard
- Create, read, update, and delete records (CRUD)
- PostgreSQL database integration
- Application and database health checks
- Persistent database storage
- Non-root Docker container
- Docker Compose orchestration

## Technology Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Python Flask
- Application Server: Gunicorn
- Database: PostgreSQL 17
- Containers: Docker
- Orchestration: Docker Compose

## Architecture

Browser → Flask Application → PostgreSQL

## Project Structure

- app/ — Application source, frontend, and Dockerfile
- db/ — Database initialization
- compose.yaml — Service orchestration
- README.md — Documentation

## Deployment

Create a `.env` file:

    DB_PASSWORD=your_strong_password

Start the application:

    docker compose up -d --build

Check services:

    docker compose ps

## Verification

    curl http://localhost:8000/health
    curl http://localhost:8000/db-check
    curl http://localhost:8000/items

Open: http://localhost:8000

## Database Persistence

PostgreSQL data is stored in the `postgres_data` Docker volume.

Avoid `docker compose down -v` unless you intend to delete database data.

## Security

- Non-root application user
- Environment-based database credentials
- `.env` excluded from Git
- PostgreSQL not directly exposed to the host
- Docker health checks

## Author

**Abdullah Shahid**

GitHub: https://github.com/abdullahshahid-devops

LinkedIn: https://www.linkedin.com/in/devops-abdullah/
