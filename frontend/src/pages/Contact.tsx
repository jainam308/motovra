import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { MapPin, Phone, Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) errs.email = 'Invalid email address';
    if (!formData.subject.trim()) errs.subject = 'Subject is required';
    if (!formData.message.trim()) errs.message = 'Message is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await api.post('/contact', formData);
      toast.success('Your message has been sent to our concierge team!');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Contact Us</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience world-class service. Our automotive concierge team is available 24/7 to assist you with inquiries, test drives, and acquisitions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-card border border-border p-8 rounded-2xl">
              <h2 className="text-2xl font-heading font-bold text-white mb-6">Global Offices</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-primary mt-1 mr-4" />
                  <div>
                    <h3 className="font-bold text-white">Beverly Hills</h3>
                    <p className="text-gray-400 text-sm">Rodeo Drive, CA 90210<br/>United States</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-primary mt-1 mr-4" />
                  <div>
                    <h3 className="font-bold text-white">Monaco</h3>
                    <p className="text-gray-400 text-sm">Monte Carlo, 98000<br/>Principality of Monaco</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-primary mt-1 mr-4" />
                  <div>
                    <h3 className="font-bold text-white">Dubai</h3>
                    <p className="text-gray-400 text-sm">Sheikh Zayed Road<br/>United Arab Emirates</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-border space-y-4">
                <div className="flex items-center text-gray-300">
                  <Phone className="w-5 h-5 mr-3 text-primary" />
                  +1 (800) 555-LUXE
                </div>
                <div className="flex items-center text-gray-300">
                  <Mail className="w-5 h-5 mr-3 text-primary" />
                  concierge@motovra.com
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="bg-card border border-border p-8 rounded-2xl space-y-5">
              <h2 className="text-2xl font-heading font-bold text-white mb-4">Send an Inquiry</h2>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Full Name</label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe" 
                  error={!!errors.name}
                />
                {errors.name && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.name}</p>}
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Email Address</label>
                <Input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com" 
                  error={!!errors.email}
                />
                {errors.email && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Subject</label>
                <Input 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="e.g. Vehicle Customization or Acquisition Query" 
                  error={!!errors.subject}
                />
                {errors.subject && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.subject}</p>}
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Message</label>
                <textarea 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full min-h-[130px] flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y text-white"
                  placeholder="How can we assist you today?"
                ></textarea>
                {errors.message && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.message}</p>}
              </div>

              <Button type="submit" className="w-full py-5 font-bold" isLoading={isSubmitting}>
                <Send className="w-4 h-4 mr-2" />
                Send Inquiry
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
