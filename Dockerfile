# build stage
# FROM node:lts-alpine as build-stage
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build:staging

# # production stage
# FROM nginx:stable-alpine as production-stage
# COPY nginx/nginx.conf /etc/nginx/nginx.conf
# COPY nginx/default.conf /etc/nginx/conf.d/default.conf
# COPY --from=build-stage /app/dist /usr/share/nginx/html
# EXPOSE 80
# RUN chown nginx:nginx /usr/share/nginx/html
# CMD ["nginx", "-g", "daemon off;"]