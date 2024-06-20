FROM mysql:latest

COPY ./privileges.sql /docker-entrypoint-initdb.d/
COPY ./coins.sql /docker-entrypoint-initdb.d/

EXPOSE 3306