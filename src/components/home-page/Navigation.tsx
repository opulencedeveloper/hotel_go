'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import logoImage from '@/assets/logo/logo.jpeg';

export default function Navigation() {
  const router = useRouter();

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 w-full bg-white/80 backdrop-blur-2xl z-50 border-b border-gray-200/50 shadow-sm"
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
              className="text-gray-700 hover:text-primary-600 font-medium"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Features
            </motion.a>
            <motion.a 
              href="#pricing" 
              className="text-gray-700 hover:text-primary-600 font-medium"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Pricing
            </motion.a>
            <motion.a 
              href="#testimonials" 
              className="text-gray-700 hover:text-primary-600 font-medium"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Testimonials
            </motion.a>
            <motion.button 
              onClick={() => router.push('/login')}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-lg font-medium"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
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
        </div>
      </div>
    </motion.nav>
  );
}

