# Security Policy

athma-ce handles clinical and patient data. Please report suspected
vulnerabilities privately — do not open a public issue or pull request.

## Reporting a Vulnerability

Use GitHub's private vulnerability reporting for this repository:

1. Go to the [Security tab](https://github.com/daivahealth/athma-ce/security/advisories/new).
2. Click **Report a vulnerability**.
3. Include affected component/service, reproduction steps, and impact.

You should receive an initial response within 3 business days. We'll work
with you to confirm the issue, assess severity, and coordinate a fix and
disclosure timeline before any public details are published.

## Scope

Architecture-level security controls, compliance posture (HIPAA/GDPR/SOC 2),
and access-control design are documented in
[docs/security/](docs/security/README.md). This file covers only vulnerability
*reporting* — see that folder for how the system is intended to behave.

## Supported Versions

Security fixes are applied to the `main` branch and the latest release.
Older releases are not patched individually.
