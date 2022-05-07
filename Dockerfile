## DEPENDENCIES STAGE

FROM endeveit/docker-jq AS dependencies

COPY package.json /tmp/package.json

RUN jq '{ dependencies, devDependencies }' </tmp/package.json >/tmp/deps.json

## BUILD STAGE

FROM node:alpine as build

WORKDIR /usr/src/app

COPY --from=dependencies /tmp/deps.json ./package.json

COPY yarn.lock ./yarn.lock

RUN NODE_ENV=development yarn install

COPY . .

ARG REACT_APP_VERSION

RUN yarn build

## NGINX SERVER

FROM nginx:alpine

RUN apk add --update nodejs

RUN apk add --update npm

RUN npm i -g runtime-env-cra

WORKDIR /usr/share/nginx/html

COPY --from=build /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf

COPY .env.example ./.env

ARG REACT_APP_VERSION

ENV REACT_APP_VERSION=${REACT_APP_VERSION}

COPY --from=build /usr/src/app/build /usr/share/nginx/html

EXPOSE 80

CMD ["/bin/sh", "-c", "runtime-env-cra && nginx -g \"daemon off;\""]
