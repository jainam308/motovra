import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Compass } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full bg-card border border-border rounded-2xl p-12 text-center space-y-6 shadow-2xl backdrop-blur-xl"
      >
        <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 mx-auto flex items-center justify-center text-primary">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>

        <div className="space-y-3">
          <span className="text-xs font-semibold tracking-widest text-primary uppercase">Off-Road Destination</span>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white">404 - Page Not Found</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The luxury route you are trying to reach does not exist or has been relocated.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/showroom">
            <Button className="w-full sm:w-auto px-8">
              Return to Showroom
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="w-full sm:w-auto px-8 border-border">
              Go Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
