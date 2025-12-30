import express from 'express';
import { body, validationResult } from 'express-validator';
import Vehicle from '../models/Vehicle.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/vehicles
// @desc    Get all vehicles
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (type) query.type = type;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const vehicles = await Vehicle.find(query)
      .populate('driverId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Vehicle.countDocuments(query);

    res.json({
      success: true,
      count: vehicles.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      vehicles
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/vehicles/:id
// @desc    Get vehicle by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('driverId', 'name email phone');

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json({
      success: true,
      vehicle
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/vehicles
// @desc    Create new vehicle
// @access  Private (Admin)
router.post('/', protect, authorize('admin'), [
  body('vehicleNumber').notEmpty().withMessage('Vehicle number is required'),
  body('type').isIn(['Truck', 'Van', 'Motorcycle', 'Bicycle', 'Container']).withMessage('Invalid vehicle type'),
  body('make').notEmpty().withMessage('Make is required'),
  body('model').notEmpty().withMessage('Model is required'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Invalid year'),
  body('licensePlate').notEmpty().withMessage('License plate is required'),
  body('capacity.weight').isFloat({ min: 0 }).withMessage('Weight capacity must be positive')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vehicle = await Vehicle.create(req.body);

    res.status(201).json({
      success: true,
      vehicle
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Vehicle number or license plate already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/vehicles/:id
// @desc    Update vehicle
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('driverId', 'name email phone');

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json({
      success: true,
      vehicle
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/vehicles/:id/location
// @desc    Update vehicle location
// @access  Private (Driver, Admin)
router.put('/:id/location', protect, authorize('driver', 'admin'), [
  body('coordinates.lat').isFloat().withMessage('Valid latitude is required'),
  body('coordinates.lng').isFloat().withMessage('Valid longitude is required'),
  body('address').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (req.user.role === 'driver' && vehicle.driverId && vehicle.driverId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    vehicle.currentLocation = {
      address: req.body.address || vehicle.currentLocation?.address || '',
      coordinates: req.body.coordinates,
      lastUpdated: new Date()
    };

    await vehicle.save();

    res.json({
      success: true,
      vehicle
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

