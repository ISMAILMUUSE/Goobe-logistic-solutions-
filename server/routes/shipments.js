import express from 'express';
import { body, validationResult } from 'express-validator';
import Shipment from '../models/Shipment.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/shipments
// @desc    Get all shipments (filtered by user role)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};

    // Filter by role
    if (req.user.role === 'customer') {
      query.customerId = req.user.id;
    } else if (req.user.role === 'driver') {
      query.driverId = req.user.id;
    }

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const shipments = await Shipment.find(query)
      .populate('customerId', 'name email phone')
      .populate('driverId', 'name email phone')
      .populate('vehicleId', 'vehicleNumber type licensePlate')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Shipment.countDocuments(query);

    res.json({
      success: true,
      count: shipments.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      shipments
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/shipments/:trackingNumber
// @desc    Get shipment by tracking number
// @access  Private
router.get('/:trackingNumber', protect, async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ trackingNumber: req.params.trackingNumber })
      .populate('customerId', 'name email phone address')
      .populate('driverId', 'name email phone')
      .populate('vehicleId', 'vehicleNumber type licensePlate currentLocation')
      .populate('routeId', 'routeNumber status stops')
      .populate('warehouseId', 'name code address');

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    // Check authorization
    if (req.user.role === 'customer' && shipment.customerId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.user.role === 'driver' && shipment.driverId && shipment.driverId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      success: true,
      shipment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/shipments
// @desc    Create new shipment
// @access  Private
router.post('/', protect, [
  body('origin.address').notEmpty().withMessage('Origin address is required'),
  body('destination.address').notEmpty().withMessage('Destination address is required'),
  body('packageDetails.weight').isFloat({ min: 0 }).withMessage('Weight must be a positive number'),
  body('estimatedDelivery').isISO8601().withMessage('Valid estimated delivery date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const shipmentData = {
      ...req.body,
      customerId: req.user.role === 'customer' ? req.user.id : req.body.customerId || req.user.id
    };

    const shipment = await Shipment.create(shipmentData);
    
    const populatedShipment = await Shipment.findById(shipment._id)
      .populate('customerId', 'name email phone');

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`shipment-${shipment.trackingNumber}`).emit('shipment-updated', populatedShipment);
    }

    res.status(201).json({
      success: true,
      shipment: populatedShipment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/shipments/:id/status
// @desc    Update shipment status
// @access  Private (Driver, Admin)
router.put('/:id/status', protect, authorize('driver', 'admin'), [
  body('status').isIn(['Order Placed', 'Processing', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'])
    .withMessage('Invalid status'),
  body('location').optional().isString(),
  body('coordinates').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, location, coordinates, description } = req.body;
    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    // Check authorization for drivers
    if (req.user.role === 'driver' && shipment.driverId && shipment.driverId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this shipment' });
    }

    shipment.status = status;
    
    // Update current location if provided
    if (location || coordinates) {
      shipment.currentLocation = {
        address: location || shipment.currentLocation?.address || '',
        coordinates: coordinates || shipment.currentLocation?.coordinates,
        lastUpdated: new Date()
      };
    }

    // Add timeline event
    shipment.timeline.push({
      status,
      location: location || shipment.currentLocation?.address || '',
      timestamp: new Date(),
      description: description || `Status updated to ${status}`,
      coordinates: coordinates || shipment.currentLocation?.coordinates
    });

    // Update actual delivery date if delivered
    if (status === 'Delivered') {
      shipment.actualDelivery = new Date();
    }

    await shipment.save();

    const populatedShipment = await Shipment.findById(shipment._id)
      .populate('customerId', 'name email phone')
      .populate('driverId', 'name email phone')
      .populate('vehicleId', 'vehicleNumber type licensePlate');

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`shipment-${shipment.trackingNumber}`).emit('shipment-updated', populatedShipment);
      io.to(`shipment-${shipment.trackingNumber}`).emit('status-changed', {
        trackingNumber: shipment.trackingNumber,
        status,
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      shipment: populatedShipment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/shipments/:id/assign
// @desc    Assign shipment to driver
// @access  Private (Admin)
router.put('/:id/assign', protect, authorize('admin'), [
  body('driverId').notEmpty().withMessage('Driver ID is required'),
  body('vehicleId').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    shipment.driverId = req.body.driverId;
    if (req.body.vehicleId) {
      shipment.vehicleId = req.body.vehicleId;
    }

    await shipment.save();

    const populatedShipment = await Shipment.findById(shipment._id)
      .populate('driverId', 'name email phone')
      .populate('vehicleId', 'vehicleNumber type licensePlate');

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`shipment-${shipment.trackingNumber}`).emit('shipment-updated', populatedShipment);
    }

    res.json({
      success: true,
      shipment: populatedShipment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

