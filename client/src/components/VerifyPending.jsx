import React, { useState } from 'react';

const VerifyPending = () => {
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get('email');

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Verification email sent! Please check your inbox.');
      } else {
        setMessage('Failed to send email. Please try again.');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    }
    setIsResending(false);
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#1a202c' 
    }}>
      <div style={{ 
        backgroundColor: '#2d3748', 
        padding: '40px', 
        borderRadius: '8px', 
        width: '500px', 
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>📧</div>
        <h1 style={{ color: '#FFD814', marginBottom: '20px' }}>Check Your Email</h1>
        <p style={{ color: '#edf2f7', marginBottom: '20px', lineHeight: '1.6' }}>
          We've sent a verification link to:
        </p>
        <p style={{ color: '#FFD814', fontWeight: 'bold', marginBottom: '30px' }}>
          {email}
        </p>
        <p style={{ color: '#a0aec0', marginBottom: '30px', lineHeight: '1.6' }}>
          Please click the verification link in your email to complete your registration and access LOCAL E COMMERCE.
        </p>
        
        {message && (
          <div style={{ 
            color: message.includes('sent') ? '#68d391' : '#fc8181', 
            marginBottom: '20px',
            padding: '10px',
            backgroundColor: message.includes('sent') ? '#1a365d' : '#742a2a',
            borderRadius: '4px'
          }}>
            {message}
          </div>
        )}

        <button 
          onClick={handleResendEmail}
          disabled={isResending}
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: isResending ? '#4a5568' : '#FFD814',
            color: isResending ? '#a0aec0' : '#000',
            border: 'none',
            borderRadius: '8px',
            cursor: isResending ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '20px'
          }}
        >
          {isResending ? 'Sending...' : 'Resend Verification Email'}
        </button>

        <p style={{ color: '#718096', fontSize: '14px' }}>
          Didn't receive the email? Check your spam folder or click resend.
        </p>
      </div>
    </div>
  );
};

export default VerifyPending;