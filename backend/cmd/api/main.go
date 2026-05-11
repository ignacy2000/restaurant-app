package main

import (
	"context"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hibiken/asynq"
	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
	"table-service.pl/internal/database"
	authModule "table-service.pl/internal/modules/auth"
	restaurantModule "table-service.pl/internal/modules/restaurant"
	userModule "table-service.pl/internal/modules/user"
	"table-service.pl/pkg/config"
	"table-service.pl/pkg/logger"
	"table-service.pl/pkg/mailer"
	"table-service.pl/pkg/middleware"
	"table-service.pl/pkg/storage"
	"table-service.pl/pkg/worker"
	"table-service.pl/pkg/ws"
)

func main() {
	_ = godotenv.Load()

	cfg := config.Load()
	log := logger.New(cfg.Env)

	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Error("connect to db", "error", err)
		os.Exit(1)
	}
	defer db.Close()

	if err := database.MigrateUp(db); err != nil {
		log.Error("run migrations", "error", err)
		os.Exit(1)
	}

	asynqClient := asynq.NewClient(asynq.RedisClientOpt{Addr: cfg.RedisAddr})
	defer asynqClient.Close()

	imageStore, err := storage.New(storage.Config{
		Endpoint:       cfg.S3Endpoint,
		PublicEndpoint: cfg.S3PublicEndpoint,
		AccessKey:      cfg.S3AccessKey,
		SecretKey:      cfg.S3SecretKey,
		Bucket:         cfg.S3Bucket,
		UseSSL:         cfg.S3UseSSL,
	})
	if err != nil {
		log.Error("init storage", "error", err)
		os.Exit(1)
	}
	if err := imageStore.EnsureBucket(context.Background()); err != nil {
		log.Error("ensure bucket", "error", err)
	}

	mail := mailer.New(cfg.SMTPHost, cfg.SMTPPort, cfg.SMTPFrom, cfg.SMTPUsername, cfg.SMTPPassword)
	proc := worker.NewEmailProcessor(mail)
	srv := worker.NewServer(cfg.RedisAddr)
	go func() {
		if err := worker.Start(srv, proc); err != nil {
			log.Error("worker error", "error", err)
		}
	}()

	hub := ws.NewHub()
	go hub.Run()

	userRepo := userModule.NewRepository(db)
	authRepo := authModule.NewRepository(db)

	userSvc := userModule.NewService(userRepo)
	authSvc := authModule.NewService(authRepo, userRepo, cfg.JWTSecret, asynqClient, cfg.FrontendURL)

	userHandler := userModule.NewHandler(userSvc)
	authHandler := authModule.NewHandler(authSvc)

	rdb := redis.NewClient(&redis.Options{Addr: cfg.RedisAddr})

	authMw := middleware.Auth(cfg.JWTSecret)
	originStore := middleware.NewOriginStore(time.Minute, authRepo.AllOriginValues, rdb, cfg.FrontendURL)

	r := gin.New()
	r.Use(middleware.Recovery(log))
	r.Use(middleware.DynamicCORS(originStore))

	api := r.Group("/api")
	userModule.Mount(api, authMw, userHandler)
	authModule.Mount(api, authMw, authHandler)
	restaurantModule.MountAll(api, authMw, db, hub, cfg.JWTSecret, mail, cfg.FrontendURL, imageStore)

	log.Info("server starting", "port", cfg.Port)
	if err := http.ListenAndServe(":"+cfg.Port, r); err != nil {
		log.Error("server error", "error", err)
		os.Exit(1)
	}
}
