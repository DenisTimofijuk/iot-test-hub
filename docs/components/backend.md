# Backend API

**Express.js + TypeScript REST API with MongoDB**

Provides secure REST endpoints for device management, sensor data storage, and user authentication.

## 🏗️ Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Controllers   │      │   Middlewares    │      │   Routes        │
│   (Logic)       │◀──▶│   (Auth/Error)   │◀──▶│   (Endpoints)   │
└─────────────────┘      └──────────────────┘      └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Models        │      │   Utils          │      │   Validation    │
│   (MongoDB)     │      │   (Helpers)      │      │   (Joi Schema)  │
└─────────────────┘      └──────────────────┘      └─────────────────┘
```

## 🚀 Quick Start

```bash
# Development
npm run dev

# Database setup
npm run setup

# Production
npm run build && npm run start

# Linting
npm run lint
```

## 🔐 Authentication

**JWT-based Authentication:**
```typescript
// Login endpoint
POST /auth/login
{
  "username": "user",
  "password": "password"
}

// Response
{
  "token": "jwt-token-here",
  "user": { "id": "...", "username": "..." }
}
```

**Protected Routes:**
```typescript
// Middleware validates JWT token
app.use('/api/protected', authMiddleware);
```

## 📊 API Endpoints

### Authentication Routes (`/auth`)
```bash
POST /auth/login      # User login
POST /auth/register   # User registration  
POST /auth/refresh    # Token refresh
POST /auth/logout     # User logout
```

### Data Routes (`/api`)
```bash
GET    /api/readings           # Get sensor readings
POST   /api/readings           # Create new reading
GET    /api/readings/:id       # Get specific reading
PUT    /api/readings/:id       # Update reading
DELETE /api/readings/:id       # Delete reading

GET    /api/devices            # Get all devices
POST   /api/devices            # Register new device
GET    /api/devices/:id        # Get device details
PUT    /api/devices/:id        # Update device
DELETE /api/devices/:id        # Remove device
```

## 🗄️ Database Schema

### Collections

**Users:**
```typescript
interface User {
  _id: ObjectId;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  lastLogin?: Date;
}
```

**Devices:**
```typescript
interface Device {
  _id: ObjectId;
  deviceId: string;
  name: string;
  type: string;
  status: DeviceStatus;
  lastSeen: Date;
  metadata: {
    location?: string;
    sensors: string[];
    firmware: string;
  };
}
```

**Readings:**
```typescript
interface Reading {
  _id: ObjectId;
  deviceId: string;
  timestamp: Date;
  data: {
    temperature?: number;
    humidity?: number;
    co2?: number;
    tvoc?: number;
  };
  quality: 'good' | 'warning' | 'error';
}
```

## ⚙️ Configuration

```typescript
// config/config.ts
export const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiry: '24h',
  corsOrigins: ['http://localhost:5173'],
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // requests per window
  }
};
```

## 🛡️ Security Features

**Authentication:**
- JWT tokens with expiration
- Password hashing with bcrypt
- Protected route middleware

**Validation:**
- Joi schema validation
- Input sanitization
- Type checking

**Error Handling:**
- Centralized error middleware
- Proper HTTP status codes
- Secure error messages

## 📈 Monitoring & Health

**Database Health Monitor:**
```typescript
class DatabaseHealthMonitor {
  // Connection status checking
  // Performance metrics
  // Automatic reconnection
  // Health endpoint reporting
}
```

**Health Endpoint:**
```bash
GET /health
{
  "status": "healthy",
  "database": "connected",
  "uptime": 3600,
  "memory": "45.2 MB"
}
```

## 🔧 Utilities

**Data Processing:**
```typescript
// utils/dataProcessing.ts
- Data aggregation functions
- Statistical calculations  
- Time series processing
- Outlier detection
```

**Error Parsing:**
```typescript
// utils/errorParser.ts
- MongoDB error translation
- Validation error formatting
- HTTP status code mapping
```

## 🧪 Testing

**Test Setup:**
```bash
npm run test
```

**Test Categories:**
- Unit tests for controllers
- Integration tests for routes
- Database operation tests
- Authentication flow tests

## 📋 Environment Variables

```bash
# .env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/iot-hub
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
LOG_LEVEL=debug

# Optional
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

## 🚨 Error Codes

**Common HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (auth required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate data)
- `422`: Unprocessable Entity (validation)
- `500`: Internal Server Error

## 📦 Dependencies

**Core:**
- `express`: Web framework
- `mongodb`: Database driver
- `jsonwebtoken`: JWT handling
- `bcrypt`: Password hashing
- `joi`: Data validation

**Development:**
- `nodemon`: Development server
- `ts-node`: TypeScript execution
- `typescript`: Type checking
- `dotenv`: Environment variables