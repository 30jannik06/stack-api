# Security Policy

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Instead, report them privately via:
- GitHub: [Security Advisories](https://github.com/30jannik06/stack-api/security/advisories/new)

I will respond within **48 hours** and aim to release a fix within **7 days** depending on severity.

## What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (optional)

## Scope

| In scope | Out of scope |
|---|---|
| API endpoints leaking sensitive data | Third-party APIs (Discord, GitHub, etc.) |
| Authentication bypass | Rate limiting bypass via normal usage |
| Environment variable exposure | Issues requiring physical access |