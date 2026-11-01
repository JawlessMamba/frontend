# ---- build stage: compile the React app ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Browser calls /api/... on the same host; nginx forwards it to the backend container
ARG VITE_API_URL=/api/
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---- run stage: serve static files with nginx ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
