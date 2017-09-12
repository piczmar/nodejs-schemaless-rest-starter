# NodeJS Schemaless REST Service
It is a starter for NodeJS REST API.
It allows storing Students and Groups.
The only required attributes for objects stored in DB are:

* Students:
{
  "attributes": {
    .. set of any key-value pairs ..
  }
}

* Groups:
{
  "criteria": {
     .. set of any key-value pairs ..
  }
}

This is a restriction for APIs `/api/groups/matching/:studentId` and `/api/groups/:groupId/students` to work correcty.
They would return respectively groups and students matching according to `criteria` and `attributes` values.
In the result only records with all values matching are returned.

# Features
* No schema definition, any set of attributes can be pushed from the API to MongoDB without modifying the app
* Express JS framework
* MongoDB connection with mongodb JS driver
* REST API with error handlign and CORS, secured with header tokens
* deployable in Docker

# Quick Start Guide (without Docker)

## 1. install npm

tested with 3.10.10

## 2. install node.js

tested with v6.11.2

## 3. Setup certificate
To get certificate signed by certification authority, you can use websites like godaddy, hostgator etc.
And to generate a self signed certificate you can use OpenSSL

### 3.1. Generate self-signed certificate

```
openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout privateKey.key -out certificate.crt

```

## 4. Put generated cert in ./keys folder in current project

## 5. Build project

```
cd app
npm install
```

## 6. Run MongoDB
Tested with MongoDB 3.0.15.
Install and run MongoDB on localhost or run in Docker.
MongoDB official Docker image is [here](https://hub.docker.com/_/mongo/).

```
docker pull mongo
docker run -p 27018:27017 --name nrs-mongo -d mongo --auth
```

This runs MongoDB in Docker container with Docker host port `27018` port mapped to MongoDB exposed port (just in case you had MongoDB already instlled on host, using the same port would cause conflicts).

The app requires MongoDB authenticated user, need to create one.

First create the admin user for initial authentication, which will allow managing database.

```
docker exec -it nrs-mongo mongo admin
connecting to: admin
> db.createUser({ user: 'adminuser', pwd: 'adminpass', roles: [ { role: "userAdminAnyDatabase", db: "admin" } ] });
```

Once you created admin user you can authenticate to MongoDB from shell with:

```
docker run -it --rm --link nrs-mongo:mongo mongo mongo -u adminuser -p adminpass --authenticationDatabase admin nrs-mongo/admin

```

Then create application db user

```
db.createUser({ user: 'nodejs', pwd: 'nodejs', roles: [ { role: "dbOwner", db: "test" } ] });

```


## 7. start application

```
cd app
node app.js
```

when it start it asks for PEM pass phrase - give the one used when generating the certificates in step 3.

## 8. Open in browser:
http://localhost:9000

or

https://localhost:9433

# Run in Docker

## Build app Docker image
From root of the project execute

```
docker build -f docker/Dockerfile -t piczmar/nrs
```

## Run app container

```
docker run -d --rm -p 9443:9443 -p 9000:9000 --name nrs-app piczmar/nrs node app.j
```

This will run container as daemon and map inner ports to Docker host ports.
It will print an ID of container.
You can then list application logs with

```
docker logs -f <container ID>
```

# TODOs

1. Monitor server load and handle overload gracefully:
https://hacks.mozilla.org/2013/01/building-a-node-js-server-that-wont-melt-a-node-js-holiday-season-part-5/

2. Generate API docs


# Further reading
 1. [Authorized certs](https://engineering.circle.com/https-authorized-certs-with-node-js-315e548354a2)