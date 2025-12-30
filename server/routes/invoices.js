import express from 'express';
import { body, validationResult } from 'express-validator';
import Invoice from '../models/Invoice.js';
import Shipment from '../models/Shipment.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/invoices
// @desc    Get all invoices
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (req.user.role === 'customer') {
      query.customerId = req.user.id;
    }

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const invoices = await Invoice.find(query)
      .populate('customerId', 'name email phone')
      .populate('shipmentId', 'trackingNumber status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Invoice.countDocuments(query);

    res.json({
      success: true,
      count: invoices.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      invoices
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/invoices/:id
// @desc    Get invoice by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customerId', 'name email phone address')
      .populate('shipmentId', 'trackingNumber status origin destination');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    if (req.user.role === 'customer' && invoice.customerId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      success: true,
      invoice
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/invoices
// @desc    Create new invoice
// @access  Private (Admin)
router.post('/', protect, authorize('admin'), [
  body('customerId').notEmpty().withMessage('Customer ID is required'),
  body('lineItems').isArray({ min: 1 }).withMessage('At least one line item is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const invoice = await Invoice.create(req.body);

    // Link invoice to shipment if provided
    if (req.body.shipmentId) {
      await Shipment.findByIdAndUpdate(req.body.shipmentId, { invoiceId: invoice._id });
    }

    const populatedInvoice = await Invoice.findById(invoice._id)
      .populate('customerId', 'name email phone')
      .populate('shipmentId', 'trackingNumber status');

    res.status(201).json({
      success: true,
      invoice: populatedInvoice
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/invoices/:id/status
// @desc    Update invoice status
// @access  Private (Admin)
router.put('/:id/status', protect, authorize('admin'), [
  body('status').isIn(['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'])
    .withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    invoice.status = req.body.status;
    
    if (req.body.status === 'Paid') {
      invoice.paidDate = new Date();
      invoice.paymentMethod = req.body.paymentMethod || invoice.paymentMethod;
    }

    await invoice.save();

    const populatedInvoice = await Invoice.findById(invoice._id)
      .populate('customerId', 'name email phone')
      .populate('shipmentId', 'trackingNumber status');

    res.json({
      success: true,
      invoice: populatedInvoice
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

