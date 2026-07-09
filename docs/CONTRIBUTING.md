# Contributing to athma-ce

Thanks for your interest in contributing. This guide covers the code
contribution workflow; see [Documentation Contributions](#documentation-contributions)
below for docs-specific standards.

## Code of Conduct

This project follows the [Contributor Covenant](../CODE_OF_CONDUCT.md).
By participating, you agree to uphold it.

## Getting Started

1. Set up your environment using [DEVELOPER-ONBOARDING.md](development/DEVELOPER-ONBOARDING.md).
2. Common local commands are in [DEVELOPMENT-COMMANDS.md](development/DEVELOPMENT-COMMANDS.md).
3. Read the top-level `AGENTS.md`/`CLAUDE.md` operating rules before touching
   architecture, API contracts, or multitenancy-sensitive code — those areas
   require matching documentation updates in the same change.

## Branching & Commits

- Branch off `main`: `feature/<short-description>`, `fix/<short-description>`.
- Follow [Conventional Commits](development/GITHUB-SETUP-GUIDE.md#commit-messages)
  (`feat:`, `fix:`, `docs:`, `chore:`, etc.).
- Keep commits scoped and coherent; avoid mixing unrelated changes.

## Pull Requests

- Fill out the PR template (`.github/PULL_REQUEST_TEMPLATE.md`).
- `main` is protected: at least one approving review and a passing
  `Build & Test (affected)` CI check are required before merge.
- Keep PRs focused — split unrelated changes into separate PRs.
- Update the relevant canonical docs under `docs/` in the same PR when
  behavior, API shape, or architecture changes (see repo `CLAUDE.md` /
  `AGENTS.md` for the routing rules).

## Reporting Bugs & Requesting Features

Use the issue templates under `.github/ISSUE_TEMPLATE/`. For security
vulnerabilities, do **not** open a public issue — follow [SECURITY.md](../SECURITY.md).

## Testing

Run the relevant test suite before opening a PR:

```bash
cd frontend && npm run test
cd backend && npm run test --workspace=@zeal/<service>
```

## Documentation Contributions

This section outlines standards and best practices for contributing to athma-ce documentation.

### 📝 Writing Standards

#### Language & Style
- Use **American English** consistently
- Write in **present tense** ("The system validates..." not "The system will validate...")
- Use **active voice** ("User clicks submit" not "Submit is clicked by user")
- Keep sentences **concise** — aim for < 25 words
- Use **bulleted lists** for enumerations (4+ items)
- Use **tables** for structured data

#### Formatting Conventions
| Element | Convention | Example |
|---------|------------|---------|
| File names | Backticks | `auth.service.ts` |
| Commands | Code block | `npm run build` |
| Code snippets | Language-tagged block | ```typescript |
| API endpoints | Monospace | `GET /api/v1/patients` |
| Variables | Italic | _tenantId_ |
| UI elements | **Bold** | Click **Save** |

#### Heading Structure
Use ATX-style headings (#, ##, ###) with:
- Top-level (#) for document title
- Second-level (##) for major sections
- Third-level (###) for subsections
- No more than 4 levels deep

### 📁 File Naming

- Use **kebab-case**: `multi-tenancy-guide.md`
- Use **descriptive names**: `backend-architecture.md` not `doc3.md`
- Include context: `adr-0013-service-decomposition.md`

### 🏗️ Document Types

#### Architecture Decision Records (ADR)
- Location: `docs/ADR/`
- Naming: `ADR-XXXX-descriptive-title.md`
- Template: See `docs/ADR/README.md`
- Status: Draft → Proposed → Accepted → Deprecated

#### Runbooks
- Location: `docs/runbooks/`
- Naming: `operation-name.md`
- Structure: Prereqs → Steps → Verification → Rollback

#### API Documentation
- Location: `docs/api/` or inline via Swagger/OpenAPI
- Keep sync with code changes
- Include examples for all endpoints

### 🎯 Content Checklist

Before submitting documentation:

- [ ] **Accuracy** — All code examples compile and work
- [ ] **Completeness** — Covers all common use cases
- [ ] **Clarity** — Peer review passes
- [ ] **Links** — Internal links work, external links verified
- [ ] **Formatting** — No broken markdown
- [ ] **Indexing** — Update `docs/README.md` if adding new sections

### 🔄 Review Process

1. **Self-review** against this guide
2. **Peer review** — At least one approver
3. **CI checks** — Markdown linting, link verification
4. **Merge** — Squash commits for documentation changes

### 📚 Documentation Types Reference

| Type | Purpose | Audience |
|------|---------|----------|
| ADR | Record architectural decisions | Developers, Architects |
| Runbook | Operational procedures | DevOps, Support |
| Tutorial | Step-by-step learning | New developers |
| Reference | API/specification details | Developers |
| Guide | Best practices | All contributors |
