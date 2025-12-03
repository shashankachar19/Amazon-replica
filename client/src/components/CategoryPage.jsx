// client/src/components/CategoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from './Header'; // 👈 CORRECTED IMPORT PATH
import ProductCard from './ProductCard';
import { useTheme } from '../context/ThemeContext';
import { useFilters } from '../context/FilterContext'; 

const CategoryPage = ({ handleLogout }) => {
  const { theme } = useTheme();
  const { filters } = useFilters();
  const { categorySlug } = useParams(); 
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Convert 'electronics-tv' to 'Electronics Tv' for display (memoized)
  const categoryName = React.useMemo(() => 
    categorySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    [categorySlug]
  );

  const baseUrl = 'http://localhost:5000'; 

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        // Fetch ALL products (for now)
        const response = await fetch(`${baseUrl}/api/products`);
        if (!response.ok) throw new Error("Failed to fetch products.");
        
        const allProductsData = await response.json();
        
        // Filter the results to match the current category
        const categoryProducts = allProductsData.filter(p => 
          p.category.toLowerCase().includes(categoryName.toLowerCase())
        );

        setAllProducts(categoryProducts);
        applyFilters(categoryProducts);
      } catch (err) {
        console.error("Error fetching or filtering products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [categorySlug, categoryName]);

  const applyFilters = React.useCallback((productList = allProducts) => {
    let filtered = [...productList];

    // Apply price range filter (prices in database are in paisa)
    if (filters.priceRange) {
      if (filters.priceRange.includes('+')) {
        const min = Number(filters.priceRange.replace('+', ''));
        filtered = filtered.filter(product => product.price >= min);
      } else {
        const [minStr, maxStr] = filters.priceRange.split('-');
        const min = Number(minStr);
        const max = Number(maxStr);
        filtered = filtered.filter(product => product.price >= min && product.price <= max);
      }
    }



    if (filters.sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setProducts(filtered);
  }, [filters]);

  useEffect(() => {
    if (allProducts.length > 0) {
      applyFilters(allProducts);
    }
  }, [filters]);
  

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
        <div className="bounce" style={{ textAlign: 'center' }}>
          <h1 style={{ color: '#FFD814', fontSize: '3em', margin: '0 0 20px 0', fontWeight: 'bold' }}>LOCAL E COMMERCE</h1>
          <p style={{ fontSize: '1.2em', margin: '0 0 30px 0', color: '#a0aec0' }}>Loading {categoryName}...</p>
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
    <div style={{ backgroundColor: theme.colors.primary, minHeight: '100vh', color: theme.colors.text }}>
      <Header handleLogout={handleLogout} />
      
      <div style={{ padding: '20px', textAlign: 'left' }}>
        <Link 
          to="/" 
          className="smooth-hover"
          style={{ 
            color: theme.colors.accent, 
            textDecoration: 'none', 
            fontWeight: 'bold', 
            display: 'block', 
            marginBottom: '20px',
            transition: 'all 0.3s ease'
          }}
        >
          &larr; Back to Categories
        </Link>

        <div className="slide-in-left" style={{ marginBottom: '30px' }}>
          <h2 style={{ margin: 0, fontSize: '2em', borderBottom: `2px solid ${theme.colors.accent}`, display: 'inline-block', paddingBottom: '5px' }}>
            Products in {categoryName}
          </h2>
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '30px',
          rowGap: '50px',
          marginBottom: '40px'
        }}>
          {products.length > 0 ? products.map((product, index) => (
            <div 
              key={product.id || product._id || index}
              className="fade-in-up"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
              }}
            >
              <ProductCard product={product} /> 
            </div>
          )) : <p className="fade-in">No products found in this category.</p>}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;