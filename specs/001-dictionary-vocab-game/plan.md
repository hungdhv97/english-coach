# Implementation Plan: Multilingual Dictionary with Vocabulary Game

**Branch**: `001-dictionary-vocab-game` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-dictionary-vocab-game/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature implements a multilingual dictionary lookup application with a vocabulary learning game for Vietnamese users. The application provides a landing page with navigation to either dictionary lookup or vocabulary games. The vocabulary game allows users to practice learning words through multiple-choice questions (A/B/C/D) filtered by topic or level, with source and target language selection. After completing games, users can view statistics on their performance.

Technical approach:
- Backend: Go with Clean Architecture/DDD pattern following the existing structure
- Frontend: React + TypeScript with Vite, following Feature-Sliced Design structure
- Database: MySQL/MariaDB (already defined in migration)
- API: RESTful API with OpenAPI specification

## Technical Context

**Language/Version**: Go 1.21+ (backend), TypeScript 5.9+ (frontend)
**Primary Dependencies**: 
- Backend: Go standard library, database driver (mysql/go-sql-driver or similar), HTTP router (likely chi or gin), validation library
- Frontend: React 19, TypeScript, Vite, React Router, HTTP client (axios/fetch), UI library (to be selected)

**Storage**: MySQL/MariaDB (schema already defined in `0001_init.sql`)
**Testing**: Manual testing discipline per constitution (no automated tests required)
**Target Platform**: Web application (backend API server + frontend SPA)
**Project Type**: Web application (frontend + backend)
**Performance Goals**: 
- API responses: <1s for 95% of requests (per SC-005)
- Page navigation: <2s from landing page (per SC-001)
- Question loading: <1s (per SC-003)
- Game completion: <5 minutes for 10 questions (per SC-004)

**Constraints**: 
- Error messages must be in Vietnamese (FR-025)
- All external inputs must be validated (FR-023)
- Unified error schema required (FR-024)
- Questions must load within 1 second (SC-003)

**Scale/Scope**: 
- Multiple languages supported (Vietnamese, English, Chinese, etc.)
- Dictionary lookup with word search, definitions, translations, examples
- Vocabulary game with topic/level filtering
- Game session tracking and statistics
- User statistics aggregation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Code Quality & Consistency

- Backend follows Clean Architecture with clear domain/infrastructure/interface separation
- All Go code follows `gofmt` formatting and standard naming conventions
- Frontend follows ESLint/Prettier configuration from package.json
- Magic values extracted to constants (e.g., game question count, timeouts)
- Domain logic resides in domain layer, not in handlers or repositories
- Repository pattern used for data access, interfaces defined in domain/port

### Type Safety

- Backend: Strong Go typing for all models, DTOs, and API contracts
- Frontend: TypeScript strict mode enabled, no `any` types without justification
- API contracts defined in OpenAPI schema with TypeScript types generated
- Domain entities have explicit types (Language, Word, Sense, GameSession, etc.)
- Request/response DTOs typed and validated

### Error Handling & Observability

- Unified error schema: `{ code: string, message: string, details?: unknown }` (FR-024)
- Centralized error handler middleware in HTTP layer
- All errors logged with request ID/correlation ID, key inputs, stack traces
- Critical flows logged: game session start/end, question answer, dictionary lookup
- Error messages translated to Vietnamese (FR-025) via i18n layer
- Structured logging using zap or equivalent in Go

### API Design & Separation of Concerns

- OpenAPI specification created before implementation (Phase 1 output)
- HTTP handlers only orchestrate: validate input → call use case → map to response
- Business logic in domain services and use cases
- Repository interfaces in domain/port, implementations in infrastructure/repository
- Consistent REST patterns: resource-oriented URIs, proper HTTP status codes
- Pagination for large result sets (dictionary search results, game history)

### Security

- Authentication: JWT-based (assumed from structure, or session-based)
- Authorization: RBAC model for user permissions (if needed for features)
- Input validation: Zod-equivalent validation (Go validator library) before business logic
- SQL injection prevention: Parameterized queries via repository layer
- XSS prevention: Frontend sanitization and proper encoding
- Rate limiting: For authentication endpoints and game session creation
- Secrets: Environment variables, no hardcoded credentials

### Performance & Scalability

- Pagination for dictionary search results and game history
- Database indexes already defined in schema (language_id, word_id, user_id indexes)
- Stateless backend API for horizontal scaling
- Frontend code splitting: route-based lazy loading for non-essential pages
- Caching strategy: Consider caching dictionary lookup results (Redis if available)
- Question generation: Optimized queries with proper joins to avoid N+1

### Manual Testing Discipline

- P1 user journeys documented with manual test steps:
  - Landing page navigation (happy path + error scenarios)
  - Game list display
  - Game configuration (valid + invalid inputs)
  - Game play (full session, answer recording)
  - Statistics viewing
- Smoke tests before release:
  - Complete game session end-to-end
  - Dictionary lookup with various queries
  - Error scenarios (invalid config, insufficient words, network errors)
- Test scenarios documented in feature spec acceptance criteria

### Documentation & UX

- Specification completed (spec.md)
- API contracts documented (OpenAPI schema)
- Data model documented (data-model.md)
- Quickstart guide created for local setup
- Frontend follows shared design system (shadcn/ui components per STRUCTURE.md)
- UX consistency: Loading states, error states, success confirmations
- Accessibility: Proper labels, contrast, focus states
- Vietnamese language support for all user-facing text

## Project Structure

### Documentation (this feature)

```text
specs/001-dictionary-vocab-game/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── openapi.yaml     # OpenAPI 3.0 specification
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── cmd/
│   ├── api/
│   │   ├── main.go
│   │   ├── config.yaml
│   │   └── wiring.go
│   └── migration/
│       └── main.go
├── internal/
│   ├── domain/
│   │   ├── dictionary/
│   │   │   ├── model/
│   │   │   │   ├── language.go
│   │   │   │   ├── word.go
│   │   │   │   ├── sense.go
│   │   │   │   ├── topic.go
│   │   │   │   └── level.go
│   │   │   ├── port/
│   │   │   │   ├── repository.go
│   │   │   │   └── search.go
│   │   │   ├── service/
│   │   │   │   └── dictionary_service.go
│   │   │   └── error/
│   │   │       └── dictionary_errors.go
│   │   └── game/
│   │       ├── model/
│   │       │   ├── game_session.go
│   │       │   ├── game_question.go
│   │       │   └── game_answer.go
│   │       ├── port/
│   │       │   ├── repository.go
│   │       │   └── question_generator.go
│   │       ├── service/
│   │       │   ├── game_service.go
│   │       │   └── question_generator_service.go
│   │       ├── usecase/
│   │       │   ├── command/
│   │       │   │   ├── create_session.go
│   │       │   │   ├── answer_question.go
│   │       │   │   └── end_session.go
│   │       │   └── query/
│   │       │       ├── get_session.go
│   │       │       ├── get_statistics.go
│   │       │       └── list_sessions.go
│   │       └── error/
│   │           └── game_errors.go
│   ├── repository/
│   │   ├── dictionary_pg.go
│   │   ├── game_pg.go
│   │   └── statistics_pg.go
│   ├── infrastructure/
│   │   ├── db/
│   │   │   ├── mysql.go
│   │   │   ├── migrations/
│   │   │   │   └── 0001_init.sql
│   │   │   └── transaction.go
│   │   └── cache/
│   │       └── redis.go (if caching needed)
│   └── interface/
│       └── http/
│           ├── handler/
│           │   ├── dictionary_handler.go
│           │   ├── game_handler.go
│           │   └── statistics_handler.go
│           └── middleware/
│               ├── auth.go
│               ├── logger.go
│               ├── error_handler.go
│               └── cors.go
├── pkg/
│   └── validator/
│       └── validator.go
└── go.mod

frontend/
├── src/
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── dictionary/
│   │   │   └── DictionaryLookupPage.tsx
│   │   └── game/
│   │       ├── GameListPage.tsx
│   │       ├── GameConfigPage.tsx
│   │       ├── GamePlayPage.tsx
│   │       └── GameStatisticsPage.tsx
│   ├── features/
│   │   ├── dictionary/
│   │   │   ├── api/
│   │   │   │   ├── dictionary.api.ts
│   │   │   │   └── dictionary.queries.ts
│   │   │   └── components/
│   │   │       ├── DictionarySearch.tsx
│   │   │       └── WordDetail.tsx
│   │   └── game/
│   │       ├── api/
│   │       │   ├── game.api.ts
│   │       │   └── game.queries.ts
│   │       ├── components/
│   │       │   ├── GameConfigForm.tsx
│   │       │   ├── GameQuestion.tsx
│   │       │   └── GameStatistics.tsx
│   │       └── hooks/
│   │           ├── useGameSession.ts
│   │           └── useGameConfig.ts
│   ├── entities/
│   │   ├── dictionary/
│   │   │   ├── model/
│   │   │   │   └── dictionary.types.ts
│   │   │   └── api/
│   │   │       └── dictionary.endpoints.ts
│   │   └── game/
│   │       ├── model/
│   │       │   └── game.types.ts
│   │       └── api/
│   │           └── game.endpoints.ts
│   ├── shared/
│   │   ├── api/
│   │   │   ├── http-client.ts
│   │   │   └── config.ts
│   │   ├── config/
│   │   │   └── env.ts
│   │   └── ui/
│   │       └── shadcn/
│   └── app/
│       ├── router/
│       │   └── routes.tsx
│       └── providers/
│           └── AppProviders.tsx
└── package.json

deploy/
├── docker/
│   ├── backend/
│   │   └── Dockerfile
│   └── frontend/
│       └── Dockerfile
├── env/
│   └── dev/
│       ├── backend.env
│       └── frontend.env
└── compose/
    └── docker-compose.yml

scripts/
├── dev.sh
├── lint-all.sh
└── migrate-all.sh
```

**Structure Decision**: This is a web application with separate frontend and backend following Clean Architecture (backend) and Feature-Sliced Design (frontend). The backend uses domain-driven design with clear separation of concerns. The frontend uses React with TypeScript and follows the structure defined in `frontend/STRUCTURE.md`. Deploy scripts follow the structure in `deploy/STRUCTURE.md`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - all architecture decisions align with constitution requirements.
