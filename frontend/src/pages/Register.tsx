import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/register', { email, password });
      toast.success('Registration successful! Check your email for the 6-digit OTP code.');
      navigate('/verify-email', { state: { email } });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center -mt-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[1000px] h-[640px] bg-card rounded-2xl overflow-hidden flex flex-row-reverse border border-border shadow-2xl"
      >
        {/* Form Panel */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-zinc-950/90 backdrop-blur-xl relative z-10 border-l border-white/5">
          <div className="mb-6 flex flex-col items-center">
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              src="/motovra-logo.jpg" 
              alt="Motovra Emblem" 
              className="h-16 w-auto object-contain rounded-2xl border border-amber-500/30 shadow-[0_0_25px_-5px_rgba(245,158,11,0.25)] p-1 bg-black" 
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center text-destructive text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Email address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="bg-black/60 border-white/10 focus:border-amber-500 text-white placeholder:text-gray-600 h-10 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-black/60 border-white/10 focus:border-amber-500 text-white placeholder:text-gray-600 h-10 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Confirm Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-black/60 border-white/10 focus:border-amber-500 text-white placeholder:text-gray-600 h-10 text-sm"
              />
            </div>

            <Button type="submit" className="w-full h-10 mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold tracking-wide shadow-lg shadow-amber-500/20" isLoading={isLoading}>
              Create Account
            </Button>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-zinc-950 text-gray-500 uppercase tracking-widest font-semibold">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-10 bg-zinc-900/80 hover:bg-zinc-800 border-white/10 text-white text-xs"
              onClick={() => { window.location.href = 'http://localhost:3000/api/auth/google'; }}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>
          </form>

          <div className="mt-4 text-center text-xs text-gray-400">
            Already have an account? <Link to="/login" className="text-amber-400 hover:underline font-semibold ml-1">Sign in here</Link>
          </div>
        </div>

        {/* High-Resolution Supercar Hero Branding Panel */}
        <div className="hidden md:flex w-1/2 relative overflow-hidden flex-col justify-between p-12 bg-black">
          {/* Motion Animated Supercar Background Image */}
          <motion.div 
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center z-0 opacity-90"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1600')` }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40 z-10" />
        </div>
      </motion.div>
    </div>
  );
};
