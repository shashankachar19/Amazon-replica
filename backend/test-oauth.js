require('dotenv').config();

console.log('Testing OAuth Configuration:');
console.log('Client ID:', process.env.GOOGLE_CLIENT_ID);
console.log('Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? 'Present' : 'Missing');
console.log('Port:', process.env.PORT);

// Test URL
const testUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=http://localhost:3001/api/auth/google/callback&scope=profile email&response_type=code`;

console.log('\nTest this URL in browser:');
console.log(testUrl);