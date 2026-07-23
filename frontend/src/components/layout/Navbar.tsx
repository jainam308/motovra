import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { User, Package } from 'lucide-react';
import { motion } from 'framer-motion';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 text-white hover:opacity-90 transition-opacity">
          <img src="/motovra-logo.jpg" alt="Motovra Logo" className="h-9 w-auto object-contain rounded-md" />
          <span className="font-heading font-bold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-amber-400">Motovra</span>
        </Link>

        <nav className="flex items-center space-x-4">
          <Link to="/showroom" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
            Showroom
          </Link>
          <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
            Contact
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  Dashboard
                </Link>
              )}
              <Link to="/orders" className="flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors">
                <Package className="w-4 h-4 mr-1.5 text-primary" />
                My Orders
              </Link>
              <Link to="/profile" className="flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors">
                <User className="w-4 h-4 mr-1.5 text-primary" />
                My Garage
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} className="border-border hover:bg-secondary">
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 ml-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">Register</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </motion.header>
  );
};
