# Arduino Component

**ESP8266 Serial Communication & Testing Framework**

Manages serial communication with ESP8266 devices and provides automated testing capabilities.

## 🔧 Core Components

### ESP8266Runner
**Purpose**: Robust serial communication library
```typescript
class ESP8266Runner {
  // Auto-reconnection with retry logic
  // Smart JSON parsing for sensor data
  // Event-driven architecture
  // Connection health monitoring
}
```

### SerialManager
**Purpose**: Low-level serial port management
```typescript
// Handles buffer management
// Data parsing and validation  
// Connection state management
// Error recovery mechanisms
```

### TestRunner
**Purpose**: Automated hardware testing
```typescript
// Hardware-in-the-loop tests
// Sensor validation
// Performance benchmarking
// Test reporting
```

### Socket Server
**Purpose**: Real-time data streaming
```typescript
// WebSocket server for live updates
// Broadcasts sensor data to frontend
// Connection management
// Error handling
```

## 🚀 Quick Start

```bash
# Development mode
npm run dev

# Production build
npm run build && npm run start

# Run tests
npm run test
```

## ⚙️ Configuration

```typescript
// config/config.ts
export const config = {
  serialPort: '/dev/ttyUSB0',    // ESP8266 port
  baudRate: 115200,              // Communication speed
  apiUrl: 'http://localhost:3000', // Backend API
  socketPort: 8080,              // WebSocket port
  reconnectInterval: 5000,       // Auto-reconnect delay
  maxRetries: 10                 // Connection retry limit
};
```

## 📊 Data Flow

```
ESP8266 Sensors → Serial Port → Arduino Service → Backend API
                      ↓                            ↓
                  Socket Server → Frontend Dashboard
```

## 🔌 Hardware Integration

**Supported Sensors:**
- DHT22: Temperature & Humidity
- CCS811: Air Quality (CO2, TVOC)

**Communication Protocol:**
- Baud Rate: 115200
- Data Format: JSON
- Heartbeat: Every 2s

## 📡 API Integration

**Authentication:**
```typescript
// login.ts - JWT token acquisition
const token = await authenticate(username, password);
```

**Data Transmission:**
```typescript
// sendData.ts - POST sensor readings
await sendSensorData(readings, token);
```

## 🧪 Testing Framework

**Test Types:**
- Connection stability tests
- Data accuracy validation
- Performance benchmarks
- Error recovery tests

**Example Test:**
```typescript
// performTest.ts
const testResult = await runHardwareTest({
  duration: 60000,      // 1 minute test
  sampleRate: 1000,     // 1 sample per second
  validateData: true    // Check data integrity
});
```

## 🔍 Debugging

**Logging Levels:**
- `DEBUG`: Detailed connection info
- `INFO`: Standard operations
- `WARN`: Recoverable issues
- `ERROR`: Critical failures

**Common Issues:**
- **Port Access**: Ensure user has serial port permissions
- **Connection Lost**: Auto-reconnect handles temporary disconnections
- **Data Corruption**: JSON parsing validates incoming data

## 📋 Dependencies

**Core:**
- `serialport`: Hardware communication
- `socket.io`: Real-time streaming
- `axios`: HTTP requests

**Development:**
- `tsx`: TypeScript execution
- `vitest`: Testing framework
- `typescript`: Type checking

## 🔧 Environment Setup

```bash
# .env file
API_URL=http://localhost:3000
SOCKET_PORT=8080
SERIAL_PORT=/dev/ttyUSB0
DEBUG_MODE=true
```

## 🚨 Error Handling

**Connection Errors:**
- Automatic reconnection attempts
- Exponential backoff strategy
- Graceful degradation

**Data Errors:**
- JSON validation
- Sensor range checking
- Duplicate detection

**System Errors:**
- Resource cleanup
- Memory management
- Process recovery