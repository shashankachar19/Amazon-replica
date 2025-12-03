import React, { useState, useEffect } from 'react';

// Toast configuration constants
const TOAST_DURATION = 3000;
const TOAST_COLORS = {
  success: '#48bb78',
  error: '#f56565',
  info: '#ed8936'
};

let toastHandler = null;

export const showToast = (message, type = 'success') => {
  if (toastHandler && typeof toastHandler === 'function') {
    toastHandler(message, type);
  }
};

const Toast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = React.useCallback((message, type) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast = { id, message, type };
    
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, TOAST_DURATION);
  }, []);

  useEffect(() => {
    toastHandler = addToast;
    
    return () => {
      toastHandler = null;
    };
  }, [addToast]);

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          style={{
            padding: '12px 20px',
            borderRadius: '8px',
            color: '#ffffff',
            fontWeight: 'bold',
            backgroundColor: TOAST_COLORS[toast.type] || TOAST_COLORS.info,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            animation: 'slideInRight 0.3s ease',
            minWidth: '250px'
          }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default Toast;