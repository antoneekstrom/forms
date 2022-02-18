## Setup with docker
Below are instructions for setting up and running the project.

### Clone the repository
`git clone https://github.com/zimbosaurus/forms`

### Add .env (development)
Configure a `.env` file to be used by docker-compose.
There is a file `defaults.env` which one can rename to `.env` for a default development configuration.

### Install dependencies
One might also want to install dependencies in the project in addition to in the containers, so one can develop without errors.
```powershell
cd backend
yarn install

cd ..

cd frontend
yarn install
```

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
