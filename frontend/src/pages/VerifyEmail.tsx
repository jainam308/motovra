import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, RefreshCw, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const initialEmail = location.state?.email || searchParams.get('email') || '';
  const tokenFromUrl = searchParams.get('token');

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Automatic token verification if token param is in URL
  useEffect(() => {
    if (tokenFromUrl) {
      handleTokenVerification(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleTokenVerification = async (rawToken: string) => {
    setIsLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/auth/verify-email/${rawToken}`);
      setSuccess(data.message || 'Email verified successfully!');
      toast.success('Email verified successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Verification failed. Invalid or expired token.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    // Handle single character or paste
    if (value.length > 1) {
      const digits = value.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newOtp[i] = digits[i] || '';
      }
      setOtp(newOtp);
      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next input box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter all 6 digits of the OTP code.');
      return;
    }

    if (!email) {
      setError('Please provide your email address.');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp: fullOtp });
      setSuccess(data.message || 'Email verified successfully!');
      toast.success('Account verified! Welcome to Motovra.');

      if (data.accessToken && data.refreshToken && data.user) {
        login(data.accessToken, data.refreshToken, data.user);
        setTimeout(() => navigate('/showroom'), 1000);
      } else {
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid or expired OTP code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setError('Please enter your email address to resend OTP.');
      return;
    }
    if (cooldown > 0) return;

    setIsResending(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await api.post('/auth/resend-verification', { email });
      toast.success(data.message || 'A new 6-digit OTP code has been sent to your email.');
      setSuccess('New 6-digit OTP code sent! Check your inbox.');
      setCooldown(30);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center -mt-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[540px] bg-card/90 backdrop-blur-2xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden"
      >
        {/* Subtle background ambient glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center text-center mb-8 relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
          >
            <ShieldCheck className="w-8 h-8 text-amber-400" />
          </motion.div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            Verify Email
          </h1>
          <p className="text-sm text-zinc-400 max-w-xs">
            We sent a 6-digit verification code to
          </p>
          <p className="text-sm font-semibold text-amber-400 mt-1 flex items-center gap-1.5 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <Mail className="w-3.5 h-3.5" />
            {email || 'your registered email'}
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center font-medium flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {success}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {!initialEmail && (
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-zinc-950/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition-all text-sm"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 text-center">
              Enter 6-Digit Verification Code
            </label>
            <div className="flex justify-between items-center gap-2 md:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-11 h-14 md:w-14 md:h-16 text-center text-2xl font-black text-amber-400 bg-zinc-950/90 border border-white/10 rounded-2xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all shadow-inner font-mono"
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || otp.join('').length !== 6}
            className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-black font-bold text-base rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-black" />
                <span>Verifying Code...</span>
              </>
            ) : (
              'Verify & Continue'
            )}
          </Button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-white/10 flex flex-col items-center gap-4 relative z-10">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isResending || cooldown > 0}
            className="text-xs text-zinc-400 hover:text-amber-400 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:hover:text-zinc-400"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
            {cooldown > 0 ? (
              <span>Resend code in <strong className="text-amber-400 font-mono">{cooldown}s</strong></span>
            ) : (
              <span>Didn't get code? <strong className="text-amber-400 underline underline-offset-4">Resend OTP</strong></span>
            )}
          </button>

          <Link
            to="/register"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign Up
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
