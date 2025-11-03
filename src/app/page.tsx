'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Bed, 
  Sparkles, 
  Shield, 
  TrendingUp, 
  Users, 
  Star, 
  Check, 
  ArrowRight,
  Zap,
  Globe,
  Lock,
  BarChart3,
  Calendar,
  CreditCard,
  Clock
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Bed className="w-8 h-8" />,
      title: 'Room Management',
      description: 'Seamlessly manage room inventory, availability, and status in real-time.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Reservations',
      description: 'Handle bookings, check-ins, and check-outs with an intuitive interface.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Analytics Dashboard',
      description: 'Make data-driven decisions with comprehensive reporting and insights.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: 'Payment Processing',
      description: 'Secure payment handling with multiple payment methods and invoicing.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Guest Management',
      description: 'Complete CRM for guest profiles, preferences, and communication history.',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and role-based access control for your team.',
      color: 'from-indigo-500 to-indigo-600'
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'General Manager',
      hotel: 'The Grand Plaza Hotel',
      image: 'SJ',
      rating: 5,
      text: 'HotelGO transformed our operations. We\'ve seen a 40% increase in efficiency and guest satisfaction has never been higher.'
    },
    {
      name: 'Michael Chen',
      role: 'Operations Director',
      hotel: 'Oceanview Resorts',
      image: 'MC',
      rating: 5,
      text: 'The analytics alone are worth the investment. We can now predict demand and optimize pricing in real-time.'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Hotel Owner',
      hotel: 'Boutique Collection',
      image: 'ER',
      rating: 5,
      text: 'Managing multiple properties was a nightmare until HotelGO. Everything is now centralized and streamlined.'
    },
  ];

  const pricingPlans = [
    {
      name: 'Basic',
      price: { quarterly: 300, yearly: 1000 },
      rooms: 'Up to 20 rooms',
      multiProperty: false,
      features: [
        'Room management',
        'Reservation system',
        'Basic analytics',
        'Payment processing',
        'Email support',
      ],
      popular: false,
      color: 'from-gray-500 to-gray-600'
    },
    {
      name: 'Gold',
      price: { quarterly: 450, yearly: 1500 },
      rooms: '21-50 rooms',
      multiProperty: false,
      features: [
        'Everything in Basic',
        'Advanced analytics',
        'Guest CRM',
        'Priority support',
        'Custom reporting',
      ],
      popular: true,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      name: 'Platinum',
      price: { quarterly: 750, yearly: 2500 },
      rooms: '51+ rooms',
      multiProperty: true,
      features: [
        'Everything in Gold',
        'Multi-property management',
        'Dedicated account manager',
        '24/7 phone support',
        'API access',
        'Custom integrations',
      ],
      popular: false,
      color: 'from-slate-500 to-slate-700'
    },
    {
      name: 'Enterprise',
      price: null,
      rooms: 'Unlimited',
      multiProperty: true,
      features: [
        'Everything in Platinum',
        'Fully customized solution',
        'On-site training',
        'White-label options',
        'Dedicated support team',
        'Custom development',
      ],
      popular: false,
      color: 'from-primary-600 to-primary-800'
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="fixed top-0 w-full bg-white/80 backdrop-blur-2xl z-50 border-b border-gray-200/50 shadow-sm"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="p-2 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg">
                  <Bed className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-semibold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent tracking-tight">
                  HotelGO
                </span>
              </motion.div>
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

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20">
          {/* Background Image */}
          <motion.div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)'
            }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/30 via-transparent to-primary-900/30"></div>
          </motion.div>
          
          <motion.div 
            className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-20"
            style={{ opacity }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
      <div className="text-center">
              <motion.div 
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-12 border border-white/30 shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">Trusted by 500+ hotels worldwide</span>
              </motion.div>
              
              <motion.h1 
                className="mb-8 leading-[1.1]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <motion.span 
                  className="text-5xl md:text-7xl lg:text-8xl font-semibold text-white block mb-4 tracking-tight"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Elevate Your Hotel
                </motion.span>
                <motion.span 
                  className="text-3xl md:text-5xl lg:text-6xl text-white/90 font-light tracking-wide block"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  Operations to New Heights
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                The all-in-one platform designed for modern hospitality. Manage every aspect of your hotel with elegance and efficiency.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <motion.button 
                  onClick={() => router.push('/register')}
                  className="group px-8 py-4 bg-white text-gray-900 rounded-2xl font-semibold text-lg shadow-2xl flex items-center space-x-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <span>Get Started</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </motion.button>
                <motion.button 
                  onClick={() => {
                    const featuresSection = document.getElementById('features');
                    featuresSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-2xl font-semibold text-lg border border-white/30 shadow-lg"
                  whileHover={{ scale: 1.05, y: -2, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  Explore Features
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                {[
                  { value: '500+', label: 'Hotels' },
                  { value: '2M+', label: 'Guests Managed' },
                  { value: '99.9%', label: 'Uptime' },
                  { value: '24/7', label: 'Support' },
                ].map((stat, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 + idx * 0.1 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                  >
                    <div className="text-4xl md:text-5xl font-light text-white mb-2 tracking-tight">{stat.value}</div>
                    <div className="text-sm text-white/80 font-light">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 bg-gradient-to-b from-white to-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="mb-6">
                <span className="text-5xl md:text-6xl lg:text-7xl font-semibold text-primary-600 block mb-3 tracking-tight">
                  Everything You Need
                </span>
                <span className="text-2xl md:text-3xl text-gray-700 font-light tracking-wide block">
                  to Run Your Hotel
                </span>
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
                Powerful features designed to streamline operations and enhance guest experiences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="group bg-white/70 backdrop-blur-md p-10 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100/60 animate-fade-in-up hover:border-gray-200/80 hover:bg-white/90"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className={`inline-flex p-5 rounded-3xl bg-gradient-to-r ${feature.color} text-white mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed font-light text-base">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 bg-white">
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
                  Simple, Transparent
                </span>
                <span className="text-2xl md:text-3xl text-gray-700 font-light tracking-wide block">
                  Pricing
                </span>
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
                Choose the plan that fits your hotel's needs. All plans include core features and updates.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {pricingPlans.map((plan, idx) => (
                <motion.div
                  key={idx}
                  className={`relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border ${
                    plan.popular 
                      ? 'border-yellow-400/60 shadow-xl' 
                      : 'border-gray-200/60 shadow-md'
                  } hover:border-gray-300/80`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ 
                    y: -8, 
                    scale: plan.popular ? 1.03 : 1.02,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                >
                  {plan.popular && (
                    <motion.div 
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-semibold rounded-full shadow-lg"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + idx * 0.1, type: "spring" }}
                    >
                      Most Popular
                    </motion.div>
                  )}
                  
                  <motion.div 
                    className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${plan.color} text-white mb-6 shadow-md`}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span className="text-3xl font-semibold">{plan.name}</span>
                  </motion.div>

                  {plan.price ? (
                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-light text-gray-900 tracking-tight">${plan.price.yearly}</span>
                        <span className="text-gray-500 ml-2 text-lg font-light">/year</span>
                      </div>
                      <div className="text-sm text-gray-400 mt-1 font-light">
                        or ${plan.price.quarterly}/quarter
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <div className="text-5xl font-semibold text-gray-900 tracking-tight">Custom</div>
                      <div className="text-sm text-gray-500 mt-1 font-light">Contact us for pricing</div>
                    </div>
                  )}

                  <div className="mb-6">
                    <div className="text-sm font-semibold text-gray-700 mb-2">{plan.rooms}</div>
                    {plan.multiProperty && (
                      <div className="text-xs text-primary-600 font-medium">✓ Multi-property support</div>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, fIdx) => (
                      <motion.li 
                        key={fIdx} 
                        className="flex items-start"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: fIdx * 0.05 }}
                      >
                        <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.button
                    onClick={() => {
                      if (plan.name === 'Enterprise') {
                        alert('Contact us at sales@hotelgo.com for Enterprise pricing');
                      } else {
                        router.push('/register');
                      }
                    }}
                    className={`w-full py-3.5 rounded-2xl font-medium backdrop-blur-sm ${
                      plan.popular
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md'
                        : 'bg-gradient-to-r from-primary-600 to-primary-800 text-white shadow-md'
                    }`}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {plan.price ? 'Get Started' : 'Contact Sales'}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
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

        {/* CTA Section */}
        <section className="py-32 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
          ></motion.div>
          <motion.div 
            className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.span 
                className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white block mb-4 tracking-tight"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Ready to Transform
              </motion.span>
              <motion.span 
                className="text-2xl md:text-3xl text-white/90 font-light tracking-wide block"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Your Hotel Operations?
              </motion.span>
            </motion.h2>
            <motion.p 
              className="text-lg text-primary-100 mb-10 max-w-2xl mx-auto font-light"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Join hundreds of hotels already using HotelGO to streamline their operations and delight their guests.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.button 
                onClick={() => router.push('/register')}
                className="px-8 py-4 bg-white text-primary-600 rounded-2xl font-semibold text-lg shadow-xl flex items-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button 
                onClick={() => {
                  const featuresSection = document.getElementById('features');
                  featuresSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-2xl font-semibold text-lg border border-white/30 shadow-lg"
                whileHover={{ scale: 1.05, y: -2, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>
        </section>

        {/* Footer */}
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
                <div className="flex items-center space-x-2 mb-4">
                  <div className="p-2 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg">
                    <Bed className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-semibold text-white tracking-tight">HotelGO</span>
                </div>
                <p className="text-sm">Premium hotel management system for the modern hospitality industry.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-sm">
              <p>&copy; {new Date().getFullYear()} HotelGO. All rights reserved.</p>
            </div>
          </div>
        </motion.footer>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </>
  );
}
