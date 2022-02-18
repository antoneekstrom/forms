## Setup with docker
Below are instructions for setting up and running the project.


### Add .env (development)
Configure a `.env` file to be used by `docker-compose.dev.yaml`.
There is a file `defaults.env` which one can rename to `.env` for a default configuration.


### Start containers
Run the following command from the root of the project:

#### Development
```
docker-compose -f docker-compose.dev.yaml up -d --build
```

#### Production
```
docker-compose -f docker-compose.yaml up -d --build
```


### Migrate database
When running for the first time you will have to migrate the database. The commands below need to be executed inside the `backend` docker container.

#### Development
```
yarn prisma migrate dev --name plupp
```

#### Production
```
yarn prisma deploy dev --name plupp
```