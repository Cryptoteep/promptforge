# Security Policy

## Supported versions

PromptForge is actively developed on the `main` branch. We provide security
fixes for the latest release only.

| Version | Supported          |
| ------- | ------------------ |
| latest  | ✅                 |
| < 1.0   | ❌ (pre-release)   |

## Reporting a vulnerability

We take security seriously. If you discover a security vulnerability in
PromptForge, **please do not open a public issue**.

Instead, please report it **privately** via one of:

- **GitHub Security Advisories** (preferred):
  [Report a new vulnerability](https://github.com/Cryptoteep/promptforge/security/advisories/new)
- Or email the maintainer directly if an email is listed in their GitHub profile.

Please include:

- A description of the vulnerability and its potential impact.
- Steps to reproduce, or a proof-of-concept.
- Affected versions/commits.
- Any suggested mitigations.

We will acknowledge receipt within **72 hours** and aim to provide an initial
assessment within **7 days**. We appreciate coordinated disclosure and will
credit reporters (unless they prefer to remain anonymous) in any advisory we
publish.

## Scope

This policy covers the PromptForge codebase in this repository. It does **not**
cover:

- Vulnerabilities in third-party dependencies (report those upstream).
- Issues in forks or deployments you don't control.
- Self-XSS or social-engineering attacks requiring the victim to attack themselves.

## Best practices for self-hosters

- Keep dependencies up to date (`bun update`).
- Do not commit your `.env` file or database — they are gitignored by default.
- Run PromptForge behind HTTPS in production.
- Review community-submitted prompts (they enter with `status: pending`) before
  promoting them to `approved`.
