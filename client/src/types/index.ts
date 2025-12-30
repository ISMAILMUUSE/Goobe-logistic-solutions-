export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'driver' | 'admin';
  phone?: string;
  address?: Address;
  avatar?: string;
  vehicleId?: string;
  companyName?: string;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Shipment {
  _id: string;
  trackingNumber: string;
  customerId: User | string;
  driverId?: User | string;
  vehicleId?: Vehicle | string;
  status: 'Order Placed' | 'Processing' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Returned';
  origin: {
    address: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  destination: {
    address: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  currentLocation?: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    lastUpdated?: Date;
  };
  packageDetails: {
    weight: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    description?: string;
    value?: number;
    quantity: number;
  };
  shippingCost: number;
  estimatedDelivery: string;
  actualDelivery?: string;
  deliveryTimeSlot?: {
    start: string;
    end: string;
  };
  timeline: TimelineEvent[];
  proofOfDelivery?: {
    signature?: string;
    photo?: string;
    deliveredBy?: string;
    notes?: string;
  };
  specialInstructions?: string;
  isFragile?: boolean;
  requiresSignature?: boolean;
  invoiceId?: string;
  routeId?: string;
  warehouseId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEvent {
  status: string;
  location: string;
  timestamp: string;
  description: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Vehicle {
  _id: string;
  vehicleNumber: string;
  type: 'Truck' | 'Van' | 'Motorcycle' | 'Bicycle' | 'Container';
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  capacity: {
    weight: number;
    volume?: number;
  };
  currentLocation?: {
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    lastUpdated?: string;
  };
  status: 'Available' | 'In Transit' | 'Maintenance' | 'Out of Service';
  driverId?: User | string;
  fuelLevel?: number;
  mileage?: number;
  lastMaintenance?: string;
  nextMaintenance?: string;
  insurance?: {
    provider?: string;
    policyNumber?: string;
    expiryDate?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Route {
  _id: string;
  routeNumber: string;
  driverId: User | string;
  vehicleId: Vehicle | string;
  stops: RouteStop[];
  startLocation?: {
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  endLocation?: {
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  totalDistance: number;
  estimatedDuration: number;
  status: 'Planned' | 'In Progress' | 'Completed' | 'Cancelled';
  startTime?: string;
  endTime?: string;
  optimizedPath?: number[][];
  createdAt: string;
  updatedAt: string;
}

export interface RouteStop {
  shipmentId: Shipment | string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  sequence: number;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Skipped';
  estimatedArrival?: string;
  actualArrival?: string;
  notes?: string;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  customerId: User | string;
  shipmentId?: Shipment | string;
  lineItems: LineItem[];
  subtotal: number;
  tax: {
    rate: number;
    amount: number;
  };
  discount: number;
  total: number;
  currency: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
  billingAddress?: Address;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Warehouse {
  _id: string;
  name: string;
  code: string;
  address: {
    street: string;
    city: string;
    state?: string;
    zipCode?: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  capacity: {
    total: number;
    used: number;
  };
  inventory: InventoryItem[];
  managerId?: User | string;
  operatingHours?: {
    open: string;
    close: string;
    timezone: string;
  };
  isActive: boolean;
  contact?: {
    phone?: string;
    email?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  shipmentId: Shipment | string;
  location?: string;
  status: 'Received' | 'Stored' | 'Outbound' | 'Shipped';
  receivedAt: string;
  shippedAt?: string;
}

export interface Analytics {
  shipments: {
    total: number;
    byStatus: Record<string, number>;
  };
  revenue: {
    total: number;
    paidInvoices: number;
    monthlyTrend: Array<{
      _id: {
        year: number;
        month: number;
      };
      revenue: number;
      count: number;
    }>;
  };
  fleet: {
    total: number;
    byStatus: Record<string, number>;
  };
  routes: {
    total: number;
    byStatus: Record<string, number>;
  };
  users: {
    total: number;
    byRole: Record<string, number>;
  };
  recentShipments: Shipment[];
}

