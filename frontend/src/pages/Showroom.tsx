import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { getVehicleImage } from '../utils/imageMapper';
import { Link, useSearchParams } from 'react-router-dom';

const fetchVehicles = async (searchParams: Record<string, any>) => {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) params.append(key, value.toString());
  });
  const { data } = await api.get(`/vehicles/search?${params.toString()}`);
  return data;
};

export const Showroom = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialCategory = searchParams.get('category') || '';
  
  const [make, setMake] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  
  const debouncedMake = useDebounce(make, 300);
  const debouncedMin = useDebounce(minPrice, 300);
  const debouncedMax = useDebounce(maxPrice, 300);
  
  const queryKey = ['vehicles', { make: debouncedMake, category, minPrice: debouncedMin, maxPrice: debouncedMax, page }];

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => fetchVehicles({ 
      make: debouncedMake, 
      category, 
      minPrice: debouncedMin, 
      maxPrice: debouncedMax, 
      page, 
      limit: 12 
    }),
  });

  const categories = ['ALL', 'SPORTS', 'LUXURY', 'SUV', 'ELECTRIC', 'SEDAN'];

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <div className="w-full md:w-64 flex-shrink-0 space-y-8">
        <div>
          <h2 className="text-lg font-heading font-bold text-white flex items-center mb-4">
            <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
          </h2>
          <div className="space-y-6">
            
            {/* Make Search */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Make / Model</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="e.g. Porsche..." 
                  className="pl-9 bg-secondary/50 border-border"
                  value={make}
                  onChange={(e) => {
                    setMake(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Category</label>
              <div className="flex flex-col space-y-1">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCategory(c === 'ALL' ? '' : c);
                      setPage(1);
                    }}
                    className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      (category === c) || (c === 'ALL' && category === '') 
                        ? 'bg-primary/10 text-primary font-semibold' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Price Range</label>
              <div className="flex items-center space-x-2">
                <Input 
                  type="number"
                  placeholder="Min" 
                  className="bg-secondary/50 border-border h-9 text-sm"
                  value={minPrice}
                  onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                />
                <span className="text-muted-foreground">-</span>
                <Input 
                  type="number"
                  placeholder="Max" 
                  className="bg-secondary/50 border-border h-9 text-sm"
                  value={maxPrice}
                  onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1">
        <div className="mb-6 flex justify-between items-end border-b border-border pb-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-white">Showroom</h1>
            <p className="text-muted-foreground mt-1">
              {data?.meta?.total || 0} vehicles matching your criteria
            </p>
          </div>
        </div>

        {isLoading ? (
          <div data-testid="showroom-skeleton" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse bg-card border-border">
                <div className="aspect-[4/3] bg-secondary" />
                <CardHeader className="space-y-2">
                  <div className="h-6 bg-secondary rounded w-2/3" />
                  <div className="h-4 bg-secondary rounded w-1/3" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-secondary rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
              <AnimatePresence>
                {data?.data?.map((vehicle: any) => (
                  <motion.div
                    key={vehicle.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link to={`/vehicles/${vehicle.id}`}>
                      <Card className="h-full flex flex-col hover:border-primary/50 transition-all duration-300 group border-border bg-card overflow-hidden cursor-pointer hover:shadow-[0_0_30px_-10px_rgba(229,169,16,0.15)]">
                        <div className="aspect-[4/3] bg-secondary relative overflow-hidden">
                          <img 
                            src={vehicle.imageUrl || getVehicleImage(vehicle.make, vehicle.model, vehicle.category)} 
                            alt={`${vehicle.make} ${vehicle.model}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent z-10" />
                          
                          <Badge variant={vehicle.quantity > 0 ? 'default' : 'destructive'} className="absolute top-4 right-4 z-20 backdrop-blur-md bg-black/50 border-white/10 text-white">
                            {vehicle.quantity > 0 ? `${vehicle.quantity} Available` : 'Out of Stock'}
                          </Badge>
                        </div>
                        
                        <CardHeader className="relative z-20 -mt-8 pt-0">
                          <CardDescription className="tracking-widest uppercase text-xs font-semibold text-primary/80 drop-shadow-md mb-1">{vehicle.category}</CardDescription>
                          <CardTitle className="text-2xl font-heading text-white">{vehicle.make} {vehicle.model}</CardTitle>
                        </CardHeader>
                        
                        <CardContent className="flex-1 pt-2">
                          <div className="text-2xl font-bold text-white tracking-tight">${vehicle.price.toLocaleString()}</div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {data?.data?.length === 0 && (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border/50 rounded-xl bg-white/2">
                  <h3 className="text-lg font-heading font-semibold text-white mb-2">No Vehicles Found</h3>
                  <p>Try adjusting your filters to find what you're looking for.</p>
                  <Button variant="outline" className="mt-4" onClick={() => { setMake(''); setCategory(''); setMinPrice(''); setMaxPrice(''); }}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {data?.data?.length > 0 && data?.meta?.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 pt-12">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="bg-card border-border hover:bg-secondary"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium text-muted-foreground">
                  Page {page} of {data.meta?.totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= data.meta?.totalPages}
                  className="bg-card border-border hover:bg-secondary"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
