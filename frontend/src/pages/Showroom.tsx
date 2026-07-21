import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';

const fetchVehicles = async (searchParams: Record<string, string>) => {
  const params = new URLSearchParams(searchParams);
  const { data } = await api.get(`/vehicles/search?${params.toString()}`);
  return data;
};

export const Showroom = () => {
  const { user } = useAuth();
  const [make, setMake] = useState('');
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['vehicles', { make }],
    queryFn: () => fetchVehicles(make ? { make } : {}),
  });

  const handlePurchase = async (id: string) => {
    try {
      await api.post(`/vehicles/${id}/purchase`);
      refetch(); 
      alert('Purchase successful!');
    } catch (e: any) {
      alert(e.response?.data?.error || 'Purchase failed');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header / Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-heading font-bold text-white mb-2">Showroom</h1>
          <p className="text-muted-foreground">Browse our premium inventory of exceptional vehicles.</p>
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Filter by Make..." 
              className="pl-9"
              value={make}
              onChange={(e) => setMake(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data?.data?.map((vehicle: any, index: number) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full flex flex-col hover:border-primary/50 transition-colors group border-white/5">
                <div className="aspect-[16/9] bg-gradient-to-tr from-secondary to-black relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:scale-105 group-hover:opacity-30 transition-all duration-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                  </div>
                  <Badge variant={vehicle.quantity > 0 ? 'default' : 'destructive'} className="absolute top-4 right-4 z-20">
                    {vehicle.quantity > 0 ? `${vehicle.quantity} Available` : 'Out of Stock'}
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-2xl">{vehicle.make} {vehicle.model}</CardTitle>
                  <CardDescription className="tracking-widest uppercase text-xs font-semibold">{vehicle.category}</CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <div className="text-3xl font-bold text-white tracking-tight">${vehicle.price.toLocaleString()}</div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={vehicle.quantity > 0 ? 'primary' : 'secondary'}
                    disabled={vehicle.quantity < 1 || !user}
                    onClick={() => handlePurchase(vehicle.id)}
                  >
                    {!user ? 'Sign in to Purchase' : vehicle.quantity > 0 ? 'Purchase Now' : 'Sold Out'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
          
          {data?.data?.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border/50 rounded-xl bg-white/5">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
              <h3 className="text-lg font-heading font-semibold text-white">No Vehicles Found</h3>
              <p>We couldn't find any vehicles matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
