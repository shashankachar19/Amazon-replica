import React, { useState } from 'react';

const Auth = ({ setIsAuthenticated }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        address: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Check for verification success
    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('verified') === 'true') {
            setError('');
            // Show success message briefly
            const successDiv = document.createElement('div');
            successDiv.style.cssText = 'position:fixed;top:20px;right:20px;background:#68d391;color:#000;padding:15px;border-radius:5px;z-index:1000';
            successDiv.textContent = 'Email verified! You can now sign in.';
            document.body.appendChild(successDiv);
            setTimeout(() => document.body.removeChild(successDiv), 3000);
        }
        if (urlParams.get('error')) {
            setError('Verification failed. Please try again.');
        }
    }, []);

    const validateEmailClient = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) return 'Invalid email format';
        
        const [localPart, domain] = email.split('@');
        if (localPart.length < 3) return 'Email username must be at least 3 characters';
        if (domain.length < 5) return 'Invalid domain';
        
        // Block simple patterns
        if (/^[a-z]@/.test(email.toLowerCase())) return 'Please use a valid email address';
        if (/^[a-z]{2}@/.test(email.toLowerCase())) return 'Please use a valid email address';
        
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Client-side email validation
        const emailError = validateEmailClient(formData.email);
        if (emailError) {
            setError(emailError);
            setLoading(false);
            return;
        }

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const payload = isLogin 
                ? { email: formData.email, password: formData.password }
                : formData;

            const response = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.requiresVerification) {
                    setError('Please check your email and click the verification link to complete registration.');
                } else {
                    localStorage.setItem('userToken', data.token);
                    localStorage.setItem('user_id', data.user.id);
                    localStorage.setItem('username', data.user.username);
                    localStorage.setItem('userEmail', data.user.email);
                    setIsAuthenticated(true);
                }
            } else {
                setError(data.message || 'Authentication failed');
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
            backgroundColor: '#1a202c' 
        }}>
            <div style={{ 
                backgroundColor: '#2d3748', 
                padding: '40px', 
                borderRadius: '8px', 
                width: '400px'
            }}>
                <h1 style={{ color: '#FFD814', marginBottom: '10px', fontSize: '2.5em', textAlign: 'center' }}>LOCAL E COMMERCE</h1>
                <h2 style={{ color: '#edf2f7', marginBottom: '30px', textAlign: 'center' }}>
                    {isLogin ? 'Sign In' : 'Create Account'}
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
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Your name"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                marginBottom: '15px',
                                border: '1px solid #4a5568',
                                borderRadius: '4px',
                                backgroundColor: '#1a202c',
                                color: '#edf2f7',
                                fontSize: '14px'
                            }}
                        />
                    )}
                    
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        style={{
                            width: '100%',
                            padding: '12px',
                            marginBottom: '15px',
                            border: '1px solid #4a5568',
                            borderRadius: '4px',
                            backgroundColor: '#1a202c',
                            color: '#edf2f7',
                            fontSize: '14px'
                        }}
                    />
                    
                    <input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                        minLength="6"
                        style={{
                            width: '100%',
                            padding: '12px',
                            marginBottom: '15px',
                            border: '1px solid #4a5568',
                            borderRadius: '4px',
                            backgroundColor: '#1a202c',
                            color: '#edf2f7',
                            fontSize: '14px'
                        }}
                    />
                    
                    {!isLogin && (
                        <textarea
                            placeholder="Address"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            required
                            rows="3"
                            style={{
                                width: '100%',
                                padding: '12px',
                                marginBottom: '15px',
                                border: '1px solid #4a5568',
                                borderRadius: '4px',
                                backgroundColor: '#1a202c',
                                color: '#edf2f7',
                                fontSize: '14px',
                                resize: 'vertical'
                            }}
                        />
                    )}

                    <button 
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '15px',
                            backgroundColor: loading ? '#4a5568' : '#FFD814',
                            color: loading ? '#a0aec0' : '#000',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            marginBottom: '20px'
                        }}
                    >
                        {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div style={{ textAlign: 'center' }}>
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                            setFormData({ username: '', email: '', password: '', address: '' });
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#FFD814',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            fontSize: '14px'
                        }}
                    >
                        {isLogin ? 'Create your LOCAL E COMMERCE account' : 'Already have an account? Sign in'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;