# ESP8266Runner

A robust Node.js TypeScript library for managing serial communication with ESP8266 devices, featuring automatic JSON parsing, connection monitoring, and graceful error handling.

## Features

- 🔄 **Auto-Reconnection**: Automatic connection monitoring with configurable retry logic
- 📊 **Smart JSON Parsing**: Handles both JSON sensor data and plain text messages
- 🛡️ **Buffer Management**: Robust handling of incomplete messages and data streams
- 📝 **Comprehensive Logging**: Structured logging with multiple severity levels
- 🔌 **Connection Health**: Real-time connection monitoring with heartbeat system
- 🛑 **Graceful Shutdown**: Clean resource cleanup on application termination
- 📡 **Event-Driven**: EventEmitter-based architecture for flexible integration

## Installation

```bash
npm install
```

## Quick Start

```typescript
import ESP8266Runner from './ESP8266Runner';

const runner = new ESP8266Runner('/dev/ttyUSB0');

// Listen for sensor data
runner.on('sensorData', (data) => {
    console.log('Temperature:', data.temperature);
    console.log('Humidity:', data.humidity);
});

// Start reading
await runner.readSerialData(60000); // Read for 1 minute
```

## API Reference

### Constructor

```typescript
new ESP8266Runner(portPath: string)
```

- `portPath`: Serial port path (e.g., `/dev/ttyUSB0`, `COM3`)

### Methods

#### `checkConnection(): Promise<boolean>`
Establishes connection to the ESP8266 device.

```typescript
const connected = await runner.checkConnection();
if (connected) {
    console.log('Device ready!');
}
```

#### `readSerialData(duration?: number): Promise<void>`
Reads serial data for specified duration with automatic JSON parsing.

```typescript
// Read for 30 seconds
await runner.readSerialData(30000);
```

#### `logSerialOutput(duration?: number): Promise<void>`
Reads and logs all incoming data to console.

```typescript
await runner.logSerialOutput(10000);
```

#### `shutdown(): Promise<void>`
Gracefully shuts down the connection and cleans up resources.

```typescript
await runner.shutdown();
```

#### `forceReconnect(): Promise<boolean>`
Manually triggers a reconnection attempt.

```typescript
const reconnected = await runner.forceReconnect();
```

#### `clearBuffer(): void`
Manually clears the message buffer.

```typescript
runner.clearBuffer();
```

### Properties

#### `isConnected: boolean`
Current connection status.

#### `reconnectAttempts: number`
Number of reconnection attempts made.

#### `lastSeen: number`
Timestamp of last received data.

## Events

### Connection Events

```typescript
runner.on('connected', () => {
    console.log('Device connected');
});

runner.on('connectionFailed', (error) => {
    console.log('Connection failed:', error);
});

runner.on('connectionLost', () => {
    console.log('Connection lost, reconnecting...');
});

runner.on('reconnectFailed', () => {
    console.log('All reconnect attempts failed');
});
```

### Data Events

```typescript
// Parsed JSON sensor data
runner.on('sensorData', (data) => {
    console.log('Sensor data:', data);
});

// Raw text messages
runner.on('rawMessage', (message) => {
    console.log('Raw message:', message);
});

// Device error messages
runner.on('deviceError', (error) => {
    console.log('Device error:', error);
});
```

### System Events

```typescript
// Logging events
runner.on('log', (logEntry) => {
    console.log(`[${logEntry.level}] ${logEntry.message}`);
});

// Shutdown event
runner.on('shutdown', () => {
    console.log('Graceful shutdown completed');
});
```

## Supported Data Formats

### JSON Sensor Data
The library automatically parses JSON messages from your ESP8266:

```json
{
    "device_id": "ESP8266_b1f57c",
    "timestamp": 2389205,
    "uptime": 2389205,
    "dht22": {
        "temperature": 22.8,
        "humidity": 51,
        "status": "ok"
    },
    "ccs811": {
        "co2": 409,
        "tvoc": 1,
        "status": "ok"
    },
    "system": {
        "free_heap": 49680,
        "wifi_connected": false,
        "sensors_ok": true
    }
}
```

### Error Messages
Plain text error messages are also handled:

```
ERROR: DHT22 reading failed
WARNING: Low memory
```

## Configuration

### Default Settings

```typescript
const config = {
    MAX_RECONNECT_ATTEMPTS: 5,     // Maximum reconnection attempts
    RECONNECT_DELAY: 3000,         // Delay between reconnects (ms)
    HEARTBEAT_INTERVAL: 30000,     // Connection check interval (ms)
    CONNECTION_TIMEOUT: 10000      // Connection timeout (ms)
};
```

### Custom Configuration
You can modify these values by extending the class:

```typescript
class CustomESP8266Runner extends ESP8266Runner {
    constructor(portPath: string) {
        super(portPath);
        this.MAX_RECONNECT_ATTEMPTS = 10;
        this.RECONNECT_DELAY = 5000;
    }
}
```

## Complete Example

```typescript
import ESP8266Runner from './ESP8266Runner';

async function monitorSensors() {
    const runner = new ESP8266Runner('/dev/ttyUSB0');
    
    // Set up comprehensive event handling
    runner.on('connected', () => {
        console.log('🟢 ESP8266 connected successfully');
    });
    
    runner.on('sensorData', (data) => {
        if (data.dht22) {
            console.log(`🌡️  Temperature: ${data.dht22.temperature}°C`);
            console.log(`💧 Humidity: ${data.dht22.humidity}%`);
        }
        
        if (data.ccs811) {
            console.log(`🌬️  CO2: ${data.ccs811.co2} ppm`);
            console.log(`☁️  TVOC: ${data.ccs811.tvoc} ppb`);
        }
    });
    
    runner.on('deviceError', (error) => {
        console.log('⚠️  Device error:', error);
    });
    
    runner.on('connectionLost', () => {
        console.log('🔄 Connection lost, attempting to reconnect...');
    });
    
    try {
        // Start monitoring
        const connected = await runner.checkConnection();
        
        if (connected) {
            console.log('Starting continuous sensor monitoring...');
            
            // Monitor indefinitely
            while (runner.isConnected) {
                await runner.readSerialData(60000); // Read in 1-minute chunks
                
                // Optional: Add small delay between chunks
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
    } catch (error) {
        console.error('Application error:', error);
    } finally {
        await runner.shutdown();
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    process.exit(0);
});

// Start monitoring
monitorSensors().catch(console.error);
```

## Error Handling

### Connection Errors
```typescript
runner.on('connectionFailed', (error) => {
    if (error.code === 'ENOENT') {
        console.log('Device not found. Check connection.');
    } else if (error.code === 'EACCES') {
        console.log('Permission denied. Run with sudo or check permissions.');
    }
});
```

### Data Parsing Errors
The library handles malformed JSON gracefully and continues processing:

```typescript
runner.on('log', (logEntry) => {
    if (logEntry.level === 'warning' && logEntry.message.includes('parse')) {
        console.log('Received malformed data, continuing...');
    }
});
```

## Troubleshooting

### Common Issues

1. **Permission Denied**
   ```bash
   sudo chmod 666 /dev/ttyUSB0
   # or add user to dialout group
   sudo usermod -a -G dialout $USER
   ```

2. **Device Not Found**
   ```bash
   # List available ports
   ls /dev/tty*
   # or
   dmesg | grep tty
   ```

3. **Connection Timeouts**
   - Check baud rate settings
   - Verify ESP8266 is powered and running
   - Check cable connections

### Debug Mode

Enable verbose logging:

```typescript
runner.on('log', (logEntry) => {
    console.log(`[${logEntry.timestamp}] [${logEntry.level.toUpperCase()}] ${logEntry.message}`);
});
```

## Requirements

- Node.js 14+
- TypeScript 4+
- ESP8266SerialManager (your existing serial manager class)

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Changelog

### v1.0.0
- Initial release
- JSON parsing with buffer management
- Auto-reconnection system
- Comprehensive error handling
- Graceful shutdown support