import React, { useState, useEffect } from 'react';

const AdvancedAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) return <div style={{ color: '#fff', padding: '20px' }}>Loading analytics...</div>;

  if (!analytics) return <div style={{ color: '#fff', padding: '20px' }}>No analytics data available</div>;

  const maxRevenue = Math.max(...analytics.dailyRevenue.map(day => day.revenue));

  return (
    <div style={{ color: '#fff' }}>
      <h3 style={{ color: '#FFD814', marginBottom: '20px' }}>Advanced Analytics</h3>
      
      {/* Key Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: '#2a2a2a',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #444'
        }}>
          <h4 style={{ color: '#FFD814', margin: '0 0 8px 0', fontSize: '14px' }}>Total Revenue</h4>
          <p style={{ fontSize: '20px', margin: 0, fontWeight: 'bold' }}>₹{analytics.totalRevenue.toFixed(2)}</p>
        </div>
        
        <div style={{
          backgroundColor: '#2a2a2a',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #444'
        }}>
          <h4 style={{ color: '#FFD814', margin: '0 0 8px 0', fontSize: '14px' }}>Avg Order Value</h4>
          <p style={{ fontSize: '20px', margin: 0, fontWeight: 'bold' }}>₹{analytics.averageOrderValue.toFixed(2)}</p>
        </div>
        
        <div style={{
          backgroundColor: '#2a2a2a',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #444'
        }}>
          <h4 style={{ color: '#FFD814', margin: '0 0 8px 0', fontSize: '14px' }}>Total Orders</h4>
          <p style={{ fontSize: '20px', margin: 0, fontWeight: 'bold' }}>{analytics.totalOrders}</p>
        </div>
      </div>

      {/* Daily Revenue Chart */}
      <div style={{
        backgroundColor: '#2a2a2a',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #444',
        marginBottom: '30px'
      }}>
        <h4 style={{ color: '#FFD814', margin: '0 0 20px 0' }}>Daily Revenue (Last 7 Days)</h4>
        
        <div style={{ display: 'flex', alignItems: 'end', gap: '10px', height: '200px' }}>
          {analytics.dailyRevenue.map((day, index) => {
            const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 160 : 0;
            return (
              <div key={index} style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                flex: 1
              }}>
                <div style={{
                  backgroundColor: '#FFD814',
                  width: '100%',
                  height: `${height}px`,
                  borderRadius: '4px 4px 0 0',
                  minHeight: '2px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'end',
                  justifyContent: 'center',
                  paddingBottom: '5px'
                }}>
                  {day.revenue > 0 && (
                    <span style={{
                      fontSize: '10px',
                      color: '#000',
                      fontWeight: 'bold'
                    }}>
                      ₹{day.revenue.toFixed(0)}
                    </span>
                  )}
                </div>
                <div style={{
                  marginTop: '8px',
                  fontSize: '12px',
                  color: '#888',
                  textAlign: 'center'
                }}>
                  {day.date}
                </div>
                <div style={{
                  fontSize: '10px',
                  color: '#666',
                  textAlign: 'center'
                }}>
                  {day.orders} orders
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Customers */}
      <div style={{
        backgroundColor: '#2a2a2a',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #444'
      }}>
        <h4 style={{ color: '#FFD814', margin: '0 0 20px 0' }}>Top Customers</h4>
        
        {analytics.topCustomers.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #444' }}>
                  <th style={{ padding: '10px', textAlign: 'left', color: '#FFD814', fontSize: '14px' }}>Rank</th>
                  <th style={{ padding: '10px', textAlign: 'left', color: '#FFD814', fontSize: '14px' }}>Customer</th>
                  <th style={{ padding: '10px', textAlign: 'center', color: '#FFD814', fontSize: '14px' }}>Orders</th>
                  <th style={{ padding: '10px', textAlign: 'right', color: '#FFD814', fontSize: '14px' }}>Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topCustomers.map((customer, index) => (
                  <tr key={customer.userId} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: '10px', fontWeight: 'bold', color: '#FFD814' }}>#{index + 1}</td>
                    <td style={{ padding: '10px' }}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{customer.username}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>{customer.email}</div>
                      </div>
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{customer.orderCount}</td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>
                      ₹{customer.totalSpent.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            color: '#888',
            fontSize: '14px'
          }}>
            No customer data available yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedAnalytics;