# Kapiche Test Webapp

Display login form + NPS data chart. Developed using VueJS and vue-cli and Node.js v8.9.0 (current LTS)

Gets data from [kapiche-test-api](https://github.com/bspink/kapiche-test-api) - run alongside the API server.

# Run me

Run locally:
```bash
# Install dependencies
npm install

# Serve with hot reload at localhost:8080
npm run dev
```

Build and run via docker locally (starts a uwsgi http server for the flask app):
```bash
docker build -f Dockerfile -t kapiche/kapiche-webapp
# This will run in the background on an nginx server at localhost:8000
docker run -d -it -p 8000:80 --rm --name kapiche-webapp kapiche/kapiche-webapp
```

Or, run from quay.io image:
```bash
# This will run in the background on localhost:5000
> docker run -d -it -p 8000:80 --rm --name kapiche-webapp quay.io/bspink/kapiche-webapp
```

To stop me:
```bash
docker stop kapiche-webapp
```
