# CGI Memes

## How to run it
First of all, you have to configure your environment variables. To do this, create and edit `.env` in the project root directory. You should use the `.env.example` file as a template.

---

To run in development using docker and docker-compose, run:

```
docker-compose -f .\docker-compose.dev.yml up
```

After docker starts all containers, the app will be ready on `http://localhost:8080`.

---


To run in production using docker and docker-compose, create and edit your `.env` file and then run:

```
docker-compose up
```
