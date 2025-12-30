import mongoose from 'mongoose';

const timelineEventSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    default: ''
  },
  coordinates: {
    lat: Number,
    lng: Number
  }
}, { _id: false });

const shipmentSchema = new mongoose.Schema({
  trackingNumber: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    default: null
  },
  status: {
    type: String,
    enum: ['Order Placed', 'Processing', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'],
    default: 'Order Placed',
    index: true
  },
  origin: {
    address: {
      type: String,
      required: true
    },
    city: String,
    state: String,
    zipCode: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  destination: {
    address: {
      type: String,
      required: true
    },
    city: String,
    state: String,
    zipCode: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  currentLocation: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    lastUpdated: Date
  },
  packageDetails: {
    weight: {
      type: Number,
      required: true,
      min: 0
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    description: String,
    value: Number,
    quantity: {
      type: Number,
      default: 1
    }
  },
  shippingCost: {
    type: Number,
    required: true,
    min: 0
  },
  estimatedDelivery: {
    type: Date,
    required: true
  },
  actualDelivery: {
    type: Date,
    default: null
  },
  deliveryTimeSlot: {
    start: Date,
    end: Date
  },
  timeline: [timelineEventSchema],
  proofOfDelivery: {
    signature: String,
    photo: String,
    deliveredBy: String,
    notes: String
  },
  specialInstructions: {
    type: String,
    default: ''
  },
  isFragile: {
    type: Boolean,
    default: false
  },
  requiresSignature: {
    type: Boolean,
    default: false
  },
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    default: null
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    default: null
  },
  warehouseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate unique tracking number before saving
shipmentSchema.pre('save', async function(next) {
  if (!this.trackingNumber) {
    const prefix = 'GB';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.trackingNumber = `${prefix}-${timestamp}-${random}`;
  }
  
  // Add initial timeline event if timeline is empty
  if (this.timeline.length === 0) {
    this.timeline.push({
      status: this.status,
      location: this.origin.address,
      timestamp: new Date(),
      description: 'Shipment created',
      coordinates: this.origin.coordinates
    });
  }
  
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
shipmentSchema.index({ customerId: 1, createdAt: -1 });
shipmentSchema.index({ driverId: 1, status: 1 });
shipmentSchema.index({ status: 1, estimatedDelivery: 1 });

export default mongoose.model('Shipment', shipmentSchema);

