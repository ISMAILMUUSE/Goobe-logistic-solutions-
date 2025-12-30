import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, MapPin, Clock, TrendingUp, Search, Plus } from 'lucide-react';
import { Shipment } from '../types';
import api from '../utils/api';
import { useSocket } from '../contexts/SocketContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Dashboard = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    inTransit: 0,
    delivered: 0,
    pending: 0,
  });
  const { socket } = useSocket();

  useEffect(() => {
    fetchShipments();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('shipment-updated', (updatedShipment: Shipment) => {
        setShipments((prev) =>
          prev.map((s) =>
            s._id === updatedShipment._id ? updatedShipment : s
          )
        );
        toast.success('Shipment status updated!');
      });

      return () => {
        socket.off('shipment-updated');
      };
    }
  }, [socket]);

  const fetchShipments = async () => {
    try {
      const response = await api.get('/shipments?limit=10');
      setShipments(response.data.shipments);
      
      // Calculate stats
      const total = response.data.total;
      const inTransit = response.data.shipments.filter(
        (s: Shipment) => s.status === 'In Transit'
      ).length;
      const delivered = response.data.shipments.filter(
        (s: Shipment) => s.status === 'Delivered'
      ).length;
      const pending = response.data.shipments.filter(
        (s: Shipment) => s.status === 'Order Placed' || s.status === 'Processing'
      ).length;

      setStats({ total, inTransit, delivered, pending });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch shipments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Order Placed': 'bg-blue-100 text-blue-800',
      'Processing': 'bg-yellow-100 text-yellow-800',
      'In Transit': 'bg-purple-100 text-purple-800',
      'Out for Delivery': 'bg-orange-100 text-orange-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your shipments and track deliveries</p>
        </div>
        <Link
          to="/create-shipment"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>New Shipment</span>
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Shipments', value: stats.total, icon: Package, color: 'blue' },
          { label: 'In Transit', value: stats.inTransit, icon: MapPin, color: 'purple' },
          { label: 'Delivered', value: stats.delivered, icon: TrendingUp, color: 'green' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'yellow' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Shipments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Shipments</h2>
          <Link
            to="/track"
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
          >
            <Search className="w-5 h-5" />
            <span>Track All</span>
          </Link>
        </div>

        {shipments.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No shipments yet</p>
            <Link
              to="/create-shipment"
              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700"
            >
              <Plus className="w-5 h-5" />
              <span>Create your first shipment</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {shipments.map((shipment, index) => (
              <motion.div
                key={shipment._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 5 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Link
                        to={`/track/${shipment.trackingNumber}`}
                        className="font-semibold text-primary-600 hover:text-primary-700"
                      >
                        {shipment.trackingNumber}
                      </Link>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                        {shipment.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {shipment.origin.address} → {shipment.destination.address}
                    </p>
                    <p className="text-xs text-gray-500">
                      Created: {format(new Date(shipment.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${shipment.shippingCost.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">
                      ETA: {format(new Date(shipment.estimatedDelivery), 'MMM dd')}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;

