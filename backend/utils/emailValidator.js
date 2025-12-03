const validateEmail = (email) => {
  // Basic format check
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Invalid email format' };
  }

  // Check minimum length requirements
  const [localPart, domain] = email.split('@');
  
  if (localPart.length < 3) {
    return { valid: false, message: 'Email username must be at least 3 characters' };
  }
  
  if (domain.length < 5) {
    return { valid: false, message: 'Invalid domain' };
  }

  // Check for valid domain structure
  const domainParts = domain.split('.');
  if (domainParts.length < 2) {
    return { valid: false, message: 'Invalid domain format' };
  }

  // Check each domain part
  for (const part of domainParts) {
    if (part.length < 2) {
      return { valid: false, message: 'Invalid domain format' };
    }
  }

  // Blocked patterns
  const blockedPatterns = [
    /^[a-z]@/,           // Single character before @
    /^[a-z]{2}@/,        // Only 2 characters before @
    /test@/,             // Common test emails
    /fake@/,             // Fake emails
    /temp@/,             // Temporary emails
    /@test\./,           // Test domains
    /@fake\./,           // Fake domains
    /@temp\./            // Temp domains
  ];

  for (const pattern of blockedPatterns) {
    if (pattern.test(email.toLowerCase())) {
      return { valid: false, message: 'Please use a valid email address' };
    }
  }

  return { valid: true };
};

module.exports = { validateEmail };