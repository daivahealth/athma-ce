# Documentation Archive

This folder contains historical documentation that is no longer actively maintained but preserved for reference.

## Contents

### Implementation History (`implementation-history/`)

Point-in-time implementation summaries and session logs from the initial development phases. These documents capture the state of the system at specific dates and are preserved for historical context.

**Note**: For current implementation status, refer to the service READMEs and feature documentation.

## Why Archive?

Documents are archived when they:

1. **Become outdated**: Status reports from specific dates
2. **Are superseded**: Replaced by more comprehensive documentation
3. **Are redundant**: Duplicated information available elsewhere
4. **Were session-specific**: Development session logs

## Finding Current Documentation

| Topic | Current Location |
|-------|------------------|
| Implementation status | Service READMEs in `backend/services/*/README.md` |
| Architecture | `docs/architecture/` |
| Features | `docs/features/` |
| API documentation | `docs/api/` and Swagger endpoints |
| Development guides | `docs/development/` |

## Restoring Archived Docs

If you need to restore an archived document:

```bash
mv docs/archive/implementation-history/DOCUMENT.md docs/implementation/summaries/
```

## Policy

- Archived documents are not deleted
- They may be referenced but should not be linked from active docs
- Updates should go to current documentation, not archives
