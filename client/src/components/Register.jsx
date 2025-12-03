import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/animations.css';

const Register = () => {
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    username: '',
    address: '',
    tempUserId: searchParams.get('tempUserId'),
    email: searchParams.get('email'),
    googleId: searchParams.get('googleId')
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useUser();
  
  useEffect(() => {
    if (!searchParams.get('tempUserId')) {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/complete-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setIsAuthenticated(true);
        navigate('/discover');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      background: theme.colors.background,
      animation: 'fadeIn 1s ease-in'
    }}>
      <div className="card-hover" style={{ 
        backgroundColor: theme.colors.card,
        padding: '50px',
        borderRadius: '20px',
        width: '450px',
        boxShadow: theme.shadows.large,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <h1 style={{ 
          color: theme.colors.text,
          marginBottom: '10px', 
          fontSize: '2.8em', 
          textAlign: 'center',
          fontWeight: 'bold',
          letterSpacing: '-1px'
        }}>
          LOCAL E COMMERCE
        </h1>
        <h2 style={{ color: '#4a5568', marginBottom: '40px', textAlign: 'center', fontSize: '1.2em', fontWeight: '300' }}>
          Complete Your Registration
        </h2>
        
        {error && (
          <div style={{ 
            color: '#fc8181', 
            backgroundColor: '#742a2a', 
            padding: '10px', 
            borderRadius: '4px', 
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
            style={{
              width: '100%',
              padding: '16px',
              marginBottom: '20px',
              border: `2px solid ${theme.colors.border}`,
              borderRadius: '12px',
              backgroundColor: theme.colors.primary,
              color: theme.colors.text,
              fontSize: '16px',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = theme.colors.accent}
            onBlur={(e) => e.target.style.borderColor = theme.colors.border}
          />
          
          <textarea
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            required
            rows="3"
            style={{
              width: '100%',
              padding: '16px',
              marginBottom: '25px',
              border: `2px solid ${theme.colors.border}`,
              borderRadius: '12px',
              backgroundColor: theme.colors.primary,
              color: theme.colors.text,
              fontSize: '16px',
              resize: 'vertical',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = theme.colors.accent}
            onBlur={(e) => e.target.style.borderColor = theme.colors.border}
          />

          <button 
            type="submit"
            disabled={loading}
            className="btn-animate"
            style={{
              width: '100%',
              padding: '18px',
              background: loading ? theme.colors.border : theme.colors.accent,
              color: loading ? theme.colors.textSecondary : '#000',
              border: 'none',
              borderRadius: '50px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: loading ? 'none' : theme.shadows.accent,
              transform: loading ? 'none' : 'translateY(0)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
          >
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid transparent',
                  borderTop: '2px solid currentColor',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Processing...
              </div>
            ) : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;