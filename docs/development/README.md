# Development Documentation

This folder contains developer-focused guides and reference materials for working with the Zeal platform.

## 📚 Documents

### Developer Guides

1. **[BACKEND-FEATURE-DEVELOPMENT-GUIDE.md](./BACKEND-FEATURE-DEVELOPMENT-GUIDE.md)** ⭐ NEW
   - **Complete step-by-step guide** for creating new backend features
   - Database schema design
   - Prisma model creation
   - Service and controller implementation
   - Testing and documentation
   - Best practices and common patterns
   - **Start here when building a new entity/feature**

2. **[NEW-FEATURE-CHECKLIST.md](./NEW-FEATURE-CHECKLIST.md)** ⭐ NEW
   - **Printable checklist** for new feature development
   - Pre-development preparation
   - Implementation steps
   - Testing checklist
   - Documentation requirements
   - **Use this to track your progress**

3. **[DEVELOPMENT-COMMANDS.md](./DEVELOPMENT-COMMANDS.md)**
   - Essential commands for managing the development environment
   - Quick start commands for backend and frontend
   - Process management (start, stop, kill)
   - Database operations
   - Useful debugging commands
   - Port management and troubleshooting

## 🚀 Quick Start

### Start Development Environment

```bash
# Terminal 1 - Backend Services
cd backend
npm run dev --workspace=@zeal/clinical
# or
npm run dev --workspace=@zeal/foundation
# or
npm run dev --workspace=@zeal/rcm

# Terminal 2 - Frontend (if applicable)
cd frontend
npm run dev
```

### Common Development Tasks

#### Database Operations

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

#### Build & Test

```bash
# Build all packages
npm run build

# Build specific workspace
npm run build --workspace=@zeal/clinical

# Run tests
npm run test

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🛠️ Development Tools

### Required Tools

- **Node.js**: 18+ (LTS recommended)
- **npm**: 9+
- **PostgreSQL**: 14+
- **Docker**: For containerized development (optional)

### Recommended IDE Extensions

- **VSCode Extensions**:
  - Prisma
  - ESLint
  - Prettier
  - TypeScript
  - GitLens
  - REST Client (for API testing)

## 📂 Project Structure

```
zeal/
├── backend/
│   ├── services/           # NestJS services
│   │   ├── clinical/       # Clinical service (port 3011)
│   │   ├── foundation/     # Foundation service (port 3001)
│   │   └── rcm/           # RCM service (port 3012)
│   ├── shared/            # Shared packages
│   │   ├── database-*/    # Prisma database packages
│   │   ├── types/         # Shared TypeScript types
│   │   └── utils/         # Shared utilities
│   └── contracts/         # API contracts
├── frontend/              # Next.js frontend
└── docs/                  # Documentation
```

## 🔧 Environment Setup

### 1. Install Dependencies

```bash
# Install all dependencies
npm install

# Or install for specific workspace
npm install --workspace=@zeal/clinical
```

### 2. Configure Environment Variables

Create `.env` files in the backend directory:

```env
# Database connections (see infrastructure/database/ for details)
FOUNDATION_DATABASE_URL="postgresql://user:password@localhost:5432/zeal_foundation"
CLINICAL_DATABASE_URL="postgresql://user:password@localhost:5432/zeal_clinical"
RCM_DATABASE_URL="postgresql://user:password@localhost:5432/zeal_rcm"
ANALYTICS_DATABASE_URL="postgresql://user:password@localhost:5432/zeal_analytics"

# Service ports
CLINICAL_PORT=3011
FOUNDATION_PORT=3001
RCM_PORT=3012

# JWT secrets
JWT_SECRET="your-secret-key"
JWT_EXPIRATION="1h"
```

### 3. Database Setup

```bash
# Generate Prisma clients
npm run db:generate

# Run migrations for all databases
npm run db:migrate

# Seed databases with test data
npm run db:seed
```

### 4. Start Services

```bash
# Start specific service
npm run dev --workspace=@zeal/clinical

# Or use the commands in DEVELOPMENT-COMMANDS.md
```

## 🐛 Debugging

### VSCode Launch Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Clinical Service",
      "runtimeArgs": ["-r", "tsx/register"],
      "args": ["${workspaceFolder}/backend/services/clinical/src/main.ts"],
      "cwd": "${workspaceFolder}/backend/services/clinical",
      "console": "integratedTerminal"
    }
  ]
}
```

### Common Issues

See [DEVELOPMENT-COMMANDS.md](./DEVELOPMENT-COMMANDS.md) for troubleshooting common development issues.

## 📖 Related Documentation

- [Infrastructure](../infrastructure/) - Deployment and operations
- [Database Configuration](../infrastructure/database/PRISMA-DATABASE-CONFIG.md)
- [Backend Implementation](../implementation/backend/)
- [API Documentation](../api/)

## 🔗 Quick Links

- [Main README](../README.md)
- [Development Commands](./DEVELOPMENT-COMMANDS.md)
- [Database Setup Guide](../infrastructure/database/PRISMA-DATABASE-CONFIG.md)
- [Backend Overview](../implementation/backend/BACKEND-OVERVIEW.md)

## 💡 Best Practices

### Code Style

- Follow TypeScript strict mode
- Use Prettier for formatting
- Run ESLint before committing
- Write meaningful commit messages

### Testing

- Write unit tests for business logic
- Integration tests for APIs
- E2E tests for critical workflows
- Maintain >80% code coverage

### Database

- Always use Prisma migrations
- Never modify generated Prisma client
- Use transactions for multi-step operations
- Follow naming conventions (snake_case for DB, camelCase for code)

### Git Workflow

- Create feature branches from `main`
- Use conventional commits format
- Keep PRs focused and small
- Update documentation with code changes

---

*For more detailed information, see [DEVELOPMENT-COMMANDS.md](./DEVELOPMENT-COMMANDS.md)*
