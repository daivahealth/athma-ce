# Documentation Contribution Guidelines

This guide outlines standards and best practices for contributing to Zeal documentation.

## 📝 Writing Standards

### Language & Style
- Use **American English** consistently
- Write in **present tense** ("The system validates..." not "The system will validate...")
- Use **active voice** ("User clicks submit" not "Submit is clicked by user")
- Keep sentences **concise** — aim for < 25 words
- Use **bulleted lists** for enumerations (4+ items)
- Use **tables** for structured data

### Formatting Conventions
| Element | Convention | Example |
|---------|------------|---------|
| File names | Backticks | `auth.service.ts` |
| Commands | Code block | `npm run build` |
| Code snippets | Language-tagged block | ```typescript |
| API endpoints | Monospace | `GET /api/v1/patients` |
| Variables | Italic | _tenantId_ |
| UI elements | **Bold** | Click **Save** |

### Heading Structure
Use ATX-style headings (#, ##, ###) with:
- Top-level (#) for document title
- Second-level (##) for major sections
- Third-level (###) for subsections
- No more than 4 levels deep

## 📁 File Naming

- Use **kebab-case**: `multi-tenancy-guide.md`
- Use **descriptive names**: `backend-architecture.md` not `doc3.md`
- Include context: `adr-0013-service-decomposition.md`

## 🏗️ Document Types

### Architecture Decision Records (ADR)
- Location: `docs/ADR/`
- Naming: `ADR-XXXX-descriptive-title.md`
- Template: See `docs/ADR/README.md`
- Status: Draft → Proposed → Accepted → Deprecated

### Runbooks
- Location: `docs/runbooks/`
- Naming: `operation-name.md`
- Structure: Prereqs → Steps → Verification → Rollback

### API Documentation
- Location: `docs/api/` or inline via Swagger/OpenAPI
- Keep sync with code changes
- Include examples for all endpoints

## 🎯 Content Checklist

Before submitting documentation:

- [ ] **Accuracy** — All code examples compile and work
- [ ] **Completeness** — Covers all common use cases
- [ ] **Clarity** — Peer review passes
- [ ] **Links** — Internal links work, external links verified
- [ ] **Formatting** — No broken markdown
- [ ] **Indexing** — Update `docs/README.md` if adding new sections

## 🔄 Review Process

1. **Self-review** against this guide
2. **Peer review** — At least one approver
3. **CI checks** — Markdown linting, link verification
4. **Merge** — Squash commits for documentation changes

## 📚 Documentation Types Reference

| Type | Purpose | Audience |
|------|---------|----------|
| ADR | Record architectural decisions | Developers, Architects |
| Runbook | Operational procedures | DevOps, Support |
| Tutorial | Step-by-step learning | New developers |
| Reference | API/specification details | Developers |
| Guide | Best practices | All contributors |
