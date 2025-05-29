# IoT Environmental Monitoring & Testing System

## Project Overview

This project simulates a **telematics device testing system** similar to what you'd work on at Teltonika Telematics. You'll build an automated testing framework for IoT devices that collect environmental data, combining hardware communication, data processing, web interfaces, and automated testing.

## Learning Objectives

This project will help you practice:
- **Serial communication** with embedded devices (ESP8266)
- **Buffer management** and data parsing from sensors
- **MongoDB** operations and data modeling
- **Node.js/TypeScript** backend development
- **React/TypeScript** frontend development
- **Automated testing** with Jest
- **Hardware-in-the-loop** testing concepts

## Architecture Overview

```
Arduino ESP8266 (DHT + CCS811) 
    ↓ (Serial/USB)
Node.js API Server
    ↓ (MongoDB operations)
MongoDB Database
    ↓ (REST API)
React Frontend Dashboard
```

## Phase 1: Hardware Communication (Week 1)

### Goals
- Establish serial communication between Node.js and Arduino
- Parse sensor data from DHT22 (temperature/humidity) and CCS811 (air quality)
- Implement basic error handling and reconnection logic

### Tasks
1. **Arduino Code Setup**
   - Configure ESP8266 to read DHT22 and CCS811 sensors
   - Format sensor data as JSON over serial
   - Implement basic error reporting

2. **Node.js Serial Communication**
   - Use `serialport` npm package
   - Parse incoming JSON data
   - Handle buffer management for incomplete messages
   - Implement connection monitoring

### Deliverables
- Arduino sketch sending sensor data every 5 seconds
- Node.js service receiving and parsing sensor data
- Basic logging system for connection status

## Phase 2: Database Integration (Week 2)

### Goals
- Design MongoDB schema for sensor data
- Implement CRUD operations with proper indexing
- Add data validation and error handling

### Tasks
1. **Database Schema Design**
   - Collection for sensor readings (timestamp, device_id, temperature, humidity, co2, tvoc)
   - Collection for device metadata (device_id, location, last_seen, status)
   - Collection for test results (later phases)

2. **Data Layer Implementation**
   - MongoDB connection with TypeScript interfaces
   - Data validation using schemas
   - Indexing for time-series queries
   - Query optimization for real-time dashboards

### Deliverables
- MongoDB collections with proper indexing
- TypeScript interfaces for all data models
- Repository pattern for database operations

## Phase 3: REST API Development (Week 3)

### Goals
- Build RESTful API for sensor data management
- Implement real-time data streaming
- Add authentication and validation

### Tasks
1. **API Endpoints**
   ```
   GET /api/devices - List all devices
   GET /api/devices/:id/readings - Get sensor readings
   POST /api/devices/:id/readings - Add sensor reading
   GET /api/devices/:id/status - Get device status
   WebSocket /ws/readings - Real-time data stream
   ```

2. **Middleware & Validation**
   - Request validation using TypeScript interfaces
   - Error handling middleware
   - Rate limiting for API protection
   - CORS configuration

### Deliverables
- Fully functional REST API
- WebSocket implementation for real-time updates
- API documentation (OpenAPI/Swagger)

## Phase 4: React Dashboard (Week 4)

### Goals
- Create responsive dashboard for monitoring devices
- Implement real-time data visualization
- Add device management features

### Tasks
1. **Dashboard Components**
   - Device status overview cards
   - Real-time sensor data charts
   - Historical data visualization
   - Device configuration panel

2. **State Management**
   - TypeScript interfaces for all state
   - Real-time WebSocket integration
   - Error boundary implementation
   - Loading states and error handling

### Deliverables
- React dashboard with real-time updates
- Responsive design for mobile/desktop
- TypeScript throughout the frontend

## Phase 5: Automated Testing Framework (Week 5)

### Goals
- Implement comprehensive testing strategy
- Create hardware-in-the-loop tests
- Set up continuous integration

### Tasks
1. **Unit Tests (Jest)**
   - Serial communication parsing
   - Database operations
   - API endpoint testing
   - React component testing

2. **Integration Tests**
   - End-to-end API testing
   - Database integration testing
   - Mock hardware testing

3. **Hardware-in-the-Loop Testing**
   - Automated sensor reading validation
   - Device connection/disconnection scenarios
   - Data integrity tests

### Deliverables
- Comprehensive test suite (>80% coverage)
- Automated test reports
- CI/CD pipeline configuration

## Phase 6: Advanced Features (Week 6+)

### Goals
- Add features similar to real telematics systems
- Implement device fleet management
- Create automated testing scenarios

### Advanced Features
1. **Device Fleet Management**
   - Multiple device support
   - Device grouping and tagging
   - Bulk operations

2. **Alerting System**
   - Threshold-based alerts
   - Email/SMS notifications
   - Alert history and acknowledgment

3. **Test Automation**
   - Automated test case creation
   - Test scheduling and execution
   - Test result analysis and reporting

4. **Data Analytics**
   - Historical trend analysis
   - Anomaly detection
   - Performance metrics

## Technology Stack Implementation

### Backend (Node.js + TypeScript)
```typescript
// Key packages to use
- express (REST API)
- serialport (Arduino communication)
- mongodb (database driver)
- ws (WebSocket server)
- jest (testing)
- joi (validation)
```

### Frontend (React + TypeScript)
```typescript
// Key packages to use
- react + react-dom
- recharts (data visualization)
- socket.io-client (real-time updates)
- axios (API calls)
- @testing-library/react (testing)
```

### Database (MongoDB)
```javascript
// Collections structure
devices: { _id, deviceId, name, location, status, lastSeen }
readings: { _id, deviceId, timestamp, temperature, humidity, co2, tvoc }
tests: { _id, deviceId, testType, status, results, timestamp }
```

## Getting Started

1. **Set up project structure**
   ```
   iot-testing-system/
   ├── arduino/          # Arduino sketches
   ├── backend/          # Node.js API
   ├── frontend/         # React dashboard
   ├── tests/           # Test suites
   └── docs/            # Documentation
   ```

2. **Initialize each component**
   - Arduino: Create basic sensor reading sketch
   - Backend: Set up Express server with TypeScript
   - Frontend: Initialize Vite React TypeScript project
   - Database: Create MongoDB collections

3. **Start with Phase 1** and progress through each phase systematically

## Success Metrics

By completing this project, you'll demonstrate:
- ✅ Serial communication with embedded devices
- ✅ Buffer management and data parsing
- ✅ MongoDB operations and optimization
- ✅ TypeScript proficiency (frontend + backend)
- ✅ React development skills
- ✅ Automated testing implementation
- ✅ Hardware-in-the-loop testing concepts
- ✅ Agile development practices