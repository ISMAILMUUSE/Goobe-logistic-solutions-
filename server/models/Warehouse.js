import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema({
  shipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shipment',
    required: true
  },
  location: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Received', 'Stored', 'Outbound', 'Shipped'],
    default: 'Received'
  },
  receivedAt: {
    type: Date,
    default: Date.now
  },
  shippedAt: {
    type: Date,
    default: null
  }
}, { _id: false });

const warehouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    unique: true,
    required: true,
    uppercase: true,
    trim: true
  },
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: String,
    zipCode: String,
    country: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  capacity: {
    total: {
      type: Number,
      required: true,
      min: 0
    },
    used: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  inventory: [inventoryItemSchema],
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  operatingHours: {
    open: String,
    close: String,
    timezone: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  contact: {
    phone: String,
    email: String
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

warehouseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  // Update used capacity based on inventory
  this.capacity.used = this.inventory.filter(
    item => item.status === 'Stored' || item.status === 'Received'
  ).length;
  next();
});

warehouseSchema.index({ code: 1 });
warehouseSchema.index({ 'address.coordinates.lat': 1, 'address.coordinates.lng': 1 });

export default mongoose.model('Warehouse', warehouseSchema);

