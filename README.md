# Docker Two-Tier Application

A containerized web application built with **Python Flask, PostgreSQL, Docker, and Docker Compose**. This project demonstrates how to build, deploy, and manage a two-tier application using containerization.

[![Docker](https://img.shields.io/badge/Docker-Containerized-blue?logo=docker)](https://www.docker.com/)
[![Python](https://img.shields.io/badge/Python-3.13-blue?logo=python)](https://www.python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue?logo=postgresql)](https://www.postgresql.org/)
[![Flask](https://img.shields.io/badge/Flask-Web%20Framework-black?logo=flask)](https://flask.palletsprojects.com/)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Architecture](#architecture)
5. [Project Structure](#project-structure)
6. [Prerequisites](#prerequisites)
7. [Getting Started](#getting-started)
8. [Access the Application](#access-the-application)
9. [Application Verification](#application-verification)
10. [CRUD Operations](#crud-operations)
11. [Useful Docker Commands](#useful-docker-commands)
12. [Database Persistence](#database-persistence)
13. [Troubleshooting](#troubleshooting)
14. [Security Practices](#security-practices)
15. [Author](#author)

---

## Project Overview

This project implements a two-tier web application:

- **Web Tier:** A Python Flask application served through Gunicorn.
- **Database Tier:** A PostgreSQL 17 database that stores application records.

Docker Compose manages both services, their networking, health checks, and persistent database storage.

The application provides a responsive dashboard where users can create, view, update, and delete records.

## Features

- Responsive web dashboard
- Create, read, update, and delete (CRUD) functionality
- Flask backend with Gunicorn application server
- PostgreSQL 17 database integration
- Docker Compose multi-container deployment
- Application health check
- Database connectivity verification
- Persistent PostgreSQL storage using Docker volumes
- Non-root application container user
- Environment-based database credentials
- Automatic service restart configuration

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Python Flask |
| Application Server | Gunicorn |
| Database | PostgreSQL 17 |
| Containerization | Docker |
| Orchestration | Docker Compose |
| Base Image | Python 3.13 Slim |

## Architecture

```text
             USER / WEB BROWSER
                     |
                     | HTTP :8000
                     |
              FLASK WEB SERVICE
               (Gunicorn)
                     |
                     | DATABASE CONNECTION
                     |
              POSTGRESQL 17
                     |
                     |
              PERSISTENT VOLUME
```

Docker Compose manages the web and database services on a private Docker network.

The database is not directly exposed to the host machine.

## Project Structure

```text
docker-two-tier-application/
│
├── app/
│   ├── app.py
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── templates/
│   │   └── index.html
│   └── static/
│       ├── style.css
│       └── script.js
│
├── db/
│   └── init.sql
│
├── .dockerignore
├── .env.example
├── .gitignore
├── compose.yaml
└── README.md
```

**Important files:**

- `app/app.py` — Flask routes and database operations.
- `app/Dockerfile` — Instructions for building the web application image.
- `compose.yaml` — Defines and manages the application and database services.
- `db/init.sql` — Initializes the database schema.
- `.env.example` — Example database password configuration.
- `.env` — Your private environment configuration. Do not commit this file.

---

## Prerequisites

Install the following before starting:

1. **Git** — To clone the repository.
2. **Docker Engine** — To build and run containers.
3. **Docker Compose plugin** — To manage multiple services.

Verify your installations:

```bash
git --version
docker --version
docker compose version
```

If these commands return version information, the required tools are available.

For installation instructions:

- Docker: https://docs.docker.com/engine/install/
- Docker Compose: https://docs.docker.com/compose/install/linux/

You do not need to install Python or PostgreSQL directly on your host machine. The application dependencies and database run inside containers.

---

## Getting Started

Follow these steps to run the project from a fresh GitHub clone.

### Step 1: Clone the Repository

```bash
git clone https://github.com/abdullahshahid-devops/docker-two-tier-application.git
```

Move into the project directory:

```bash
cd docker-two-tier-application
```

### Step 2: Configure Environment Variables

Create your private environment file:

```bash
cp .env.example .env
```

Open it:

```bash
nano .env
```

You will see:

```env
DB_PASSWORD=replace_with_a_strong_password
```

Replace the example value with your own strong database password.

Save the file:

- Press `CTRL + O`
- Press `ENTER`
- Press `CTRL + X`

**Security note:** Never share your real database password or commit your `.env` file to GitHub.

### Step 3: Build and Start the Application

Run:

```bash
docker compose up -d --build
```

What this command does:

- `up` — Creates and starts the services.
- `-d` — Runs containers in detached mode.
- `--build` — Builds the application image before starting services.

Docker Compose will:

1. Build the Flask application image.
2. Create a Docker network.
3. Create a persistent PostgreSQL volume.
4. Start PostgreSQL.
5. Wait for the database health check.
6. Start the Flask/Gunicorn application.

### Step 4: Verify Containers

Run:

```bash
docker compose ps
```

Both services should be running:

- `web` — Flask/Gunicorn application.
- `db` — PostgreSQL database.

Wait for the services to become healthy before proceeding.

### Step 5: View Application Logs

```bash
docker compose logs
```

To follow logs continuously:

```bash
docker compose logs -f
```

To view only the web application logs:

```bash
docker compose logs web
```

To view database logs:

```bash
docker compose logs db
```

---

## Access the Application

### Local Machine

Open your browser:

```text
http://localhost:8000
```

### AWS EC2 Instance

If you deployed the application on an EC2 Ubuntu instance:

```text
http://YOUR_EC2_PUBLIC_IP:8000
```

Replace `YOUR_EC2_PUBLIC_IP` with your instance's public IP address.

**AWS Security Group requirement:**

Allow inbound TCP traffic on port `8000` from your intended client IP address.

For production deployments, use an appropriately secured reverse proxy and HTTPS rather than exposing an application port publicly without additional protection.

---

## Application Verification

The application provides health-check endpoints.

### 1. Application Health

```bash
curl -i http://localhost:8000/health
```

Expected response:

```http
HTTP/1.1 200 OK
```

```json
{
  "status": "healthy"
}
```

This confirms that the Flask application is responding.

### 2. Database Connectivity

```bash
curl -i http://localhost:8000/db-check
```

Expected response:

```http
HTTP/1.1 200 OK
```

```json
{
  "database": "connected",
  "result": 1
}
```

This confirms that the application can connect to PostgreSQL and execute a test query.

### 3. Retrieve Application Records

```bash
curl http://localhost:8000/items
```

Expected response when no records exist:

```json
{
  "items": []
}
```

---

## CRUD Operations

CRUD means:

- **Create:** Add a new record.
- **Read:** Retrieve existing records.
- **Update:** Modify an existing record.
- **Delete:** Remove a record.

These operations are available through the web dashboard.

### Create

Add a new item using the dashboard's input field and Add Item button.

### Read

View stored records in the Stored Items section.

You can also retrieve records through:

```bash
curl http://localhost:8000/items
```

### Update

Use the Edit or Update functionality in the dashboard to modify an existing item.

### Delete

Use the Delete functionality to remove a record.

Verify the result:

```bash
curl http://localhost:8000/items
```

---

## Useful Docker Commands

Run these commands from the project directory.

| Purpose | Command |
|---|---|
| List running services | `docker compose ps` |
| Build and start | `docker compose up -d --build` |
| Stop services | `docker compose stop` |
| Start stopped services | `docker compose start` |
| View logs | `docker compose logs` |
| Follow logs | `docker compose logs -f` |
| Restart services | `docker compose restart` |
| Stop and remove containers | `docker compose down` |
| Rebuild application | `docker compose up -d --build` |

### Access PostgreSQL

```bash
docker compose exec db psql -U appuser -d twotier
```

Useful PostgreSQL commands:

```sql
\dt
SELECT * FROM items;
\q
```

- `\dt` — Lists database tables.
- `SELECT * FROM items;` — Displays stored records.
- `\q` — Exits PostgreSQL.

---

## Database Persistence

The PostgreSQL database uses a named Docker volume:

```yaml
postgres_data:
```

This volume stores database data outside the container's writable filesystem.

As a result, stopping or removing containers does not automatically remove the database records.

### Important Difference

**Stop and remove containers while preserving database data:**

```bash
docker compose down
```

**Stop containers and delete the database volume:**

```bash
docker compose down -v
```

**WARNING:** The second command permanently removes the Compose-managed database volume and its stored records.

Only use it when you intentionally want to reset the database.

The database initialization script runs when PostgreSQL initializes a new, empty data directory. It does not automatically recreate tables every time the containers restart.

---

## Troubleshooting

### Problem 1: Port 8000 Already in Use

**Possible error:**

```text
Bind for 0.0.0.0:8000 failed: port is already allocated
```

Check which process is using the port:

```bash
sudo ss -ltnp | grep :8000
```

Check running containers:

```bash
docker ps
```

Stop only the conflicting container or service after identifying it.

Do not stop unrelated containers unnecessarily.

### Problem 2: Database Is Not Healthy

Check database logs:

```bash
docker compose logs db
```

Check service status:

```bash
docker compose ps
```

Verify your `.env` file contains a valid `DB_PASSWORD` and that the database service has started successfully.

### Problem 3: Application Cannot Connect to PostgreSQL

Check both services:

```bash
docker compose ps
```

Check application logs:

```bash
docker compose logs web
```

Check database logs:

```bash
docker compose logs db
```

Verify that both services use the same configured database password.

### Problem 4: Application Is Not Responding

Check the application health endpoint:

```bash
curl -i http://localhost:8000/health
```

Check container logs:

```bash
docker compose logs web
```

Check whether the web container is running:

```bash
docker compose ps
```

### Problem 5: Environment Variable Missing

If Docker Compose reports that `DB_PASSWORD` is not set:

```bash
cp .env.example .env
nano .env
```

Set a valid password, save the file, and retry:

```bash
docker compose up -d --build
```

---

## Security Practices

This project includes several basic container security practices:

- Application runs using a non-root Linux user.
- Database credentials are provided through environment variables.
- `.env` is excluded from Git.
- `.env.example` provides a safe configuration template.
- PostgreSQL is not directly published to the host.
- Docker health checks monitor service availability.
- Application and database services communicate through Docker networking.

**Production consideration:** This project is a learning and portfolio application. A production deployment should additionally consider HTTPS, secret management, restricted network access, backups, monitoring, and database access controls.

---

## Author

**Abdullah Shahid**

DevOps Engineer | DevOps & AIOps Practitioner

- GitHub: https://github.com/abdullahshahid-devops
- LinkedIn: https://www.linkedin.com/in/devops-abdullah/

**GitHub Repository:**  
https://github.com/abdullahshahid-devops/docker-two-tier-application

---

## Learning Outcomes

By building and deploying this project, you practice:

- Containerizing a Python Flask application.
- Writing and building a Dockerfile.
- Managing multiple containers with Docker Compose.
- Connecting a web application to PostgreSQL.
- Configuring environment variables.
- Implementing persistent Docker volumes.
- Using container health checks.
- Testing application and database connectivity.
- Performing CRUD operations.
- Troubleshooting containerized applications.

**Project Goal:** Demonstrate practical understanding of Docker, Docker Compose, Flask, PostgreSQL, and multi-container application deployment.
