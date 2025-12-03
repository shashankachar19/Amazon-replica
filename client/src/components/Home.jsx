// client/src/components/Home.jsx
import React from 'react';
import CategoryCard from './CategoryCard'; 
import Header from './Header';
import { useTheme } from '../context/ThemeContext'; 

// --- Mock Category Data for Home Page (5 Categories) ---
const categories = [
  { id: 1, name: 'Electronics', description: 'Gadgets and gear' },
  { id: 2, name: 'Apparel', description: 'Clothing and accessories' },
  { id: 3, name: 'Home & Kitchen', description: 'Essentials for your living space' },
  { id: 4, name: 'Books', description: 'Reading material and novels' },
  { id: 5, name: 'Sports & Outdoors', description: 'Gear for fitness and fun' },
];
// -------------------------------------------------------------

const Home = React.memo(() => {
  const { theme } = useTheme();
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  
  // Function to handle logout (defined here or passed from App.jsx)
  const handleLogout = React.useCallback(() => {
      try {
        localStorage.removeItem('userToken');
        localStorage.removeItem('user_id');
        localStorage.removeItem('username');
        window.location.href = '/login'; 
      } catch (error) {
        console.error('Logout error:', error);
        window.location.href = '/login';
      }
  }, []);

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
      
      <Header handleLogout={handleLogout} hideCategories={true} hideSearchBar={true} /> 

      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2 className="slide-in-left" style={{ marginTop: '20px', marginBottom: '40px', fontSize: '2em' }}>
          Shop By Category
        </h2>
        
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center', 
          gap: '10px',
          marginBottom: '40px' 
        }}>
          {categories.map((category, index) => (
            <div 
              key={category.id} 
              className="scale-in"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
              }}
            >
              <CategoryCard category={category} /> 
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default Home;