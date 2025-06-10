# API Reference

**Complete REST API documentation for IoT Test Hub**

Base URL: `http://localhost:3000`

## 🔐 Authentication

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "admin",
    "email": "admin@example.com"
  }
}
```

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com", 
  "password": "securepassword",
  "confirmPassword": "securepassword"
}
```

### Token Refresh
```http
POST /auth/refresh
Authorization: Bearer <token>
```

## 📊 Sensor Readings

### Get All Readings
```http
GET /api/devices/readings
Authorization: Bearer <token>

# Query Parameters
?limit=50           # Number of results (default: 100)
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "deviceId": "esp8266_001",
      "timestamp": "2024-06-10T14:30:00Z",
      "data": {
        "temperature": 22.5,
        "humidity": 65.2,
        "co2": 412,
        "tvoc": 0.05
      },
      "quality": "good"
    }
  ],
  "pagination": {
    "total": 1250,
    "limit": 50,
    "offset": 0,
    "hasNext": true
  }
}
```

### Create Reading
```http
POST /api/devices/readings
Authorization: Bearer <token>
Content-Type: application/json

{
  "deviceId": "esp8266_001",
  "data": {
    "temperature": 23.1,
    "humidity": 58.7,
    "co2": 408,
    "tvoc": 0.03
  },
  "timestamp": "2024-06-10T14:35:00Z"
}
```

### Get Reading by ID
```http
GET /api/devices/readings/{id}
Authorization: Bearer <token>
```

### Update Reading
```http
PUT /api/devices/readings/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "data": {
    "temperature": 23.2,
    "humidity": 58.9
  },
  "quality": "warning"
}
```

### Delete Reading
```http
DELETE /api/devices/readings/{id}
Authorization: Bearer <token>
```

## 🔧 Device Management

### Get All Devices
```http
GET /api/devices
Authorization: Bearer <token>

# Query Parameters
?status=online      # Filter by status
?type=sensor        # Filter by device type
?location=lab1      # Filter by location
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "deviceId": "esp8266_001",
      "name": "Lab Sensor #1",
      "type": "environmental_sensor",
      "status": "online",
      "lastSeen": "2024-06-10T14:35:00Z",
      "metadata": {
        "location": "Lab Room 1",
        "sensors": ["DHT22", "CCS811"],
        "firmware": "v1.2.3",
        "serialNumber": "ESP001"
      },
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Register Device
```http
POST /api/devices
Authorization: Bearer <token>
Content-Type: application/json

{
  "deviceId": "esp8266_002",
  "name": "Lab Sensor #2",
  "type": "environmental_sensor",
  "metadata": {
    "location": "Lab Room 2",
    "sensors": ["DHT22", "CCS811"],
    "firmware": "v1.2.3"
  }
}
```

### Get Device Details
```http
GET /api/devices/{id}
Authorization: Bearer <token>
```

### Update Device
```http
PUT /api/devices/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Sensor Name",
  "status": "maintenance",
  "metadata": {
    "location": "New Location"
  }
}
```

### Delete Device
```http
DELETE /api/devices/{id}
Authorization: Bearer <token>
```

## 📈 Analytics Endpoints

### Device Statistics
```http
GET /api/analytics/devices/{deviceId}/stats
Authorization: Bearer <token>

# Query Parameters
?period=24h         # Time period: 1h, 24h, 7d, 30d
?metrics=temp,humidity,co2  # Specific metrics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "24h",
    "deviceId": "esp8266_001",
    "statistics": {
      "temperature": {
        "avg": 22.8,
        "min": 20.1,
        "max": 25.3,
        "samples": 1440
      },
      "humidity": {
        "avg": 62.4,
        "min": 45.2,
        "max": 78.9,
        "samples": 1440
      }
    }
  }
}
```

### System Health
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-06-10T14:35:00Z",
  "uptime": 86400,
  "services": {
    "database": "connected",
    "redis": "connected"
  },
  "metrics": {
    "memoryUsage": "45.2 MB",
    "cpuUsage": "12.5%",
    "activeConnections": 15
  }
}
```

## 🚨 Error Responses

### Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      {
        "field": "temperature",
        "message": "Temperature must be between -50 and 100"
      }
    ]
  }
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 201  | Created |
| 400  | Bad Request |
| 401  | Unauthorized |
| 403  | Forbidden |
| 404  | Not Found |
| 409  | Conflict |
| 422  | Validation Error |
| 429  | Rate Limited |
| 500  | Internal Server Error |

### Common Error Codes

| Code | Description |
|------|-------------|
| `INVALID_TOKEN` | JWT token invalid or expired |
| `VALIDATION_ERROR` | Request validation failed |
| `DEVICE_NOT_FOUND` | Device ID not found |
| `DUPLICATE_DEVICE` | Device already registered |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `DATABASE_ERROR` | Database operation failed |

## 🔄 Real-time WebSocket Events

### Connection
```javascript
// Client connection
const socket = io('http://localhost:8080');

// Authentication
socket.emit('authenticate', { token: 'jwt-token' });
```

### Events

#### Sensor Data
```javascript
// Receive real-time sensor data
socket.on('sensorData', (data) => {
  console.log('New sensor reading:', data);
});

// Data format
{
  "deviceId": "esp8266_001",
  "timestamp": "2024-06-10T14:35:00Z",
  "data": {
    "temperature": 22.5,
    "humidity": 65.2,
    "co2": 412,
    "tvoc": 0.05
  }
}
```

#### Device Status
```javascript
// Device online/offline events
socket.on('deviceStatus', (status) => {
  console.log('Device status changed:', status);
});

// Status format
{
  "deviceId": "esp8266_001",
  "status": "online",
  "timestamp": "2024-06-10T14:35:00Z"
}
```

#### System Alerts
```javascript
// System alerts and warnings
socket.on('systemAlert', (alert) => {
  console.log('System alert:', alert);
});

// Alert format
{
  "type": "warning",
  "message": "High temperature detected",
  "deviceId": "esp8266_001",
  "timestamp": "2024-06-10T14:35:00Z",
  "data": {
    "temperature": 35.2
  }
}
```

## 📋 Rate Limiting

### Default Limits
- **Authentication**: 5 requests per minute
- **API Endpoints**: 100 requests per 15 minutes
- **WebSocket**: 1000 messages per hour

### Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1623456789
```

## 🔧 Request/Response Examples

### cURL Examples

**Login:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

**Get Readings:**
```bash
curl -X GET "http://localhost:3000/api/readings?limit=10" \
  -H "Authorization: Bearer <token>"
```

**Create Reading:**
```bash
curl -X POST http://localhost:3000/api/readings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "deviceId": "esp8266_001",
    "data": {
      "temperature": 23.1,
      "humidity": 58.7
    }
  }'
```

## 📚 SDK Examples

### JavaScript/TypeScript
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Login
const { data } = await api.post('/auth/login', {
  username: 'admin',
  password: 'password123'
});

// Set token for future requests
api.defaults.headers.Authorization = `Bearer ${data.token}`;

// Get readings
const readings = await api.get('/api/readings');
```

### Python
```python
import requests

# Login
response = requests.post('http://localhost:3000/auth/login', 
  json={'username': 'admin', 'password': 'password123'})
token = response.json()['token']

# Get readings
headers = {'Authorization': f'Bearer {token}'}
readings = requests.get('http://localhost:3000/api/readings', 
  headers=headers)
```