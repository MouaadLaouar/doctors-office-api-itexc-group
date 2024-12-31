# Doctors Office API

This is a NestJS application with Prisma and PostgreSQL, designed for managing a doctor's office system. This project uses JWT for authentication, and it comes with a Dockerfile for containerization.

## Prerequisites

- Node.js >= 18
- PostgreSQL
- Docker

## Installation

### Step 1: Clone the repository

```bash
git clone [<your-repo-url>](https://github.com/MouaadLaouar/doctors-office-api-itexc-group.git)
cd doctors-office-api-itexc-group
```

### Step 2: Install dependencies

Run the following command to install the necessary dependencies:

```bash
npm install
```

### Step 3: Configure environment variables

Create a .env file in the root directory by copying the provided env.example file:

```bash
cp env.example .env
```

Modify the .env file to match your local environment settings. Here is an example of what your .env file should look like:

```
PORT=8888
BASE_URL="/api/v1"
DATABASE_URL="postgresql://<USER>:<PASSWORD>@localhost:5432/<DATABASE>?schema=public"
JWT_SECRET="SA0IxWPHuqGPQhuY6uHfV7gRStT2XtGYmoXRNazuW8Y"
```

- PORT : The port your application will run on (default: 8888).
- BASE_URL :  The base URL for your API (default: /api/v1).
- DATABASE_URL : The connection string for your PostgreSQL database.
- JWT_SECRET : A secret key used for JWT authentication.

### Step 4: Prisma setup

### Step 5: Run the application

Run Prisma migrations to set up your PostgreSQL database schema:

```bash
npx prisma migrate deploy
```
This will apply any pending migrations to your PostgreSQL database.

Before running the application, make sure that your PostgreSQL database is set up and accessible.

#### Running without Docker

Run the NestJS app with the following command:

```bash
npm run start:dev
```

The app should now be running on http://localhost:8888 (or another port if you modified the PORT value in .env).

#### Running with Docker

Alternatively, you can run the app with Docker. The repository includes a Dockerfile to containerize the application.

1. Build and start the containers using Docker Compose:

```bash
docker-compose up --build
```

This command will build the Docker images and start the app and PostgreSQL container defined in docker-compose.yml.

2. Access the app:

The app will be available at http://localhost:8888.

### Step 6: Verify the app

Once everything is running, you can test your API by making requests to:

```bash
http://localhost:8888/api/v1
```
