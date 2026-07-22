import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, CreditCard, Smartphone, Landmark, Wallet, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface RazorpaySandboxModalProps {
  razorpayOrderId: string;
  amount: number;
  vehicleName: string;
  customerName: string;
  customerPhone: string;
  onSuccess: (paymentData: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
  onCancel: () => void;
}

export const RazorpaySandboxModal: React.FC<RazorpaySandboxModalProps> = ({
  razorpayOrderId,
  amount,
  vehicleName,
  customerName,
  customerPhone,
  onSuccess,
  onCancel,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'upi' | 'netbanking' | 'wallet'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSimulatePayment = async () => {
    setIsSubmitting(true);
    const mockPaymentId = `pay_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const secret = 'mock_secret_key_456';
    let signature = 'mock_sig';

    try {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secret);
      const msgData = encoder.encode(`${razorpayOrderId}|${mockPaymentId}`);
      const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      const signatureBuffer = await window.crypto.subtle.sign('HMAC', cryptoKey, msgData);
      const hashArray = Array.from(new Uint8Array(signatureBuffer));
      signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback signature
    }

    setTimeout(() => {
      onSuccess({
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: mockPaymentId,
        razorpay_signature: signature,
      });
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
          onClick={onCancel}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative bg-[#0c0d12] border border-blue-500/30 rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.2)] text-white"
          onClick={e => e.stopPropagation()}
        >
          {/* Razorpay Brand Header */}
          <div className="bg-gradient-to-r from-[#072654] to-[#0c1b33] p-5 border-b border-blue-500/20 relative">
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-600 text-white font-black italic text-xs px-2 py-0.5 rounded tracking-tighter shadow">
                RAZORPAY
              </div>
              <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                Sandbox Mode
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">Motovra Luxury Motors</h3>
            <p className="text-xs text-gray-300">Booking Deposit for {vehicleName}</p>

            <div className="mt-4 flex justify-between items-baseline bg-black/40 p-3 rounded-xl border border-white/10">
              <span className="text-xs text-gray-400">Total Payable Amount</span>
              <span className="text-2xl font-bold font-mono text-blue-400">${amount.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="p-5 space-y-4">
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Select Payment Method</div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'card', label: 'Card', icon: CreditCard, subText: 'Visa, Mastercard, Amex' },
                { id: 'upi', label: 'UPI / QR', icon: Smartphone, subText: 'Google Pay, PhonePe' },
                { id: 'netbanking', label: 'NetBanking', icon: Landmark, subText: 'All major banks' },
                { id: 'wallet', label: 'Wallets', icon: Wallet, subText: 'Paytm, Mobikwik' },
              ].map(m => {
                const Icon = m.icon;
                const active = selectedMethod === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMethod(m.id as any)}
                    className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left ${
                      active
                        ? 'bg-blue-600/15 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-1 ${active ? 'text-blue-400' : 'text-gray-400'}`} />
                    <span className="text-xs font-bold text-white">{m.label}</span>
                    <span className="text-[10px] text-gray-400">{m.subText}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Method Input Mock */}
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Customer</span>
                <span className="text-white font-semibold">{customerName || 'Customer'} ({customerPhone || '+91-XXXXX'})</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Razorpay Order ID</span>
                <span className="font-mono text-blue-400 text-[11px]">{razorpayOrderId}</span>
              </div>
            </div>

            {/* Test Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleSimulatePayment}
                disabled={isSubmitting}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 font-bold text-white rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Verifying Payment Signature...</>
                ) : (
                  <><CheckCircle2 className="w-4 h-4" /> Complete ${amount.toLocaleString()} Test Payment</>
                )}
              </button>

              <button
                onClick={onCancel}
                disabled={isSubmitting}
                className="w-full py-2.5 bg-transparent hover:bg-white/5 text-gray-400 hover:text-white font-semibold rounded-xl transition-all text-xs border border-white/10"
              >
                Cancel Payment
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>256-bit SSL Encrypted • Razorpay Gateway</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
