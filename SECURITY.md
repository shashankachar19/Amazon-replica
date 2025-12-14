# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

This is an educational project for software testing demonstration. If you discover a security vulnerability:

1. **DO NOT** open a public issue
2. Email the maintainer directly
3. Include detailed steps to reproduce
4. Allow 48 hours for initial response

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Protected API routes
- Environment variable protection
- CORS configuration

## Known Limitations

This is a **demonstration project** with the following limitations:
- Uses development secrets (change in production)
- SQLite database (not production-ready)
- Basic error handling
- Limited rate limiting

## Best Practices Implemented

- ✅ Environment variables for secrets
- ✅ JWT token expiration
- ✅ Password hashing
- ✅ Input validation
- ✅ Protected routes
- ✅ CORS headers