# Architecture Documentation

This folder contains the core architecture and design documentation for the Zeal PMS/RCM system.

## 📚 Core Architecture Documents

### System Overview

1. **[01-Context.md](./01-Context.md)**
   - System context and business requirements
   - Stakeholders and goals
   - Problem statement and solution overview

2. **[02-Architecture-Diagram.md](./02-Architecture-Diagram.md)**
   - High-level architecture diagrams
   - System components and interactions
   - Technology stack overview

### Domain & Data Models

3. **[03-Domain-Model.md](./03-Domain-Model.md)**
   - Domain-driven design models
   - Core entities and aggregates
   - Business logic boundaries

4. **[Complete-Domain-Model.md](./Complete-Domain-Model.md)**
   - Comprehensive domain model reference
   - All entities, relationships, and business rules

5. **[05-Data-Model.md](./05-Data-Model.md)**
   - Database schema design
   - Entity-relationship diagrams
   - Data modeling decisions

6. **[22-Data-Model-Summary.md](./22-Data-Model-Summary.md)**
   - Data model summary and quick reference
   - Key entities and relationships

7. **[Complete-Data-Model.md](./Complete-Data-Model.md)**
   - Complete database schema reference
   - All tables, columns, and constraints

### Technical Architecture

8. **[04-Interfaces.md](./04-Interfaces.md)**
   - System interfaces and APIs
   - Integration patterns
   - Communication protocols

9. **[24-Service-Database-Interaction.md](./24-Service-Database-Interaction.md)**
   - Service-to-database interaction patterns
   - Data access layer design
   - Connection pooling and optimization

10. **[06-AI-Design.md](./06-AI-Design.md)**
    - AI/ML architecture and design
    - Model deployment strategy
    - AI-powered features

## 🏗️ Architecture Principles

### Microservices Architecture
- **Clinical Domain**: Patient management, encounters, clinical workflows
- **RCM Domain**: Billing, claims, revenue cycle management
- **Foundation Domain**: Facility management, scheduling, identity
- **Analytics Domain**: Reporting, dashboards, business intelligence

### Design Patterns
- Domain-Driven Design (DDD)
- Event-Driven Architecture
- CQRS for complex queries
- Repository pattern for data access

### Technology Stack
- **Backend**: Node.js, NestJS, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **API**: REST with OpenAPI/Swagger
- **Real-time**: WebSockets for live updates

## 📖 Related Documentation

- [Security & Compliance](../security/)
- [Multi-Tenancy](../multitenancy/)
- [Infrastructure](../infrastructure/)
- [Architecture Decision Records](../ADR/)

## 🔗 Quick Links

- [Main README](../README.md)
- [Implementation Summaries](../implementation/summaries/)
- [Feature Documentation](../features/)
