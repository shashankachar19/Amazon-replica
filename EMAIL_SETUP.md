# Email Verification Setup Guide

## Quick Setup (5 minutes)

### 1. Gmail App Password Setup
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Security → 2-Step Verification (enable if not already)
3. Security → App passwords
4. Generate app password for "Mail"
5. Copy the 16-character password

### 2. Update .env File
```bash
# Replace with your actual Gmail credentials
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-character-app-password
```

### 3. Database Migration
```bash
cd backend
npm run data:destroy
npm run data:import
```

## How It Works

1. **User signs in with Google OAuth**
2. **System checks if email is verified**
3. **If not verified:**
   - Sends verification email
   - Redirects to pending page
   - Blocks access until verified
4. **User clicks email link → Email verified → Access granted**

## Features Added

- ✅ Email verification required for access
- ✅ Verification email with secure tokens
- ✅ 24-hour token expiration
- ✅ Resend verification option
- ✅ User-friendly verification pages
- ✅ Automatic redirect after verification

## Security Benefits

- **Real email validation**: Users must have access to the email
- **Token-based verification**: Secure, time-limited tokens
- **No access without verification**: Complete access blocking
- **Prevents fake accounts**: Only verified emails can access

## Testing

1. Sign in with Google
2. Check email for verification link
3. Click link to verify
4. Access granted to ST Store

Perfect for ensuring only users with valid, accessible email addresses can use your application!