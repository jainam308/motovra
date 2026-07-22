import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { getVehicleImage } from '../utils/imageMapper';
import { motion } from 'framer-motion';
import { User, Shield, Car, Calendar, ArrowRight, Mail } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

export const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const { data: savedVehicles = [], isLoading } = useQuery({
    queryKey: ['savedVehicles'],
    queryFn: async () => {
      const { data } = await api.get('/vehicles/saved');
      return Array.isArray(data) ? data : (data?.data || []);
    },
    enabled: !!user
  });

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-8 flex flex-col md:flex-row items-center md:justify-between"
        >
          <div className="flex items-center space-x-6 mb-6 md:mb-0">
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center border-2 border-primary/20">
              <User className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold text-white mb-2">My Garage</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  {user.email}
                </span>
                <span className="flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  {user.role}
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={logout}
            className="px-6 py-2 rounded-full border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors"
          >
            Sign Out
          </button>
        </motion.div>

        {/* Saved Vehicles */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-heading font-bold text-white mb-6 flex items-center">
            <Car className="w-6 h-6 mr-3 text-primary" />
            Saved Vehicles
          </h2>

          {isLoading ? (
            <div className="text-center text-gray-400 py-12">Loading your garage...</div>
          ) : savedVehicles?.length === 0 ? (
            <div className="text-center bg-card border border-border rounded-2xl py-16">
              <Car className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl text-white font-medium mb-2">Your garage is empty</h3>
              <p className="text-gray-400 mb-6">Explore the showroom and save your favorite vehicles.</p>
              <Link to="/showroom" className="text-primary hover:underline inline-flex items-center">
                Visit Showroom <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedVehicles?.map((item: any) => (
                <Link key={item.id} to={`/vehicles/${item.vehicle.id}`}>
                  <div className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="aspect-video bg-secondary relative overflow-hidden">
                      <img 
                        src={item.vehicle.imageUrl || getVehicleImage(item.vehicle.make, item.vehicle.model, item.vehicle.category)} 
                        alt={`${item.vehicle.make} ${item.vehicle.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-6">
                      <div className="text-sm text-primary font-medium tracking-wider uppercase mb-2">
                        {item.vehicle.make}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary transition-colors">
                        {item.vehicle.model}
                      </h3>
                      <div className="flex justify-between items-center border-t border-border pt-4">
                        <span className="text-lg text-white font-medium">
                          ${item.vehicle.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Saved {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

