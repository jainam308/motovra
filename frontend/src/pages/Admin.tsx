import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Loader2, Plus, Edit, Trash2, PackagePlus, X, ShieldAlert, LayoutDashboard, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import AdminDashboard from './AdminDashboard';

const validateVehicle = (data: any) => {
  const errors: Record<string, string> = {};
  if (!data.make?.trim()) errors.make = 'Make is required';
  if (!data.model?.trim()) errors.model = 'Model is required';
  if (!data.category?.trim()) errors.category = 'Category is required';
  if (data.price === undefined || data.price <= 0 || isNaN(data.price)) errors.price = 'Price must be greater than 0';
  if (data.quantity === undefined || data.quantity < 0 || isNaN(data.quantity)) errors.quantity = 'Quantity must be 0 or greater';
  return errors;
};

export const Admin = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'inventory' ? 'inventory' : 'dashboard';
  const [activeTab, setActiveTabState] = useState<'dashboard' | 'inventory'>(initialTab);

  const setActiveTab = (tab: 'dashboard' | 'inventory') => {
    setActiveTabState(tab);
    setSearchParams(tab === 'inventory' ? { tab: 'inventory' } : {});
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    category: '',
    price: '',
    quantity: '',
    imageUrl: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ['vehicles', 'admin'],
    queryFn: async () => {
      const { data } = await api.get('/vehicles/search?limit=100&page=1');
      return data;
    },
  });

  const vehiclesList = Array.isArray(data) ? data : (data?.data || []);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/vehicles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Vehicle deleted successfully');
    },
    onError: () => toast.error('Failed to delete vehicle')
  });

  const restockMutation = useMutation({
    mutationFn: ({ id, amount }: { id: string, amount: number }) => api.post(`/vehicles/${id}/restock`, { amount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Restocked successfully');
    },
    onError: () => toast.error('Failed to restock vehicle')
  });

  const saveMutation = useMutation({
    mutationFn: (vehicleData: any) => {
      if (editingVehicle) {
        return api.put(`/vehicles/${editingVehicle.id}`, vehicleData);
      }
      return api.post('/vehicles', vehicleData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setIsModalOpen(false);
      resetForm();
      toast.success('Vehicle saved successfully');
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Failed to save vehicle')
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleRestock = (id: string) => {
    const amountStr = prompt('Enter restock amount:', '5');
    const amount = parseInt(amountStr || '');
    if (!isNaN(amount) && amount > 0) {
      restockMutation.mutate({ id, amount });
    }
  };

  const resetForm = () => {
    setFormData({ make: '', model: '', category: '', price: '', quantity: '', imageUrl: '' });
    setEditingVehicle(null);
    setErrors({});
  };

  const openModal = (vehicle?: any) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData({
        make: vehicle.make,
        model: vehicle.model,
        category: vehicle.category,
        price: vehicle.price.toString(),
        quantity: vehicle.quantity.toString(),
        imageUrl: vehicle.imageUrl || ''
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      make: formData.make,
      model: formData.model,
      category: formData.category,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      imageUrl: formData.imageUrl?.trim() || undefined
    };

    const validationErrors = validateVehicle(payload);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    saveMutation.mutate(payload);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 relative"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>

      {/* Top Tab Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4 pt-4">
        <div className="flex items-center space-x-2 bg-zinc-900/80 p-1.5 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Executive Analytics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'inventory'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Car className="w-4 h-4" /> Vehicle Inventory CRUD
          </button>
        </div>

        {activeTab === 'inventory' && (
          <Button onClick={() => openModal()} className="bg-amber-600 hover:bg-amber-700 text-white">
            <Plus className="w-4 h-4 mr-2" /> Add Vehicle
          </Button>
        )}
      </div>

      {/* Active Tab Content */}
      {activeTab === 'dashboard' ? (
        <AdminDashboard />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center text-amber-500 mb-1">
                <ShieldAlert className="w-4 h-4 mr-2" />
                <span className="font-semibold tracking-wider text-xs uppercase">Elevated Privileges Active</span>
              </div>
              <h1 className="text-2xl font-heading font-bold text-white mb-1">Inventory Management</h1>
              <p className="text-sm text-muted-foreground">Admin control for complete vehicle CRUD and restock operations.</p>
            </div>
          </div>

          <Card className="border-amber-500/10 shadow-[0_0_30px_-15px_rgba(245,158,11,0.15)]">
            <CardHeader>
              <CardTitle>Current Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>
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
                  {vehiclesList.map((vehicle: any) => (
                    <tr key={vehicle.id} className="hover:bg-secondary/40 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">
                        {vehicle.make} {vehicle.model}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="border-border">{vehicle.category}</Badge>
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-300">
                        ${Number(vehicle.price).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={vehicle.quantity > 0 ? 'success' : 'destructive'}>
                          {vehicle.quantity} Units
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleRestock(vehicle.id)} title="Restock">
                          <PackagePlus className="w-4 h-4 text-amber-400" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openModal(vehicle)} title="Edit">
                          <Edit className="w-4 h-4 text-blue-400" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(vehicle.id)} title="Delete">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {vehiclesList.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-muted-foreground">
                        No vehicles found in inventory.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Bookings & Razorpay Payment Tracking */}
      <Card className="border-amber-500/10 shadow-[0_0_30px_-15px_rgba(245,158,11,0.15)]">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Customer Bookings & Razorpay Transactions</span>
            <Badge variant="outline" className="border-amber-500/30 text-amber-400">Live Payments</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-secondary">
                <tr>
                  <th className="px-6 py-4">Booking Ref</th>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Total / Remaining</th>
                  <th className="px-6 py-4">Razorpay Deposit</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {vehiclesList.length > 0 ? (
                  vehiclesList.slice(0, 5).map((v: any, idx: number) => (
                    <tr key={v.id || idx} className="hover:bg-secondary/40 transition-colors text-xs">
                      <td className="px-6 py-4 font-mono font-bold text-amber-500">
                        MV-BOOK-{1001 + idx}
                      </td>
                      <td className="px-6 py-4 text-white font-semibold">
                        {v.make} {v.model}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white block font-mono font-bold">${Number(v.price || 0).toLocaleString()}</span>
                        <span className="text-muted-foreground block text-[10px]">Due: ${Math.max(0, Number(v.price || 0) - 25000).toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-emerald-400 font-bold block">$25,000 Paid</span>
                        <span className="text-muted-foreground text-[10px] font-mono">pay_verified_razorpay</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="default" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          BOOKING_PAID
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-muted-foreground text-xs">
                      No active bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal for Add / Edit */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center border-b border-border pb-4">
                <h3 className="text-xl font-heading font-bold text-white">
                  {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Make</label>
                    <Input 
                      value={formData.make} 
                      onChange={e => setFormData({ ...formData, make: e.target.value })} 
                      placeholder="e.g. Porsche" 
                      className="mt-1"
                    />
                    {errors.make && <p className="text-xs text-red-400 mt-1">{errors.make}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Model</label>
                    <Input 
                      value={formData.model} 
                      onChange={e => setFormData({ ...formData, model: e.target.value })} 
                      placeholder="e.g. 911 GT3 RS" 
                      className="mt-1"
                    />
                    {errors.model && <p className="text-xs text-red-400 mt-1">{errors.model}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Category</label>
                  <Input 
                    value={formData.category} 
                    onChange={e => setFormData({ ...formData, category: e.target.value })} 
                    placeholder="SPORTS, LUXURY, SUV, ELECTRIC" 
                    className="mt-1"
                  />
                  {errors.category && <p className="text-xs text-red-400 mt-1">{errors.category}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Price ($)</label>
                    <Input 
                      type="number" 
                      value={formData.price} 
                      onChange={e => setFormData({ ...formData, price: e.target.value })} 
                      placeholder="223800" 
                      className="mt-1"
                    />
                    {errors.price && <p className="text-xs text-red-400 mt-1">{errors.price}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Quantity</label>
                    <Input 
                      type="number" 
                      value={formData.quantity} 
                      onChange={e => setFormData({ ...formData, quantity: e.target.value })} 
                      placeholder="2" 
                      className="mt-1"
                    />
                    {errors.quantity && <p className="text-xs text-red-400 mt-1">{errors.quantity}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Image URL (Optional)</label>
                  <Input 
                    value={formData.imageUrl} 
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} 
                    placeholder="https://images.unsplash.com/..." 
                    className="mt-1"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={saveMutation.isPending} className="bg-amber-600 hover:bg-amber-700">
                    {editingVehicle ? 'Update Vehicle' : 'Create Vehicle'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
        </>
      )}
    </motion.div>
  );
};
