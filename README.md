# Tictactoe
A small TicTacToe game with NextJs and NestJS.



## Installation
Clone the project and go to the root folder.

`npm run dev:setup`

This will install all the dependencies from the two services (API and APP).

## Start
Copy the .env.example file to .env file and write the proper variables:
```
DATABASE=mongodb
DATABASE_USER=tbd
DATABASE_PASSWORD=tbd
DATABASE_ROOT=tbd
DATABASE_ROOT_PASSWORD=tbd
DATABASE_HOST="ex.: localhost"
DATABASE_PORT="27017"
DATABASE_NAME="ex.: myDb or dbName"
# Change the url with proper variables
DATABASE_URL="<database>://<database_user>:<database_password>@<database_host>:<database_port>/<database_name>"
```

Start the project (with docker):

`npm run dev:start`

Starts the two services concurrently and initialize the databse with Docker. 
Then, pulls the proper images for the Mongoose database. You will need to have an instance of Docker running (ex docker desktop).

**Go to `localhost:3000` to see the project running**
