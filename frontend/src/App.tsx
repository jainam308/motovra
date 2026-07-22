import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from './components/layout/RootLayout';
import { useAuth } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Showroom } from './pages/Showroom';
import { VehicleDetail } from './pages/VehicleDetail';
import { Admin } from './pages/Admin';
import { Home } from './pages/Home';
import { Contact } from './pages/Contact';
import { Profile } from './pages/Profile';
import { Orders } from './pages/Orders';
import { OAuthCallback } from './pages/OAuthCallback';
import { NotFound } from './pages/NotFound';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#121212',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      />
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/showroom" element={<Showroom />} />
          <Route path="/vehicles/:id" element={<VehicleDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />
          <Route path="/login" element={
            !user ? <Login /> : user.role === 'ADMIN' ? <Navigate to="/admin" /> : <Navigate to="/showroom" />
          } />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/showroom" />} />
          <Route path="/admin" element={user?.role === 'ADMIN' ? <Admin /> : <Navigate to={user ? '/showroom' : '/login'} />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
