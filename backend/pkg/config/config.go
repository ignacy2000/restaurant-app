package config

import "os"

type Config struct {
	Port         string
	DatabaseURL  string
	Env          string
	JWTSecret    string
	FrontendURL  string
	RedisAddr    string
	SMTPHost     string
	SMTPPort     string
	SMTPFrom     string
	SMTPUsername string
	SMTPPassword string
}

func Load() Config {
	return Config{
		Port:         getEnv("PORT", "8080"),
		DatabaseURL:  getEnv("DATABASE_URL", "postgresql://************************"),
		Env:          getEnv("ENV", "development"),
		JWTSecret:    getEnv("JWT_SECRET", "change-me-in-production"),
		FrontendURL:  getEnv("FRONTEND_URL", "http://localhost:3000"),
		RedisAddr:    getEnv("REDIS_ADDR", "localhost:6379"),
		SMTPHost:     getEnv("SMTP_HOST", "localhost"),
		SMTPPort:     getEnv("SMTP_PORT", "1025"),
		SMTPFrom:     getEnv("SMTP_FROM", "no-reply@localhost"),
		SMTPUsername: getEnv("SMTP_USERNAME", ""),
		SMTPPassword: getEnv("SMTP_PASSWORD", ""),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
