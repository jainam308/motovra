import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { getVehicleImage } from '../utils/imageMapper';
import { ArrowLeft, Check, ShieldCheck, Truck, Clock, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const fetchVehicleById = async (id: string) => {
  const { data } = await api.get(`/vehicles/search?limit=100&page=1`);
  const vehicle = data.data.find((v: any) => v.id === id);
  if (!vehicle) throw new Error('Vehicle not found');
  return vehicle;
};

export const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: vehicle, isLoading, isError } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => fetchVehicleById(id!),
    enabled: !!id,
  });

  const purchaseMutation = useMutation({
    mutationFn: async (vid: string) => {
      await api.post(`/vehicles/${vid}/purchase`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle', id] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Purchase successful! A concierge will contact you shortly.');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Purchase failed');
    }
  });

  const saveMutation = useMutation({
    mutationFn: () => api.post(`/vehicles/${id}/save`),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['savedVehicles'] });
      if (res.data.saved) {
        toast.success(res.data.message);
      } else {
        toast.success(res.data.message);
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to update garage');
    }
  });

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div></div>;
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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <button 
        onClick={() => navigate('/showroom')} 
        className="flex items-center text-sm text-muted-foreground hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Inventory
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Images */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-[4/3] rounded-2xl overflow-hidden bg-secondary border border-border"
          >
            <img 
              src={vehicle.imageUrl || getVehicleImage(vehicle.make, vehicle.model, vehicle.category)} 
              alt={`${vehicle.make} ${vehicle.model}`} 
              className="w-full h-full object-cover"
            />
          </motion.div>
          {/* Mock Thumbnails */}
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map((i) => (
               <div key={i} className="aspect-[4/3] rounded-lg bg-secondary/50 border border-border overflow-hidden opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                 <img 
                    src={vehicle.imageUrl || getVehicleImage(vehicle.make, vehicle.model, vehicle.category)} 
                    alt="Thumbnail" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0"
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
          <div className="mb-6">
            <Badge variant="outline" className="mb-4 text-primary border-primary/20 bg-primary/5">{vehicle.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">{vehicle.make} {vehicle.model}</h1>
            <p className="text-3xl font-light text-gray-300 mt-4">${vehicle.price.toLocaleString()}</p>
          </div>

          <div className="border-t border-b border-border py-6 my-6 space-y-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <ShieldCheck className="w-5 h-5 mr-3 text-primary" />
              Motovra Certified Provenance
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Truck className="w-5 h-5 mr-3 text-primary" />
              Complimentary Enclosed Delivery
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-5 h-5 mr-3 text-primary" />
              Delivery in 3-5 Business Days
            </div>
          </div>

          <div className="space-y-4 mt-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-white">Availability</span>
              <Badge variant={inStock ? 'success' : 'destructive'}>
                {inStock ? `${vehicle.quantity} In Network` : 'Sold Out'}
              </Badge>
            </div>

            <div className="flex space-x-4">
              <Button 
                onClick={() => purchaseMutation.mutate(vehicle.id)} 
                isLoading={purchaseMutation.isPending}
                className="flex-1 text-lg py-6"
                disabled={!inStock || !user}
              >
                {!user ? 'Sign in to Acquire' : (vehicle.quantity > 0 ? 'Acquire Now' : 'Out of Stock')}
              </Button>
              <Button 
                variant="outline"
                className="py-6 px-6 bg-transparent border-border hover:bg-secondary"
                onClick={() => user ? saveMutation.mutate() : navigate('/login')}
                isLoading={saveMutation.isPending}
              >
                <Heart className="w-6 h-6" />
              </Button>
            </div>
            {!user && (
              <p className="text-xs text-center text-muted-foreground mt-2">
                You must be signed in to an approved account to purchase.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
