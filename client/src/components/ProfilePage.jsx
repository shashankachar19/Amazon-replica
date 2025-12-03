// client/src/components/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import Header from './Header';
import { useUser } from '../context/UserContext';

const ProfilePage = ({ handleLogout }) => {
  const { user: contextUser, loading: userLoading } = useUser();
  const [user, setUser] = useState({
    username: '',
    email: '',
    address: '',
    phone: '',
    city: '',
    state: '',
    pincode: '',
    savedAddresses: [],
    notifications: {
      email: true,
      sms: false,
      orderUpdates: true,
      promotions: false
    }
  });
  const [originalUser, setOriginalUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (contextUser) {
      let parsedAddress = { city: '', state: '', pincode: '', phone: '' };
      let savedAddresses = [];
      let notifications = { email: true, sms: false, orderUpdates: true, promotions: false };
      
      try {
        if (contextUser.address) {
          const parsed = JSON.parse(contextUser.address);
          if (parsed.structured) {
            parsedAddress = parsed;
            savedAddresses = parsed.savedAddresses || [];
            notifications = parsed.notifications || notifications;
          }
        }
      } catch (e) {
        // Legacy address format
      }
      
      const userData = {
        username: contextUser.username || '',
        email: contextUser.email || '',
        address: contextUser.address || '',
        phone: parsedAddress.phone || '',
        city: parsedAddress.city || '',
        state: parsedAddress.state || '',
        pincode: parsedAddress.pincode || '',
        savedAddresses,
        notifications
      };
      setUser(userData);
      setOriginalUser(userData);
    }
    setLoading(userLoading);
  }, [contextUser, userLoading]);

  useEffect(() => {
    if (originalUser) {
      setHasChanges(
        user.username !== originalUser.username ||
        user.phone !== originalUser.phone ||
        user.city !== originalUser.city ||
        user.state !== originalUser.state ||
        user.pincode !== originalUser.pincode ||
        JSON.stringify(user.notifications) !== JSON.stringify(originalUser.notifications)
      );
    }
  }, [user, originalUser]);

  const handleCancel = () => {
    setUser(originalUser);
    setIsEditing(false);
    setErrors({});
  };

  const fetchOrders = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      if (!userId) return;
      
      const response = await fetch('http://localhost:5000/api/cart/orders', {
        headers: { 'x-user-id': userId },
        credentials: 'include'
      });
      
      if (response.ok) {
        const ordersData = await response.json();
        setOrders(ordersData);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setErrors({});
    try {
      const structuredAddress = JSON.stringify({
        structured: true,
        phone: user.phone.trim(),
        city: user.city.trim(),
        state: user.state.trim(),
        pincode: user.pincode.trim(),
        savedAddresses: user.savedAddresses,
        notifications: user.notifications
      });
      
      const response = await fetch('http://localhost:5000/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          username: user.username.trim(),
          address: structuredAddress
        })
      });
      
      if (response.ok) {
        const updatedData = { ...user, username: user.username.trim(), address: user.address.trim() };
        setOriginalUser(updatedData);
        setUser(updatedData);
        setIsEditing(false);
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const error = await response.json();
        setErrors({ general: error.message || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Update error:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    
    if (confirmDelete) {
      const finalConfirm = window.confirm(
        'This will permanently delete all your data including cart items and order history. Continue?'
      );
      
      if (finalConfirm) {
        try {
          // Call API to delete from database
          const response = await fetch('http://localhost:5000/api/auth/delete', {
            method: 'DELETE',
            credentials: 'include'
          });
          
          if (response.ok) {
            // Clear all local data
            localStorage.clear();
            alert('Account deleted successfully from database. You will be redirected to login.');
            window.location.href = '/login';
          } else {
            const error = await response.json();
            alert('Failed to delete account: ' + error.msg);
          }
        } catch (error) {
          console.error('Delete error:', error);
          alert('Network error. Please try again.');
        }
      }
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#1a202c', minHeight: '100vh', color: '#e2e8f0' }}>
        <Header handleLogout={handleLogout} hideSearchBar={true} />
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '4px solid #4a5568',
            borderTop: '4px solid #FFD814',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }} />
          <h2>Loading your profile...</h2>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#1a202c', minHeight: '100vh', color: '#e2e8f0' }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <Header handleLogout={handleLogout} hideSearchBar={true} />
      
      <div className="fade-in" style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
          <h1 className="scale-in" style={{ color: '#FFD814', fontSize: '2.5em', margin: 0 }}>My Profile</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#FFD814',
                color: '#1a202c',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
              Edit Profile
            </button>
          )}
        </div>
        
        {successMessage && (
          <div style={{
            backgroundColor: '#38a169',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            {successMessage}
          </div>
        )}
        
        {errors.general && (
          <div style={{
            backgroundColor: '#e53e3e',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
            {errors.general}
          </div>
        )}
        
        <div className="scale-in" style={{ 
          backgroundColor: '#2d3748', 
          padding: '30px', 
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)',
          transition: 'all 0.3s ease',
          border: isEditing ? '2px solid #FFD814' : '1px solid #4a5568'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 'bold', color: '#e2e8f0' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              Username {isEditing && <span style={{ color: '#fc8181' }}>*</span>}
            </label>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={user.username}
                  onChange={(e) => setUser({...user, username: e.target.value})}
                  placeholder="Enter your username"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    borderRadius: '6px',
                    border: `2px solid ${errors.username ? '#fc8181' : '#4a5568'}`,
                    backgroundColor: '#1a202c',
                    color: '#edf2f7',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = errors.username ? '#fc8181' : '#FFD814'}
                  onBlur={(e) => e.target.style.borderColor = errors.username ? '#fc8181' : '#4a5568'}
                />
                {errors.username && (
                  <p style={{ color: '#fc8181', fontSize: '14px', marginTop: '4px', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                    </svg>
                    {errors.username}
                  </p>
                )}
              </div>
            ) : (
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#1a202c', 
                borderRadius: '6px',
                border: '1px solid #4a5568',
                fontSize: '16px'
              }}>
                {user.username || 'Not set'}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 'bold', color: '#e2e8f0' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              Email Address
            </label>
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#1a202c', 
              borderRadius: '6px',
              border: '1px solid #4a5568',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ color: '#FFD814', fontWeight: 'bold' }}>
                {user.email || 'No email found'}
              </span>
              <span style={{ 
                fontSize: '12px', 
                color: '#a0aec0',
                backgroundColor: '#2d3748',
                padding: '4px 8px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
                Protected
              </span>
            </div>
          </div>

          {/* Phone Number */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 'bold', color: '#e2e8f0' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={user.phone}
                onChange={(e) => setUser({...user, phone: e.target.value})}
                placeholder="Enter your phone number"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  borderRadius: '6px',
                  border: '2px solid #4a5568',
                  backgroundColor: '#1a202c',
                  color: '#edf2f7',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#FFD814'}
                onBlur={(e) => e.target.style.borderColor = '#4a5568'}
              />
            ) : (
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#1a202c', 
                borderRadius: '6px',
                border: '1px solid #4a5568',
                fontSize: '16px'
              }}>
                {user.phone || 'Not provided'}
              </div>
            )}
          </div>

          {/* Address Fields */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 'bold', color: '#e2e8f0' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              Address Details
            </label>
            {isEditing ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input
                  type="text"
                  value={user.city}
                  onChange={(e) => setUser({...user, city: e.target.value})}
                  placeholder="City"
                  style={{
                    padding: '12px',
                    fontSize: '16px',
                    borderRadius: '6px',
                    border: '2px solid #4a5568',
                    backgroundColor: '#1a202c',
                    color: '#edf2f7',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FFD814'}
                  onBlur={(e) => e.target.style.borderColor = '#4a5568'}
                />
                <input
                  type="text"
                  value={user.state}
                  onChange={(e) => setUser({...user, state: e.target.value})}
                  placeholder="State"
                  style={{
                    padding: '12px',
                    fontSize: '16px',
                    borderRadius: '6px',
                    border: '2px solid #4a5568',
                    backgroundColor: '#1a202c',
                    color: '#edf2f7',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FFD814'}
                  onBlur={(e) => e.target.style.borderColor = '#4a5568'}
                />
                <input
                  type="text"
                  value={user.pincode}
                  onChange={(e) => setUser({...user, pincode: e.target.value})}
                  placeholder="Pincode"
                  style={{
                    padding: '12px',
                    fontSize: '16px',
                    borderRadius: '6px',
                    border: '2px solid #4a5568',
                    backgroundColor: '#1a202c',
                    color: '#edf2f7',
                    outline: 'none',
                    gridColumn: 'span 2'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FFD814'}
                  onBlur={(e) => e.target.style.borderColor = '#4a5568'}
                />
              </div>
            ) : (
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#1a202c', 
                borderRadius: '6px',
                border: '1px solid #4a5568',
                fontSize: '16px'
              }}>
                {user.city || user.state || user.pincode ? 
                  `${user.city}${user.city && user.state ? ', ' : ''}${user.state}${(user.city || user.state) && user.pincode ? ' - ' : ''}${user.pincode}` : 
                  'No address provided'
                }
              </div>
            )}
          </div>

          {/* Notification Preferences */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: 'bold', color: '#e2e8f0' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
              Notification Preferences
            </label>
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#1a202c', 
              borderRadius: '6px',
              border: '1px solid #4a5568'
            }}>
              {Object.entries({
                email: 'Email Notifications',
                sms: 'SMS Notifications', 
                orderUpdates: 'Order Updates',
                promotions: 'Promotional Offers'
              }).map(([key, label]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#edf2f7' }}>{label}</span>
                  <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                    <input
                      type="checkbox"
                      checked={user.notifications[key]}
                      onChange={(e) => setUser({...user, notifications: {...user.notifications, [key]: e.target.checked}})}
                      disabled={!isEditing}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: isEditing ? 'pointer' : 'not-allowed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: user.notifications[key] ? '#FFD814' : '#4a5568',
                      transition: '0.3s',
                      borderRadius: '24px'
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '',
                        height: '18px',
                        width: '18px',
                        left: user.notifications[key] ? '29px' : '3px',
                        bottom: '3px',
                        backgroundColor: '#1a202c',
                        transition: '0.3s',
                        borderRadius: '50%'
                      }} />
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {isEditing && (
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              flexWrap: 'wrap',
              padding: '20px',
              backgroundColor: '#1a202c',
              borderRadius: '6px',
              border: '1px solid #4a5568'
            }}>
              <button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                style={{
                  padding: '12px 24px',
                  backgroundColor: saving || !hasChanges ? '#4a5568' : '#38a169',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: saving || !hasChanges ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (!saving && hasChanges) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(56, 161, 105, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {saving ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid #ffffff',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Saving...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
              
              <button
                onClick={handleCancel}
                disabled={saving}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'transparent',
                  color: '#a0aec0',
                  border: '2px solid #4a5568',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!saving) {
                    e.target.style.borderColor = '#a0aec0';
                    e.target.style.color = '#edf2f7';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#4a5568';
                  e.target.style.color = '#a0aec0';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
                Cancel
              </button>
              
              {hasChanges && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#FFD814',
                  fontSize: '14px',
                  marginLeft: 'auto'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                  </svg>
                  Unsaved changes
                </div>
              )}
            </div>
          )}
          
          {/* Order History Section */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFD814', marginBottom: '15px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
              Recent Orders ({orders.length})
            </h3>
            {ordersLoading ? (
              <div style={{ 
                padding: '20px', 
                backgroundColor: '#1a202c', 
                borderRadius: '6px',
                border: '1px solid #4a5568',
                textAlign: 'center'
              }}>
                <div style={{
                  display: 'inline-block',
                  width: '24px',
                  height: '24px',
                  border: '3px solid #4a5568',
                  borderTop: '3px solid #FFD814',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <p style={{ color: '#a0aec0', margin: '10px 0 0 0' }}>Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div style={{ 
                padding: '20px', 
                backgroundColor: '#1a202c', 
                borderRadius: '6px',
                border: '1px solid #4a5568',
                textAlign: 'center'
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="#4a5568" style={{ marginBottom: '12px' }}>
                  <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
                </svg>
                <p style={{ color: '#a0aec0', margin: 0 }}>No orders found. Start shopping to see your order history!</p>
              </div>
            ) : (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {orders.map((order, index) => (
                  <div key={order.orderId} style={{
                    padding: '16px',
                    backgroundColor: '#1a202c',
                    borderRadius: '6px',
                    border: '1px solid #4a5568',
                    marginBottom: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div>
                        <h4 style={{ margin: 0, color: '#FFD814', fontSize: '16px' }}>Order #{order.orderId}</h4>
                        <p style={{ margin: '4px 0 0 0', color: '#a0aec0', fontSize: '14px' }}>
                          Ordered: {order.orderDate || new Date(order.createdAt).toLocaleDateString('en-IN', { 
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </p>
                        {order.deliveryDate && (
                          <p style={{ margin: '2px 0 0 0', color: '#00A652', fontSize: '12px' }}>
                            Expected: {order.deliveryDate}
                          </p>
                        )}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, color: '#edf2f7', fontWeight: 'bold', fontSize: '16px' }}>
                          ₹{parseFloat(order.totalAmount).toLocaleString('en-IN')}
                        </p>
                        <span style={{
                          padding: '4px 8px',
                          backgroundColor: '#38a169',
                          color: 'white',
                          borderRadius: '4px',
                          fontSize: '12px',
                          textTransform: 'capitalize'
                        }}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: '14px', color: '#a0aec0' }}>
                      {order.items.slice(0, 2).map((item, i) => (
                        <span key={i}>
                          {item.name} (x{item.quantity})
                          {i < Math.min(order.items.length, 2) - 1 && ', '}
                        </span>
                      ))}
                      {order.items.length > 2 && (
                        <span> and {order.items.length - 2} more item{order.items.length > 3 ? 's' : ''}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delete Account Section */}
          <div style={{ 
            marginTop: '40px', 
            paddingTop: '20px', 
            borderTop: '1px solid #4a5568'
          }}>
            <h3 style={{ color: '#fc8181', marginBottom: '15px' }}>Deletion</h3>
            <p style={{ color: '#a0aec0', marginBottom: '15px', fontSize: '0.9em' }}>
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              onClick={handleDeleteAccount}
              style={{
                padding: '12px 20px',
                backgroundColor: '#e53e3e',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#c53030';
                e.target.style.boxShadow = '0 0 15px rgba(229, 62, 62, 0.5)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#e53e3e';
                e.target.style.boxShadow = 'none';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;