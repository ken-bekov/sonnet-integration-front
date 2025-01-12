FROM node:22.9.0-alpine AS build
WORKDIR /source
COPY . /source
RUN npm install
RUN npm run build

FROM nginx:latest
COPY --from=build /source/dist /usr/share/nginx/html
