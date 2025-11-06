# Security Policy

## Supported Versions

We actively support security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.2.x   | :white_check_mark: |
| < 0.2.0 | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

### How to Report

1. **Do NOT** open a public GitHub issue for security vulnerabilities
2. Report security vulnerabilities through one of these methods:
   - **Preferred**: Use [GitHub Security Advisories](https://github.com/joinnextblock/telescope/security/advisories/new) for this repository
   - Alternative: Contact NextBlock security team through official channels
3. Include the following information:
   - Type of vulnerability
   - Full paths of source file(s) related to the vulnerability
   - The location of the affected code (tag/branch/commit or direct URL)
   - Step-by-step instructions to reproduce the issue
   - Proof-of-concept or exploit code (if possible)
   - Impact of the vulnerability, including how an attacker might exploit it

### What to Expect

- You will receive an acknowledgment of your report within 48 hours
- We will provide a detailed response within 7 days indicating the next steps
- We will keep you informed of the progress toward fixing the vulnerability
- We will notify you when the vulnerability has been fixed

### Disclosure Policy

- We will coordinate with you to determine the appropriate disclosure timeline
- We will credit you for the discovery (if desired)
- We will not share your personal information without your permission

### Security Best Practices

When using Telescope:

- Always validate input data, especially block heights and block objects
- Ensure Bitcoin block objects are from trusted sources
- Keep dependencies up to date
- Review the code before using in production environments

### Known Security Considerations

Telescope is a calculation library that processes Bitcoin block data. Security considerations include:

- **Input Validation**: Always validate block height values and block object structure
- **Type Safety**: Use TypeScript types to ensure type safety
- **No Network Access**: This library does not make network requests, reducing attack surface
- **Deterministic Calculations**: All calculations are deterministic and do not rely on external data sources

## Security Updates

Security updates will be released as patch versions (e.g., 0.2.0 → 0.2.1) and will be documented in the CHANGELOG.md.

Thank you for helping keep Telescope and its users safe!

