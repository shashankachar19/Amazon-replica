import React from 'react';
import Header from './Header';
import ProductCard from './ProductCard';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';

const WishlistPage = ({ handleLogout }) => {
  const { wishlist } = useWishlist();
  const { theme } = useTheme();
  
  if (!wishlist) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ backgroundColor: theme.colors.primary, minHeight: '100vh', color: theme.colors.text }}>
      <Header handleLogout={handleLogout} hideSearchBar={true} />
      
      <div style={{ padding: '20px' }}>
        <h2 style={{ marginBottom: '30px', fontSize: '2em', borderBottom: `2px solid ${theme.colors.accent}`, display: 'inline-block', paddingBottom: '5px' }}>
          My Wishlist ({wishlist.length} items)
        </h2>
        
        {wishlist.length > 0 ? (
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '20px',
            justifyContent: 'flex-start'
          }}>
            {wishlist.map(product => {
              if (!product || !product._id) return null;
              return <ProductCard key={product._id} product={product} />;
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div style={{ fontSize: '3em', marginBottom: '20px' }}>💔</div>
            <div style={{ fontSize: '1.5em', marginBottom: '10px' }}>Your wishlist is empty</div>
            <div style={{ color: theme.colors.textSecondary }}>
              Add products to your wishlist by clicking the heart icon
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;