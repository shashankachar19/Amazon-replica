import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from './Header';
import ProductCard from './ProductCard';
import { useTheme } from '../context/ThemeContext';
import { useFilters } from '../context/FilterContext';

const SearchPage = ({ handleLogout }) => {
  const { theme } = useTheme();
  const { filters } = useFilters();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const query = searchParams.get('q') || '';
  
  const totalPages = Math.ceil(products.length / itemsPerPage);
  
  const categories = ['Electronics', 'Apparel', 'Home & Kitchen', 'Books', 'Sports & Outdoors'];

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (response.ok) {
          const fetchedProducts = await response.json();
          setAllProducts(fetchedProducts);
          applyFilters(fetchedProducts);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query]);

  const applyFilters = (productList = allProducts) => {
    let filtered = productList.filter(product =>
      (product.name && product.name.toLowerCase().includes(query.toLowerCase())) ||
      (product.category && product.category.toLowerCase().includes(query.toLowerCase())) ||
      (product.brand && product.brand.toLowerCase().includes(query.toLowerCase()))
    );

    // Apply price range filter (prices in database are in paisa)
    if (filters.priceRange) {
      if (filters.priceRange.includes('+')) {
        const min = Number(filters.priceRange.replace('+', ''));
        if (!isNaN(min)) {
          filtered = filtered.filter(product => product.price >= min);
        }
      } else {
        const [minStr, maxStr] = filters.priceRange.split('-');
        const min = Number(minStr);
        const max = Number(maxStr);
        if (!isNaN(min) && !isNaN(max)) {
          filtered = filtered.filter(product => product.price >= min && product.price <= max);
        }
      }
    }

    // Apply brand filter
    if (filters.brand) {
      filtered = filtered.filter(product => 
        product.brand && product.brand.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }

    // Apply sorting
    if (filters.sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setProducts(filtered);
  };

  useEffect(() => {
    if (allProducts.length > 0) {
      applyFilters(allProducts);
      setCurrentPage(1); // Reset to first page when filters change
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, query]);

  return (
    <div style={{ backgroundColor: theme.colors.primary, minHeight: '100vh', color: theme.colors.text }}>
      <Header handleLogout={handleLogout} />
      
      <div style={{ padding: '20px' }}>
        <h2 style={{ marginBottom: '20px' }}>
          Search Results for "{query}" ({products.length} items)
        </h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div style={{ fontSize: '1.5em' }}>Searching...</div>
          </div>
        ) : products.length > 0 ? (
          <>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '20px',
              justifyContent: 'flex-start'
            }}>
              {products
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map(product => (
                  <ProductCard key={product._id} product={product} />
                ))
              }
            </div>
            
            {products.length > itemsPerPage && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                gap: '10px',
                marginTop: '30px'
              }}>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: currentPage === 1 ? '#ccc' : theme.colors.secondary,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '4px',
                    color: theme.colors.text,
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Previous
                </button>
                
                <span style={{ color: theme.colors.text }}>
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: currentPage === totalPages ? '#ccc' : theme.colors.secondary,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '4px',
                    color: theme.colors.text,
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : query ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div style={{ fontSize: '1.2em', color: theme.colors.textSecondary }}>
              No products found for "{query}"
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchPage;