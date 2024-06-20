# This is a tutorial to run the backend in Linux

If you are using Linux, and you cannot run the backend, you can try to run it in a Docker container. The following instructions were tested on Ubuntu 20.04.6 LTS.

## Step 1. Dependencies and Repositories

### Clone the repository

```bash
git clone https://tools.ages.pucrs.br/globo-aplausos/globo-aplausos-backend.git
cd globo-aplausos-backend
```

### Install Node.js

```bash
sudo apt update
sudo apt install nodejs
```

### Install NPM

```bash
sudo apt update
sudo apt install npm
```

### Install Docker

```bash
sudo apt update
sudo snap install docker
```

## Step 2. Necessary files and folders

Also, you should have a folder called `database` in the root of the project, with some files and folders inside, as shown below:

```bash
database
├── dumps
├── Dockerfile
└── privileges.sql
```

The `dumps` folder should contain the database dumps, which come from Docker containers, you should not edit them manually.

The `Dockerfile` should contain the following code:

```dockerfile
FROM mysql:latest

COPY ./privileges.sql /docker-entrypoint-initdb.d/

EXPOSE 3306
```

It is important to note that the `privileges.sql` file is copied to the `docker-entrypoint-initdb.d` folder, which means that it will be executed when the container is created.

The privileges.sql file should contain the following code:

```sql
-- User ('globo') should comply with .env file
GRANT ALL PRIVILEGES ON *.* TO 'globo'@'%' WITH GRANT OPTION;
GRANT CREATE ON *.* TO 'globo'@'%';
FLUSH PRIVILEGES;
```

This file is used to grant privileges to the user that will be created in the database.

Last but not least, you should have a `.env` file in the root of the project, with code similar to the `.env.example` file, but with the correct values for your environment. The `.env` file DATABASE_USER variable should match the one in the `privileges.sql` file.

## Step 3. Docker

Make sure that you have Docker installed and running. You can check it with the following commands:

```bash
sudo docker --version
sudo docker info
```

### Obs:

This tutorial was tested with Docker version 20.10.24, build 297e128.

### Check if the containers are running

```bash
sudo docker ps
```

If there is already a container running this project's folder, stop them and then follow along.

### Build the Docker containers

```bash
cd globo-aplausos-backend
sudo docker compose up --build
```

### If you intend on running the backend locally, or the API image is not working via docker, kill its container

```bash
sudo docker container kill globo_aplausos_backend
```

## Step 4. Backend

If at any point you receive an EACCES error, try to run the commands with `sudo`. If they don't work, try to change the permissions of the files and folders. You can do this with the following command:

```bash
sudo chmod -R 777 .
```

### Install the dependencies

```bash
npm install
```

### Get types for Prisma in the project

```bash
npm run prisma:format
```

If you receive an error, try to run the following commands:


```bash
npx prisma format
npx prisma generate
```

### Import tables to the database

```bash
npm run prisma:update
```

If you receive an error like:

```bash
Error: P3006

Migration `2023.........._..` failed to apply cleanly to the shadow database 
Error code: P3018
Error:
  A migration failed to apply. New migrations cannot be applied until the error is recovered from. Read more about how to resolve migration issues in the documentation: https://pris.ly/d/migrate-resolve

Migration name: `2023.........._..`

Database error code: 1146

Database error:
  Table 'globo-aplausos-backend.shadow_db...' doesn't exist

Please check the query number 1 from the migration file.
```

Try to delete the `prisma/migrations` folder and run the following command:

```bash
npx prisma migrate dev --name init
```

If this works, **do not** commit the `prisma/migrations` folder, as it will cause problems for other developers.

### Import data to the database

```bash
npm run prisma:seed
```

### Run the backend

```bash
npm run dev
```

### Check if the database was setup correctly

```bash
npm run prisma
```

## Other Possibly Useful Commands

### Stop the Docker containers

```bash
sudo docker compose down
```

### Delete the Docker containers

```bash
sudo docker compose kill {container_name}
```

### Delete the Docker images

```bash
sudo docker rmi {image_name}
```

### Delete the Docker volumes

```bash
sudo docker volume rm {volume_name}
```

### Delete the Docker networks

```bash
sudo docker network rm {network_name}
```

### Delete the Docker containers, images, volumes and networks

```bash
sudo docker system prune
```

### Delete port bindings

```bash
sudo kill `sudo lsof -t -i:{port_number}`
```
