import express from 'express';
import { body, validationResult } from 'express-validator';
import Route from '../models/Route.js';
import Shipment from '../models/Shipment.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/routes
// @desc    Get all routes
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, driverId, page = 1, limit = 10 } = req.query;
    const query = {};

    if (req.user.role === 'driver') {
      query.driverId = req.user.id;
    } else if (driverId) {
      query.driverId = driverId;
    }

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const routes = await Route.find(query)
      .populate('driverId', 'name email phone')
      .populate('vehicleId', 'vehicleNumber type licensePlate')
      .populate('stops.shipmentId', 'trackingNumber destination status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Route.countDocuments(query);

    res.json({
      success: true,
      count: routes.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      routes
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/routes/optimize
// @desc    Get optimized route for shipments
// @access  Private (Driver, Admin)
router.get('/optimize', protect, authorize('driver', 'admin'), async (req, res) => {
  try {
    const { shipmentIds } = req.query;
    
    if (!shipmentIds || !Array.isArray(shipmentIds) || shipmentIds.length === 0) {
      return res.status(400).json({ message: 'Please provide shipment IDs' });
    }

    // Fetch shipments
    const shipments = await Shipment.find({
      _id: { $in: shipmentIds },
      status: { $in: ['Order Placed', 'Processing', 'In Transit'] }
    });

    if (shipments.length === 0) {
      return res.status(404).json({ message: 'No valid shipments found' });
    }

    // Simple optimization: sort by distance from origin
    // In production, use a proper routing algorithm (e.g., Google Directions API, Mapbox Optimization API)
    const optimizedStops = shipments.map((shipment, index) => ({
      shipmentId: shipment._id,
      address: shipment.destination.address,
      coordinates: shipment.destination.coordinates,
      sequence: index + 1,
      status: 'Pending'
    }));

    // Calculate estimated distance (simplified - in production use actual routing)
    const totalDistance = shipments.length * 10; // Placeholder
    const estimatedDuration = shipments.length * 30; // Placeholder (minutes)

    res.json({
      success: true,
      optimizedRoute: {
        stops: optimizedStops,
        totalDistance,
        estimatedDuration,
        totalStops: optimizedStops.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/routes
// @desc    Create new route
// @access  Private (Driver, Admin)
router.post('/', protect, authorize('driver', 'admin'), [
  body('driverId').notEmpty().withMessage('Driver ID is required'),
  body('vehicleId').notEmpty().withMessage('Vehicle ID is required'),
  body('stops').isArray({ min: 1 }).withMessage('At least one stop is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const routeData = {
      ...req.body,
      driverId: req.user.role === 'driver' ? req.user.id : req.body.driverId
    };

    const route = await Route.create(routeData);

    // Update shipments with route ID
    const shipmentIds = route.stops.map(stop => stop.shipmentId);
    await Shipment.updateMany(
      { _id: { $in: shipmentIds } },
      { routeId: route._id, status: 'In Transit' }
    );

    const populatedRoute = await Route.findById(route._id)
      .populate('driverId', 'name email phone')
      .populate('vehicleId', 'vehicleNumber type licensePlate')
      .populate('stops.shipmentId', 'trackingNumber destination status');

    res.status(201).json({
      success: true,
      route: populatedRoute
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/routes/:id/status
// @desc    Update route status
// @access  Private (Driver, Admin)
router.put('/:id/status', protect, authorize('driver', 'admin'), [
  body('status').isIn(['Planned', 'In Progress', 'Completed', 'Cancelled'])
    .withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    if (req.user.role === 'driver' && route.driverId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    route.status = req.body.status;
    
    if (req.body.status === 'In Progress' && !route.startTime) {
      route.startTime = new Date();
    }
    
    if (req.body.status === 'Completed') {
      route.endTime = new Date();
    }

    await route.save();

    const populatedRoute = await Route.findById(route._id)
      .populate('driverId', 'name email phone')
      .populate('vehicleId', 'vehicleNumber type licensePlate')
      .populate('stops.shipmentId', 'trackingNumber destination status');

    res.json({
      success: true,
      route: populatedRoute
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

