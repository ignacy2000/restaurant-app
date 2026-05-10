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
# Vite runs under Node, not Bun: Bun's http.Server does not forward `upgrade`
# events the way Node does, which breaks vite's `proxy.ws` (WebSocket upgrades
# to the backend silently time out). Bun is still used for install/build.
FROM oven/bun:1.3.9-alpine AS dev
WORKDIR /app
ENV NODE_ENV=development
RUN apk add --no-cache nodejs
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
EXPOSE 3000
CMD ["node", "node_modules/vite/bin/vite.js", "--host", "0.0.0.0", "--port", "3000"]

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
