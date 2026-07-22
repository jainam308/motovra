import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Globe, ChevronRight, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getVehicleImage } from '../utils/imageMapper';
import { AnimatedHeroSection } from '../components/hero/AnimatedHeroSection';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export const Home = () => {
  const [activeCategory, setActiveCategory] = useState('ALL');

  const featuredVehicles = [
    { title: 'Porsche 911 GT3 RS', make: 'Porsche', model: '911', category: 'SPORTS', price: '$223,800', hp: '518 HP', topSpeed: '184 mph' },
    { title: 'Ferrari SF90 Stradale', make: 'Ferrari', model: 'SF90', category: 'SPORTS', price: '$524,000', hp: '986 HP', topSpeed: '211 mph' },
    { title: 'Lamborghini Urus Performante', make: 'Lamborghini', model: 'Urus', category: 'SUV', price: '$260,000', hp: '657 HP', topSpeed: '190 mph' },
    { title: 'Aston Martin DBS Superleggera', make: 'Aston Martin', model: 'DBS', category: 'SPORTS', price: '$330,000', hp: '715 HP', topSpeed: '211 mph' },
    { title: 'Rolls-Royce Phantom', make: 'Rolls-Royce', model: 'Phantom', category: 'LUXURY', price: '$460,000', hp: '563 HP', topSpeed: '155 mph' },
    { title: 'McLaren 765LT', make: 'McLaren', model: '765LT', category: 'SPORTS', price: '$382,500', hp: '755 HP', topSpeed: '205 mph' },
  ];

  const filteredVehicles = activeCategory === 'ALL'
    ? featuredVehicles
    : featuredVehicles.filter(v => v.category === activeCategory);

  return (
    <div className="-mt-8 -mx-4 md:-mx-8 bg-background">
      
      {/* 🏎️ Animated Framer Motion Highway Hero */}
      <AnimatedHeroSection />

      {/* 🌟 Featured Marques Section */}
      <section className="py-24 px-4 md:px-8 border-b border-border/50">
        <div className="container mx-auto max-w-7xl space-y-12">
          
          {/* Section Header & Filter Tabs */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold tracking-widest text-primary uppercase">Curated Collection</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white">Featured Marques</h2>
              <p className="text-muted-foreground mt-1">Discover our most sought-after flagship hypercars and luxury sedans.</p>
            </div>

            {/* Category Pill Filters */}
            <div className="flex flex-wrap gap-2">
              {['ALL', 'SPORTS', 'LUXURY', 'SUV'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-primary text-black shadow-[0_0_20px_rgba(229,169,16,0.4)]'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Widescreen Vehicle Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {filteredVehicles.map((car) => (
                <motion.div
                  key={car.title}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to="/showroom">
                    <div className="group relative rounded-2xl overflow-hidden bg-card border border-border/80 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_15px_40px_-15px_rgba(229,169,16,0.2)]">
                      {/* Image Container with 16:9 Widescreen Ratio */}
                      <div className="aspect-[16/10] bg-secondary relative overflow-hidden">
                        <img
                          src={getVehicleImage(car.make, car.model)}
                          alt={car.title}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />

                        {/* Top Badges */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
                          <Badge variant="secondary" className="backdrop-blur-md bg-black/60 text-xs border border-white/10 text-white font-semibold">
                            {car.category}
                          </Badge>
                          <span className="text-xs font-mono text-gray-300 backdrop-blur-md bg-black/60 px-2.5 py-1 rounded-full border border-white/10">
                            {car.hp}
                          </span>
                        </div>
                      </div>

                      {/* Card Info Box */}
                      <div className="p-6 space-y-3 relative z-20 -mt-6 pt-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-2xl font-heading font-bold text-white group-hover:text-primary transition-colors">
                            {car.title}
                          </h3>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-white/10">
                          <span className="text-2xl font-bold font-mono text-primary">{car.price}</span>
                          <span className="text-xs text-muted-foreground font-semibold flex items-center group-hover:translate-x-1 transition-transform">
                            Details <ChevronRight className="w-4 h-4 ml-0.5 text-primary" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* View Full Showroom Callout */}
          <div className="text-center pt-6">
            <Link to="/showroom">
              <Button size="lg" variant="outline" className="h-13 px-8 text-base border-white/20 hover:bg-white/10">
                Explore Entire Showroom Inventory ({15} Vehicles)
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* 👑 The Motovra Distinction / Why Choose Us */}
      <section className="py-24 px-4 md:px-8 bg-secondary/20 border-b border-border/50">
        <div className="container mx-auto max-w-7xl">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold tracking-widest text-primary uppercase">THE MOTOVRA STANDARD</span>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white">Uncompromising Luxury Acquisition</h2>
            <p className="text-muted-foreground text-base md:text-lg">
              We eliminate every point of friction between wanting a luxury machine and holding the keys in your hands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-300 space-y-4 relative group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white">200-Point Inspection</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Every vehicle undergoes rigorous mechanical, structural, and aesthetic authentication by certified marque technicians.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-gray-300">
                <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-2 text-primary" /> Verified Title & History</li>
                <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-2 text-primary" /> Multi-Point Powertrain Dyno</li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-300 space-y-4 relative group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white">Enclosed Global Delivery</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Climate-controlled, fully insured white-glove transportation directly to your residence anywhere across the globe.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-gray-300">
                <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-2 text-primary" /> GPS Real-Time Carrier Tracking</li>
                <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-2 text-primary" /> Zero Mileage Enclosed Transport</li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-300 space-y-4 relative group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white">Frictionless Settlement</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Seamless digital acquisition supporting wire transfers, crypto payments, or custom tailored multi-year financing.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-gray-300">
                <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-2 text-primary" /> Instant Smart Contract Transfer</li>
                <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-2 text-primary" /> Dedicated Concierge Specialist</li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 🚀 Ready to Drive Callout Banner */}
      <section className="py-20 px-4 md:px-8 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10 p-12 md:p-16 rounded-3xl bg-gradient-to-r from-primary/20 via-card to-card border border-primary/30 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white">Ready to Elevate Your Drive?</h2>
            <p className="text-gray-300 text-base">Browse our verified inventory or contact our concierge to source custom hypercars.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/showroom">
              <Button size="lg" className="h-13 px-8 text-base font-bold bg-primary text-black hover:bg-primary/90">
                Browse Showroom Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="h-13 px-8 text-base border-white/30 text-white hover:bg-white/10">
                Sell Your Vehicle
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
