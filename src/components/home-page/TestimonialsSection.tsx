'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  hotel: string;
  image: string;
  rating: number;
  text: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section id="testimonials" className="py-32 bg-gradient-to-b from-gray-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-6">
            <span className="text-5xl md:text-6xl lg:text-7xl font-semibold text-primary-600 block mb-3 tracking-tight">
              Loved by Hoteliers
            </span>
            <span className="text-2xl md:text-3xl text-gray-700 font-light tracking-wide block">
              Worldwide
            </span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
            See what hotel owners and managers are saying about HotelGO
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <motion.div 
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 md:p-12 overflow-hidden border border-gray-100/50"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx === activeTestimonial ? 0 : 50 }}
                animate={{ 
                  opacity: idx === activeTestimonial ? 1 : 0,
                  x: idx === activeTestimonial ? 0 : 50,
                  display: idx === activeTestimonial ? 'block' : 'none'
                }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="flex items-center mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: idx === activeTestimonial ? 1 : 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div 
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-600 to-primary-800 flex items-center justify-center text-white text-xl font-bold mr-4"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {testimonial.image}
                  </motion.div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-primary-600">{testimonial.hotel}</div>
                  </div>
                  <div className="ml-auto flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: idx === activeTestimonial ? 1 : 0 }}
                        transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                      >
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                <motion.p 
                  className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light italic"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: idx === activeTestimonial ? 1 : 0, y: idx === activeTestimonial ? 0 : 20 }}
                  transition={{ delay: 0.4 }}
                >
                  "{testimonial.text}"
                </motion.p>
              </motion.div>
            ))}
            
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === activeTestimonial ? 'bg-primary-600 w-8' : 'bg-gray-300 w-2'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{ 
                    width: idx === activeTestimonial ? 32 : 8,
                    backgroundColor: idx === activeTestimonial ? 'rgb(37, 99, 235)' : 'rgb(209, 213, 219)'
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

