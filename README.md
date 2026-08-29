# Athma CE — Community Edition

> **The open-source community edition of [Athma](https://athma.health/) — a modern healthcare platform.**

A modular, open platform to run hospitals, clinics, and digital health systems.

---

## What is Athma CE?

Athma CE is the community edition of [Athma](https://athma.health/), an open-source healthcare platform designed to manage:

- **Clinical operations** (EMR/EHR)
- **Billing & insurance workflows**
- **Patient engagement**
- **Diagnostics & reporting**

Built for real-world healthcare environments — scalable, flexible, and enterprise-ready.

---

## Why Athma CE?

Healthcare systems today are:

- Fragmented
- Expensive
- Hard to customize

**Athma CE changes that.**

- **Modular** — use only what you need
- **Fast to deploy** — get started in minutes
- **Built for healthcare** — audit, compliance, multi-tenant
- **Open** — no vendor lock-in

---

## What You Can Do With Athma CE

### Clinical Care
- Manage patient encounters
- Record observations and prescriptions
- Generate discharge summaries

### Financial Operations
- Billing and invoicing
- Insurance claims workflows
- Patient ledger and payments

### Patient Engagement
- Send messages via SMS / WhatsApp / Email
- Run targeted patient campaigns
- Improve follow-ups and retention

### Diagnostics & Reports
- Create and manage lab/radiology reports
- Flexible, template-based reporting

---

## Getting Started

Athma CE runs as a set of Node.js services plus a Next.js frontend. Docker Compose provides the **infrastructure only** (PostgreSQL, Redis, pgAdmin, RedisInsight) — the app services run directly with `npm` during local development.

**Prerequisites:** Node.js 20+, Docker.

```bash
git clone https://github.com/daivahealth/athma-ce.git
cd athma-ce

# 1. Start infrastructure (Postgres + Redis)
docker-compose up -d postgres redis

# 2. Install backend dependencies
cd backend && npm install && cd ..

# 3. Create database schemas and load baseline data
#    (full steps, including optional plugin schemas and sample data)
#    → docs/seeding/00-complete-seed-guide.md

# 4. Run the backend services you need (each in its own terminal)
cd backend
npm run dev --workspace=@zeal/foundation   # auth/tenants, port 3010
npm run dev --workspace=@zeal/clinical     # clinical, port 3011
# optional: @zeal/rcm (3012), @zeal/prm (3013)

# 5. Run the frontend
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Then open **http://localhost:3000** and sign in with the seeded credentials from the seed guide.

Detailed setup, commands, and workflows: [Developer Onboarding](docs/development/DEVELOPER-ONBOARDING.md) · [Development Commands](docs/development/DEVELOPMENT-COMMANDS.md) · [Seed Guide](docs/seeding/00-complete-seed-guide.md)

---

## Where Athma CE Fits

Athma CE can be used by:

- Hospitals (single or multi-location)
- Clinic chains
- Diagnostic centers
- Health-tech startups
- Digital health platforms

---

## Built for the Future

Athma CE is designed to support:

- AI-powered workflows
- Advanced analytics
- Interoperability (FHIR, APIs)
- Scalable healthcare ecosystems

---

## Roadmap

- [ ] Public demo environment
- [ ] Mobile applications
- [ ] AI assistants for clinicians & operations
- [ ] Advanced analytics and dashboards

---

## Contributing

We welcome contributions from developers, healthcare professionals, and organizations.

1. Fork the repository
2. Create a branch
3. Submit a pull request

---

## License

Licensed under the [Apache License 2.0](./LICENSE)

---

## Commercial & Enterprise

Athma CE is the open-source community edition. For the full-featured product, managed hosting, enterprise deployments, or support, visit [athma.health](https://athma.health/).

📩 **Contact:** sajithchandran@gmail.com

---

## Support

If you find Athma CE useful:

- Star the repository
- Fork and build on it
- Contribute

---

## Author

**Sajith Chandran**
Healthcare IT Architect
