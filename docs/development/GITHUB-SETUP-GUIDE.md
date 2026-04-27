# GitHub Repository Setup Guide

This guide walks through setting up CI/CD, branch protection, and GitHub governance for the athma-ce monorepo.

## 📋 Table of Contents

- [Overview](#overview)
- [Files Created](#files-created)
- [GitHub UI Configuration](#github-ui-configuration)
- [Team Setup](#team-setup)
- [Workflow Testing](#workflow-testing)
- [Release Process](#release-process)

## Overview

The athma-ce monorepo uses GitHub Actions for continuous integration and deployment:

- **CI Pipeline**: Runs on every PR and push to `main` or `release/**` branches
- **Staging Deployment**: Triggered by RC tags (e.g., `v1.2.0-rc.1`)
- **Production Deployment**: Triggered by release tags (e.g., `v1.2.0`)

## Files Created

### GitHub Actions Workflows

```
.github/
├── workflows/
│   ├── ci.yml              # Main CI pipeline
│   ├── staging-rc.yml      # Staging deployment
│   └── release-prod.yml    # Production deployment
├── ISSUE_TEMPLATE/
│   ├── bug_report.yml      # Bug report template
│   └── feature_request.yml # Feature request template
└── PULL_REQUEST_TEMPLATE.md # PR template
```

### Repository Configuration

```
CODEOWNERS               # Code ownership rules
.changeset/
└── config.json         # Changeset configuration for release notes
```

### Documentation

```
docs/
├── SERVICES-AND-PORTS.md    # Service ports and health endpoints
└── GITHUB-SETUP-GUIDE.md    # This file
```

## GitHub UI Configuration

### 1. Create GitHub Teams

Navigate to your organization settings and create the following teams:

#### Required Teams

| Team Name          | Purpose                                    | Members              |
|--------------------|--------------------------------------------|--------------------|
| `maintainers`      | Overall platform maintainers               | Tech leads, architects |
| `platform-team`    | Shared libraries and infrastructure        | Backend leads       |
| `foundation-team`  | Foundation service owners                  | Foundation devs     |
| `clinical-team`    | Clinical service owners                    | Clinical devs       |
| `rcm-team`         | RCM service owners                         | RCM devs            |
| `analytics-team`   | Analytics service owners                   | Analytics devs      |
| `db-team`          | Database migrations and schema             | DBAs, senior devs   |
| `devops-team`      | DevOps, CI/CD, infrastructure              | DevOps engineers    |
| `frontend-team`    | Frontend applications (when added)         | Frontend devs       |

**Steps:**
1. Go to `https://github.com/orgs/<your-org>/teams`
2. Click "New team"
3. Set team name and description
4. Add members
5. Repeat for all teams

### 2. Configure Branch Protection

Protect `main` and `release/**` branches:

**Steps:**
1. Go to repository Settings → Branches
2. Click "Add rule" or "Add branch protection rule"
3. Branch name pattern: `main`
4. Enable the following:

#### Required Settings

- ✅ **Require a pull request before merging**
  - Required approvals: 1 (or 2 for production)
  - Dismiss stale PR approvals when new commits are pushed
  - Require review from Code Owners

- ✅ **Require status checks to pass before merging**
  - Require branches to be up to date before merging
  - Status checks required:
    - `build-test` (from CI workflow)

- ✅ **Require conversation resolution before merging**

- ✅ **Require linear history**
  - Enforces rebase or squash merges

- ✅ **Do not allow bypassing the above settings**
  - Include administrators

- ✅ **Restrict who can push to matching branches**
  - Add teams: `maintainers`, `platform-team`

5. Click "Create" or "Save changes"
6. **Repeat for `release/**` pattern**

### 3. Configure Environments

Create deployment environments for staging and production:

#### Staging Environment

1. Go to Settings → Environments
2. Click "New environment"
3. Name: `staging`
4. Configure:
   - ✅ Required reviewers: `devops-team` (optional for staging)
   - Environment secrets:
     - `DATABASE_URL`
     - `REDIS_URL`
     - `JWT_SECRET`
   - Protection rules: (optional)
     - Wait timer: 0 minutes
     - Deployment branches: `release/**` tags only

#### Production Environment

1. Click "New environment"
2. Name: `production`
3. Configure:
   - ✅ **Required reviewers**: `maintainers`, `devops-team` (at least 2)
   - ✅ **Wait timer**: 5 minutes (optional safety buffer)
   - Environment secrets:
     - `DATABASE_URL`
     - `REDIS_URL`
     - `JWT_SECRET`
     - Any cloud provider credentials
   - ✅ Protection rules:
     - Deployment branches: Selected branches/tags
     - Pattern: `v*` (production tags only, exclude RC tags)

### 4. Configure Repository Secrets

Add repository-wide secrets (Settings → Secrets and variables → Actions):

#### Required Secrets

- `DATABASE_URL` - Database connection string (if not in environments)
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - JWT signing secret
- `DOCKER_USERNAME` - Docker registry username (if using Docker)
- `DOCKER_PASSWORD` - Docker registry password
- `KUBECONFIG` - Kubernetes config (if deploying to K8s)

### 5. Enable GitHub Features

Settings → General:

- ✅ **Issues**: Enable issue tracking
- ✅ **Discussions**: Enable for team collaboration (optional)
- ✅ **Pull Requests**:
  - Allow squash merging (recommended)
  - Allow rebase merging
  - Disable merge commits (optional, for linear history)
  - Automatically delete head branches

## Team Setup

### Assigning Code Owners

The `CODEOWNERS` file automatically assigns reviewers based on file paths. To see it in action:

1. Create a PR that modifies `backend/services/foundation/`
2. GitHub will automatically request review from `@zeal/foundation-team`

### Team Permissions

Recommended team permissions:

| Team              | Repository Role | Additional Permissions      |
|-------------------|-----------------|----------------------------|
| `maintainers`     | Admin           | All                        |
| `platform-team`   | Maintain        | Manage workflows           |
| `*-team` (services)| Write          | Push to branches (except protected) |
| `devops-team`     | Maintain        | Manage deployments         |
| `db-team`         | Write           | Approve migration PRs      |

## Workflow Testing

### Test CI Pipeline

1. Create a test branch:
   ```bash
   git checkout -b test/ci-pipeline
   ```

2. Make a trivial change:
   ```bash
   echo "# Test" >> README.md
   git add README.md
   git commit -m "test: CI pipeline"
   git push origin test/ci-pipeline
   ```

3. Open a PR and verify:
   - ✅ CI workflow runs automatically
   - ✅ Status checks appear in PR
   - ✅ Lint, build, and tests execute
   - ✅ Code owners are requested for review

### Test Staging Deployment (RC Tags)

1. Create and push an RC tag:
   ```bash
   git checkout main
   git pull origin main
   git tag v1.0.0-rc.1
   git push origin v1.0.0-rc.1
   ```

2. Verify in GitHub Actions:
   - ✅ Staging deployment workflow triggers
   - ✅ Build completes successfully
   - ✅ Deployment runs (update deployment script first)

### Test Production Deployment

1. Create and push a release tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. Verify:
   - ✅ Production deployment workflow triggers
   - ✅ Required approvals requested (if configured)
   - ✅ Deployment succeeds after approval

## Release Process

### Creating a Release Candidate (Staging)

```bash
# 1. Ensure main is up to date
git checkout main
git pull origin main

# 2. Create RC tag
git tag v1.2.0-rc.1 -m "Release candidate for v1.2.0"
git push origin v1.2.0-rc.1

# 3. Monitor GitHub Actions for staging deployment
# 4. Test in staging environment
# 5. If issues found, create v1.2.0-rc.2, etc.
```

### Creating a Production Release

```bash
# 1. After RC testing is complete
git checkout main
git pull origin main

# 2. Create release tag (no -rc suffix)
git tag v1.2.0 -m "Release v1.2.0"
git push origin v1.2.0

# 3. GitHub Actions will trigger production deployment
# 4. Approve deployment in GitHub UI (if required reviewers configured)
# 5. Monitor deployment and verify in production
```

### Using Changesets for Release Notes

```bash
# 1. Install changesets CLI
npm install -g @changesets/cli

# 2. Add a changeset for your changes
npx changeset

# Follow prompts:
# - Select packages that changed
# - Select change type (patch/minor/major)
# - Describe the changes

# 3. Commit the changeset
git add .changeset/*
git commit -m "chore: add changeset"

# 4. When ready to release, generate changelog
npx changeset version

# 5. Commit version bumps and changelogs
git add .
git commit -m "chore: version bump and changelog"

# 6. Create and push tag
git tag v1.2.0
git push origin main --tags
```

## Customization Guide

### Update Deployment Scripts

Edit `.github/workflows/staging-rc.yml` and `.github/workflows/release-prod.yml`:

Replace the placeholder deployment steps with your actual deployment commands:

```yaml
# Example: Docker deployment
- name: Build Docker images
  run: |
    docker build -t zeal/foundation:${GITHUB_REF_NAME} ./backend/services/foundation
    docker build -t zeal/clinical:${GITHUB_REF_NAME} ./backend/services/clinical

- name: Push to registry
  run: |
    echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
    docker push zeal/foundation:${GITHUB_REF_NAME}
    docker push zeal/clinical:${GITHUB_REF_NAME}

# Example: Kubernetes deployment
- name: Deploy to K8s
  run: |
    kubectl set image deployment/foundation foundation=zeal/foundation:${GITHUB_REF_NAME}
    kubectl set image deployment/clinical clinical=zeal/clinical:${GITHUB_REF_NAME}
    kubectl rollout status deployment/foundation
    kubectl rollout status deployment/clinical
```

### Adjust Team Names

If your GitHub organization uses different team names, update:

1. `CODEOWNERS` file
2. Branch protection rules
3. Environment reviewers

### Add More Workflows

Create additional workflows in `.github/workflows/`:

- `security-scan.yml` - Run security scans (Snyk, Trivy)
- `e2e-tests.yml` - End-to-end tests
- `performance-tests.yml` - Load testing
- `docs-deploy.yml` - Deploy documentation

## Troubleshooting

### CI Workflow Fails

**Check:**
- Node version matches (should be 20)
- All dependencies install successfully
- Turbo cache is working
- Environment variables are set

**Debug locally:**
```bash
npm ci
npx turbo run lint
npx turbo run build
npx turbo run test
```

### CODEOWNERS Not Working

**Verify:**
- File is named exactly `CODEOWNERS` (case-sensitive)
- File is at repository root
- Teams exist in GitHub organization
- Teams have read access to repository
- Branch protection requires code owner review

### Deployment Fails

**Check:**
- Environment secrets are set correctly
- Deployment target is accessible
- Required reviewers have approved (for production)
- Tags are pushed correctly (`git push --tags`)

### Status Checks Not Required

**Fix:**
1. Run CI workflow at least once to register the check
2. Go to branch protection settings
3. Search for check name in "Status checks" section
4. Select the check to make it required

## Best Practices

### Commit Messages

Follow conventional commits:

```
feat(clinical): add patient appointment scheduling
fix(foundation): resolve tenant isolation bug
chore(deps): upgrade NestJS to v10
docs: update API documentation
test(rcm): add billing integration tests
```

### PR Workflow

1. Create feature branch from `main`
2. Make changes and commit
3. Push and open PR
4. Add changeset if needed: `npx changeset`
5. Request reviews from code owners
6. Address review comments
7. Squash and merge when approved

### Tagging Conventions

- RC tags: `v1.2.0-rc.1`, `v1.2.0-rc.2`, etc.
- Production: `v1.2.0`, `v1.2.1`, `v2.0.0`
- Hotfixes: `v1.2.1` (patch version bump)
- Follow semantic versioning (MAJOR.MINOR.PATCH)

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [CODEOWNERS Syntax](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [Changesets Documentation](https://github.com/changesets/changesets)
- [Turborepo CI/CD](https://turbo.build/repo/docs/ci)

## Support

For issues with GitHub setup or CI/CD:
1. Check GitHub Actions logs
2. Review this documentation
3. Contact `@zeal/devops-team` or `@zeal/maintainers`
