import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Calendar, MapPin, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
import { getVehicleImage } from '../utils/imageMapper';

export const Orders = () => {
  const { user, isAuthenticated } = useAuth();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['myOrders'],
    queryFn: async () => {
      const { data } = await api.get('/orders');
      return Array.isArray(data) ? data : (data?.data || []);
    },
    enabled: isAuthenticated
  });

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] py-8 px-4 max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white flex items-center">
            <Package className="w-8 h-8 mr-3 text-primary" /> My Orders
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your vehicle acquisitions, order history, and delivery details.
          </p>
        </div>
        <Link to="/showroom">
          <Button variant="outline" className="border-border">
            <ShoppingBag className="w-4 h-4 mr-2" /> Browse Showroom
          </Button>
        </Link>
      </div>

      {/* Orders List */}
      {orders.length > 0 ? (
        <div className="space-y-6" data-testid="orders-list">
          {orders.map((order: any) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-card border-border hover:border-primary/40 transition-all duration-300 overflow-hidden shadow-lg">
                <CardHeader className="bg-secondary/40 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 py-4">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-sm font-bold text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <Badge variant="default" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    <Truck className="w-3 h-3 mr-1" /> {order.status}
                  </Badge>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    
                    {/* Vehicle Thumbnail */}
                    <div className="w-full md:w-48 aspect-[16/10] bg-secondary rounded-xl overflow-hidden flex-shrink-0 border border-border">
                      <img
                        src={getVehicleImage(order.make, order.model)}
                        alt={`${order.make} ${order.model}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-4 w-full">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2">
                        <div>
                          <h3 className="text-2xl font-heading font-bold text-white">
                            {order.make} {order.model}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Quantity: <span className="font-semibold text-white">{order.quantity}</span>
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="text-xs uppercase font-semibold text-muted-foreground block">Total Amount</span>
                          <span className="text-2xl font-bold font-mono text-primary">
                            ${Number(order.totalAmount || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Delivery Address Details */}
                      {order.deliveryInfo && (
                        <div className="p-3.5 bg-secondary/30 rounded-lg border border-border/60 text-xs text-gray-300 flex items-start space-x-2">
                          <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-white block">{order.deliveryInfo.fullName} • {order.deliveryInfo.phone}</span>
                            <span>{order.deliveryInfo.addressLine}, {order.deliveryInfo.city}, {order.deliveryInfo.state} {order.deliveryInfo.postalCode}</span>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-16 text-center border border-dashed border-border/60 rounded-2xl bg-card p-8 space-y-4 max-w-lg mx-auto"
          data-testid="orders-empty-state"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mx-auto flex items-center justify-center text-primary">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-white">No Orders Yet</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            You haven't placed any vehicle orders yet. Visit our showroom to explore luxury models and acquire your dream ride.
          </p>
          <div className="pt-2">
            <Link to="/showroom">
              <Button className="px-6">
                Explore Showroom <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

    </div>
  );
};
