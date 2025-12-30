import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Truck', 'Van', 'Motorcycle', 'Bicycle', 'Container'],
    required: true
  },
  make: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  licensePlate: {
    type: String,
    required: true,
    unique: true
  },
  capacity: {
    weight: {
      type: Number,
      required: true,
      min: 0
    },
    volume: {
      type: Number,
      min: 0
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
  status: {
    type: String,
    enum: ['Available', 'In Transit', 'Maintenance', 'Out of Service'],
    default: 'Available',
    index: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  fuelLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  mileage: {
    type: Number,
    default: 0,
    min: 0
  },
  lastMaintenance: {
    type: Date,
    default: null
  },
  nextMaintenance: {
    type: Date,
    default: null
  },
  insurance: {
    provider: String,
    policyNumber: String,
    expiryDate: Date
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

vehicleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

vehicleSchema.index({ status: 1, type: 1 });
vehicleSchema.index({ driverId: 1 });

export default mongoose.model('Vehicle', vehicleSchema);

