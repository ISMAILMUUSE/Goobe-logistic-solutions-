import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, MapPin, Clock, CheckCircle2, Truck, Loader2 } from 'lucide-react';
import { Shipment, TimelineEvent } from '../types';
import api from '../utils/api';
import { useSocket } from '../contexts/SocketContext';
import toast from 'react-hot-toast';
import { format, differenceInHours } from 'date-fns';

const TrackShipment = () => {
  const { trackingNumber: paramTrackingNumber } = useParams();
  const navigate = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState(paramTrackingNumber || '');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(false);
  const { socket } = useSocket();

  useEffect(() => {
    if (paramTrackingNumber) {
      fetchShipment(paramTrackingNumber);
    }
  }, [paramTrackingNumber]);

  useEffect(() => {
    if (socket && shipment) {
      socket.emit('join-shipment', shipment.trackingNumber);
      
      socket.on('shipment-updated', (updatedShipment: Shipment) => {
        if (updatedShipment.trackingNumber === shipment.trackingNumber) {
          setShipment(updatedShipment);
          toast.success('Shipment status updated!');
        }
      });

      socket.on('status-changed', (data: { trackingNumber: string; status: string }) => {
        if (data.trackingNumber === shipment.trackingNumber) {
          toast.success(`Status changed to ${data.status}`);
        }
      });

      return () => {
        socket.emit('leave-shipment', shipment.trackingNumber);
        socket.off('shipment-updated');
        socket.off('status-changed');
      };
    }
  }, [socket, shipment]);

  const fetchShipment = async (trackingNum: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/shipments/${trackingNum}`);
      setShipment(response.data.shipment);
      navigate(`/track/${trackingNum}`, { replace: true });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Shipment not found');
      setShipment(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      fetchShipment(trackingNumber.trim());
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return CheckCircle2;
      case 'Out for Delivery':
      case 'In Transit':
        return Truck;
      default:
        return Package;
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Order Placed': 'bg-blue-500',
      'Processing': 'bg-yellow-500',
      'In Transit': 'bg-purple-500',
      'Out for Delivery': 'bg-orange-500',
      'Delivered': 'bg-green-500',
      'Cancelled': 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getProgressPercentage = () => {
    if (!shipment) return 0;
    const statusOrder = ['Order Placed', 'Processing', 'In Transit', 'Out for Delivery', 'Delivered'];
    const currentIndex = statusOrder.indexOf(shipment.status);
    return currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0;
  };

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number (e.g., GB-XXXXX-XXXXX)"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Track'}
          </button>
        </form>
      </motion.div>

      {/* Shipment Details */}
      <AnimatePresence>
        {shipment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {shipment.trackingNumber}
                  </h2>
                  <p className="text-gray-600">
                    {shipment.origin.address} → {shipment.destination.address}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-lg ${getStatusColor(shipment.status)} text-white font-semibold`}>
                  {shipment.status}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(getProgressPercentage())}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgressPercentage()}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full ${getStatusColor(shipment.status)} rounded-full`}
                  />
                </div>
              </div>

              {/* Estimated Delivery */}
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>
                    ETA: {format(new Date(shipment.estimatedDelivery), 'MMM dd, yyyy h:mm a')}
                  </span>
                </div>
                {shipment.status !== 'Delivered' && (
                  <span className="text-primary-600 font-medium">
                    {differenceInHours(new Date(shipment.estimatedDelivery), new Date())} hours remaining
                  </span>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Timeline</h3>
              <div className="space-y-4">
                {shipment.timeline.map((event: TimelineEvent, index: number) => {
                  const Icon = getStatusIcon(event.status);
                  const isLast = index === shipment.timeline.length - 1;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-4"
                    >
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full ${getStatusColor(event.status)} flex items-center justify-center text-white`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        {!isLast && (
                          <div className="w-0.5 h-16 bg-gray-300 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-gray-900">{event.status}</h4>
                          <span className="text-sm text-gray-500">
                            {format(new Date(event.timestamp), 'MMM dd, h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{event.description}</p>
                        {event.location && (
                          <p className="text-xs text-gray-500 flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{event.location}</span>
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Package Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">{shipment.packageDetails.weight} kg</span>
                  </div>
                  {shipment.packageDetails.dimensions && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dimensions:</span>
                      <span className="font-medium">
                        {shipment.packageDetails.dimensions.length} × {shipment.packageDetails.dimensions.width} × {shipment.packageDetails.dimensions.height} cm
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium">{shipment.packageDetails.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Cost:</span>
                    <span className="font-medium text-primary-600">${shipment.shippingCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600 block mb-1">Origin:</span>
                    <span className="font-medium">{shipment.origin.address}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block mb-1">Destination:</span>
                    <span className="font-medium">{shipment.destination.address}</span>
                  </div>
                  {shipment.currentLocation && (
                    <div>
                      <span className="text-gray-600 block mb-1">Current Location:</span>
                      <span className="font-medium">{shipment.currentLocation.address || 'In transit'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!shipment && !loading && paramTrackingNumber && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No shipment found with this tracking number</p>
        </div>
      )}
    </div>
  );
};

export default TrackShipment;

