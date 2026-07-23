import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { User, Package, Menu, X, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link 
          to="/" 
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center space-x-3 text-white hover:opacity-90 transition-opacity"
        >
          <img src="/motovra-logo.jpg" alt="Motovra Logo" className="h-9 w-auto object-contain rounded-md" />
          <span className="font-heading font-bold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-amber-400">Motovra</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/showroom" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
            Showroom
          </Link>
          <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
            Contact
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className="text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4" /> Admin Panel
                </Link>
              )}
              <Link to="/orders" className="flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors">
                <Package className="w-4 h-4 mr-1.5 text-amber-400" />
                My Orders
              </Link>
              <Link to="/profile" className="flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors">
                <User className="w-4 h-4 mr-1.5 text-amber-400" />
                My Garage
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} className="border-border hover:bg-secondary">
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3 ml-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold">Register</Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={toggleMobileMenu}
          aria-label="Toggle Navigation Menu"
          className="md:hidden p-2.5 text-gray-300 hover:text-white focus:outline-none rounded-lg hover:bg-white/10 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/10 bg-zinc-950/95 backdrop-blur-2xl px-4 py-6 space-y-4 shadow-2xl"
          >
            <Link
              to="/showroom"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-medium text-gray-200 hover:bg-white/10 hover:text-white transition-all"
            >
              Showroom
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-medium text-gray-200 hover:bg-white/10 hover:text-white transition-all"
            >
              Contact Us
            </Link>

            {isAuthenticated ? (
              <div className="pt-4 border-t border-white/10 space-y-3">
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2.5 rounded-xl text-base font-semibold text-amber-400 hover:bg-amber-500/10 transition-all"
                  >
                    <ShieldAlert className="w-5 h-5 mr-2" /> Admin Panel
                  </Link>
                )}
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2.5 rounded-xl text-base font-medium text-gray-200 hover:bg-white/10 transition-all"
                >
                  <Package className="w-5 h-5 mr-2 text-amber-400" /> My Orders
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2.5 rounded-xl text-base font-medium text-gray-200 hover:bg-white/10 transition-all"
                >
                  <User className="w-5 h-5 mr-2 text-amber-400" /> My Garage
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-base font-semibold text-red-400 hover:bg-red-500/10 transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/10 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
