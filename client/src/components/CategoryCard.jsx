// client/src/components/CategoryCard.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLoading } from '../context/LoadingContext';

const CategoryCard = ({ category }) => {
  const { theme } = useTheme();
  const { navigateWithLoading } = useLoading();
  
  // Use local category images with error handling
  const categorySlug = React.useMemo(() => {
    try {
      return category.name.toLowerCase().replace(/\s&\s/g, '_').replace(/\s/g, '_');
    } catch (error) {
      console.error('Error processing category name:', error);
      return 'default';
    }
  }, [category.name]);
  
  const imageUrl = `/images/category_${categorySlug}.jpg`;
  const fallbackImage = 'https://via.placeholder.com/100x100?text=Category';
  
  // Create a clean URL path: /category/electronics or /category/sports-outdoors
  const linkPath = `/category/${category.name.toLowerCase().replace(/\s/g, '-')}`;
  
  const handleCategoryClick = () => {
    navigateWithLoading(linkPath);
  };

  return (
    <div 
      onClick={handleCategoryClick}
      style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
    >
      <div 
        style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '180px', 
          padding: '10px',
          margin: '10px',
          backgroundColor: theme.colors.secondary, 
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          minHeight: '200px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05) translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 10px 20px rgba(255, 216, 20, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <img 
          src={imageUrl} 
          alt={category.name} 
          style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            objectFit: 'cover', 
            marginBottom: '10px',
            border: '3px solid #FFD814' 
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImage;
          }}
        />
        <h3 style={{ color: theme.colors.text, fontSize: '1em', textAlign: 'center' }}>{category.name}</h3>
      </div>
    </div>
  );
};

export default CategoryCard;