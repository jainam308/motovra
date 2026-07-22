import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-heading font-bold text-white tracking-tighter">
              MOTOVRA<span className="text-primary">.</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              The world's most exclusive marketplace for ultra-luxury and high-performance vehicles. Redefining automotive excellence.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-white font-heading font-semibold">Showroom</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/showroom?category=SPORTS" className="hover:text-primary transition-colors">Sports & Exotic</Link></li>
              <li><Link to="/showroom?category=LUXURY" className="hover:text-primary transition-colors">Ultra Luxury</Link></li>
              <li><Link to="/showroom?category=SUV" className="hover:text-primary transition-colors">Performance SUVs</Link></li>
              <li><Link to="/showroom?category=ELECTRIC" className="hover:text-primary transition-colors">Electric</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-heading font-semibold">Concierge</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="#" className="hover:text-primary transition-colors">Private Viewing</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Financing & Lease</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Trade-In Valuation</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Global Delivery</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-white font-heading font-semibold">Stay Informed</h4>
            <p className="text-muted-foreground text-sm">Join our private list for exclusive inventory alerts.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-card border border-border px-4 py-2 text-sm w-full rounded-l-md focus:outline-none focus:border-primary"
              />
              <button className="bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold rounded-r-md hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Motovra Exotics. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs text-muted-foreground">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
