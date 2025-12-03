import React, { useState, useEffect } from 'react';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      alert('Error updating order status');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#4caf50';
      case 'pending': return '#ff9800';
      case 'shipped': return '#2196f3';
      case 'cancelled': return '#f44336';
      default: return '#888';
    }
  };

  if (loading) return <div style={{ color: '#fff', padding: '20px' }}>Loading orders...</div>;

  return (
    <div style={{ color: '#fff' }}>
      <h3 style={{ color: '#FFD814', marginBottom: '20px' }}>Order Management</h3>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#333' }}>
          <thead>
            <tr style={{ backgroundColor: '#FFD814', color: '#000' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Order ID</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Product</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Qty</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Amount</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id} style={{
                borderBottom: '1px solid #555',
                backgroundColor: index % 2 === 0 ? '#2a2a2a' : '#333'
              }}>
                <td style={{ padding: '12px', fontFamily: 'monospace' }}>{order.orderId}</td>
                <td style={{ padding: '12px' }}>{order.productName}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{order.quantity}</td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                  ₹{parseFloat(order.totalAmount).toFixed(2)}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{
                    backgroundColor: getStatusColor(order.status),
                    color: '#fff',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'capitalize'
                  }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px' }}>
                  {new Date(order.createdAt).toLocaleDateString('en-IN')}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    style={{
                      backgroundColor: '#444',
                      border: '1px solid #666',
                      color: '#fff',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="shipped">Shipped</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {orders.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          backgroundColor: '#2a2a2a',
          borderRadius: '8px',
          border: '2px dashed #555',
          marginTop: '20px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
          <h3 style={{ color: '#FFD814', margin: '0 0 8px 0' }}>No Orders Found</h3>
          <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>
            Orders will appear here once customers make purchases.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;