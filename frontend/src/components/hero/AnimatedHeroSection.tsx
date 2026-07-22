import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowRight, Shield, Car, Tag, Headphones, ChevronDown } from 'lucide-react';

export const AnimatedHeroSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative w-full h-[92vh] min-h-[700px] max-h-[960px] overflow-hidden bg-[#06070a] select-none text-white">
      
      {/* 🌇 Layer 1: Unified Widescreen Cinematic Supercar Highway Sunset Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          initial={shouldReduceMotion ? { scale: 1 } : { scale: 1.08, opacity: 0.85 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=2400"
          alt="Motovra Luxury Supercar Highway Sunset"
          className="w-full h-full object-cover object-center"
        />
        
        {/* Subtle Atmospheric Gradient Overlays for Perfect Contrast & Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06070a] via-transparent to-[#06070a]/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#06070a]/30 to-[#06070a]/95" />
        
        {/* Ambient Warm Sunset Light Flare */}
        <div className="absolute top-[25%] right-[30%] w-[450px] h-[450px] bg-amber-500/15 blur-[120px] rounded-full pointer-events-none" />
      </div>

      {/* 🛣️ Layer 2: Animated Perspective Highway Lane Markings */}
      <div className="absolute bottom-0 left-0 right-0 h-[45%] z-10 overflow-hidden pointer-events-none">
        <div className="relative w-full h-full flex justify-center items-end">
          
          {/* Animated Moving Lane Markings */}
          <div className="w-full h-full relative overflow-hidden opacity-75">
            <div className="absolute inset-0 flex flex-col justify-end items-center pb-8">
              {!shouldReduceMotion && (
                <style>{`
                  @keyframes laneMove {
                    0% { transform: translateY(-120%) scaleX(0.4); opacity: 0.1; }
                    50% { opacity: 0.95; }
                    100% { transform: translateY(220%) scaleX(2.2); opacity: 0; }
                  }
                  .animate-lane-dash {
                    animation: laneMove 1.1s infinite linear;
                  }
                  .animate-lane-dash-delayed {
                    animation: laneMove 1.1s infinite linear 0.55s;
                  }
                  @keyframes speedLine {
                    0% { transform: translateX(-100%); opacity: 0; }
                    50% { opacity: 0.7; }
                    100% { transform: translateX(200%); opacity: 0; }
                  }
                  .animate-speed-line {
                    animation: speedLine 0.85s infinite linear;
                  }
                `}</style>
              )}
              
              {/* Center Dashed Lane Marker */}
              <div className="w-full h-full relative flex justify-center">
                <div className="w-1.5 md:w-2.5 bg-gradient-to-b from-white/10 via-amber-400/90 to-transparent h-28 rounded-full animate-lane-dash shadow-[0_0_15px_rgba(245,158,11,0.8)]" />
                <div className="w-1.5 md:w-2.5 bg-gradient-to-b from-white/10 via-amber-400/90 to-transparent h-28 rounded-full animate-lane-dash-delayed shadow-[0_0_15px_rgba(245,158,11,0.8)]" />
              </div>

              {/* Wet Asphalt Reflection Speed Lines */}
              <div className="absolute bottom-6 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent animate-speed-line" />
            </div>
          </div>
        </div>
      </div>

      {/* 📝 Layer 3: Floating Text & Call To Action Overlay */}
      <div className="relative z-30 container mx-auto px-4 md:px-8 h-full flex flex-col justify-between py-10 md:py-14">
        
        {/* Right-Aligned Headline & CTA Container */}
        <div className="flex-1 flex flex-col justify-center items-end text-right ml-auto max-w-xl lg:max-w-2xl pt-10 md:pt-4">
          
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: shouldReduceMotion ? 0 : 0.4 }}
            className="flex items-center space-x-2 space-x-reverse mb-3"
          >
            <span className="w-10 h-[2px] bg-primary rounded-full" />
            <span className="text-xs md:text-sm font-bold tracking-[0.2em] text-primary uppercase">
              DRIVE YOUR DREAM
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: shouldReduceMotion ? 0 : 0.6 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-heading font-extrabold text-white tracking-tight leading-[1.08] mb-5"
          >
            Find. Drive. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-400 to-amber-200">
              Own
            </span>{' '}
            with Motovra.
          </motion.h1>

          {/* Subtitle Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: shouldReduceMotion ? 0 : 0.8 }}
            className="text-base sm:text-lg text-gray-200 font-light leading-relaxed mb-8 max-w-lg drop-shadow-md"
          >
            Explore a premium collection of cars from trusted sellers. Buy your perfect ride with confidence.
          </motion.p>

          {/* Action CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: shouldReduceMotion ? 0 : 1.0 }}
            className="flex flex-wrap items-center justify-end gap-4"
          >
            <Link to="/showroom">
              <Button
                size="lg"
                className="h-13 px-8 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_35px_-5px_rgba(229,169,16,0.6)] transition-all duration-300 hover:scale-105 pointer-events-auto"
              >
                Explore Vehicles
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="h-13 px-8 text-base font-medium backdrop-blur-md bg-white/10 border-white/30 hover:bg-white/20 text-white transition-all duration-300 pointer-events-auto shadow-lg"
              >
                Sell Your Car
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* 🛡️ Layer 4: Glassmorphism Bottom Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: shouldReduceMotion ? 0 : 1.2 }}
          className="w-full max-w-6xl mx-auto mt-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 md:p-6 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            
            <div className="flex items-center space-x-3.5 p-2">
              <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary flex-shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-white">Trusted & Secure</h4>
                <p className="text-xs text-gray-300">Verified sellers & transactions</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 p-2">
              <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary flex-shrink-0">
                <Car className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-white">Wide Selection</h4>
                <p className="text-xs text-gray-300">Explore thousands of cars in one place</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 p-2">
              <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary flex-shrink-0">
                <Tag className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-white">Best Prices</h4>
                <p className="text-xs text-gray-300">Competitive prices guaranteed</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 p-2">
              <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary flex-shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-white">24/7 Support</h4>
                <p className="text-xs text-gray-300">We're here to help anytime</p>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="hidden md:flex justify-center pt-1">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>

      </div>
    </section>
  );
};
