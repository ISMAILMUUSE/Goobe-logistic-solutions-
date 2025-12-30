import express from 'express';
import Shipment from '../models/Shipment.js';
import Vehicle from '../models/Vehicle.js';
import Route from '../models/Route.js';
import Invoice from '../models/Invoice.js';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard statistics
// @access  Private (Admin)
router.get('/dashboard', protect, authorize('admin'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};

    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Shipment statistics
    const totalShipments = await Shipment.countDocuments(dateFilter);
    const shipmentsByStatus = await Shipment.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Revenue statistics
    const revenueData = await Invoice.aggregate([
      { $match: { ...dateFilter, status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }
    ]);
    const totalRevenue = revenueData[0]?.total || 0;
    const paidInvoices = revenueData[0]?.count || 0;

    // Fleet statistics
    const totalVehicles = await Vehicle.countDocuments();
    const vehiclesByStatus = await Vehicle.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Route statistics
    const totalRoutes = await Route.countDocuments(dateFilter);
    const routesByStatus = await Route.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // User statistics
    const totalUsers = await User.countDocuments();
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Recent shipments
    const recentShipments = await Shipment.find(dateFilter)
      .populate('customerId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Monthly revenue trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyRevenue = await Invoice.aggregate([
      {
        $match: {
          status: 'Paid',
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      analytics: {
        shipments: {
          total: totalShipments,
          byStatus: shipmentsByStatus.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {})
        },
        revenue: {
          total: totalRevenue,
          paidInvoices,
          monthlyTrend: monthlyRevenue
        },
        fleet: {
          total: totalVehicles,
          byStatus: vehiclesByStatus.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {})
        },
        routes: {
          total: totalRoutes,
          byStatus: routesByStatus.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {})
        },
        users: {
          total: totalUsers,
          byRole: usersByRole.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {})
        },
        recentShipments
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

