# Architecture Documentation

This folder contains architecture documentation for `athma-ce`.

Use these documents with one rule in mind: documents in this folder should describe the implemented system unless they explicitly say a section is planned or recommended.

## Start Here

- [TECHNICAL-ARCHITECTURE.md](./TECHNICAL-ARCHITECTURE.md)
  Current-state system architecture across frontend, backend, services, databases, and local infrastructure.
- [BACKEND-ARCHITECTURE.md](./BACKEND-ARCHITECTURE.md)
  Backend-specific service and platform guidance.
- [FRONTEND-ARCHITECTURE-RECOMMENDATION.md](./FRONTEND-ARCHITECTURE-RECOMMENDATION.md)
  Frontend structure guidance updated to the current single-app, domain-module model.

## Core Reference Documents

- [01-Context.md](./01-Context.md)
- [02-Architecture-Diagram.md](./02-Architecture-Diagram.md)
- [03-Domain-Model.md](./03-Domain-Model.md)
- [04-Interfaces.md](./04-Interfaces.md)
- [05-Data-Model.md](./05-Data-Model.md)
- [06-AI-Design.md](./06-AI-Design.md)
- [24-Service-Database-Interaction.md](./24-Service-Database-Interaction.md)

## Architecture Standards for This Folder

- Prefer updating an existing canonical document over creating a new one.
- Mark planned or target-state architecture explicitly.
- Do not describe deprecated topology as if it were deployed.
- Keep service, port, and database ownership details aligned with the repository.
- Update related ADRs when current implementation materially diverges from an earlier decision record.

## Related Documentation

- [ADR Index](../ADR/)
- [Services Overview](../services/README.md)
- [Security](../security/)
- [Multi-Tenancy](../multitenancy/)
- [Infrastructure](../infrastructure/)
- [Main Docs Index](../README.md)
