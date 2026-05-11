package config

import "os"

type Config struct {
	Port             string
	DatabaseURL      string
	Env              string
	JWTSecret        string
	FrontendURL      string
	RedisAddr        string
	SMTPHost         string
	SMTPPort         string
	SMTPFrom         string
	SMTPUsername     string
	SMTPPassword     string
	S3Endpoint       string
	S3PublicEndpoint string
	S3AccessKey      string
	S3SecretKey      string
	S3Bucket         string
	S3UseSSL         bool
}

func Load() Config {
	return Config{
		Port:             getEnv("PORT", "8080"),
		DatabaseURL:      getEnv("DATABASE_URL", "postgresql://************************"),
		Env:              getEnv("ENV", "development"),
		JWTSecret:        getEnv("JWT_SECRET", "change-me-in-production"),
		FrontendURL:      getEnv("FRONTEND_URL", "http://localhost:3000"),
		RedisAddr:        getEnv("REDIS_ADDR", "localhost:6379"),
		SMTPHost:         getEnv("SMTP_HOST", "localhost"),
		SMTPPort:         getEnv("SMTP_PORT", "1025"),
		SMTPFrom:         getEnv("SMTP_FROM", "no-reply@localhost"),
		SMTPUsername:     getEnv("SMTP_USERNAME", ""),
		SMTPPassword:     getEnv("SMTP_PASSWORD", ""),
		S3Endpoint:       getEnv("S3_ENDPOINT", "localhost:9000"),
		S3PublicEndpoint: getEnv("S3_PUBLIC_ENDPOINT", "http://localhost:9000"),
		S3AccessKey:      getEnv("S3_ACCESS_KEY", "minioadmin"),
		S3SecretKey:      getEnv("S3_SECRET_KEY", "minioadmin"),
		S3Bucket:         getEnv("S3_BUCKET", "menu-images"),
		S3UseSSL:         getEnv("S3_USE_SSL", "false") == "true",
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
