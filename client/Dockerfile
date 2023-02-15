#copy node-alpine
FROM node:18-alpine AS node

WORKDIR /client

# copy project code
COPY . /client

# install angular-cli
RUN npm install -g @angular/cli@14.0.7

# install dependencies
RUN npm install

# build app
RUN ng build --configuration production

# copy nginx
FROM nginx:alpine
# COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node ./client/dist/icam /usr/share/nginx/html

# expose the port
EXPOSE ${WEB_PORT}