import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Plus, MapPin, Fuel, Wrench } from 'lucide-react';
import { Vehicle } from '../types';
import api from '../utils/api';
import toast from 'react-hot-toast';

const FleetManagement = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/vehicles');
      setVehicles(response.data.vehicles);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Available': 'bg-green-100 text-green-800',
      'In Transit': 'bg-blue-100 text-blue-800',
      'Maintenance': 'bg-yellow-100 text-yellow-800',
      'Out of Service': 'bg-red-100 text-red-800',
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fleet Management</h1>
          <p className="text-gray-600 mt-1">Manage your delivery vehicles</p>
        </div>
        <button className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg">
          <Plus className="w-5 h-5" />
          <span>Add Vehicle</span>
        </button>
      </motion.div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle, index) => (
          <motion.div
            key={vehicle._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{vehicle.vehicleNumber}</h3>
                  <p className="text-sm text-gray-600">{vehicle.type}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                {vehicle.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Make/Model:</span>
                <span className="font-medium">{vehicle.make} {vehicle.model}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">License Plate:</span>
                <span className="font-medium">{vehicle.licensePlate}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Capacity:</span>
                <span className="font-medium">{vehicle.capacity.weight} kg</span>
              </div>
              {vehicle.fuelLevel !== undefined && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center space-x-1">
                      <Fuel className="w-4 h-4" />
                      <span>Fuel Level</span>
                    </span>
                    <span className="font-medium">{vehicle.fuelLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${vehicle.fuelLevel}%` }}
                      transition={{ duration: 1 }}
                      className={`h-2 rounded-full ${
                        vehicle.fuelLevel > 50 ? 'bg-green-500' :
                        vehicle.fuelLevel > 25 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                </div>
              )}
              {vehicle.driverId && (
                <div className="flex items-center justify-between text-sm pt-2 border-t">
                  <span className="text-gray-600">Driver:</span>
                  <span className="font-medium">
                    {(vehicle.driverId as any)?.name || 'Assigned'}
                  </span>
                </div>
              )}
              {vehicle.nextMaintenance && (
                <div className="flex items-center space-x-2 text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
                  <Wrench className="w-4 h-4" />
                  <span>Maintenance due soon</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {vehicles.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No vehicles in fleet</p>
          <button className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Plus className="w-5 h-5" />
            <span>Add First Vehicle</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default FleetManagement;

