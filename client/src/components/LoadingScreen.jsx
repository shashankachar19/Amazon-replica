// client/src/components/LoadingScreen.jsx
import React from 'react';

const LoadingScreen = () => {
  try {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#1a202c',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        animation: 'fadeIn 0.3s ease-out'
      }}>
      {/* ST Store Logo */}
      <div style={{
        marginBottom: '30px',
        animation: 'pulse 1.5s ease-in-out infinite'
      }}>
        <h1 style={{
          color: '#FFD814',
          fontSize: '3em',
          margin: 0,
          fontWeight: 'bold',
          textShadow: '0 0 20px rgba(255, 216, 20, 0.5)'
        }}>
          LOCAL E COMMERCE
        </h1>
      </div>

      {/* Unique Loading Animation */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px'
      }}>
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#FFD814',
              borderRadius: '50%',
              animation: `bounce 1.4s ease-in-out infinite`,
              animationDelay: `${index * 0.16}s`
            }}
          />
        ))}
      </div>

      {/* Loading Text */}
      <p style={{
        color: '#a0aec0',
        fontSize: '1.1em',
        margin: 0,
        animation: 'fadeIn 1s ease-out 0.5s both'
      }}>
        Loading...
      </p>

      {/* Shopping Cart Icon Animation */}
      <div style={{
        marginTop: '20px',
        animation: 'slideInRight 1s ease-out 0.8s both'
      }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="#FFD814">
          <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
      </div>
    );
  } catch (error) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#1a202c',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#e2e8f0'
      }}>
        Loading...
      </div>
    );
  }
};

export default LoadingScreen;