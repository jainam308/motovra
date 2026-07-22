import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ShieldCheck, Zap, Globe, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getVehicleImage } from '../utils/imageMapper';

export const Home = () => {
  return (
    <div className="-mt-8 -mx-4 md:-mx-8"> {/* Negative margin to offset RootLayout container padding for full width sections */}
      
      {/* Cinematic Hero */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxury Car Hero" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center space-y-8 px-4 max-w-4xl mx-auto mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-heading font-bold text-white tracking-tighter"
          >
            The Apex of <span className="text-primary italic">Performance.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto font-light"
          >
            Curated ultra-luxury and exotic vehicles for the most discerning drivers. 
            Acquire your dream machine today.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link to="/showroom">
              <Button size="lg" className="h-14 px-8 text-lg font-semibold shadow-[0_0_40px_-10px_rgba(229,169,16,0.5)]">
                Explore Inventory
              </Button>
            </Link>
            <Link to="/showroom?category=ELECTRIC">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg backdrop-blur-md bg-white/5 border-white/20 hover:bg-white/10">
                View Electric
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Marquee / Categories */}
      <section className="py-24 bg-background px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-end mb-12 border-b border-border pb-6">
            <div>
              <h2 className="text-3xl font-heading font-bold text-white mb-2">Featured Marques</h2>
              <p className="text-muted-foreground">Discover our most sought-after collections.</p>
            </div>
            <Link to="/showroom" className="text-primary hover:text-primary/80 flex items-center text-sm font-semibold uppercase tracking-wider">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Porsche 911 GT3 RS', make: 'Porsche', model: '911', price: '$223,800' },
              { title: 'Ferrari SF90', make: 'Ferrari', model: 'SF90', price: '$524,000' },
              { title: 'Rolls-Royce Phantom', make: 'Rolls-Royce', model: 'Phantom', price: '$460,000' }
            ].map((car, i) => (
              <Link to="/showroom" key={i}>
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-secondary border border-border"
                >
                  <img src={getVehicleImage(car.make, car.model)} alt={car.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <h3 className="text-2xl font-heading font-bold text-white mb-1">{car.title}</h3>
                    <p className="text-primary font-semibold">{car.price}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Motovra */}
      <section className="py-24 bg-secondary/30 border-t border-b border-border px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">The Motovra Standard</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We don't just sell cars; we provide an uncompromised acquisition experience tailored to your lifestyle.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white">Verified Provenance</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Every vehicle undergoes a rigorous 200-point inspection and provenance verification by our master technicians.</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white">White-Glove Delivery</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Secure, enclosed transport delivery anywhere in the world, straight to your garage door.</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white">Frictionless Checkout</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Crypto, wire transfer, or tailored financing. Complete your multi-million dollar acquisition in minutes.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
