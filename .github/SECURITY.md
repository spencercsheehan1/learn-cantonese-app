# Security Policy

## Supported Versions

Currently, Learn Cantonese App is in early development. Security updates are applied to the latest version only.

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1.0 | :x:                |

## Security Considerations

This application has several security-sensitive components:

1. **API Keys**: The app is designed to work with the Cantonese.ai API for speech recognition and pronunciation evaluation
2. **Voice Data**: The app processes user voice recordings for pronunciation analysis
3. **Local Storage**: User progress and potentially sensitive learning data may be stored locally

## Security Measures

- API keys are loaded from environment variables and never committed to the repository
- Demo mode is enabled by default, with simulated API responses
- Automatic dependency updates via Dependabot to patch security vulnerabilities

## Reporting a Vulnerability

If you discover a security vulnerability in Learn Cantonese App, please follow these steps:

1. **Do not disclose the vulnerability publicly** until it has been addressed
2. Email the project maintainer at [spencermustbeking@gmail.com](mailto:spencermustbeking@gmail.com) with:
   - A description of the vulnerability
   - Steps to reproduce (if applicable)
   - Potential impact
   - Suggested fixes (if you have any)

## Response Timeline

- **Acknowledgment**: You will receive an acknowledgment of your report within 48 hours
- **Assessment**: We will assess the vulnerability and determine its severity within 7 days
- **Resolution**: The timeframe for addressing the vulnerability will depend on its severity:
  - Critical: 1-3 days
  - High: 1-2 weeks
  - Medium/Low: Within the next release cycle

## Security Best Practices for Contributors

1. Never commit API keys, tokens, or credentials
2. Use environment variables for sensitive configuration
3. Follow the principle of least privilege
4. Keep dependencies updated
5. Use proper input validation and sanitization, especially for voice data processing

Thank you for helping to keep Learn Cantonese App secure! 