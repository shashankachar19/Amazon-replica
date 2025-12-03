import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import CategoryPage from './components/CategoryPage';
import CartPage from './components/CartPage';
import SearchPage from './components/SearchPage';
import WishlistPage from './components/WishlistPage';
import PaymentPage from './components/PaymentPage';
import ProfilePage from './components/ProfilePage';
import PrivateRoutes from './components/PrivateRoutes';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminPrivateRoute from './components/AdminPrivateRoute';

import Toast from './components/Toast';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import { WishlistProvider } from './context/WishlistContext';
import { FilterProvider } from './context/FilterContext';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import LoadingScreen from './components/LoadingScreen';
import './animations.css';
import './styles/animations.css';

function App() {
  return (
    <UserProvider>
      <LoadingProvider>
        <ThemeProvider>
          <WishlistProvider>
            <FilterProvider>
              <AppContent />
            </FilterProvider>
          </WishlistProvider>
        </ThemeProvider>
      </LoadingProvider>
    </UserProvider>
  );
};

const AppContent = () => {
  const { isLoading } = useLoading();

  return (
    <div style={{ animation: 'fadeIn 0.8s ease-in' }}>
      {isLoading && <LoadingScreen />}
      <BrowserRouter>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login />} />
        
        {/* Registration Route */}
        <Route path="/register" element={<Register />} />



        {/* Discover Route (Protected) */}
        <Route 
          path="/discover" 
          element={
            <PrivateRoutes>
              <Home />
            </PrivateRoutes>
          } 
        />
        
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/discover" replace />} />

        {/* Category Route (Protected) */}
        <Route 
          path="/category/:categorySlug" 
          element={
            <PrivateRoutes>
              <CategoryPage />
            </PrivateRoutes>
          } 
        />

        {/* Cart Route (Protected) */}
        <Route 
          path="/cart" 
          element={
            <PrivateRoutes>
              <CartPage />
            </PrivateRoutes>
          } 
        />

        {/* Search Route (Protected) */}
        <Route 
          path="/search" 
          element={
            <PrivateRoutes>
              <SearchPage />
            </PrivateRoutes>
          } 
        />

        {/* Wishlist Route (Protected) */}
        <Route 
          path="/wishlist" 
          element={
            <PrivateRoutes>
              <WishlistPage />
            </PrivateRoutes>
          } 
        />

        {/* Payment Route (Protected) */}
        <Route 
          path="/payment" 
          element={
            <PrivateRoutes>
              <PaymentPage />
            </PrivateRoutes>
          } 
        />

        {/* Profile Route (Protected) */}
        <Route 
          path="/profile" 
          element={
            <PrivateRoutes>
              <ProfilePage />
            </PrivateRoutes>
          } 
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminPrivateRoute>
              <AdminDashboard />
            </AdminPrivateRoute>
          } 
        />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/discover" replace />} />
      </Routes>
      </BrowserRouter>
      <Toast />
    </div>
  );
}

export default App;