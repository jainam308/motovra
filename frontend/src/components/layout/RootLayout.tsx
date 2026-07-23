import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

export const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main 
          className="flex-1 container mx-auto px-4 py-8 max-w-7xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />
    </div>
  );
};
