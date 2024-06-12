# Front-end Submodule

## Overview
This submodule is the front-end part of the project. It has separate Dockerfiles for development and production environments. This README provides instructions on how to build and run the front-end application using Docker Compose.

## Repository Structure
```
front/
├── Dockerfile.dev
├── Dockerfile.prod
├── docker-compose.yml
└── ...
```

## Prerequisites
- Docker Engine

## How to Build and Run

# 1. Clone the Repository
Clone the parent repository along with its submodules:

```sh
git clone --recurse-submodules <repository-url>
cd project-root/front
```

### 2. Build and Run
Development Environment
Navigate to the front directory and build the Docker image for development:

```sh
cd front
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

## Production Environment
For production, use the production Dockerfile:

```sh
cd front
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

## Stopping the Containers
To stop the running containers, use the following command:

```sh
docker-compose down
```

## Cleaning Up
To remove all containers, networks, and volumes created by Docker Compose, use:

```sh
Copy code
docker-compose down -v
```

## Using .env
To use an .env file for environment variables, add the env_file section in the docker-compose.yml:

```yaml
services:
    main:
        image: "front-dev"
        build:
            context: .
            dockerfile: Dockerfile.dev
        container_name: "front-dev"
        ports:
            - "3000:3000"
        env_file:
            - .env
```

## Troubleshooting
If you encounter issues, please ensure:

Docker and Docker Compose are correctly installed and running.
You have cloned the repository with submodules.

For further assistance, please refer to the Docker and Docker Compose documentation.
