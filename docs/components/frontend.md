# Frontend Dashboard

**React + TypeScript Real-time IoT Monitoring Interface**

Modern, responsive dashboard for monitoring IoT devices with real-time data visualization and device management.

## 🎯 Features

- **Real-time Data**: Live sensor readings via WebSocket
- **Interactive Charts**: Temperature, humidity, air quality graphs
- **Device Management**: Monitor device status and health
- **Authentication**: Secure login/logout with JWT
- **Responsive Design**: Mobile-friendly interface
- **Dark/Light Mode**: Theme switching (future)

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Pages         │    │   Components     │    │   Utils         │
│   (Routes)      │◀──▶│   (Reusable)     │◀──▶│   (Helpers)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Types         │    │   CSS/Styles     │    │   Assets        │
│   (TypeScript)  │    │   (Tailwind)     │    │   (Images)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview build
npm run preview

# Linting
npm run lint
```

## 📱 Pages & Routes

### Authentication Flow
```typescript
/login     -> Authentication.tsx    # Login form
/logout    -> Logout.tsx           # Logout handler
```

### Main Application
```typescript
/          -> Root.tsx             # Route protection
/dashboard -> Dashboard.tsx        # Main monitoring interface
/intro     -> Intro.tsx           # Welcome/onboarding
/error     -> Error.tsx           # Error boundaries
```

## 🧩 Components

### Core Components

**Header Component:**
```typescript
// components/Header.tsx
- Navigation menu
- User profile
- Logout functionality
- Connection status indicator
```

**Chart Component:**
```typescript
// components/Chart.v2.tsx
- Real-time data visualization
- Multiple chart types (line, bar, area)
- Interactive tooltips
- Responsive design
- Data aggregation controls
```

**Connection Status:**
```typescript
// components/ConnectionStatus.tsx
- WebSocket connection indicator
- Device online/offline status
- Connection quality metrics
- Auto-reconnection status
```

## 📊 Data Visualization

**Chart Types:**
- **Line Charts**: Temperature trends over time
- **Area Charts**: Humidity patterns
- **Bar Charts**: Air quality readings
- **Scatter Plots**: Multi-sensor correlations

**Features:**
- Zoom and pan functionality
- Data point tooltips
- Time range selection
- Export capabilities
- Real-time updates

## 🔌 Real-time Updates

**WebSocket Integration:**
```typescript
// Socket.io client connection
const socket = io('http://localhost:8080');

socket.on('sensorData', (data) => {
  updateCharts(data);
  updateDeviceStatus(data.deviceId);
});
```

**Data Flow:**
```
Arduino → Socket Server → Frontend → Chart Updates
```

## 🔐 Authentication

**JWT Token Management:**
```typescript
// utils/auth.ts
- Token storage (memory-based)
- Automatic token refresh
- Route protection
- Session management
```

**Protected Routes:**
```typescript
// Route guards check authentication
if (!isAuthenticated()) {
  redirect('/login');
}
```

## 🎨 Styling

**Tailwind CSS:**
```typescript
// Modern utility-first CSS framework
- Responsive design classes
- Dark mode support
- Custom color schemes
- Component-based styling
```

**Key Design Principles:**
- Mobile-first responsive design
- Clean, modern interface
- Accessibility compliance
- Consistent spacing and typography

## 📊 State Management

**React State:**
```typescript
// useState for local component state
const [sensorData, setSensorData] = useState<Reading[]>([]);
const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');
```

**Context Usage:**
```typescript
// types/ItemContext.type.ts
// Shared state across components
- Authentication state
- Device information
- Real-time data
```

## 🔧 Configuration

**Environment Variables:**
```bash
# .env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:8080
VITE_APP_NAME=IoT Test Hub
```

**Vite Configuration:**
```typescript
// vite.config.ts
- Development server settings
- Build optimization
- Asset handling
- Plugin configuration
```

## 📱 Responsive Design

**Breakpoints:**
- Mobile: 320px - 768px
- Tablet: 768px - 1024px  
- Desktop: 1024px+

**Adaptive Features:**
- Collapsible navigation
- Responsive charts
- Touch-friendly interactions
- Optimized layouts

## 🧪 Testing

**Component Testing:**
```typescript
// Vitest + React Testing Library
- Component rendering tests
- User interaction tests
- API integration tests
- Real-time update tests
```

## 📦 Key Dependencies

**Core Framework:**
- `react`: UI library
- `react-dom`: DOM rendering
- `react-router-dom`: Client-side routing
- `typescript`: Type safety

**Data Visualization:**
- `recharts`: Chart library
- `lucide-react`: Icon library

**Real-time Communication:**
- `socket.io-client`: WebSocket client

**Styling:**
- `tailwindcss`: Utility-first CSS
- `@tailwindcss/vite`: Vite integration

**Authentication:**
- `jsonwebtoken`: JWT handling

## 🚨 Error Handling

**Error Boundaries:**
```typescript
// pages/Error.tsx
- Catches React component errors
- Displays user-friendly messages
- Provides recovery options
```

**API Error Handling:**
```typescript
// utils/fetchItems.ts
- HTTP error status handling
- Network error recovery
- User notification system
```

## 🔍 Performance Optimization

**Code Splitting:**
- Route-based code splitting
- Lazy loading components
- Dynamic imports

**Data Optimization:**
- Efficient re-renders
- Memoization strategies
- Virtual scrolling for large datasets

**Bundle Optimization:**
- Tree shaking
- Asset optimization
- Compression

## 📋 Development Workflow

**Development:**
```bash
npm run dev          # Start dev server
npm run lint         # Code linting
npm run build        # Production build
```

**File Structure:**
```
src/
├── components/      # Reusable UI components
├── pages/          # Route components
├── types/          # TypeScript definitions
├── util/           # Helper functions
├── css/            # Styling files
└── assets/         # Static assets
```