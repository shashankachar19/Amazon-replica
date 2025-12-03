// client/src/components/ProductCard.jsx
import React from 'react';
import { showToast } from './Toast';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';

const ProductCard = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { theme } = useTheme();
  const productId = product.id || product._id;
  const inWishlist = isInWishlist(productId);
  
  // Configuration constants
  const API_BASE_URL = '';
  const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/250x200?text=Product+Image'; 

  const handleAddToCart = React.useCallback(async () => {
    try {
      const userId = localStorage.getItem('user_id');
      
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify({ 
          productId: productId, 
          quantity: 1 
        }),
      });

      if (response.ok) {
        showToast(`${product.name} added to cart!`, 'success');
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        const data = await response.json();
        if (response.status === 401) {
          showToast('Please log in to add items to cart.', 'error');
        } else {
          showToast(`Failed to add to cart: ${data.message || response.statusText}`, 'error');
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('An error occurred. Could not add item.', 'error');
    }
  }, [productId, product.name]);

  return (
    <div 
      style={{ 
        padding: '15px', 
        backgroundColor: theme.colors.secondary, 
        borderRadius: '8px',
        textAlign: 'left',
        border: `1px solid ${theme.colors.border}`,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 216, 20, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <img 
        src={`${API_BASE_URL}/${product.image}`} 
        alt={product.name} 
        style={{ 
          width: '100%', 
          height: '200px', 
          objectFit: 'cover', 
          borderRadius: '4px', 
          marginBottom: '10px',
          transition: 'all 0.3s ease'
        }}

        onError={(e) => {
            e.target.onerror = null; 
            e.target.src = PLACEHOLDER_IMAGE 
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ color: theme.colors.text, fontSize: '1.2em', margin: '5px 0', flex: 1 }}>{product.name}</h3>
        <button
          onClick={React.useCallback(() => {
            if (inWishlist) {
              removeFromWishlist(productId);
              showToast('Removed from wishlist', 'info');
            } else {
              addToWishlist(product);
              showToast('Added to wishlist', 'success');
            }
          }, [inWishlist, productId, product, removeFromWishlist, addToWishlist])}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5em',
            cursor: 'pointer',
            color: inWishlist ? '#e53e3e' : theme.colors.textSecondary,
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: theme.colors.textSecondary, fontSize: '0.9em', margin: '3px 0' }}>Category: {product.category}</p>
          <p style={{ color: theme.colors.accent, fontWeight: 'bold', margin: '5px 0' }}>₹{product.price.toLocaleString('en-IN')}</p>
          <p style={{ color: theme.colors.text, fontSize: '0.8em', margin: '5px 0' }}>Rating: {product.rating} ({product.numReviews} reviews)</p>
          <p style={{ 
            color: product.countInStock > 0 ? '#00A652' : '#FF4444', 
            fontSize: '0.8em', 
            margin: '5px 0',
            fontWeight: 'bold'
          }}>
            {product.countInStock > 0 ? `In Stock (${product.countInStock})` : 'Out of Stock'}
          </p>
        </div>
        
        <button 
        onClick={handleAddToCart} 
        disabled={product.countInStock === 0}
        style={{ 
          padding: '8px 15px', 
          cursor: product.countInStock === 0 ? 'not-allowed' : 'pointer', 
          background: product.countInStock === 0 ? '#ccc' : '#FFD814', 
          border: 'none', 
          borderRadius: '4px', 
          fontWeight: 'bold',
          marginTop: '10px',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          if (product.countInStock > 0) e.target.style.boxShadow = '0 0 15px #FFD814';
        }}
        onMouseLeave={(e) => {
          if (product.countInStock > 0) e.target.style.boxShadow = 'none';
        }}
        >
          {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;