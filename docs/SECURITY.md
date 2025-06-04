# WhatIf.DIY Security Features

This document outlines the comprehensive security measures implemented to protect the application, users, and AI API from abuse and attacks.

## 🛡️ **Input Validation & Sanitization**

### Frontend Security

- **Length Limits**: Topic (500 chars), Perspective (200 chars)
- **Character Filtering**: Removes control characters, HTML/XML tags, JavaScript schemes
- **Pattern Detection**: Blocks suspicious patterns like script injection attempts
- **Request Size Validation**: 10KB maximum request size

### Backend Security

- **Multi-layer Validation**: Server-side validation with client-side backup
- **Content Sanitization**: Removes harmful characters and normalizes input
- **Encoding Protection**: Prevents various encoding attacks

## 🚫 **Content Filtering**

### Harmful Content Blocking

- **Violence & Harm**: Suicide, self-harm, violence, murder, torture
- **Illegal Activities**: Drug dealing, hacking, explosives, terrorism
- **Inappropriate Content**: Child abuse, explicit sexual content
- **Spam Prevention**: Repeated characters, URLs, social media handles

### Prompt Injection Protection

- **System Command Blocking**: Prevents admin/system mode attempts
- **Instruction Manipulation**: Blocks ignore/forget/disregard patterns
- **Code Execution Prevention**: Blocks eval, execute, run commands

### Sensitive Topic Handling

- **Political Content**: Monitored but allowed with balanced responses
- **Religious Topics**: Handled with educational, balanced perspectives
- **Social Issues**: Race, discrimination topics handled carefully

## ⚡ **Rate Limiting & Abuse Prevention**

### Multi-tier Rate Limiting

- **Daily Limit**: 10 requests per day (free tier)
- **Hourly Limit**: 5 requests per hour
- **Burst Protection**: 3 requests per minute maximum
- **IP-based Tracking**: Secure hashed IP identification

### Abuse Detection

- **Suspicious Activity Monitoring**: Flags rapid-fire requests
- **High Volume Detection**: Monitors for unusual usage patterns
- **Automatic Blocking**: Temporary blocks for severe abuse
- **Request Tracking**: Maintains request history for analysis

## 🔒 **API Security**

### Request Protection

- **Request Size Limits**: 10KB maximum payload
- **Timeout Protection**: 30-second timeout for AI requests
- **Error Handling**: Prevents information leakage in errors
- **Response Validation**: Validates AI response structure

### Headers & CORS

```javascript
{
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Cache-Control": "no-cache, no-store, must-revalidate"
}
```

### CSRF Protection

- **X-Requested-With Header**: Validates legitimate frontend requests
- **Origin Validation**: Checks request origins
- **Token-based Protection**: Uses secure tokens for state changes

## 🔐 **Data Privacy & Security**

### IP Address Protection

- **SHA-256 Hashing**: Secure hashing with salt
- **No Plain Text Storage**: IPs never stored in plain text
- **Privacy First**: Minimal data collection approach

### Redis Security

- **Encrypted Connections**: TLS-encrypted Redis connections
- **Access Control**: Environment-based credentials
- **Data Expiration**: Automatic cleanup of old data
- **Key Isolation**: User-specific key patterns

## 🎯 **AI Safety Measures**

### Prompt Engineering

- **Safety Instructions**: Clear guidelines in prompts
- **Response Constraints**: Structured JSON-only responses
- **Content Boundaries**: Explicit content policy in prompts
- **Fallback Responses**: Safe defaults when AI fails

### Response Validation

- **Structure Verification**: Validates response format
- **Content Filtering**: Additional filtering of AI responses
- **Error Handling**: Graceful handling of inappropriate responses

## 📊 **Monitoring & Logging**

### Security Logging

- **Suspicious Activity Alerts**: Logs unusual patterns
- **Error Tracking**: Comprehensive error logging
- **Rate Limit Violations**: Tracks limit violations
- **Content Policy Violations**: Logs blocked content

### Metrics Tracking

- **Usage Analytics**: Tracks legitimate usage patterns
- **Security Events**: Monitors security-related events
- **Performance Monitoring**: Tracks API response times

## 🔧 **Configuration**

### Environment Variables

```bash
GEMINI_API_KEY=your_api_key
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

### Security Settings

```javascript
const SECURITY_CONFIG = {
  MAX_TOPIC_LENGTH: 500,
  MAX_PERSPECTIVE_LENGTH: 200,
  DAILY_LIMIT: 10,
  HOURLY_LIMIT: 5,
  BURST_LIMIT: 3,
  SUSPICIOUS_THRESHOLD: 20,
};
```

## 🚨 **Incident Response**

### Automatic Responses

- **Rate Limit Enforcement**: Automatic blocking for violations
- **Content Filtering**: Immediate rejection of harmful content
- **Error Handling**: Safe error responses without data leakage

### Manual Interventions

- **IP Blocking**: Ability to block problematic IPs
- **Content Updates**: Regular updates to blocking patterns
- **Monitoring Adjustments**: Threshold tuning based on patterns

## ✅ **Security Checklist**

- [x] Input validation and sanitization
- [x] Content filtering for harmful material
- [x] Rate limiting and abuse prevention
- [x] API security with proper headers
- [x] Data privacy protection
- [x] AI safety measures
- [x] Comprehensive error handling
- [x] Security logging and monitoring
- [x] CSRF and XSS protection
- [x] Request size and timeout limits

## 🔄 **Regular Security Tasks**

### Weekly

- Review suspicious activity logs
- Check rate limiting effectiveness
- Monitor API usage patterns

### Monthly

- Update content filtering patterns
- Review and update security configurations
- Analyze security metrics

### Quarterly

- Security audit and penetration testing
- Update security documentation
- Review and update incident response procedures

## 📞 **Security Contact**

For security-related issues or vulnerabilities:

- Create an issue in the repository
- Mark as security-related
- Provide detailed information about the issue

---

_This security documentation is regularly updated to reflect the latest security measures and best practices._
