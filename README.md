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
2. Create the .env File
3. 
Copy the .env-template file to create the required .env file:

```sh
cp .env-template .env
```

Ensure the .env file contains the necessary environment variables. Modify values as needed for your setup.

## Important Note

When running in Docker (or anywhere not on localhost), set NEXT_PUBLIC_ACTIVE_PROFILE to dev in your .env file due to specifics of cross-origin cookie sharing requiring HTTPS communication for SameSite=None cookies used for authentication.

# 3. Build and Run

## Development Environment
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
docker-compose down -v
```

## Troubleshooting
If you encounter issues, please ensure:

Docker and Docker Compose are correctly installed and running.
You have cloned the repository with submodules.

For further assistance, please refer to the Docker and Docker Compose documentation.
