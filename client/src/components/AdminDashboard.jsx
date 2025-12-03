import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import AdvancedAnalytics from './AdvancedAnalytics';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        navigate('/admin/login');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchSalesData = async (period) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/sales?period=${period}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSalesData(data);
      }
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchDashboardData();
    fetchSalesData(selectedPeriod);
    setLoading(false);
  }, [selectedPeriod]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    fetchSalesData(period);
  };

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear all sales data? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch('http://localhost:5000/api/admin/clear-data', {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          alert('Sales data cleared successfully!');
          fetchDashboardData();
          fetchSalesData(selectedPeriod);
        } else {
          alert('Failed to clear data');
        }
      } catch (error) {
        alert('Error clearing data');
      }
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#0f1419', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#fff'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f1419',
      color: '#fff',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#1a1a1a',
        padding: '20px',
        borderBottom: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <h1 style={{ color: '#FFD814', margin: 0 }}>Admin Panel</h1>
          
          <nav style={{ display: 'flex', gap: '20px' }}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'products', label: 'Products', icon: '📦' },
              { id: 'orders', label: 'Orders', icon: '🛒' },
              { id: 'analytics', label: 'Analytics', icon: '📈' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  backgroundColor: activeTab === tab.id ? '#FFD814' : 'transparent',
                  color: activeTab === tab.id ? '#000' : '#FFD814',
                  border: activeTab === tab.id ? 'none' : '1px solid #FFD814',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleClearData}
            style={{
              backgroundColor: '#ff6b35',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z"/>
            </svg>
            Clear Data
          </button>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#d32f2f',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7L15.59 5.59L12 9.17L8.41 5.59L7 7L10.59 10.59L7 14.17L8.41 15.59L12 12L15.59 15.59L17 14.17L13.41 10.59L17 7Z"/>
            </svg>
            Logout
          </button>
        </div>
      </div>

      <div style={{ padding: '30px' }}>
        {activeTab === 'dashboard' && (
          <>
        {/* Overview Cards */}
        {dashboardData && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            <div style={{
              backgroundColor: '#1a1a1a',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #333'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFD814">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <h3 style={{ color: '#FFD814', margin: 0 }}>Total Users</h3>
              </div>
              <p style={{ fontSize: '24px', margin: 0 }}>{dashboardData.totalUsers}</p>
            </div>
            
            <div style={{
              backgroundColor: '#1a1a1a',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #333'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFD814">
                  <path d="M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M5,5V19H19V5H5M7,7H17V9H7V7M7,11H17V13H7V11M7,15H13V17H7V15Z"/>
                </svg>
                <h3 style={{ color: '#FFD814', margin: 0 }}>Total Products</h3>
              </div>
              <p style={{ fontSize: '24px', margin: 0 }}>{dashboardData.totalProducts}</p>
            </div>
            
            <div style={{
              backgroundColor: '#1a1a1a',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #333'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFD814">
                  <path d="M7 18C5.9 18 5 18.9 5 20S5.9 22 7 22 9 21.1 9 20 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5H5.21L4.27 3H1ZM17 18C15.9 18 15 18.9 15 20S15.9 22 17 22 19 21.1 19 20 18.1 18 17 18Z"/>
                </svg>
                <h3 style={{ color: '#FFD814', margin: 0 }}>Total Orders</h3>
              </div>
              <p style={{ fontSize: '24px', margin: 0 }}>{dashboardData.totalOrders}</p>
            </div>
            
            <div style={{
              backgroundColor: '#1a1a1a',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #333'
            }}>
              <h3 style={{ color: '#FFD814', margin: '0 0 10px 0' }}>Total Revenue</h3>
              <p style={{ fontSize: '24px', margin: 0 }}>₹{dashboardData.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Sales Analytics */}
        <div style={{
          backgroundColor: '#1a1a1a',
          padding: '30px',
          borderRadius: '8px',
          border: '1px solid #333'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFD814">
                <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z"/>
              </svg>
              <h2 style={{ color: '#FFD814', margin: 0 }}>Sales Analytics</h2>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              {['week', 'month', 'year'].map(period => (
                <button
                  key={period}
                  onClick={() => handlePeriodChange(period)}
                  style={{
                    backgroundColor: selectedPeriod === period ? '#FFD814' : '#333',
                    color: selectedPeriod === period ? '#000' : '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {salesData && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <p style={{ margin: '5px 0' }}>
                  <strong>Period:</strong> Last {selectedPeriod}
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>Total Orders:</strong> {salesData.totalOrders}
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>Total Revenue:</strong> ₹{salesData.totalRevenue.toFixed(2)}
                </p>
              </div>

              <h3 style={{ color: '#FFD814', marginBottom: '20px' }}>Product Sales</h3>
              
              {salesData.productSales.length > 0 ? (
                <div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <span style={{ color: '#888', fontSize: '14px' }}>
                      Showing {salesData.productSales.length} products with sales
                    </span>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      backgroundColor: '#333'
                    }}>
                      <thead>
                        <tr style={{ backgroundColor: '#FFD814', color: '#000' }}>
                          <th style={{ padding: '12px', textAlign: 'left' }}>Rank</th>
                          <th style={{ padding: '12px', textAlign: 'left' }}>Product Name</th>
                          <th style={{ padding: '12px', textAlign: 'center' }}>Quantity Sold</th>
                          <th style={{ padding: '12px', textAlign: 'right' }}>Revenue</th>
                          <th style={{ padding: '12px', textAlign: 'center' }}>Avg. Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salesData.productSales.map((product, index) => (
                          <tr key={product.productId} style={{
                            borderBottom: '1px solid #555',
                            backgroundColor: index % 2 === 0 ? '#2a2a2a' : '#333'
                          }}>
                            <td style={{ padding: '12px', fontWeight: 'bold', color: '#FFD814' }}>#{index + 1}</td>
                            <td style={{ padding: '12px' }}>{product.productName}</td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>{product.totalQuantity}</td>
                            <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>₹{product.totalRevenue.toFixed(2)}</td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>₹{(product.totalRevenue / product.totalQuantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px 20px',
                  backgroundColor: '#2a2a2a',
                  borderRadius: '8px',
                  border: '2px dashed #555'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                  <h3 style={{ color: '#FFD814', margin: '0 0 8px 0' }}>No Sales Data</h3>
                  <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>
                    No sales recorded for the selected {selectedPeriod}. Sales data will appear here once customers make purchases.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        </>
        )}
        
        {activeTab === 'products' && <ProductManagement />}
        {activeTab === 'orders' && <OrderManagement />}
        {activeTab === 'analytics' && <AdvancedAnalytics />}
      </div>
    </div>
  );
};

export default AdminDashboard;