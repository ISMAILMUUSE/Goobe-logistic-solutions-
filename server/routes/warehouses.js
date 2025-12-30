import express from 'express';
import { body, validationResult } from 'express-validator';
import Warehouse from '../models/Warehouse.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/warehouses
// @desc    Get all warehouses
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const warehouses = await Warehouse.find({ isActive: true })
      .populate('managerId', 'name email phone')
      .sort({ name: 1 });

    res.json({
      success: true,
      count: warehouses.length,
      warehouses
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/warehouses/:id
// @desc    Get warehouse by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id)
      .populate('managerId', 'name email phone')
      .populate('inventory.shipmentId', 'trackingNumber status destination');

    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }

    res.json({
      success: true,
      warehouse
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/warehouses
// @desc    Create new warehouse
// @access  Private (Admin)
router.post('/', protect, authorize('admin'), [
  body('name').notEmpty().withMessage('Name is required'),
  body('code').notEmpty().withMessage('Code is required'),
  body('address.street').notEmpty().withMessage('Street address is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.country').notEmpty().withMessage('Country is required'),
  body('capacity.total').isInt({ min: 1 }).withMessage('Total capacity must be positive')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const warehouse = await Warehouse.create(req.body);

    res.status(201).json({
      success: true,
      warehouse
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Warehouse code already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

