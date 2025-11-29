# Research: Multilingual Dictionary with Vocabulary Game

**Created**: 2025-01-27  
**Feature**: [spec.md](./spec.md)

## Technology Decisions

### Database Choice: MySQL/MariaDB

**Decision**: Use MySQL/MariaDB as the database system.

**Rationale**: 
- Schema already defined in `0001_init.sql` using MySQL syntax (AUTO_INCREMENT)
- Schema includes all necessary tables for dictionary and game functionality
- Foreign keys and indexes already defined appropriately
- MySQL performance is sufficient for the expected scale

**Alternatives considered**:
- PostgreSQL: Mentioned in STRUCTURE.md but schema uses MySQL syntax, so MySQL is the chosen implementation

### Backend Architecture: Clean Architecture with DDD

**Decision**: Follow Clean Architecture with Domain-Driven Design pattern as shown in backend STRUCTURE.md.

**Rationale**:
- Clear separation of concerns: domain, infrastructure, interface layers
- Testability: Domain logic independent of infrastructure
- Maintainability: Changes in one layer don't affect others
- Aligns with existing project structure

**Alternatives considered**: None - structure already defined in backend/STRUCTURE.md

### Frontend Architecture: Feature-Sliced Design

**Decision**: Follow Feature-Sliced Design structure as defined in frontend/STRUCTURE.md.

**Rationale**:
- Clear feature organization with shared/entities/features/pages layers
- Reusability: Shared components and utilities
- Scalability: Easy to add new features
- Aligns with existing project structure

**Alternatives considered**: None - structure already defined in frontend/STRUCTURE.md

### API Design: RESTful with OpenAPI

**Decision**: Use RESTful API design with OpenAPI 3.0 specification.

**Rationale**:
- Standard approach for web applications
- OpenAPI enables code generation and documentation
- Consistent with common industry practices
- Enables frontend-backend type sharing

**Alternatives considered**:
- GraphQL: More complex, REST is sufficient for current needs
- gRPC: Not needed for web application, REST is more appropriate

### Error Handling: Unified Schema

**Decision**: Use unified error schema `{ code: string, message: string, details?: unknown }`.

**Rationale**:
- Consistent error responses across all endpoints
- Frontend can handle errors uniformly
- Supports internationalization (Vietnamese messages)
- Aligns with constitution requirements

**Alternatives considered**: None - required by constitution and FR-024

### Validation: Go Validator + Frontend Zod

**Decision**: Use Go validator library for backend, Zod for frontend (if needed).

**Rationale**:
- Backend: Standard Go validation library
- Frontend: TypeScript-first validation with Zod
- Both provide type-safe validation
- Supports shared schemas potentially via OpenAPI generation

**Alternatives considered**: None - standard approach for each platform

## Implementation Patterns

### Repository Pattern

**Decision**: Use repository pattern for data access.

**Rationale**:
- Abstracts database implementation details
- Enables testing with mocks
- Aligns with Clean Architecture principles
- Already shown in backend STRUCTURE.md

### Use Case Pattern

**Decision**: Implement use cases for business logic orchestration.

**Rationale**:
- Separates business logic from controllers
- Clear command/query separation
- Testable business logic
- Aligns with Clean Architecture

### DTO Pattern

**Decision**: Use DTOs (Data Transfer Objects) for API boundaries.

**Rationale**:
- Separates domain models from API contracts
- Enables API versioning
- Prevents exposing internal domain details
- Standard REST API practice

## Performance Considerations

### Caching Strategy

**Decision**: Consider Redis caching for dictionary lookups (optional, not required for MVP).

**Rationale**:
- Dictionary lookups are read-heavy operations
- Caching can improve response times
- Redis already mentioned in infrastructure structure
- Can be added later if performance requires it

**Alternatives considered**:
- In-memory caching: Sufficient for initial implementation
- No caching: Acceptable for MVP, can add later

### Database Indexes

**Decision**: Use indexes already defined in schema.

**Rationale**:
- Indexes already defined for key query paths:
  - `idx_words_lang_lemma`, `idx_words_lang_norm`, `idx_words_lang_search`
  - `idx_senses_word_order`
  - `idx_vgs_user_time`
- Should be sufficient for expected query patterns

### Question Generation Optimization

**Decision**: Generate all questions for a session upfront.

**Rationale**:
- Avoids N+1 queries during game play
- Better user experience (no loading between questions)
- Easier to implement
- Questions are immutable once session starts

**Alternatives considered**:
- Lazy generation: More complex, not necessary for MVP

## No Clarifications Needed

All technology choices are clear from existing structure and requirements. No NEEDS CLARIFICATION markers in the specification.

