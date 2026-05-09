# syntax=docker/dockerfile:1.7

############################
# Stage: deps (module cache)
############################
FROM golang:1.26-alpine AS deps
WORKDIR /app
RUN apk add --no-cache git
COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    go mod download

############################
# Stage: dev (air hot reload)
############################
FROM golang:1.26-alpine AS dev
WORKDIR /app
RUN apk add --no-cache git curl \
    && go install github.com/air-verse/air@v1.61.7
ENV CGO_ENABLED=0 \
    GOFLAGS=-mod=mod \
    GOTOOLCHAIN=auto
COPY --from=deps /go/pkg/mod /go/pkg/mod
COPY . .
EXPOSE 8080
CMD ["air", "-c", ".air.toml"]

############################
# Stage: build (prod binary)
############################
FROM golang:1.26-alpine AS build
WORKDIR /app
RUN apk add --no-cache git
ENV GOTOOLCHAIN=auto
COPY --from=deps /go/pkg/mod /go/pkg/mod
COPY . .
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/api ./cmd/api

############################
# Stage: prod (distroless)
############################
FROM gcr.io/distroless/static-debian12:nonroot AS prod
COPY --from=build /out/api /api
EXPOSE 8080
USER nonroot:nonroot
ENTRYPOINT ["/api"]
