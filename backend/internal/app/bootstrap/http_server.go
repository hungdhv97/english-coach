package bootstrap

import (
	"context"
	"net/http"
	"time"

	"github.com/english-coach/backend/internal/shared/logger"
	httptransport "github.com/english-coach/backend/internal/transport/http"
	"github.com/gin-contrib/requestid"
	"github.com/gin-gonic/gin"
)

// HTTPServerConfig holds HTTP server configuration
type HTTPServerConfig struct {
	Port            int
	ReadTimeout     time.Duration
	WriteTimeout    time.Duration
	IdleTimeout     time.Duration
	ShutdownTimeout time.Duration
}

// HTTPServer represents the application-specific HTTP server.
// It handles router setup, middleware chain, and wraps the generic transport/http.Server
type HTTPServer struct {
	router *gin.Engine
	server *httptransport.Server
}

// NewHTTPServer creates a new HTTP server with application-specific configuration:
// - Sets up Gin router with application middleware chain
// - Wraps it in the generic transport/http.Server for low-level HTTP handling
func NewHTTPServer(
	cfg HTTPServerConfig,
	appLogger logger.ILogger,
	corsMiddleware, errorMiddleware, loggerMiddleware gin.HandlerFunc,
) *HTTPServer {
	// Set Gin mode based on environment
	gin.SetMode(gin.ReleaseMode)

	// Use Sonic for JSON binding (faster JSON parsing)
	gin.EnableJsonDecoderUseNumber()

	router := gin.New()

	// Add request ID middleware
	router.Use(requestid.New())

	// Add logger middleware
	if loggerMiddleware != nil {
		router.Use(loggerMiddleware)
	}

	// Add CORS middleware
	if corsMiddleware != nil {
		router.Use(corsMiddleware)
	}

	// Add recovery middleware
	router.Use(gin.CustomRecovery(func(c *gin.Context, recovered interface{}) {
		if appLogger != nil {
			appLogger.Error("panic recovered",
				logger.Any("error", recovered),
				logger.String("path", c.Request.URL.Path),
			)
		}
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"code":    "INTERNAL_ERROR",
			"message": "An internal error occurred",
		})
	}))

	// Add error handler middleware
	if errorMiddleware != nil {
		router.Use(errorMiddleware)
	}

	// Wrap router in generic HTTP server (low-level config)
	httpServer := httptransport.NewServer(
		httptransport.Config{
			Port:            cfg.Port,
			ReadTimeout:     cfg.ReadTimeout,
			WriteTimeout:    cfg.WriteTimeout,
			IdleTimeout:     cfg.IdleTimeout,
			ShutdownTimeout: cfg.ShutdownTimeout,
		},
		router, // router implements http.Handler
	)

	return &HTTPServer{
		router: router,
		server: httpServer,
	}
}

// Router returns the Gin router for route registration
func (s *HTTPServer) Router() *gin.Engine {
	return s.router
}

// Start starts the HTTP server
func (s *HTTPServer) Start() error {
	return s.server.Start()
}

// Shutdown gracefully shuts down the server
func (s *HTTPServer) Shutdown(ctx context.Context) error {
	return s.server.Shutdown(ctx)
}
