// client/src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useWishlist } from '../context/WishlistContext';
import { useFilters } from '../context/FilterContext';
import { useUser } from '../context/UserContext';
import '../styles/animations.css';

const LogoutButton = () => {
  const { logout } = useUser();
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button 
      onClick={logout}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="btn-animate"
      style={{ 
        padding: '10px 20px', 
        cursor: 'pointer', 
        background: isHovered ? theme.colors.accent : theme.colors.primary,
        color: isHovered ? '#000' : theme.colors.accent,
        border: `1px solid ${theme.colors.accent}`,
        borderRadius: '25px', 
        fontWeight: '600',
        fontSize: '14px',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered ? theme.shadows.accent : theme.shadows.small,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      Logout
    </button>
  );
};

const Header = ({ hideCategories = false, hideSearchBar = false }) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { wishlist } = useWishlist();
  const { filters, updateFilter } = useFilters();
  const { user } = useUser();
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Get current category from URL (memoized)
  const currentCategory = React.useMemo(() => {
    const currentPath = window.location.pathname;
    if (!currentPath.includes('/category/')) return null;
    
    return currentPath.split('/category/')[1]?.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') || null;
  }, [window.location.pathname]);

  // Category-specific filter options
  const getFilterOptions = () => {
    switch(currentCategory) {
      case 'Electronics':
        return {
          priceRanges: [
            { value: '', label: 'All Prices' },
            { value: '0-5000', label: 'Under ₹5,000' },
            { value: '5000-15000', label: '₹5,000 - ₹15,000' },
            { value: '15000-30000', label: '₹15,000 - ₹30,000' },
            { value: '30000+', label: 'Above ₹30,000' }
          ],
          brands: ['Apple', 'Samsung', 'Sony', 'Logitech', 'JBL', 'Razer', 'Xiaomi']
        };
      case 'Apparel':
        return {
          priceRanges: [
            { value: '', label: 'All Prices' },
            { value: '0-1000', label: 'Under ₹1,000' },
            { value: '1000-3000', label: '₹1,000 - ₹3,000' },
            { value: '3000-7000', label: '₹3,000 - ₹7,000' },
            { value: '7000+', label: 'Above ₹7,000' }
          ],
          brands: ['Nike', 'Adidas', 'Levi\'s', 'Zara', 'The North Face', 'Coach']
        };
      case 'Home Kitchen':
        return {
          priceRanges: [
            { value: '', label: 'All Prices' },
            { value: '0-3000', label: 'Under ₹3,000' },
            { value: '3000-8000', label: '₹3,000 - ₹8,000' },
            { value: '8000-15000', label: '₹8,000 - ₹15,000' },
            { value: '15000+', label: 'Above ₹15,000' }
          ],
          brands: ['Cuisinart', 'Breville', 'Tefal', 'Xiaomi', 'NutriChef', 'Brooklinen']
        };
      case 'Books':
        return {
          priceRanges: [
            { value: '', label: 'All Prices' },
            { value: '0-300', label: 'Under ₹300' },
            { value: '300-400', label: '₹300 - ₹400' },
            { value: '400+', label: 'Above ₹400' }
          ],
          brands: ['Matt Haig', 'James Clear', 'Andy Weir', 'Stephen Covey', 'Morgan Housel']
        };
      case 'Sports Outdoors':
        return {
          priceRanges: [
            { value: '', label: 'All Prices' },
            { value: '0-2500', label: 'Under ₹2,500' },
            { value: '2500-4000', label: '₹2,500 - ₹4,000' },
            { value: '4000+', label: 'Above ₹4,000' }
          ],
          brands: ['Nike', 'REI', 'Liforme', 'Black Diamond', 'Hydro Flask', 'Yonex']
        };
      default:
        return {
          priceRanges: [
            { value: '', label: 'All Prices' },
            { value: '0-1000', label: 'Under ₹1,000' },
            { value: '1000-5000', label: '₹1,000 - ₹5,000' },
            { value: '5000-15000', label: '₹5,000 - ₹15,000' },
            { value: '15000+', label: 'Above ₹15,000' }
          ],
          brands: ['Apple', 'Samsung', 'Nike', 'Sony', 'Logitech']
        };
    }
  };

  const filterOptions = React.useMemo(() => getFilterOptions(), [currentCategory]);
  // Mock category links for demonstration (same as the list in Home.jsx)
  const categories = React.useMemo(() => ['Electronics', 'Books', 'Apparel', 'Home & Kitchen', 'Sports & Outdoors'], []);



  const fetchCartCount = React.useCallback(async () => {
    try {
      const userId = localStorage.getItem('user_id');
      
      const response = await fetch('http://localhost:5000/api/cart', {
        headers: {
          'x-user-id': userId
        }
      });
      if (response.ok) {
        const cart = await response.json();
        const totalItems = cart.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
        setCartCount(totalItems);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  }, []);

  const handleCartUpdate = React.useCallback(() => fetchCartCount(), [fetchCartCount]);
  
  const handleClickOutside = React.useCallback((event) => {
    if (showFilters && !event.target.closest('.filter-dropdown')) {
      setShowFilters(false);
    }
  }, [showFilters]);

  const handleMouseEnter = React.useCallback((e) => {
    e.target.style.color = '#FFD814';
    const underline = e.target.querySelector('.underline');
    if (underline) underline.style.width = '100%';
  }, []);

  const handleMouseLeave = React.useCallback((e) => {
    e.target.style.color = '#ffffff';
    const underline = e.target.querySelector('.underline');
    if (underline) underline.style.width = '0%';
  }, []);

  useEffect(() => {
    fetchCartCount();
    
    // Listen for cart updates
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    // Close filters when clicking outside
    document.addEventListener('click', handleClickOutside);
    
    // Refresh cart count every 5 seconds as backup
    const interval = setInterval(fetchCartCount, 5000);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      document.removeEventListener('click', handleClickOutside);
      clearInterval(interval);
    };
  }, [showFilters, fetchCartCount, handleCartUpdate, handleClickOutside]);

  return (
    <header style={{ 
      background: theme.colors.header, 
      color: '#ffffff', 
      boxShadow: theme.shadows.medium
    }}>
      {/* Top Row */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '10px 20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Link back to home page */}
        <a href="/" style={{ textDecoration: 'none', marginRight: '20px' }}>
            <h1 style={{ 
              color: '#ffffff',
              fontSize: '1.8em', 
              margin: 0, 
              fontWeight: 'bold',
              letterSpacing: '-0.5px'
            }}>LOCAL E COMMERCE</h1>
        </a>
        
        {/* Navigation Links */}
        {!hideCategories && (
          <nav style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
            {categories.map((cat, index) => (
              <a 
                key={index}
                href={`/category/${cat.toLowerCase().replace(/\s/g, '-')}`}
                style={{ 
                  color: '#ffffff', 
                  textDecoration: 'none', 
                  margin: '0 15px', 
                  fontSize: '0.9em',
                  fontWeight: '500',
                  position: 'relative',
                  display: 'inline-block'
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {cat}
                <div 
                  className="underline"
                  style={{
                    position: 'absolute',
                    bottom: '-3px',
                    left: '0',
                    height: '2px',
                    width: '0%',
                    backgroundColor: theme.colors.accent,
                    transition: 'width 0.3s ease'
                  }}
                />
              </a>
            ))}
            
            {/* Filter Dropdown */}
            <div className="filter-dropdown" style={{ position: 'relative', marginLeft: '20px', marginRight: '20px' }}>
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  padding: '8px 15px',
                  backgroundColor: 'transparent',
                  border: '1px solid #ffffff',
                  borderRadius: '4px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '0.9em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Filters
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>
              
              {showFilters && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    backgroundColor: theme.colors.secondary,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '8px',
                    padding: '15px',
                    minWidth: '250px',
                    zIndex: 1000,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                  }}>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: theme.colors.text }}>Price Range:</label>
                    <select 
                      value={filters.priceRange}
                      onChange={(e) => updateFilter('priceRange', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: `1px solid ${theme.colors.border}`,
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.text
                      }}>
                      {filterOptions.priceRanges.map(range => (
                        <option key={range.value} value={range.value}>{range.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: theme.colors.text }}>Sort By:</label>
                    <select 
                      value={filters.sortBy}
                      onChange={(e) => updateFilter('sortBy', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: `1px solid ${theme.colors.border}`,
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.text
                      }}>
                      <option value="">Default</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>
                  

                </div>
              )}
            </div>
          </nav>
        )}
        
        </div>

        {/* User, Cart, and Logout Buttons */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <a 
          href="/profile"
          style={{ 
            marginRight: '10px', 
            fontSize: '0.9em', 
            whiteSpace: 'nowrap',
            color: '#ffffff',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'color 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.color = theme.colors.accent}
          onMouseLeave={(e) => e.target.style.color = '#ffffff'}
        >
          Hello, {user?.username || 'User'}
        </a>

        {/* Wishlist Link */}
        <a 
          href="/wishlist"
          style={{ 
            color: '#ffffff', 
            textDecoration: 'none', 
            marginRight: '20px', 
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            fontSize: '1.5em'
          }}
          title="Wishlist"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {wishlist.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-10px',
              backgroundColor: theme.colors.accent,
              color: '#ffffff',
              borderRadius: '50%',
              padding: '1px 5px',
              fontSize: '0.6em',
              fontWeight: 'bold',
              minWidth: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {wishlist.length}
            </span>
          )}
        </a>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn-animate"
          style={{
            marginRight: '15px',
            padding: '10px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50%',
            color: '#ffffff',
            cursor: 'pointer',
            fontSize: '1.2em',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
            e.target.style.transform = 'scale(1)';
          }}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 16.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"/>
              <path d="M19.14 19.14l-.35-.35M4.86 4.86l-.35-.35M19.14 4.86l-.35.35M4.86 19.14l-.35-.35M12 3v1M12 20v1M3 12h1M20 12h1"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
            </svg>
          )}
        </button>

        {/* Cart Link */}
        <a 
          href="/cart"
          style={{ 
            color: '#ffffff', 
            textDecoration: 'none', 
            marginRight: '20px', 
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            padding: '8px',
            transition: 'color 0.3s ease'
          }}
          onMouseEnter={e => e.target.style.color = theme.colors.accent}
          onMouseLeave={e => e.target.style.color = '#ffffff'}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.5">
            <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              backgroundColor: theme.colors.accent,
              color: '#ffffff',
              borderRadius: '50%',
              padding: '1px 5px',
              fontSize: '0.75em',
              fontWeight: 'bold',
              minWidth: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: '1'
            }}>
              {cartCount}
            </span>
          )}
        </a>

        <LogoutButton />
        </div>
      </div>
      
      {/* Search Bar Strip */}
      {!hideSearchBar && (
        <div style={{ 
          padding: '10px 20px', 
          backgroundColor: 'rgba(0,0,0,0.1)',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              window.location.assign(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            }
          }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 20px',
                borderRadius: '25px',
                border: 'none',
                fontSize: '1em',
                outline: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;