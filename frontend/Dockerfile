# syntax=docker/dockerfile:1.7

############################
# Stage: deps
############################
FROM oven/bun:1.3.9-alpine AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

############################
# Stage: dev (Vite + HMR)
############################
FROM oven/bun:1.3.9-alpine AS dev
WORKDIR /app
ENV NODE_ENV=development
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
EXPOSE 3000
CMD ["bun", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

############################
# Stage: build (prod bundle)
############################
FROM oven/bun:1.3.9-alpine AS build
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN bun run build

############################
# Stage: prod (nginx)
############################
FROM nginx:1.27-alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
