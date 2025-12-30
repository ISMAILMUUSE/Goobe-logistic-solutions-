import mongoose from 'mongoose';

const stopSchema = new mongoose.Schema({
  shipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shipment',
    required: true
  },
  address: {
    type: String,
    required: true
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  sequence: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Skipped'],
    default: 'Pending'
  },
  estimatedArrival: Date,
  actualArrival: Date,
  notes: String
}, { _id: false });

const routeSchema = new mongoose.Schema({
  routeNumber: {
    type: String,
    unique: true,
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  stops: [stopSchema],
  startLocation: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  endLocation: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  totalDistance: {
    type: Number,
    default: 0,
    min: 0
  },
  estimatedDuration: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['Planned', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Planned',
    index: true
  },
  startTime: {
    type: Date,
    default: null
  },
  endTime: {
    type: Date,
    default: null
  },
  optimizedPath: {
    type: [[Number]], // Array of [lat, lng] coordinates
    default: []
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

routeSchema.pre('save', async function(next) {
  if (!this.routeNumber) {
    const prefix = 'RT';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.routeNumber = `${prefix}-${timestamp}-${random}`;
  }
  this.updatedAt = Date.now();
  next();
});

routeSchema.index({ driverId: 1, status: 1 });
routeSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Route', routeSchema);

