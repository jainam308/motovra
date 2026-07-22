import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Loader2, Plus, Edit, Trash2, PackagePlus, X, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

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
      quantity: parseInt(formData.quantity, 10),
      ...(formData.imageUrl ? { imageUrl: formData.imageUrl } : {})
    };

    const validationErrors = validateVehicle(payload);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    saveMutation.mutate(payload);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 relative"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>

      <div className="flex justify-between items-center pt-4">
        <div>
          <div className="flex items-center text-amber-500 mb-2">
            <ShieldAlert className="w-5 h-5 mr-2" />
            <span className="font-semibold tracking-wider text-xs uppercase">Elevated Privileges Active</span>
          </div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Inventory Management</h1>
          <p className="text-muted-foreground">Admin dashboard for complete CRUD control.</p>
        </div>
        <Button onClick={() => openModal()} className="bg-amber-600 hover:bg-amber-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Vehicle
        </Button>
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
                        <Button variant="ghost" size="icon" onClick={() => openModal(vehicle)} title="Edit">
                          <Edit className="w-4 h-4 text-blue-400" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(vehicle.id)} title="Delete">
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

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              role="dialog"
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-card border border-amber-500/30 rounded-xl shadow-2xl p-6 z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-heading font-bold text-white">
                  {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                  <X className="w-5 h-5 text-muted-foreground" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Make</label>
                    <Input 
                      value={formData.make}
                      onChange={(e) => setFormData({...formData, make: e.target.value})}
                      error={!!errors.make}
                    />
                    {errors.make && <p className="text-xs text-destructive">{errors.make}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Model</label>
                    <Input 
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                      error={!!errors.model}
                    />
                    {errors.model && <p className="text-xs text-destructive">{errors.model}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className={`w-full h-10 rounded-md border bg-secondary px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.category ? 'border-destructive' : 'border-border'
                    }`}
                  >
                    <option value="" disabled>Select a category...</option>
                    <option value="SPORTS">🏎️ Sports</option>
                    <option value="LUXURY">👑 Luxury</option>
                    <option value="SUV">🚙 SUV</option>
                    <option value="ELECTRIC">⚡ Electric</option>
                    <option value="SEDAN">🚗 Sedan</option>
                    <option value="CONVERTIBLE">🌞 Convertible</option>
                    <option value="TRUCK">🛻 Truck</option>
                  </select>
                  {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Price ($)</label>
                    <Input 
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      error={!!errors.price}
                    />
                    {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Quantity</label>
                    <Input 
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      error={!!errors.quantity}
                    />
                    {errors.quantity && <p className="text-xs text-destructive">{errors.quantity}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Image URL (Optional)</label>
                  <Input 
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="pt-4 flex justify-end space-x-3">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white" isLoading={saveMutation.isPending}>
                    Save Vehicle
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
