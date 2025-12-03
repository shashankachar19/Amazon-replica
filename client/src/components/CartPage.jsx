// client/src/components/CartPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CartPage = ({ handleLogout }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const imageBaseUrl = `${API_BASE_URL}/`; 

  // --- Fetch Cart Function ---
  const fetchCart = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('user_id');
      
      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        headers: {
          'x-user-id': userId
        }
      });

      if (response.ok) {
        try {
          const data = await response.json();
          setCart(data);
        } catch (parseError) {
          console.error('Failed to parse cart response:', parseError);
          setCart({ items: [] });
        }
      } else {
        console.error('Failed to fetch cart:', response.statusText);
        setCart({ items: [] });
      }
    } catch (error) {
      console.error('Network error fetching cart:', error);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  // --- Update Quantity Function ---
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1 || updating) return;

    console.log('Updating quantity:', { productId, newQuantity });
    setUpdating(true);

    try {
        const userId = localStorage.getItem('user_id');
        
        const response = await fetch(`${API_BASE_URL}/api/cart/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': userId
            },
            body: JSON.stringify({ 
                productId: productId, 
                quantity: newQuantity 
            }),
        });

        if (response.ok) {
            try {
                const updatedCart = await response.json();
                setCart(updatedCart);
                window.dispatchEvent(new Event('cartUpdated'));
            } catch (parseError) {
                console.error('Failed to parse update response:', parseError);
            }
        } else {
            try {
                const errorData = await response.json();
                console.error('Update failed:', errorData);
            } catch (parseError) {
                console.error('Update failed with status:', response.status);
            }
        }
    } catch (error) {
        console.error('Error updating cart:', error);
    } finally {
        setUpdating(false);
    }
  };

  // --- Remove Item Function ---
  const handleRemoveItem = async (productId) => {
    try {
        // Validate productId
        if (!productId) {
            console.error('Invalid product ID');
            return;
        }
        
        const userId = localStorage.getItem('user_id');
        
        const response = await fetch(`${API_BASE_URL}/api/cart/remove/${encodeURIComponent(productId)}`, {
            method: 'DELETE',
            headers: {
                'x-user-id': userId
            }
        });

        if (response.ok) {
            // Update local state with the new cart data from the server
            const updatedCart = await response.json();
            setCart(updatedCart);
            window.dispatchEvent(new Event('cartUpdated'));
        } else {
            console.error('Failed to remove item from cart.');
        }
    } catch (error) {
        console.error('Error removing item:', error);
    }
  };


  useEffect(() => {
    fetchCart();
  }, []);
  
  // Calculate Subtotal and Total Items
  const subtotal = React.useMemo(() => {
    if (!cart?.items) return '0.00';
    return cart.items.reduce(
      (acc, item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 0;
        return acc + price * quantity;
      }, 
      0
    ).toFixed(2);
  }, [cart?.items]);

  const totalItems = React.useMemo(() => {
    return cart?.items.reduce(
      (acc, item) => acc + item.quantity, 
      0
    );
  }, [cart?.items]);

  // Generate or get existing delivery date
  const getDeliveryDate = () => {
    const deliveryKey = `delivery_date_cart`;
    
    let storedDate = localStorage.getItem(deliveryKey);
    
    if (!storedDate && cart?.items.length > 0) {
      const today = new Date();
      const randomDays = Math.floor(Math.random() * 10) + 1;
      const deliveryDate = new Date(today.getTime() + randomDays * 24 * 60 * 60 * 1000);
      storedDate = deliveryDate.toLocaleDateString('en-IN', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      localStorage.setItem(deliveryKey, storedDate);
    }
    
    return storedDate;
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#1a202c', minHeight: '100vh', color: '#e2e8f0' }}>
        <Header handleLogout={handleLogout} hideSearchBar={true} />
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Loading your cart...</h2>
        </div>
      </div>
    );
  }

  // If cart is null and not loading, means not logged in
  if (!cart && !loading) {
    return (
        <div style={{ backgroundColor: '#1a202c', minHeight: '100vh', color: '#e2e8f0' }}>
            <Header handleLogout={handleLogout} hideSearchBar={true} />
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p style={{ fontSize: '1.5em', marginTop: '50px' }}>You must be logged in to view the cart.</p>
                <Link to="/login" style={{ color: '#FFD814', textDecoration: 'none', fontSize: '1.2em' }}>Go to Login</Link>
            </div>
        </div>
    );
  }


  return (
    <div style={{ backgroundColor: '#1a202c', minHeight: '100vh', color: '#e2e8f0' }}>
      <Header handleLogout={handleLogout} hideSearchBar={true} />
      
      <div style={{ display: 'flex', padding: '20px', gap: '20px' }}>
        
        {/* === Left Column: Cart Items === */}
        <div style={{ flex: 3 }}>
          <h2 style={{ marginBottom: '20px', fontSize: '2em', borderBottom: '1px solid #4a5568', paddingBottom: '10px' }}>
            Shopping Cart
          </h2>
          
          {cart?.items.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', background: '#2d3748', borderRadius: '8px' }}>
                <p style={{ fontSize: '1.2em' }}>Your cart is empty. <Link to="/" style={{ color: '#FFD814', textDecoration: 'none' }}>Start shopping!</Link></p>
            </div>
          ) : (
            cart?.items.map((item, index) => (
              <div 
                key={item.productId || item.product || index}
                style={{ 
                  display: 'flex', 
                  marginBottom: '15px', 
                  padding: '15px', 
                  border: '1px solid #4a5568', 
                  borderRadius: '8px', 
                  background: '#2d3748',
                  transition: 'all 0.3s ease',
                  animation: 'fadeInUp 0.5s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(5px)';
                  e.currentTarget.style.borderColor = '#FFD814';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.borderColor = '#4a5568';
                }}
              >
                <img 
                  src={imageBaseUrl + item.image} 
                  alt={item.name} 
                  style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '20px', borderRadius: '4px' }} 
                  onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/100x100?text=Item" }}
                />
                <div style={{ flexGrow: 1 }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#edf2f7' }}>{item.name}</h4>
                  
                  <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                    <label style={{ marginRight: '10px', color: '#a0aec0' }}>Qty:</label>
                    
                    <button
                        onClick={() => {
                            const productId = item.productId || (typeof item.product === 'object' ? (item.product.id || item.product._id) : item.product);
                            handleUpdateQuantity(productId, item.quantity - 1);
                        }}
                        disabled={item.quantity <= 1 || updating}
                        style={{
                            padding: '5px 10px',
                            backgroundColor: '#4a5568',
                            color: '#edf2f7',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                            opacity: item.quantity <= 1 ? 0.5 : 1,
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => !e.target.disabled && (e.target.style.boxShadow = '0 0 10px #4a5568')}
                        onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                    >
                        -
                    </button>
                    
                    <span style={{ 
                        padding: '5px 15px', 
                        backgroundColor: '#1a202c', 
                        color: '#edf2f7', 
                        border: '1px solid #4a5568',
                        margin: '0 5px'
                    }}>
                        {item.quantity}
                    </span>
                    
                    <button
                        onClick={() => {
                            const productId = item.productId || (typeof item.product === 'object' ? (item.product.id || item.product._id) : item.product);
                            const newQuantity = item.quantity + 1;
                            handleUpdateQuantity(productId, newQuantity);
                        }}
                        disabled={updating}
                        style={{
                            padding: '5px 10px',
                            backgroundColor: '#4a5568',
                            color: '#edf2f7',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: updating ? 'not-allowed' : 'pointer',
                            opacity: updating ? 0.5 : 1,
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.boxShadow = '0 0 10px #4a5568'}
                        onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                    >
                        +
                    </button>

                    <button
                        onClick={() => {
                            const productId = item.productId || (typeof item.product === 'object' ? (item.product.id || item.product._id) : item.product);
                            handleRemoveItem(productId);
                        }}
                        style={{
                            marginLeft: '15px',
                            padding: '5px 10px',
                            background: 'none',
                            color: '#fc8181',
                            border: '1px solid #fc8181',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.boxShadow = '0 0 10px #fc8181'}
                        onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                    >
                        Remove
                    </button>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, color: '#FFD814', fontWeight: 'bold', fontSize: '1.2em' }}>
                    ₹{((Number(item.price) || 0) * (Number(item.quantity) || 0)).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* === Right Column: Subtotal/Checkout === */}
        <div style={{ flex: 1, background: '#2d3748', padding: '20px', borderRadius: '8px', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5em' }}>Subtotal ({totalItems} items):</h3>
          <p style={{ fontSize: '2em', color: '#FFD814', fontWeight: 'bold', margin: '0 0 20px 0' }}>
            ₹{parseFloat(subtotal).toLocaleString('en-IN')}
          </p>
          
          {cart?.items.length > 0 && (
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#1a202c', borderRadius: '6px', border: '1px solid #4a5568' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#edf2f7' }}>Delivery Information</h4>
              <p style={{ margin: '0', color: '#a0aec0', fontSize: '0.9em' }}>Expected Delivery:</p>
              <p style={{ margin: '5px 0 0 0', color: '#00A652', fontWeight: 'bold' }}>{getDeliveryDate()}</p>
            </div>
          )}
          
          <button 
            onClick={() => window.open('/payment', '_blank')}
            disabled={cart?.items.length === 0}
            style={{ 
              width: '100%', 
              padding: '12px', 
              cursor: cart?.items.length === 0 ? 'not-allowed' : 'pointer', 
              background: cart?.items.length === 0 ? '#4a5568' : '#FFD814', 
              color: cart?.items.length === 0 ? '#a0aec0' : '#1a202c',
              border: 'none', 
              borderRadius: '4px', 
              fontWeight: 'bold',
              fontSize: '1.1em',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (cart?.items.length > 0) e.target.style.boxShadow = '0 0 15px #FFD814';
            }}
            onMouseLeave={(e) => {
              if (cart?.items.length > 0) e.target.style.boxShadow = 'none';
            }}
          >
            Proceed to Checkout
          </button>
        </div>

      </div>
    </div>
  );
};

export default CartPage;