# Backend Tech Stack

This document describes the technology stack used in the backend.

## Core Framework

- **Router**: [Gin](https://github.com/gin-gonic/gin) - High-performance HTTP web framework
- **JSON Binding**: [Sonic](https://github.com/bytedance/sonic) - Ultra-fast JSON serialization
- **JSON Fallback**: [go-json](https://github.com/goccy/go-json) - Fast JSON encoder/decoder

## Database

- **Driver**: [pgx](https://github.com/jackc/pgx/v5) - PostgreSQL driver and toolkit
- **Query Generator**: [sqlc](https://github.com/sqlc-dev/sqlc) - Generate type-safe Go code from SQL
- **Database**: PostgreSQL 15+

## Cache

- **Client**: [go-redis](https://github.com/redis/go-redis/v9) - Redis client for Go
- **Cache**: Redis 7+

## Authentication & Security

- **JWT**: [golang-jwt/jwt](https://github.com/golang-jwt/jwt/v5) - JSON Web Token implementation
- **Crypto**: [x/crypto](https://golang.org/x/crypto) - Bcrypt for password hashing

## Configuration

- **Config Manager**: [Viper](https://github.com/spf13/viper) - Configuration management with support for multiple formats

## Logging

- **Logger**: [Zap](https://go.uber.org/zap) - Structured, fast, leveled logging

## Validation

- **Validator**: [go-playground/validator](https://github.com/go-playground/validator/v10) - Struct validation

## Utilities

- **UUID**: [google/uuid](https://github.com/google/uuid) - UUID generation

## Architecture

The backend follows Clean Architecture principles:

```
backend/
├── cmd/                    # Application entry points
│   ├── api/               # HTTP API server
│   └── migration/         # Database migration runner
├── internal/
│   ├── app/               # Application layer (wiring)
│   ├── config/            # Configuration management
│   ├── domain/            # Domain layer (business logic)
│   ├── infrastructure/    # Infrastructure layer
│   │   ├── db/           # Database (pgx)
│   │   ├── cache/        # Redis cache
│   │   ├── auth/         # JWT authentication
│   │   ├── logger/       # Zap logger
│   │   └── crypto/       # Bcrypt hashing
│   ├── interface/         # Interface layer (HTTP handlers)
│   │   └── http/
│   │       ├── handler/  # HTTP handlers
│   │       └── middleware/ # Middleware (auth, CORS, logger, error handler)
│   ├── repository/        # Data access layer (sqlc generated + custom)
│   └── shared/           # Shared utilities
│       └── response/     # Standardized response format
└── pkg/                   # Public packages
    └── validator/         # Validator utilities for Gin
```

## Key Features

### High Performance
- Gin router for fast HTTP handling
- Sonic for ultra-fast JSON parsing
- pgx connection pooling
- Redis caching

### Type Safety
- sqlc generates type-safe database queries
- Go's strong typing throughout

### Security
- JWT-based authentication
- Bcrypt password hashing
- CORS middleware
- Input validation

### Developer Experience
- Structured logging with Zap
- Viper for flexible configuration
- Clean Architecture for maintainability

## Getting Started

### Prerequisites

- Go 1.21+
- PostgreSQL 15+
- Redis 7+

### Setup

1. Install dependencies:
```bash
go mod download
```

2. Configure environment variables (see `deploy/env/dev/backend.env`)

3. Run migrations:
```bash
go run cmd/migration/main.go
```

4. Generate sqlc code (when queries are added):
```bash
sqlc generate
```

5. Start the server:
```bash
go run cmd/api/main.go
```

## Configuration

Configuration is managed by Viper with the following priority:
1. Environment variables
2. Config files (yaml, json, etc.)
3. Defaults

See `internal/config/config.go` for configuration structure.

