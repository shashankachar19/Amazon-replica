import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/auth/verify-email/${token}`);
        
        if (response.redirected) {
          // Handle redirect from backend
          const redirectUrl = new URL(response.url);
          const params = new URLSearchParams(redirectUrl.search);
          
          if (params.get('error')) {
            setStatus('error');
            setMessage('Verification failed. Link may be expired or invalid.');
          } else if (params.get('verified')) {
            setStatus('success');
            setMessage('Email verified successfully!');
            
            // Store auth data and redirect
            const userId = params.get('userId');
            const username = params.get('username');
            const token = params.get('token');
            
            if (userId && username && token) {
              localStorage.setItem('userToken', token);
              localStorage.setItem('user_id', userId);
              localStorage.setItem('username', username);
              
              setTimeout(() => {
                navigate('/');
              }, 2000);
            }
          }
        }
      } catch (error) {
        setStatus('error');
        setMessage('Network error occurred during verification');
      }
    };

    verifyEmail();
  }, [navigate]);

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
        width: '400px', 
        textAlign: 'center'
      }}>
        {status === 'verifying' && (
          <>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>⏳</div>
            <h2 style={{ color: '#FFD814', marginBottom: '20px' }}>Verifying Email...</h2>
            <p style={{ color: '#a0aec0' }}>Please wait while we verify your email address.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
            <h2 style={{ color: '#68d391', marginBottom: '20px' }}>Email Verified!</h2>
            <p style={{ color: '#edf2f7', marginBottom: '20px' }}>{message}</p>
            <p style={{ color: '#a0aec0' }}>Redirecting you to LOCAL E COMMERCE...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>❌</div>
            <h2 style={{ color: '#fc8181', marginBottom: '20px' }}>Verification Failed</h2>
            <p style={{ color: '#edf2f7', marginBottom: '30px' }}>{message}</p>
            <button 
              onClick={() => navigate('/login')}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: '#FFD814',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;