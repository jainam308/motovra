import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Heart, ShieldCheck, Truck, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getVehicleImage } from '../utils/imageMapper';
import { CheckoutModal } from '../components/CheckoutModal';

const fetchVehicleById = async (id: string) => {
  const { data } = await api.get('/vehicles');
  const list = Array.isArray(data) ? data : (data?.data || []);
  const vehicle = list.find((v: any) => v.id === id);
  if (!vehicle) throw new Error('Vehicle not found');
  return vehicle;
};

export const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCheckout, setShowCheckout] = useState(false);

  const { data: vehicle, isLoading, isError } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => fetchVehicleById(id!),
    enabled: !!id,
  });

  const purchaseMutation = useMutation({
    mutationFn: async (deliveryInfo: any) => {
      const res = await api.post(`/vehicles/${vehicle.id}/purchase`, { deliveryInfo });
      return res.data;
    },
    onSuccess: (data) => {
      setShowCheckout(false);
      queryClient.invalidateQueries({ queryKey: ['vehicle', id] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
      toast.success(`🎉 Order placed! #${data?.orderNumber || 'created'}`);
      navigate('/orders');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Purchase failed. Please try again.');
    }
  });

  const saveMutation = useMutation({
    mutationFn: () => api.post(`/vehicles/${id}/save`),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['savedVehicles'] });
      toast.success(res.data.message || 'Updated saved vehicles');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to update garage');
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isError || !vehicle) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <h2 className="text-3xl font-heading font-bold">Vehicle Not Found</h2>
        <Button variant="outline" onClick={() => navigate('/showroom')}>Back to Showroom</Button>
      </div>
    );
  }

  const inStock = vehicle.quantity > 0;
  const imgSrc = vehicle.imageUrl || getVehicleImage(vehicle.make, vehicle.model, vehicle.category);

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-8">
        <button
          onClick={() => navigate('/showroom')}
          className="flex items-center text-sm text-muted-foreground hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Inventory
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="aspect-[4/3] rounded-2xl overflow-hidden bg-secondary border border-border relative"
            >
              <img
                src={imgSrc}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge variant="outline" className="bg-black/50 backdrop-blur-sm border-white/20 text-white">
                  {vehicle.category}
                </Badge>
              </div>
            </motion.div>

            {/* Thumbnails */}
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`aspect-[4/3] rounded-xl bg-secondary border overflow-hidden cursor-pointer transition-all duration-200 ${i === 0 ? 'border-amber-500/60 ring-2 ring-amber-500/30' : 'border-border opacity-60 hover:opacity-100 hover:border-white/30'}`}
                >
                  <img
                    src={imgSrc}
                    alt="Thumbnail"
                    className={`w-full h-full object-cover ${i !== 0 ? 'grayscale hover:grayscale-0 transition-all' : ''}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Details & Purchase */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-4">
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-1">
                {vehicle.make}
              </h1>
              <h2 className="text-3xl font-heading font-light text-gray-400 mb-4">
                {vehicle.model}
              </h2>

              {/* Rating Mock */}
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-sm text-muted-foreground">(4.9 · 128 reviews)</span>
              </div>

              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-bold font-mono text-white">
                  ${Number(vehicle.price).toLocaleString()}
                </p>
                <span className="text-sm text-emerald-400 font-semibold">Complimentary Delivery</span>
              </div>
            </div>

            {/* Trust Features */}
            <div className="border-t border-b border-border py-5 my-5 space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <ShieldCheck className="w-5 h-5 mr-3 text-amber-500 flex-shrink-0" />
                <span>Motovra Certified Provenance — every vehicle inspected</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Truck className="w-5 h-5 mr-3 text-amber-500 flex-shrink-0" />
                <span>Complimentary Enclosed White-Glove Delivery</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-5 h-5 mr-3 text-amber-500 flex-shrink-0" />
                <span>Delivery in 3–5 Business Days</span>
              </div>
            </div>

            {/* Stock & Actions */}
            <div className="space-y-4 mt-auto">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">Availability</span>
                <Badge variant={inStock ? 'success' : 'destructive'}>
                  {inStock ? `${vehicle.quantity} In Network` : 'Sold Out'}
                </Badge>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    if (!user) { navigate('/login'); return; }
                    setShowCheckout(true);
                  }}
                  className="flex-1 text-lg py-6 bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-lg shadow-amber-500/20"
                  disabled={!inStock}
                >
                  {!user ? 'Sign in to Acquire' : inStock ? 'Buy Now' : 'Out of Stock'}
                </Button>
                <Button
                  variant="outline"
                  className="py-6 px-6 bg-transparent border-border hover:bg-secondary"
                  onClick={() => user ? saveMutation.mutate() : navigate('/login')}
                  isLoading={saveMutation.isPending}
                >
                  <Heart className={`w-6 h-6 ${saveMutation.isSuccess ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>

              {!user && (
                <p className="text-xs text-center text-muted-foreground">
                  You must be signed in to purchase a vehicle.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && vehicle && (
        <CheckoutModal
          vehicle={vehicle}
          onClose={() => setShowCheckout(false)}
          onConfirm={(deliveryInfo) => purchaseMutation.mutate(deliveryInfo)}
          isLoading={purchaseMutation.isPending}
        />
      )}
    </>
  );
};
