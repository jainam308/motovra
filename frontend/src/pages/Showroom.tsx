import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';

const fetchVehicles = async (searchParams: Record<string, any>) => {
  const params = new URLSearchParams(searchParams);
  const { data } = await api.get(`/vehicles/search?${params.toString()}`);
  return data;
};

export const Showroom = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [make, setMake] = useState('');
  const [page, setPage] = useState(1);
  const debouncedMake = useDebounce(make, 300);
  
  const queryKey = ['vehicles', { make: debouncedMake, page }];

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => fetchVehicles({ make: debouncedMake, page, limit: 12 }),
  });

  const purchaseMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.post(`/vehicles/${id}/purchase`);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);
      
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.map((v: any) => 
            v.id === id ? { ...v, quantity: Math.max(0, v.quantity - 1) } : v
          )
        };
      });
      
      return { previousData };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const handlePurchase = (id: string) => {
    purchaseMutation.mutate(id);
  };

  return (
    <div className="space-y-8">
      {/* Sticky Filter Bar */}
      <div className="sticky top-[64px] z-40 -mx-4 px-4 py-4 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">Showroom</h1>
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Filter by Make..." 
              className="pl-9"
              value={make}
              onChange={(e) => {
                setMake(e.target.value);
                setPage(1); // Reset page on search
              }}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div data-testid="showroom-skeleton" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-[16/9] bg-secondary" />
              <CardHeader className="space-y-2">
                <div className="h-6 bg-secondary rounded w-2/3" />
                <div className="h-4 bg-secondary rounded w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-secondary rounded w-1/2" />
              </CardContent>
              <CardFooter>
                <div className="h-9 bg-secondary rounded w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[400px]">
            <AnimatePresence>
              {data?.data?.map((vehicle: any, index: number) => (
                <motion.div
                  key={vehicle.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
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
                        disabled={vehicle.quantity < 1 || !user || purchaseMutation.isPending}
                        onClick={() => handlePurchase(vehicle.id)}
                      >
                        {!user ? 'Sign in to Purchase' : vehicle.quantity > 0 ? 'Purchase Now' : 'Sold Out'}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {data?.data?.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border/50 rounded-xl bg-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                <h3 className="text-lg font-heading font-semibold text-white">No Vehicles Found</h3>
                <p>We couldn't find any vehicles matching your criteria.</p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {data?.data?.length > 0 && (
            <div className="flex justify-center items-center space-x-4 pt-8">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-muted-foreground">
                Page {page} {data.totalPages ? `of ${data.totalPages}` : ''}
              </span>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setPage(p => p + 1)}
                disabled={data.totalPages ? page >= data.totalPages : data.data.length < 12}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
