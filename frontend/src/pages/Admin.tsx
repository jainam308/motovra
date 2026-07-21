import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Loader2, Plus, Edit, Trash2, PackagePlus } from 'lucide-react';
import { motion } from 'framer-motion';

export const Admin = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['vehicles', 'admin'],
    queryFn: async () => {
      const { data } = await api.get('/vehicles');
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      await api.delete(`/vehicles/${id}`);
      refetch();
    }
  };

  const handleRestock = async (id: string) => {
    const amount = prompt('Enter restock amount:', '5');
    if (amount && parseInt(amount) > 0) {
      await api.post(`/vehicles/${id}/restock`, { amount: parseInt(amount) });
      refetch();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Inventory Management</h1>
          <p className="text-muted-foreground">Admin dashboard for managing vehicles.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Add Vehicle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-secondary">
                  <tr>
                    <th className="px-6 py-4">Make & Model</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {data?.data?.map((vehicle: any) => (
                    <tr key={vehicle.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{vehicle.make} {vehicle.model}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline">{vehicle.category}</Badge>
                      </td>
                      <td className="px-6 py-4">${vehicle.price.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <Badge variant={vehicle.quantity > 5 ? 'success' : vehicle.quantity > 0 ? 'secondary' : 'destructive'}>
                          {vehicle.quantity}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleRestock(vehicle.id)} title="Restock">
                          <PackagePlus className="w-4 h-4 text-emerald-500" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4 text-blue-400" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(vehicle.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {data?.data?.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                        No inventory found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
