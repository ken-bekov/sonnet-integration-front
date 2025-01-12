FROM node:22.9.0-alpine AS build
WORKDIR /source
COPY . /source
RUN npm install
RUN npm run build

FROM nginx:latest
COPY --from=build /source/dist /usr/share/nginx/html
COPY --from=build /source/conf/default.conf.template /etc/nginx/templates
