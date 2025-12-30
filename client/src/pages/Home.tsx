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

      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <StarPattern />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary-600 mb-6 leading-tight"
          >
            #1 global leader in
            <br />
            <span className="text-gray-900">Smart Logistics Solutions</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl md:text-2xl text-gray-700 mb-10 max-w-2xl mx-auto"
          >
            Discover how Goobe Logistic builds smarter, faster, better solutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {user ? (
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-primary-600 text-white font-semibold rounded hover:bg-primary-700 transition-colors text-lg"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-4 bg-primary-600 text-white font-semibold rounded hover:bg-primary-700 transition-colors text-lg"
                >
                  Ship with us
                </Link>
                <Link
                  to="/register?role=driver"
                  className="px-8 py-4 bg-white text-gray-900 font-semibold rounded border-2 border-gray-900 hover:bg-gray-50 transition-colors text-lg"
                >
                  Haul with us
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Additional Content Sections */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">
                Track your shipments in real-time with live location updates and status notifications.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Optimized Routes</h3>
              <p className="text-gray-600">
                AI-powered route optimization to reduce delivery times and operational costs.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Fleet Management</h3>
              <p className="text-gray-600">
                Comprehensive fleet management tools to monitor and optimize your delivery vehicles.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
