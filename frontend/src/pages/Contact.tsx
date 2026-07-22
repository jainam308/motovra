import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('Your message has been sent to our concierge team.');
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
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
            <form onSubmit={handleSubmit} className="bg-card border border-border p-8 rounded-2xl space-y-6">
              <h2 className="text-2xl font-heading font-bold text-white mb-6">Send an Inquiry</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Full Name</label>
                <Input 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email Address</label>
                <Input 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Message</label>
                <textarea 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full min-h-[150px] flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                  placeholder="How can we assist you today?"
                ></textarea>
              </div>

              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
