# IoT Test Hub

**Automated testing framework for IoT devices with environmental monitoring**

A comprehensive system that simulates telematics device testing, combining hardware communication, data processing, web interfaces, and automated testing.

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐     ┌─────────────────┐
│   ESP8266       │──▶│   Arduino        │───▶│   Backend API   │
│   (Sensors)     │    │   (Serial Comm)  │     │   (Express/TS)  │
└─────────────────┘    └──────────────────┘     └─────────────────┘
                                                         │
                       ┌─────────────────┐               │
                       │   Frontend      │◀─────────────┤
                       │   (React/TS)    │               │
                       └─────────────────┘               │
                                                         │
                       ┌─────────────────┐               │
                       │   MongoDB       │◀─────────────┘
                       │   (Database)    │
                       └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 14+
- MongoDB
- ESP8266 with DHT22 & CCS811 sensors
- TypeScript 4+

### Installation
```bash
# Clone and install dependencies
git clone https://github.com/DenisTimofijuk/iot-test-hub.git
cd iot-test-hub
npm install

# Setup database
npm run dev:db-setup

# Start development environment
npm run dev
```

### Individual Services
```bash
# Backend API only
npm run dev:api

# Frontend only  
npm run dev:frontend

# Arduino + Backend
npm run dev:arduino
```

## 📦 Project Structure

### `/arduino` - Hardware Communication
- **ESP8266Runner**: Serial communication library
- **Socket Server**: Real-time data streaming
- **Test Runner**: Automated hardware testing

### `/backend/api` - REST API
- **Express + TypeScript**: RESTful API server
- **MongoDB Integration**: Data persistence
- **JWT Authentication**: Secure endpoints
- **Real-time APIs**: WebSocket support

### `/frontend` - React Dashboard
- **Real-time Monitoring**: Live sensor data
- **Data Visualization**: Charts and graphs
- **Device Management**: Fleet monitoring
- **Authentication UI**: Login/logout flow

## 🔧 Key Features

- **Auto-Reconnection**: Automatic ESP8266 connection recovery
- **Real-time Data**: WebSocket streaming for live updates
- **Comprehensive Testing**: Hardware-in-the-loop test framework
- **Fleet Management**: Multi-device monitoring
- **Data Analytics**: Historical data analysis
- **Alert System**: Configurable notifications

## 🧪 Hardware Setup

**Sensors:**
- DHT22: Temperature & Humidity
- CCS811: Air Quality (CO2, TVOC)

**Connection:** USB Serial to ESP8266

## 📊 Data Flow

1. **Sensors** → ESP8266 reads environmental data
2. **Serial** → Arduino service receives data via USB
3. **API** → Data posted to backend via REST
4. **Database** → MongoDB stores readings
5. **WebSocket** → Real-time updates to frontend
6. **Dashboard** → React displays live data & charts

## 🔐 Authentication

- JWT-based authentication
- Protected API endpoints
- Token management
- Role-based access (future)

## 📈 Monitoring

- Connection health monitoring
- Automatic error recovery  
- Comprehensive logging
- Performance metrics

## 🧪 Testing

- Unit tests with Vitest
- Hardware-in-the-loop testing
- API endpoint testing
- Integration testing

## 🛠️ Development

Built with modern TypeScript stack:
- **Backend**: Node.js, Express, MongoDB
- **Frontend**: React, Vite, TailwindCSS
- **Hardware**: SerialPort, Socket.io
- **Testing**: Vitest, Jest

## 📋 Environment Variables

Required in `.env` files:
```bash
# API
APP_PORT=3000
NODE_ENV=development
DB_USER=database_user
DB_PASSWORD=database_user_password
DB_NAME_AUTH=authentication_database_name
DB_NAME=database_name
DB_PORT=5432
DB_HOST=localhost
TOKEN_KEY=your_secret_key

# Arduino  
USER_NAME=user_name_created_in_users_collection
PASSWORD=user_password
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/name`)
3. Commit changes (`git commit -am 'Add feature'`)
4. Push branch (`git push origin feature/name`)
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details