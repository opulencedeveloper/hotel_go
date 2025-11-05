'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import logoImage from '@/assets/logo/logo.png';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string, closeMenu: boolean = false) => {
    e.preventDefault();
    
    // Close mobile menu if open
    if (closeMenu) {
      setMobileMenuOpen(false);
    }
    
    // Check if we're on the home page
    if (pathname === '/') {
      // On home page - scroll smoothly
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Not on home page - navigate to home with hash
      // Store the section ID to scroll to after navigation
      sessionStorage.setItem('scrollToSection', sectionId);
      router.push('/');
      
      // Also set hash in URL for browser fallback
      window.location.hash = sectionId;
    }
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 w-full bg-white/80 backdrop-blur-2xl z-[10000] border-b border-gray-200/50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >

            <div className='h-10 w-max'>
            <Image 
              src={logoImage} 
              alt="HotelGO Logo" 
              width={40} 
              height={40} 
              className="h-full w-full"
            />
            </div>
          </motion.div>
          {/* <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Image 
              src={logoImage} 
              alt="HotelGO Logo" 
              width={40} 
              height={40} 
              className="h-full w-full"
            />
            <span className="text-2xl font-semibold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent tracking-tight">
              HotelGO
            </span>
          </motion.div> */}
          <div className="hidden md:flex items-center space-x-8">
            <motion.a 
              href="#features" 
              onClick={(e) => handleSectionClick(e, 'features')}
              className="text-gray-700 hover:text-primary-600 font-medium cursor-pointer"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Features
            </motion.a>
            <motion.a 
              href="#pricing" 
              onClick={(e) => handleSectionClick(e, 'pricing')}
              className="text-gray-700 hover:text-primary-600 font-medium cursor-pointer"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Pricing
            </motion.a>
            <motion.a 
              href="#testimonials" 
              onClick={(e) => handleSectionClick(e, 'testimonials')}
              className="text-gray-700 hover:text-primary-600 font-medium cursor-pointer"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Testimonials
            </motion.a>
            <motion.button 
              onClick={() => router.push('/login')}
              className="px-6 py-2 text-gray-700 bg-transparent border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Sign In
            </motion.button>
            <motion.button 
              onClick={() => router.push('/register')}
              className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-lg hover:from-primary-700 hover:to-primary-900 shadow-lg font-medium"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-primary-600 rounded-lg transition-colors"
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile menu overlay - Rendered via Portal to escape stacking context */}
      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden"
                style={{ position: 'fixed', zIndex: 10010 }}
                onClick={() => setMobileMenuOpen(false)}
              />

              {/* Mobile menu panel */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl md:hidden overflow-y-auto"
                style={{ position: 'fixed', zIndex: 10020 }}
              >
                <div className="flex flex-col h-full">
                  {/* Mobile menu header */}
                  <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-max">
                        <Image 
                          src={logoImage} 
                          alt="HotelGO Logo" 
                          width={40} 
                          height={40} 
                          className="h-full w-full"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 text-gray-700 hover:text-primary-600 rounded-lg transition-colors"
                      aria-label="Close mobile menu"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Mobile menu items */}
                  <nav className="flex-1 px-6 py-8 space-y-4">
                    <motion.a
                      href="#features"
                      onClick={(e) => handleSectionClick(e, 'features', true)}
                      className="block py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors border-b border-gray-100"
                      whileTap={{ scale: 0.98 }}
                    >
                      Features
                    </motion.a>
                    <motion.a
                      href="#pricing"
                      onClick={(e) => handleSectionClick(e, 'pricing', true)}
                      className="block py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors border-b border-gray-100"
                      whileTap={{ scale: 0.98 }}
                    >
                      Pricing
                    </motion.a>
                    <motion.a
                      href="#testimonials"
                      onClick={(e) => handleSectionClick(e, 'testimonials', true)}
                      className="block py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors border-b border-gray-100"
                      whileTap={{ scale: 0.98 }}
                    >
                      Testimonials
                    </motion.a>

                    {/* Mobile CTA buttons */}
                    <div className="pt-6 space-y-3">
                      <motion.button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          router.push('/login');
                        }}
                        className="w-full px-6 py-3 text-gray-700 bg-transparent border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 font-medium transition-colors"
                        whileTap={{ scale: 0.98 }}
                      >
                        Sign In
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          router.push('/register');
                        }}
                        className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-lg hover:from-primary-700 hover:to-primary-900 shadow-lg font-medium transition-colors"
                        whileTap={{ scale: 0.98 }}
                      >
                        Get Started
                      </motion.button>
                    </div>
                  </nav>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.nav>
  );
}

