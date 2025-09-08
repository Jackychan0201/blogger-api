# Blogger API

## A simple API for managing users and blog posts

## Project description

**Tech Stack:** TypeScript · NestJS · PostgreSQL · TypeORM · JWT · Docker · Jest

This API allows users to register, login, and manage their blog posts. Each post is associated with a user, and users can only modify their own posts. JWT is used for authentication and access control.

## Project features
This API provides the following functionality:
* User registration and login
* JWT-based authentication
* Create, update, delete posts (only by the author)
* Get all posts (public)
* Request validation (e.g., email format, required fields)
* Unit tests for services and controllers

## Containerization and deployment
The API is containerized using Docker and can be run locally with Docker Compose:
* API container
* PostgreSQL database container

## Installation and testing the app locally
Here are the steps for local testing of the API:

- Clone the project:
```bash
git clone https://github.com/jackychan0201/blogger-api.git
```
- Navigate to the project directory:
```bash
cd blogger-api
```
- Install all dependencies:
```bash
npm install
```

Then you can either:
- Run the project with Docker Compose:
```bash
docker-compose up --build
```
Or:
- Run the project locally:
```bash
npm run start:dev
```
- Run tests:
```bash
npm run test
```

[!NOTE]
Make sure to have a PostgreSQL database running if you are not using Docker. 
The environment variables are stored in the `.env` file.

## Environment variables
The API uses environment variables for configuration. Here's an example of a `.env` file:
```
# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=3600s

# Postgres
DB_HOST=localhost # for running locally
DB_HOST=db # for running using Docker
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=blogger
```

## Found a bug?
If you find an issue while testing the API or have suggestions for improvements, please contact me via email: y.budzko@softteco.eu


