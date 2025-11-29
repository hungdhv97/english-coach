package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/gin-gonic/gin"
	"github.com/english-coach/backend/internal/config"
	"github.com/english-coach/backend/internal/infrastructure/db"
	"github.com/english-coach/backend/internal/infrastructure/logger"
	httpServer "github.com/english-coach/backend/internal/interface/http"
	"github.com/english-coach/backend/internal/interface/http/middleware"
	"go.uber.org/zap"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize logger
	appLogger, err := logger.NewLogger(cfg.Logging.Level)
	if err != nil {
		log.Fatalf("Failed to initialize logger: %v", err)
	}
	defer appLogger.Sync()

	appLogger.Info("Starting English Coach Backend API",
		zap.String("env", cfg.App.Env),
		zap.String("name", cfg.App.Name),
	)

	// Initialize database connection
	ctx := context.Background()
	pool, err := db.NewPostgres(ctx, db.Config{
		Host:            cfg.Database.Host,
		Port:            cfg.Database.Port,
		User:            cfg.Database.User,
		Password:        cfg.Database.Password,
		Database:        cfg.Database.Database,
		SSLMode:         cfg.Database.SSLMode,
		MaxConns:        cfg.Database.MaxConns,
		MinConns:        cfg.Database.MinConns,
		MaxConnLifetime: cfg.Database.MaxConnLifetime,
		MaxConnIdleTime: cfg.Database.MaxConnIdleTime,
	})
	if err != nil {
		appLogger.Fatal("Failed to connect to database", zap.Error(err))
	}
	defer pool.Close()

	appLogger.Info("Database connection established")

	// Setup HTTP server
	server := httpServer.NewServer(
		httpServer.Config{
			Port:            cfg.Server.Port,
			ReadTimeout:     cfg.Server.ReadTimeout,
			WriteTimeout:    cfg.Server.WriteTimeout,
			IdleTimeout:     cfg.Server.IdleTimeout,
			ShutdownTimeout: cfg.Server.ShutdownTimeout,
		},
		appLogger.Logger,
		middleware.CORS(cfg.CORS.AllowedOrigins),
		middleware.ErrorHandler(appLogger.Logger),
		middleware.LoggerMiddleware(appLogger.Logger),
	)

	// Register routes (will be added in Phase 5+)
	// For now, just a health check endpoint
	router := server.Router()
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Start server in goroutine
	go func() {
		appLogger.Info("Starting HTTP server", zap.Int("port", cfg.Server.Port))
		if err := server.Start(); err != nil {
			appLogger.Fatal("Failed to start server", zap.Error(err))
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	appLogger.Info("Shutting down server...")

	// Graceful shutdown
	shutdownCtx, cancel := context.WithTimeout(context.Background(), cfg.Server.ShutdownTimeout)
	defer cancel()

	if err := server.Shutdown(shutdownCtx); err != nil {
		appLogger.Error("Server forced to shutdown", zap.Error(err))
	}

	appLogger.Info("Server exited")
}
