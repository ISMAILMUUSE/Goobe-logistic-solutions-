# Goobe Logistic - Full-Stack Logistics Platform

A professional logistics management platform with real-time tracking, shipment management, and animated UI interactions.

## Tech Stack

- **Frontend**: React 18+ with TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io
- **Authentication**: JWT

## Features

- Real-time shipment tracking
- User dashboard with animations
- Admin panel with analytics
- Fleet management
- Route optimization
- Invoice generation
- Multi-user roles (customers, drivers, admins)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB installed and running
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd Goobe-logistic
   ```

2. Install dependencies:
   ```bash
   npm run install-all
   ```
   This will install dependencies for root, server, and client.

3. Set up environment variables:
   
   **Server** - Create `.env` file in `server/` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/goobe-logistic
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   MAPBOX_ACCESS_TOKEN=your-mapbox-token-here
   ```

   **Client** - Create `.env` file in `client/` directory (optional):
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. Start MongoDB:
   ```bash
   # Make sure MongoDB is running on your system
   # On macOS with Homebrew:
   brew services start mongodb-community
   
   # On Linux:
   sudo systemctl start mongod
   
   # On Windows:
   # Start MongoDB service from Services panel
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```
   This will start both the backend and frontend concurrently.

The app will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Socket.io: http://localhost:5000

## Project Structure

```
goobe-logistic/
├── server/          # Express backend
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API routes
│   ├── middleware/  # Auth & validation
│   ├── controllers/ # Business logic
│   └── utils/       # Helpers
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── utils/
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Shipments
- `GET /api/shipments` - List shipments (with pagination and filters)
- `POST /api/shipments` - Create new shipment
- `GET /api/shipments/:trackingNumber` - Track shipment by tracking number
- `PUT /api/shipments/:id/status` - Update shipment status (Driver/Admin)
- `PUT /api/shipments/:id/assign` - Assign shipment to driver (Admin)

### Routes
- `GET /api/routes` - List all routes
- `POST /api/routes` - Create new route
- `GET /api/routes/optimize` - Get optimized route for shipments
- `PUT /api/routes/:id/status` - Update route status

### Analytics (Admin Only)
- `GET /api/analytics/dashboard` - Get dashboard statistics

### Vehicles
- `GET /api/vehicles` - List all vehicles
- `GET /api/vehicles/:id` - Get vehicle by ID
- `POST /api/vehicles` - Create new vehicle (Admin)
- `PUT /api/vehicles/:id` - Update vehicle (Admin)
- `PUT /api/vehicles/:id/location` - Update vehicle location (Driver/Admin)

### Warehouses
- `GET /api/warehouses` - List all warehouses
- `GET /api/warehouses/:id` - Get warehouse by ID
- `POST /api/warehouses` - Create new warehouse (Admin)

### Invoices
- `GET /api/invoices` - List all invoices
- `GET /api/invoices/:id` - Get invoice by ID
- `POST /api/invoices` - Create new invoice (Admin)
- `PUT /api/invoices/:id/status` - Update invoice status (Admin)

## Features Implemented

✅ **User Management**
- Multi-role authentication (Customer, Driver, Admin)
- JWT-based secure authentication
- User profiles and settings

✅ **Shipment Management**
- Create and track shipments
- Real-time status updates via Socket.io
- Timeline tracking with location history
- Package details and cost calculation

✅ **Real-time Tracking**
- Live shipment location updates
- Socket.io integration for instant notifications
- Progress bars with animated fills
- Interactive timeline components

✅ **Admin Features**
- Comprehensive analytics dashboard
- Fleet management
- Route optimization
- User and vehicle management
- Revenue tracking

✅ **UI/UX**
- Framer Motion animations throughout
- Responsive design (mobile-first)
- Loading states and skeletons
- Toast notifications
- Smooth page transitions

✅ **Database Models**
- Users (customers, drivers, admins)
- Shipments with full tracking
- Vehicles and fleet management
- Routes with optimization
- Warehouses and inventory
- Invoices and billing

## Development

### Running Individual Services

**Backend only:**
```bash
cd server
npm run dev
```

**Frontend only:**
```bash
cd client
npm run dev
```

### Building for Production

```bash
# Build frontend
cd client
npm run build

# The built files will be in client/dist/
```

## Project Structure

```
goobe-logistic/
├── server/                 # Express backend
│   ├── models/             # Mongoose schemas
│   │   ├── User.js
│   │   ├── Shipment.js
│   │   ├── Vehicle.js
│   │   ├── Route.js
│   │   ├── Warehouse.js
│   │   └── Invoice.js
│   ├── routes/             # API routes
│   │   ├── auth.js
│   │   ├── shipments.js
│   │   ├── routes.js
│   │   ├── analytics.js
│   │   ├── vehicles.js
│   │   ├── warehouses.js
│   │   └── invoices.js
│   ├── middleware/         # Auth & validation
│   │   └── auth.js
│   ├── utils/              # Helpers
│   │   └── generateToken.js
│   ├── index.js            # Server entry point
│   └── package.json
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Layout.tsx
│   │   │   └── PrivateRoute.tsx
│   │   ├── contexts/       # React contexts
│   │   │   ├── AuthContext.tsx
│   │   │   └── SocketContext.tsx
│   │   ├── pages/          # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── TrackShipment.tsx
│   │   │   ├── CreateShipment.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── FleetManagement.tsx
│   │   │   └── Analytics.tsx
│   │   ├── types/          # TypeScript types
│   │   │   └── index.ts
│   │   ├── utils/          # Utilities
│   │   │   └── api.ts
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   ├── index.html
│   └── package.json
├── package.json            # Root package.json
└── README.md
```

## License

MIT

