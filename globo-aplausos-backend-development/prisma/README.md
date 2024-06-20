# Useful Information

## Files and Folders in this directory

- `migrations`: This folder contains your database migrations. Learn more about them in the docs: https://pris.ly/d/understanding-migrations
    - `*/migration.sql`: This file contains the SQL statements that are executed when you run the migration.
    - `migration_lock.toml`: This file contains the state of the migration. It should not be edited manually.
- `schema.mwb`: This is a MySQL Workbench file that contains a visualization of your data model.
- `schema.png`: This is a visualization of your data model.
- `schema.prisma`: This file contains your Prisma schema. Learn more about it in the docs: https://pris.ly/d/prisma-schema
- `seed.ts`: This file contains the script that fills the database with data. You can execute it by running `npm run prisma:update`

## Useful commands:

After editing the schema.prisma file, you need to generate the Prisma Client library

```sh
    npm run prisma:format
```

If someone made changes to the Prisma schema and want to apply them to the database, you need to migrate the database:

```sh
    npm run prisma:update
```

If the changes were made only to the seeed, and you want to apply them to the database, you need to seed the database (inside the seed.ts file there is an option to either reset the database or attempt to update it):

```sh
    npm run prisma:seed
```

If you would like to check if all has worked well, you can open Prisma Studio to view and edit the data in your database:

```sh
    npm run prisma
```
