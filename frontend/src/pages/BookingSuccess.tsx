import React from 'react';
import { useLocation, useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, MapPin, CreditCard, PhoneCall, Calendar, ShieldCheck, ArrowRight, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { getVehicleImage } from '../utils/imageMapper';

export const BookingSuccess = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const stateData = location.state || {};

  const order = stateData.order || {};
  const payment = stateData.payment || {};
  const vehicle = stateData.vehicle || {};

  const bookingId = order.orderNumber || orderId || 'MV-BOOKING';
  const razorpayTxId = payment.razorpayPaymentId || 'pay_verified_razorpay';
  const bookingAmount = payment.bookingAmount ? Number(payment.bookingAmount) : 25000;
  const totalAmount = order.totalAmount ? Number(order.totalAmount) : Number(vehicle.price || 0);
  const remainingAmount = payment.remainingAmount ? Number(payment.remainingAmount) : Math.max(0, totalAmount - bookingAmount);

  return (
    <div className="min-h-[calc(100vh-8rem)] py-12 px-4 max-w-4xl mx-auto space-y-8">
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-emerald-950/40 via-card to-amber-950/30 border border-emerald-500/30 rounded-2xl p-8 text-center space-y-4 shadow-2xl relative overflow-hidden"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 px-3 py-1 mb-2">
            BOOKING VERIFIED & PAID
          </Badge>
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-white">
            Vehicle Reserved Successfully!
          </h1>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto mt-2">
            Your Razorpay booking deposit has been processed and verified. Your luxury vehicle has been reserved in our inventory.
          </p>
        </div>
      </motion.div>

      {/* Grid: Booking Details & Dealer Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Order & Payment Summary */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-card border-border overflow-hidden">
            <div className="p-6 border-b border-border bg-secondary/30 flex justify-between items-center">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Booking Reference</span>
                <span className="text-2xl font-bold font-mono text-amber-500">{bookingId}</span>
              </div>
              <Badge variant="default" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                Razorpay Paid
              </Badge>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Vehicle Row */}
              <div className="flex gap-4 items-center p-4 bg-secondary/40 rounded-xl border border-border">
                <div className="w-28 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                  <img
                    src={vehicle.imageUrl || getVehicleImage(order.make || vehicle.make || '', order.model || vehicle.model || '')}
                    alt="Vehicle"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-white">
                    {order.make || vehicle.make} {order.model || vehicle.model}
                  </h3>
                  <p className="text-sm text-muted-foreground">Full Price: ${totalAmount.toLocaleString()}</p>
                </div>
              </div>

              {/* Payment Summary Box */}
              <div className="p-5 bg-amber-500/5 rounded-xl border border-amber-500/20 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-400" /> Razorpay Transaction Details
                </h4>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Razorpay Transaction ID</span>
                    <span className="font-mono text-white text-xs bg-white/5 px-2 py-0.5 rounded border border-white/10">{razorpayTxId}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Deposit Paid via Razorpay</span>
                    <span className="font-bold text-emerald-400">${bookingAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-amber-500/20 text-base font-bold">
                    <span className="text-white">Remaining Balance (Due at Delivery)</span>
                    <span className="text-amber-400 font-mono">${remainingAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              {order.deliveryInfo && (
                <div className="p-4 bg-secondary/30 rounded-xl border border-border space-y-2 text-xs text-gray-300">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400" /> Scheduled Delivery Location
                  </h4>
                  <p className="font-semibold text-white">{order.deliveryInfo.fullName} • {order.deliveryInfo.phone}</p>
                  <p>{order.deliveryInfo.addressLine}, {order.deliveryInfo.city}, {order.deliveryInfo.state} {order.deliveryInfo.postalCode}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Dealer & Actions */}
        <div className="space-y-6">
          <Card className="bg-card border-border p-6 space-y-5">
            <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-amber-500" /> Concierge & Next Steps
            </h3>
            
            <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
              <p className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                Our VIP Relations Concierge will contact you within 2 hours to confirm enclosed transport logistics.
              </p>
              <p className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                Remaining amount of <strong className="text-white">${remainingAmount.toLocaleString()}</strong> can be settled upon white-glove inspection or through dealer financing.
              </p>
            </div>

            <div className="p-3.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs">
              <span className="font-semibold text-amber-400 block mb-1">Direct Dealer Support</span>
              <span className="text-white block font-mono font-bold">+1 (800) 555-MOTOVRA</span>
              <span className="text-muted-foreground">concierge@motovra.com</span>
            </div>

            <div className="space-y-3 pt-2">
              <Link to="/orders" className="w-full block">
                <Button className="w-full py-5 bg-amber-600 hover:bg-amber-700 font-bold text-white">
                  <Package className="w-4 h-4 mr-2" /> View My Bookings
                </Button>
              </Link>
              <Link to="/showroom" className="w-full block">
                <Button variant="outline" className="w-full border-border">
                  <ShoppingBag className="w-4 h-4 mr-2" /> Browse Showroom
                </Button>
              </Link>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};
