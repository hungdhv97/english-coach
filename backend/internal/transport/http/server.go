package http

import (
	"context"
	"fmt"
	"net/http"
	"time"
)

// Server represents a generic HTTP server with low-level configuration
// It only handles HTTP server settings (timeouts, address) and delegates
// request handling to the provided handler.
type Server struct {
	server *http.Server
}

// Config holds HTTP server configuration (timeouts, port, etc.)
type Config struct {
	Port            int
	ReadTimeout     time.Duration
	WriteTimeout    time.Duration
	IdleTimeout     time.Duration
	ShutdownTimeout time.Duration
}

// NewServer creates a new HTTP server with the given configuration and handler.
// This is a generic, low-level server that doesn't know about routing frameworks.
func NewServer(cfg Config, handler http.Handler) *Server {
	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.Port),
		Handler:      handler,
		ReadTimeout:  cfg.ReadTimeout,
		WriteTimeout: cfg.WriteTimeout,
		IdleTimeout:  cfg.IdleTimeout,
	}

	return &Server{
		server: server,
	}
}

// Start starts the HTTP server
func (s *Server) Start() error {
	return s.server.ListenAndServe()
}

// Shutdown gracefully shuts down the server
func (s *Server) Shutdown(ctx context.Context) error {
	return s.server.Shutdown(ctx)
}
