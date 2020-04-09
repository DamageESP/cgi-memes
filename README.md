# CGI Memes

## How to run it
First of all, you have to configure your environment variables. To do this, create and edit `.env` in the project root directory. You should use the `.env.example` file as a template.

After that, you need to generate your certs to develop using https on localhost. For that, you can use

```
openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365
openssl rsa -in keytmp.pem -out key.pem
```

and put them on `/certs`

If you are using Windows, the latest versions of Winwdows 10 include bash.exe on `C:/Windows/System32`, so you can use that to have the `openssl` command. Or you can search online for other ways to have it, or to generate your own certificate.

---

To run in development using docker and docker-compose, run:

```
docker-compose -f .\docker-compose.dev.yml up
```

After docker starts all containers, the app will be ready on `https://localhost:8080`.

---


To run in production using docker and docker-compose, create and edit your `.env` file and then run:

```
docker-compose up
```
