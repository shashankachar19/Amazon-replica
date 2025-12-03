import React, { useState, useEffect } from 'react';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId, updatedData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });
      
      if (response.ok) {
        alert('Product updated successfully!');
        fetchProducts();
        setEditingProduct(null);
      }
    } catch (error) {
      alert('Error updating product');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <div style={{ color: '#fff', padding: '20px' }}>Loading products...</div>;

  return (
    <div style={{ color: '#fff' }}>
      <h3 style={{ color: '#FFD814', marginBottom: '20px' }}>Product Management</h3>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#333' }}>
          <thead>
            <tr style={{ backgroundColor: '#FFD814', color: '#000' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Price</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Stock</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Category</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id} style={{
                borderBottom: '1px solid #555',
                backgroundColor: index % 2 === 0 ? '#2a2a2a' : '#333'
              }}>
                <td style={{ padding: '12px' }}>
                  {editingProduct === product.id ? (
                    <input
                      type="text"
                      defaultValue={product.name}
                      id={`name-${product.id}`}
                      style={{
                        backgroundColor: '#444',
                        border: '1px solid #666',
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        width: '100%'
                      }}
                    />
                  ) : (
                    product.name
                  )}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {editingProduct === product.id ? (
                    <input
                      type="number"
                      defaultValue={product.price}
                      id={`price-${product.id}`}
                      style={{
                        backgroundColor: '#444',
                        border: '1px solid #666',
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        width: '80px'
                      }}
                    />
                  ) : (
                    `₹${product.price}`
                  )}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {editingProduct === product.id ? (
                    <input
                      type="number"
                      defaultValue={product.countInStock}
                      id={`stock-${product.id}`}
                      style={{
                        backgroundColor: '#444',
                        border: '1px solid #666',
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        width: '60px'
                      }}
                    />
                  ) : (
                    <span style={{ 
                      color: product.countInStock < 5 ? '#ff6b6b' : '#fff',
                      fontWeight: product.countInStock < 5 ? 'bold' : 'normal'
                    }}>
                      {product.countInStock}
                    </span>
                  )}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{product.category}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {editingProduct === product.id ? (
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                      <button
                        onClick={() => {
                          const name = document.getElementById(`name-${product.id}`).value;
                          const price = document.getElementById(`price-${product.id}`).value;
                          const stock = document.getElementById(`stock-${product.id}`).value;
                          updateProduct(product.id, {
                            name,
                            price: parseFloat(price),
                            countInStock: parseInt(stock),
                            category: product.category
                          });
                        }}
                        style={{
                          backgroundColor: '#4caf50',
                          color: '#fff',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingProduct(null)}
                        style={{
                          backgroundColor: '#f44336',
                          color: '#fff',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingProduct(product.id)}
                      style={{
                        backgroundColor: '#FFD814',
                        color: '#000',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;