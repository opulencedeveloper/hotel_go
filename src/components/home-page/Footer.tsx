'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import logoImage from '@/assets/logo/app-icon.png';

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    
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

  return (
    <motion.footer 
      className="bg-gray-900 text-gray-400 py-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1.5">
                <Image 
                  src={logoImage} 
                  alt="HotelGO Logo" 
                  width={40} 
                  height={40} 
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-semibold text-white tracking-tight">HotelGO</span>
            </div>
            <p className="text-sm">Premium hotel management system for the modern hospitality industry.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="#features" 
                  onClick={(e) => handleSectionClick(e, 'features')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Features
                </a>
              </li>
              <li>
                <a 
                  href="#pricing" 
                  onClick={(e) => handleSectionClick(e, 'pricing')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms-of-use" className="hover:text-white transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="mailto:support@hotelgo.pro" 
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  Contact Us
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>©️2025 SWAD Digital Solutions Ltd</p>
        </div>
      </div>
    </motion.footer>
  );
}

