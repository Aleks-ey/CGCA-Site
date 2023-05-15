FROM node:lts-alpine as builder
WORKDIR /Georgian-Website
COPY . .
RUN npm install
RUN npm run ng build

FROM nginx:alpine
COPY --from=builder Georgian-Website/dist/* /usr/share/nginx/html/
EXPOSE 80