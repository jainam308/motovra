import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from './components/layout/RootLayout';
import { useAuth } from './context/AuthContext';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Showroom } from './pages/Showroom';
import { motion } from 'framer-motion';
import { Button } from './components/ui/button';

const Landing = () => <div className="text-center py-32"><motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}><h1 className="text-6xl font-heading font-bold text-white mb-6">Experience the <span className="text-primary">Future</span></h1><p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">A premium marketplace for automotive enthusiasts. Browse curated collections with unparalleled design.</p><Button size="lg" onClick={() => window.location.href='/showroom'}>Enter Showroom</Button></motion.div></div>;

const App = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div></div>;
  }

  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/showroom" element={<Showroom />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/showroom" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/showroom" />} />
        <Route path="/admin" element={user?.role === 'ADMIN' ? <Admin /> : <Navigate to="/" />} />
      </Route>
    </Routes>
  );
};

export default App;
