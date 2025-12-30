import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';

const Home = () => {
  const { user } = useAuth();

  // Decorative star pattern component
  const StarPattern = () => (
    <div className="absolute left-0 top-0 h-full w-64 opacity-20 pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 256 800" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M128 0L140 48L188 60L140 72L128 120L116 72L68 60L116 48L128 0Z" fill="#2563eb" />
        <path d="M64 150L70 170L90 176L70 182L64 202L58 182L38 176L58 170L64 150Z" fill="#2563eb" />
        <path d="M192 200L198 220L218 226L198 232L192 252L186 232L166 226L186 220L192 200Z" fill="#2563eb" />
        <path d="M32 300L38 320L58 326L38 332L32 352L26 332L6 326L26 320L32 300Z" fill="#2563eb" />
        <path d="M160 400L166 420L186 426L166 432L160 452L154 432L134 426L154 420L160 400Z" fill="#2563eb" />
        <path d="M96 500L102 520L122 526L102 532L96 552L90 532L70 526L90 520L96 500Z" fill="#2563eb" />
        <path d="M224 600L230 620L250 626L230 632L224 652L218 632L198 626L218 620L224 600Z" fill="#2563eb" />
        <path d="M48 700L54 720L74 726L54 732L48 752L42 732L22 726L42 720L48 700Z" fill="#2563eb" />
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section with Background Image */}
      <section className="relative min-h-[700px] md:min-h-[800px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/logistic.jpg"
            alt="Logistics background"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay for better text readability - reduced opacity */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-purple-900/35 to-pink-900/40"></div>
          {/* Additional colorful overlay - reduced opacity */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-secondary-500/10 to-orange-500/10"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400/20 rounded-full blur-xl"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Brand Logo/Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-2xl mb-6">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white flex items-center justify-center">
                <span className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  G
                </span>
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              #1 Global Leader
            </span>
            <br />
            <span className="text-white drop-shadow-2xl">
              in Smart Logistics
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-12 max-w-3xl mx-auto font-medium drop-shadow-lg"
          >
            Discover how <span className="font-bold text-yellow-300">Goobe Logistic</span> builds smarter, faster, better solutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {user ? (
              <Link
                to="/dashboard"
                className="px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-lg shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transform"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold rounded-full hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 text-lg shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transform"
                >
                  Ship with us
                </Link>
                <Link
                  to="/register?role=driver"
                  className="px-10 py-5 bg-white/95 text-purple-900 font-bold rounded-full border-2 border-white hover:bg-white transition-all duration-300 text-lg shadow-2xl hover:shadow-white/50 hover:scale-105 transform"
                >
                  Haul with us
                </Link>
              </>
            )}
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {[
              { label: 'Shipments', value: '2.5M+', color: 'from-blue-400 to-blue-600' },
              { label: 'Countries', value: '150+', color: 'from-purple-400 to-purple-600' },
              { label: 'Vehicles', value: '50K+', color: 'from-pink-400 to-pink-600' },
              { label: 'Satisfaction', value: '98%', color: 'from-yellow-400 to-yellow-600' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
              >
                <div className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                  {stat.value}
                </div>
                <div className="text-white/80 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section with Colorful Design */}
      <section className="py-20 bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-purple-700 max-w-2xl mx-auto font-medium">
              Everything you need to manage your logistics operations efficiently
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Real-time Tracking',
                description: 'Track your shipments in real-time with live location updates and status notifications.',
                icon: '📍',
                gradient: 'from-blue-500 to-cyan-500',
                bgGradient: 'from-blue-50 to-cyan-50',
              },
              {
                title: 'Optimized Routes',
                description: 'AI-powered route optimization to reduce delivery times and operational costs.',
                icon: '🚀',
                gradient: 'from-purple-500 to-pink-500',
                bgGradient: 'from-purple-50 to-pink-50',
              },
              {
                title: 'Fleet Management',
                description: 'Comprehensive fleet management tools to monitor and optimize your delivery vehicles.',
                icon: '🚛',
                gradient: 'from-orange-500 to-red-500',
                bgGradient: 'from-orange-50 to-red-50',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`bg-gradient-to-br ${feature.bgGradient} rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-3xl mb-6 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                  {feature.title}
                </h3>
                <p className="text-purple-800 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Gradient */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Transform Your Logistics?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of businesses using Goobe Logistic for their shipping needs
            </p>
            {!user && (
              <Link
                to="/register"
                className="inline-flex items-center px-10 py-5 bg-white text-purple-600 font-bold rounded-full hover:bg-purple-50 transition-all duration-300 text-lg shadow-2xl hover:shadow-white/50 hover:scale-105 transform"
              >
                Get Started Free
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
