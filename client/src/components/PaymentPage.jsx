// client/src/components/PaymentPage.jsx
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Header from './Header';
import '../animations.css';

const PaymentPage = ({ handleLogout }) => {
  const { theme } = useTheme();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');


  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);



  const handlePayment = async () => {
    setProcessing(true);
    
    try {
      // Get user's cart with proper error handling
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        throw new Error('Please log in to continue');
      }
      
      let cartResponse;
      try {
        cartResponse = await fetch('http://localhost:5000/api/cart', {
          headers: {
            'x-user-id': userId
          },
          credentials: 'include'
        });
      } catch (networkError) {
        throw new Error('Network error: Unable to connect to server');
      }
      
      if (!cartResponse.ok) {
        const errorText = await cartResponse.text().catch(() => 'Unknown error');
        throw new Error(`Failed to get cart: ${cartResponse.status} ${errorText}`);
      }
      
      let cart;
      try {
        cart = await cartResponse.json();
      } catch (parseError) {
        throw new Error('Invalid response format from server');
      }
      
      if (!cart || !cart.items || cart.items.length === 0) {
        alert('Cart is empty!');
        return;
      }



      // Process purchase - reduce stock for each item
      let purchaseResponse;
      try {
        purchaseResponse = await fetch('http://localhost:5000/api/cart/purchase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId
          },
          credentials: 'include'
        });
      } catch (networkError) {
        throw new Error('Network error: Unable to process purchase');
      }

      if (!purchaseResponse.ok) {
        let errorMessage = 'Purchase failed';
        try {
          const error = await purchaseResponse.json();
          errorMessage = error.message || errorMessage;
        } catch (parseError) {
          errorMessage = `Purchase failed: ${purchaseResponse.status} ${purchaseResponse.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Get order details from response
      const orderData = await purchaseResponse.json();

      setTimeout(() => {
        // Create custom notification with safe DOM manipulation
        const notification = document.createElement('div');
        const container = document.createElement('div');
        container.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
          color: #e2e8f0;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          z-index: 10000;
          text-align: center;
          border: 2px solid #FFD814;
          max-width: 500px;
          animation: scaleIn 0.5s ease-out;
        `;
        
        // Safely create content without innerHTML
        const title = document.createElement('h2');
        title.textContent = 'Order Confirmed!';
        title.style.cssText = 'color: #FFD814; margin: 0 0 20px 0; font-size: 1.8em;';
        
        const message = document.createElement('p');
        message.textContent = 'Thank you for shopping with LOCAL E COMMERCE!';
        message.style.cssText = 'margin: 0 0 15px 0; font-size: 1.1em;';
        
        const details = document.createElement('div');
        details.style.cssText = 'background: rgba(255,216,20,0.1); padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left;';
        
        const dateText = document.createElement('p');
        dateText.textContent = `Expected: ${orderData.deliveryDate || 'Processing'}`;
        dateText.style.cssText = 'margin: 5px 0;';
        
        const orderText = document.createElement('p');
        orderText.textContent = `Order ID: #${orderData.orderId || 'Processing'}`;
        orderText.style.cssText = 'margin: 5px 0;';
        details.appendChild(dateText);
        details.appendChild(orderText);
        
        container.appendChild(title);
        container.appendChild(message);
        container.appendChild(details);
        notification.appendChild(container);
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.remove();
          window.location.href = '/';
        }, 4000);
      }, 2000);
      
    } catch (error) {
      console.error('Purchase error:', error);
      const errorMsg = document.createElement('div');
      errorMsg.textContent = `Purchase failed: ${error.message}`;
      errorMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #f56565; color: white; padding: 15px; border-radius: 8px; z-index: 10000;';
      document.body.appendChild(errorMsg);
      setTimeout(() => errorMsg.remove(), 3000);
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        backgroundColor: '#1a202c', 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        color: '#e2e8f0'
      }}>
        <div className="bounce" style={{ textAlign: 'center', animationDelay: '0.2s', animationFillMode: 'both' }}>
          <h1 style={{ color: '#FFD814', fontSize: '3em', margin: '0 0 20px 0', fontWeight: 'bold' }}>LOCAL E COMMERCE</h1>
          <p style={{ fontSize: '1.2em', margin: '0 0 30px 0', color: '#a0aec0' }}>Secure Payment Gateway</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="bounce"
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#FFD814',
                  borderRadius: '50%',
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s',
                  animationIterationCount: 'infinite'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#1a202c'
    }}>
      <div className="scale-in" style={{ 
        backgroundColor: '#2d3748', 
        padding: '40px', 
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 216, 20, 0.3)',
        width: '500px',
        textAlign: 'center',
        border: '1px solid #FFD814',
        transition: 'all 0.3s ease',
        color: '#edf2f7'
      }}>
        <h1 style={{ color: '#FFD814', marginBottom: '10px', fontSize: '2.5em' }}>LOCAL E COMMERCE</h1>
        <h2 style={{ color: '#edf2f7', marginBottom: '30px', fontSize: '1.4em' }}>Secure Checkout</h2>
          <h3 className="slide-in-right" style={{ marginBottom: '25px', color: theme.colors.text, fontSize: '1.4em', animationDelay: '0.4s', animationFillMode: 'both' }}>Select Payment Method</h3>
          
          <div style={{ marginBottom: '30px' }}>
            <label className="fade-in" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '15px', 
              cursor: 'pointer',
              padding: '15px',
              borderRadius: '8px',
              border: paymentMethod === 'card' ? '2px solid #FFD814' : `1px solid ${theme.colors.border}`,
              backgroundColor: paymentMethod === 'card' ? 'rgba(255, 216, 20, 0.1)' : 'transparent',
              animationDelay: '0.6s',
              animationFillMode: 'both'
            }}>
              <input 
                type="radio" 
                value="card" 
                checked={paymentMethod === 'card'} 
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ marginRight: '15px', transform: 'scale(1.2)' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                </svg>
                <span style={{ fontSize: '1.1em', fontWeight: '500' }}>Credit/Debit Card</span>
              </div>
            </label>
            <label className="fade-in" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '15px', 
              cursor: 'pointer',
              padding: '15px',
              borderRadius: '8px',
              border: paymentMethod === 'upi' ? '2px solid #FFD814' : `1px solid ${theme.colors.border}`,
              backgroundColor: paymentMethod === 'upi' ? 'rgba(255, 216, 20, 0.1)' : 'transparent',
              animationDelay: '0.7s',
              animationFillMode: 'both'
            }}>
              <input 
                type="radio" 
                value="upi" 
                checked={paymentMethod === 'upi'} 
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ marginRight: '15px', transform: 'scale(1.2)' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7 4h10v1H7V4zm0 15V6h10v13H7z"/>
                </svg>
                <span style={{ fontSize: '1.1em', fontWeight: '500' }}>UPI Payment</span>
              </div>
            </label>
            <label className="fade-in" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '15px', 
              cursor: 'pointer',
              padding: '15px',
              borderRadius: '8px',
              border: paymentMethod === 'cod' ? '2px solid #FFD814' : `1px solid ${theme.colors.border}`,
              backgroundColor: paymentMethod === 'cod' ? 'rgba(255, 216, 20, 0.1)' : 'transparent',
              animationDelay: '0.8s',
              animationFillMode: 'both'
            }}>
              <input 
                type="radio" 
                value="cod" 
                checked={paymentMethod === 'cod'} 
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ marginRight: '15px', transform: 'scale(1.2)' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
                <span style={{ fontSize: '1.1em', fontWeight: '500' }}>Cash on Delivery</span>
              </div>
            </label>
          </div>

          {paymentMethod === 'card' && (
            <div className="slide-in-up" style={{ marginBottom: '20px', animationDelay: '0.9s', animationFillMode: 'both' }}>
              <input 
                placeholder="Card Number (12 digits)"
                value={cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ')}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 12);
                  setCardNumber(value);
                }}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  marginBottom: '10px', 
                  borderRadius: '4px', 
                  border: '1px solid #4a5568',
                  backgroundColor: '#2d3748',
                  color: '#edf2f7',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FFD814';
                  e.target.style.boxShadow = '0 0 10px rgba(255, 216, 20, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#4a5568';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  placeholder="MM"
                  value={expiryMonth}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                    if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 12)) {
                      setExpiryMonth(value);
                    }
                  }}
                  style={{ 
                    width: '60px', 
                    padding: '10px', 
                    borderRadius: '4px', 
                    border: '1px solid #4a5568',
                    backgroundColor: '#2d3748',
                    color: '#edf2f7',
                    textAlign: 'center',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#FFD814';
                    e.target.style.boxShadow = '0 0 10px rgba(255, 216, 20, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#4a5568';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <span style={{ color: theme.colors.text, fontSize: '1.2em' }}>/</span>
                <input 
                  placeholder="YY"
                  value={expiryYear}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                    setExpiryYear(value);
                  }}
                  style={{ 
                    width: '60px', 
                    padding: '10px', 
                    borderRadius: '4px', 
                    border: '1px solid #4a5568',
                    backgroundColor: '#2d3748',
                    color: '#edf2f7',
                    textAlign: 'center',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#FFD814';
                    e.target.style.boxShadow = '0 0 10px rgba(255, 216, 20, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#4a5568';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <input 
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                    setCvv(value);
                  }}
                  style={{ 
                    width: '80px', 
                    padding: '10px', 
                    borderRadius: '4px', 
                    border: '1px solid #4a5568',
                    backgroundColor: '#2d3748',
                    color: '#edf2f7',
                    textAlign: 'center',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#FFD814';
                    e.target.style.boxShadow = '0 0 10px rgba(255, 216, 20, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#4a5568';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
          )}

          {paymentMethod === 'upi' && (
            <div className="slide-in-up" style={{ marginBottom: '20px', animationDelay: '0.9s', animationFillMode: 'both' }}>
              <input 
                placeholder="UPI ID (e.g., user@paytm)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '4px', 
                  border: '1px solid #4a5568',
                  backgroundColor: '#2d3748',
                  color: '#edf2f7',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FFD814';
                  e.target.style.boxShadow = '0 0 10px rgba(255, 216, 20, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#4a5568';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          )}



          <button
            className="bounce glow"
            onClick={handlePayment}
            disabled={processing}
            style={{
              width: '100%',
              padding: '18px',
              backgroundColor: processing ? '#ccc' : '#FFD814',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1.2em',
              cursor: processing ? 'not-allowed' : 'pointer',
              boxShadow: processing ? 'none' : '0 4px 12px rgba(255, 216, 20, 0.3)',
              transition: 'all 0.3s ease',
              color: '#000',
              animationDelay: '1.2s',
              animationFillMode: 'both'
            }}
            onMouseEnter={(e) => {
              if (!processing) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(255, 216, 20, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!processing) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(255, 216, 20, 0.3)';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              {processing ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"/>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                  </svg>
                  Place Order
                </>
              )}
            </div>
          </button>
      </div>
    </div>
  );
};

export default PaymentPage;