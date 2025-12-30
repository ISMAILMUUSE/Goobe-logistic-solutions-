import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, ChevronDown, ChevronUp, ChevronRight, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setHoveredCategory(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation data
  const navigationData = {
    services: {
      mainLink: 'Explore all shipper services',
      categories: [
        {
          name: 'Freight Services',
          subItems: [
            'Air Freight',
            'Drop Trailer',
            'Flatbed',
            'Intermodal',
            'Less than Truckload (LTL)',
            'Ocean Shipping',
            'Port Services',
            'Temperature Controlled',
            'Truckload',
          ],
        },
        {
          name: 'Logistics Services',
          subItems: [
            'Warehouse Management',
            'Distribution Services',
            'Cross-Docking',
            'Inventory Management',
            'Order Fulfillment',
            'Returns Processing',
            'Value-Added Services',
          ],
        },
        {
          name: 'Supply Chain Management',
          subItems: [
            'End-to-End Visibility',
            'Supply Chain Analytics',
            'Demand Planning',
            'Supplier Management',
            'Risk Management',
            'Compliance Services',
          ],
        },
        {
          name: 'Lean AI Supply Chain Platform',
          subItems: [
            'AI-Powered Optimization',
            'Predictive Analytics',
            'Machine Learning Routing',
            'Automated Decision Making',
            'Real-Time Insights',
            'Performance Dashboards',
          ],
        },
        {
          name: 'Industries',
          subItems: [
            'Retail & E-commerce',
            'Manufacturing',
            'Healthcare & Pharmaceuticals',
            'Food & Beverage',
            'Automotive',
            'Technology & Electronics',
            'Energy & Chemicals',
          ],
        },
      ],
    },
    carriers: {
      mainLink: 'Explore all carrier services',
      categories: [
        {
          name: 'Financial Services',
          subItems: [
            'Cash Advance',
            'Digital Banking',
            'Freight Factoring',
            'Fuel Card',
            'Quick Pay',
            'Fuel Savings Program',
          ],
        },
        {
          name: 'Become a Carrier',
          subItems: [
            'Carrier Registration',
            'Onboarding Process',
            'Requirements & Compliance',
            'Carrier Benefits',
            'Support Resources',
          ],
        },
        {
          name: 'Load Board',
          subItems: [
            'Browse Available Loads',
            'Post Your Truck',
            'Load Matching',
            'Rate Negotiation',
            'Load History',
          ],
        },
        {
          name: 'Carrier Support',
          subItems: [
            '24/7 Support Center',
            'Technical Assistance',
            'Training Resources',
            'Documentation',
            'FAQ & Help Center',
          ],
        },
        {
          name: 'Carrier Advantage Program',
          subItems: [
            'Loyalty Rewards',
            'Volume Discounts',
            'Priority Load Access',
            'Performance Bonuses',
            'Exclusive Benefits',
          ],
        },
        {
          name: 'Carrier Technology',
          subItems: [
            'Mobile App',
            'ELD Integration',
            'Tracking Tools',
            'Document Management',
            'API Access',
          ],
        },
      ],
    },
    resources: {
      mainLink: 'Explore all resources',
      categories: [
        {
          name: 'Insights and Advisories',
          subItems: [
            'Market Intelligence Reports',
            'Freight Market Update',
            'North American Trade & Tariff Insights',
            'Industry Trends',
            'Economic Forecasts',
            'Supply Chain News',
          ],
        },
        {
          name: 'Resource Center',
          subItems: [
            'White Papers',
            'Case Studies',
            'Webinars & Events',
            'Best Practices Guides',
            'Compliance Resources',
            'Training Materials',
          ],
        },
        {
          name: 'C.H. Robinson Blog',
          subItems: [
            'Latest Articles',
            'Industry Insights',
            'Technology Updates',
            'Success Stories',
            'Expert Opinions',
          ],
        },
      ],
    },
    about: {
      mainLink: 'Explore our company',
      items: [
        'Careers',
        'Corporate Responsibility',
        'Global Newsroom',
        'Governance',
        'Innovation',
        'Investors',
        'Leadership Team',
        'Our History',
        'Awards & Recognition',
      ],
    },
    contact: {
      mainLink: 'Contact us',
      items: [
        'Connect with an Expert',
        'Find an Office',
        'Get a Quote',
        'Customer Support',
        'Sales Inquiry',
        'Partnership Opportunities',
      ],
    },
  };

  const handleNavClick = (navItem: string) => {
    setActiveDropdown(activeDropdown === navItem ? null : navItem);
    if (activeDropdown !== navItem) {
      setHoveredCategory(null);
    }
  };

  const handleCategoryHover = (categoryName: string) => {
    setHoveredCategory(categoryName);
  };

  const handleItemClick = (item: string, type: string) => {
    // Navigate based on item clicked
    const routes: Record<string, Record<string, string>> = {
      services: {
        'Air Freight': '/services/air-freight',
        'Truckload': '/services/truckload',
        'Less than Truckload (LTL)': '/services/ltl',
        'Ocean Shipping': '/services/ocean',
        'Warehouse Management': '/services/warehouse',
      },
      carriers: {
        'Load Board': '/dashboard',
        'Become a Carrier': '/register?role=driver',
        'Carrier Registration': '/register?role=driver',
      },
      contact: {
        'Get a Quote': '/create-shipment',
        'Connect with an Expert': '/contact',
        'Find an Office': '/contact',
      },
    };

    const route = routes[type]?.[item];
    if (route) {
      navigate(route);
    }
    setActiveDropdown(null);
    setHoveredCategory(null);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200" ref={dropdownRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-600 rounded flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">GOOBE LOGISTIC</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* Services */}
            <div className="relative">
              <button
                onClick={() => handleNavClick('services')}
                onMouseEnter={() => setActiveDropdown('services')}
                className={`px-4 py-2 flex items-center space-x-1 transition-colors ${
                  activeDropdown === 'services'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                <span>Services</span>
                {activeDropdown === 'services' ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              <AnimatePresence>
                {activeDropdown === 'services' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onMouseLeave={() => setActiveDropdown(null)}
                    className="absolute top-full left-0 mt-0 w-[800px] bg-white shadow-2xl border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div className="grid grid-cols-2 p-6">
                      <div className="pr-6 border-r border-gray-200">
                        <Link
                          to="/services"
                          className="text-primary-600 hover:text-primary-700 font-medium mb-4 block"
                        >
                          {navigationData.services.mainLink}
                        </Link>
                        <div className="border-t border-gray-200 pt-4 space-y-1">
                          {navigationData.services.categories.map((category) => (
                            <div
                              key={category.name}
                              onMouseEnter={() => handleCategoryHover(category.name)}
                              className={`px-3 py-2 rounded cursor-pointer flex items-center justify-between ${
                                hoveredCategory === category.name ? 'bg-blue-50' : 'hover:bg-gray-50'
                              }`}
                            >
                              <span className="text-gray-900">{category.name}</span>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="pl-6">
                        {hoveredCategory && (
                          <div>
                            <Link
                              to="/services"
                              className="text-primary-600 hover:text-primary-700 font-medium mb-4 block"
                            >
                              Browse {hoveredCategory.toLowerCase()}
                            </Link>
                            <div className="border-t border-gray-200 pt-4">
                              <div className="grid grid-cols-2 gap-2">
                                {navigationData.services.categories
                                  .find((c) => c.name === hoveredCategory)
                                  ?.subItems.map((item) => (
                                    <button
                                      key={item}
                                      onClick={() => handleItemClick(item, 'services')}
                                      className="text-left px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded text-sm"
                                    >
                                      {item}
                                    </button>
                                  ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Carriers */}
            <div className="relative">
              <button
                onClick={() => handleNavClick('carriers')}
                onMouseEnter={() => setActiveDropdown('carriers')}
                className={`px-4 py-2 flex items-center space-x-1 transition-colors ${
                  activeDropdown === 'carriers'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                <span>Carriers</span>
                {activeDropdown === 'carriers' ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              <AnimatePresence>
                {activeDropdown === 'carriers' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onMouseLeave={() => setActiveDropdown(null)}
                    className="absolute top-full left-0 mt-0 w-[800px] bg-white shadow-2xl border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div className="grid grid-cols-2 p-6">
                      <div className="pr-6 border-r border-gray-200">
                        <Link
                          to="/carriers"
                          className="text-primary-600 hover:text-primary-700 font-medium mb-4 block"
                        >
                          {navigationData.carriers.mainLink}
                        </Link>
                        <div className="border-t border-gray-200 pt-4 space-y-1">
                          {navigationData.carriers.categories.map((category) => (
                            <div
                              key={category.name}
                              onMouseEnter={() => handleCategoryHover(category.name)}
                              className={`px-3 py-2 rounded cursor-pointer flex items-center justify-between ${
                                hoveredCategory === category.name ? 'bg-blue-50' : 'hover:bg-gray-50'
                              }`}
                            >
                              <span className="text-gray-900">{category.name}</span>
                              {category.subItems && (
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="pl-6">
                        {hoveredCategory && (
                          <div>
                            <Link
                              to="/carriers"
                              className="text-primary-600 hover:text-primary-700 font-medium mb-4 block"
                            >
                              Browse all carrier {hoveredCategory.toLowerCase()}
                            </Link>
                            <div className="border-t border-gray-200 pt-4">
                              <div className="space-y-1">
                                {navigationData.carriers.categories
                                  .find((c) => c.name === hoveredCategory)
                                  ?.subItems.map((item) => (
                                    <button
                                      key={item}
                                      onClick={() => handleItemClick(item, 'carriers')}
                                      className="w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded text-sm"
                                    >
                                      {item}
                                    </button>
                                  ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Resources */}
            <div className="relative">
              <button
                onClick={() => handleNavClick('resources')}
                onMouseEnter={() => setActiveDropdown('resources')}
                className={`px-4 py-2 flex items-center space-x-1 transition-colors ${
                  activeDropdown === 'resources'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                <span>Resources</span>
                {activeDropdown === 'resources' ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              <AnimatePresence>
                {activeDropdown === 'resources' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onMouseLeave={() => setActiveDropdown(null)}
                    className="absolute top-full left-0 mt-0 w-[800px] bg-white shadow-2xl border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div className="grid grid-cols-2 p-6">
                      <div className="pr-6 border-r border-gray-200">
                        <Link
                          to="/resources"
                          className="text-primary-600 hover:text-primary-700 font-medium mb-4 block"
                        >
                          {navigationData.resources.mainLink}
                        </Link>
                        <div className="border-t border-gray-200 pt-4 space-y-1">
                          {navigationData.resources.categories.map((category) => (
                            <div
                              key={category.name}
                              onMouseEnter={() => handleCategoryHover(category.name)}
                              className={`px-3 py-2 rounded cursor-pointer flex items-center justify-between ${
                                hoveredCategory === category.name ? 'bg-blue-50' : 'hover:bg-gray-50'
                              }`}
                            >
                              <span className="text-gray-900">{category.name}</span>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="pl-6">
                        {hoveredCategory && (
                          <div>
                            <Link
                              to="/resources"
                              className="text-primary-600 hover:text-primary-700 font-medium mb-4 block"
                            >
                              Browse {hoveredCategory.toLowerCase()}
                            </Link>
                            <div className="border-t border-gray-200 pt-4">
                              <div className="space-y-1">
                                {navigationData.resources.categories
                                  .find((c) => c.name === hoveredCategory)
                                  ?.subItems.map((item) => (
                                    <button
                                      key={item}
                                      onClick={() => handleItemClick(item, 'resources')}
                                      className="w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded text-sm"
                                    >
                                      {item}
                                    </button>
                                  ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* About */}
            <div className="relative">
              <button
                onClick={() => handleNavClick('about')}
                onMouseEnter={() => setActiveDropdown('about')}
                className={`px-4 py-2 flex items-center space-x-1 transition-colors ${
                  activeDropdown === 'about'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                <span>About</span>
                {activeDropdown === 'about' ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              <AnimatePresence>
                {activeDropdown === 'about' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onMouseLeave={() => setActiveDropdown(null)}
                    className="absolute top-full left-0 mt-0 w-64 bg-white shadow-2xl border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div className="p-6">
                      <Link
                        to="/about"
                        className="text-primary-600 hover:text-primary-700 font-medium mb-4 block"
                      >
                        {navigationData.about.mainLink}
                      </Link>
                      <div className="border-t border-gray-200 pt-4 space-y-1">
                        {navigationData.about.items.map((item) => (
                          <Link
                            key={item}
                            to={`/about/${item.toLowerCase().replace(/\s+/g, '-')}`}
                            className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded"
                          >
                            {item}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Contact */}
            <div className="relative">
              <button
                onClick={() => handleNavClick('contact')}
                onMouseEnter={() => setActiveDropdown('contact')}
                className={`px-4 py-2 flex items-center space-x-1 transition-colors ${
                  activeDropdown === 'contact'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                <span>Contact</span>
                {activeDropdown === 'contact' ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              <AnimatePresence>
                {activeDropdown === 'contact' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onMouseLeave={() => setActiveDropdown(null)}
                    className="absolute top-full left-0 mt-0 w-64 bg-white shadow-2xl border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div className="p-6">
                      <Link
                        to="/contact"
                        className="text-primary-600 hover:text-primary-700 font-medium mb-4 block"
                      >
                        {navigationData.contact.mainLink}
                      </Link>
                      <div className="border-t border-gray-200 pt-4 space-y-1">
                        {navigationData.contact.items.map((item) => (
                          <button
                            key={item}
                            onClick={() => handleItemClick(item, 'contact')}
                            className="w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/create-shipment"
              className="px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              Get a quote
            </Link>
            <Link
              to="/dashboard"
              className="px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              Load board
            </Link>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => handleNavClick('user')}
                  className="px-4 py-2 text-gray-700 hover:text-primary-600 flex items-center space-x-1 transition-colors"
                >
                  <span>Dashboard</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <AnimatePresence>
                  {activeDropdown === 'user' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onMouseLeave={() => setActiveDropdown(null)}
                      className="absolute top-full right-0 mt-2 w-48 bg-white shadow-2xl border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div className="p-2">
                        <Link
                          to="/dashboard"
                          className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded"
                        >
                          My Dashboard
                        </Link>
                        <Link
                          to="/track"
                          className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded"
                        >
                          Track Shipments
                        </Link>
                        <Link
                          to="/create-shipment"
                          className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded"
                        >
                          Create Shipment
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded"
                          >
                            Admin Panel
                          </Link>
                        )}
                        <div className="border-t border-gray-200 my-1"></div>
                        <button
                          onClick={() => {
                            logout();
                            navigate('/');
                          }}
                          className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                Login
              </Link>
            )}
            <button className="px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-1">
              <span>EN-US</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-700 hover:text-primary-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setActiveDropdown(activeDropdown === 'mobile' ? null : 'mobile')}
            className="lg:hidden p-2 text-gray-700"
          >
            {activeDropdown === 'mobile' ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {activeDropdown === 'mobile' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-200 bg-white"
          >
            <div className="px-4 py-4 space-y-2">
              <Link to="/create-shipment" className="block py-2 text-gray-700">
                Get a quote
              </Link>
              <Link to="/dashboard" className="block py-2 text-gray-700">
                Load board
              </Link>
              {user ? (
                <Link to="/dashboard" className="block py-2 text-gray-700">
                  Dashboard
                </Link>
              ) : (
                <Link to="/login" className="block py-2 text-gray-700">
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navigation;

