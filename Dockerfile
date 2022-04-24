## BUILD STAGE

FROM node:alpine as build

ARG REACT_APP_API_URL

ARG REACT_APP_VERSION

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN NODE_ENV=development yarn install

COPY . .

RUN yarn build


## NGINX SERVER

FROM nginx:alpine

ARG REACT_APP_API_URL

ENV REACT_APP_API_URL=${REACT_APP_API_URL}

ARG REACT_APP_VERSION

ENV REACT_APP_VERSION=${REACT_APP_VERSION}

COPY --from=build /usr/src/app/build /usr/share/nginx/html

COPY --from=build /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
