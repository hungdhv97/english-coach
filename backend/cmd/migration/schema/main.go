package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/url"
	"os"
	"path/filepath"
	"strings"

	_ "github.com/jackc/pgx/v5/stdlib"
)

// parseDatabaseURL parses a PostgreSQL connection URL and returns components
func parseDatabaseURL(dsn string) (host, port, user, password, dbname string, err error) {
	u, err := url.Parse(dsn)
	if err != nil {
		return "", "", "", "", "", err
	}

	host = u.Hostname()
	port = u.Port()
	if port == "" {
		port = "5432"
	}

	user = u.User.Username()
	password, _ = u.User.Password()

	// Get database name from path (remove leading slash)
	dbname = strings.TrimPrefix(u.Path, "/")
	// Remove query parameters if any
	if idx := strings.Index(dbname, "?"); idx != -1 {
		dbname = dbname[:idx]
	}

	return host, port, user, password, dbname, nil
}

// createDatabaseIfNotExists creates the database if it doesn't exist
func createDatabaseIfNotExists(ctx context.Context, dsn string) error {
	host, port, user, password, dbname, err := parseDatabaseURL(dsn)
	if err != nil {
		return fmt.Errorf("failed to parse database URL: %w", err)
	}

	if dbname == "" {
		return fmt.Errorf("database name is empty")
	}

	// Create connection to postgres database (default database)
	adminDSN := fmt.Sprintf("postgres://%s:%s@%s:%s/postgres?sslmode=disable",
		user, password, host, port)

	adminDB, err := sql.Open("pgx", adminDSN)
	if err != nil {
		return fmt.Errorf("failed to connect to postgres database: %w", err)
	}
	defer adminDB.Close()

	// Check if database exists
	var exists int
	checkQuery := "SELECT 1 FROM pg_database WHERE datname = $1"
	err = adminDB.QueryRowContext(ctx, checkQuery, dbname).Scan(&exists)
	if err == nil && exists == 1 {
		log.Printf("Database '%s' already exists", dbname)
		return nil
	}

	// Database doesn't exist, create it
	// Note: CREATE DATABASE cannot be run in a transaction
	// Quote identifier to prevent SQL injection
	log.Printf("Database '%s' does not exist. Creating...", dbname)
	// Use pg_quote_identifier equivalent: double quotes for identifiers
	quotedDBName := fmt.Sprintf(`"%s"`, strings.ReplaceAll(dbname, `"`, `""`))
	createQuery := fmt.Sprintf("CREATE DATABASE %s", quotedDBName)
	_, err = adminDB.ExecContext(ctx, createQuery)
	if err != nil {
		return fmt.Errorf("failed to create database '%s': %w", dbname, err)
	}

	log.Printf("Database '%s' created successfully", dbname)
	return nil
}

func main() {
	ctx := context.Background()

	// Get database connection string from environment or use default
	// Priority: DATABASE_URL env var > default DSN
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://postgres:postgres@localhost:5500/lexigo?sslmode=disable"
	}

	// Create database if it doesn't exist
	if err := createDatabaseIfNotExists(ctx, dsn); err != nil {
		log.Printf("Warning: Failed to ensure database exists: %v", err)
		log.Printf("Attempting to continue anyway...")
	}

	// Use pgx/stdlib for compatibility with sql.Open
	db, err := sql.Open("pgx", dsn)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Verify connection
	if err := db.PingContext(ctx); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	// Read migration file
	migrationPath := "db/migrations/schema/0001_init_schema.sql"
	if _, err := os.Stat(migrationPath); os.IsNotExist(err) {
		// Try alternative path
		migrationPath = filepath.Join("backend", migrationPath)
	}

	sqlBytes, err := os.ReadFile(migrationPath)
	if err != nil {
		log.Fatalf("Failed to read migration file: %v", err)
	}

	// Execute migration
	sql := string(sqlBytes)
	if _, err := db.ExecContext(ctx, sql); err != nil {
		log.Fatalf("Failed to execute migration: %v", err)
	}

	fmt.Println("Migration completed successfully!")
}
