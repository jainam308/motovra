import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const userStr = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      setErrorMsg('Google sign-in was cancelled or failed. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2500);
      return;
    }

    if (accessToken && refreshToken && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        login(accessToken, refreshToken, user);
        navigate('/showroom');
      } catch {
        setErrorMsg('Failed to complete sign-in. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2500);
      }
    } else {
      setErrorMsg('Missing authentication data. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2500);
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4 text-center"
      >
        {errorMsg ? (
          <>
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
            <p className="text-destructive font-medium">{errorMsg}</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="text-white font-medium text-lg">Completing sign-in...</p>
            <p className="text-muted-foreground text-sm">Please wait, you'll be redirected shortly.</p>
          </>
        )}
      </motion.div>
    </div>
  );
};
