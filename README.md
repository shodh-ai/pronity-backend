# Node.js Backend

This repository contains a Node.js backend application that can be run using Docker Compose.

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/shodh-ai/pronity-backend.git
cd pronity-backend
```

### 2. Make the entrypoint script executable

Before running the application, you need to make the entrypoint script executable:

```bash
chmod +x entrypoint.sh
```

### 3. Start the application

Use Docker Compose to build and start the application:

```bash
docker compose up
```

To run the application in detached mode (in the background):

```bash
docker compose up -d
```

### 4. Stop the application

To stop the running containers:

```bash
docker compose down
```