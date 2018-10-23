# build stage
FROM node:8.12.0-alpine as build-stage
WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM nginx:1.15.5-alpine as deploy-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Override the default.conf provided with the image.
# This is so that we can have a fallback to index.html for our Vue app.
COPY ./release/assets/nginx/default.conf /etc/nginx/conf.d
CMD ["nginx", "-g", "daemon off;"]
