# Production Deployment Instructions

This guide provides step-by-step instructions for deploying your React + Node.js + Socket.IO application using Docker with recommended production configurations.

## 🏗️ Architecture Overview

**Development Architecture:**
- Frontend (React + Vite): Port 5173
- Backend API: Port 3000
- Socket Server: Port 4000
- MongoDB: Port 27017

**Production Architecture (Recommended):**
- Single Express Server: Port 3000
  - Serves React build (static files)
  - Handles API routes (`/api/*`)
  - Proxies Socket.IO (`/socket.io/*`)
- Socket Server: Port 4000 (internal)
- MongoDB: Port 27017 (internal)

## 📋 Prerequisites

- Docker and Docker Compose installed
- Your application code structured as shown in the project organization
- Environment variables configured

## 🔧 Step 1: Update Development Configuration

### 1.1 Frontend Socket Connection

Update your frontend to use environment-aware Socket.IO connection:

```typescript
// frontend/src/components/Dashboard.tsx (or wherever you initialize socket)
useEffect(() => {
    // In production, connect to same origin (will be proxied)
    // In development, use Vite proxy
    const newSocket = io();
    setSocket(newSocket);
    
    newSocket.on("arduino-status", (data) => {
        setConnectionStatus(data.status);
    });
    
    return () => newSocket.close();
}, []);
```

### 1.2 Keep Your Vite Config for Development

```typescript
// frontend/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                changeOrigin: true,
            },
            "^/socket\\.io/.*": {
                target: "http://localhost:4000",
                changeOrigin: true,
                ws: true,
            },
        },
    },
});
```

## 🏭 Step 2: Create Production Server

### 2.1 Update Backend API Server

Create or update your main API server to serve React build and proxy Socket.IO:

```javascript
// backend/api/src/server.ts (or app.ts)
import express from 'express';
import path from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();
const PORT = process.env.APP_PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In production, serve React build
if (process.env.NODE_ENV === 'production') {
    // Serve static files from React build
    app.use(express.static(path.join(__dirname, '../../../frontend/dist')));
    
    // Proxy Socket.IO requests to socket server
    app.use('/socket.io', createProxyMiddleware({
        target: `http://socket-server:4000`, // Docker service name
        changeOrigin: true,
        ws: true,
    }));
}

// API routes
app.use('/api', yourApiRoutes);

// In production, serve React app for all other routes
if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../../frontend/dist/index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

### 2.2 Install Required Dependencies

Add to your backend package.json:

```bash
cd backend/api
npm install http-proxy-middleware
```

## 🐳 Step 3: Docker Configuration

### 3.1 Create Dockerfiles

**Frontend Dockerfile:**
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage - nginx to serve static files (alternative)
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Backend API Dockerfile:**
```dockerfile
# backend/api/Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Copy frontend build (if serving from Express)
COPY --from=frontend-builder /app/dist ./frontend/dist

EXPOSE 3000
CMD ["npm", "start"]
```

**Socket Server Dockerfile:**
```dockerfile
# arduino/Dockerfile (or wherever your socket server is)
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 4000
CMD ["npm", "start"]
```

### 3.2 Docker Compose Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    container_name: mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${DB_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${DB_PASSWORD}
      MONGO_INITDB_DATABASE: ${DB_NAME}
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - app-network

  backend-api:
    build:
      context: ./backend/api
      dockerfile: Dockerfile
    container_name: backend-api
    environment:
      NODE_ENV: production
      APP_PORT: 3000
      DB_HOST: mongodb
      DB_PORT: 27017
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_NAME: ${DB_NAME}
      DB_NAME_AUTH: ${DB_NAME_AUTH}
      TOKEN_KEY: ${TOKEN_KEY}
    ports:
      - "3000:3000"
    depends_on:
      - mongodb
      - socket-server
    networks:
      - app-network

  socket-server:
    build:
      context: ./arduino
      dockerfile: Dockerfile
    container_name: socket-server
    environment:
      NODE_ENV: production
      SOCKET_PORT: 4000
      USER_NAME: ${USER_NAME}
      PASSWORD: ${PASSWORD}
    ports:
      - "4000:4000"
    depends_on:
      - mongodb
    networks:
      - app-network

volumes:
  mongodb_data:

networks:
  app-network:
    driver: bridge
```

### 3.3 Alternative: Single Service Approach (Recommended)

If you want to serve everything from one container:

```yaml
# docker-compose.production.yml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    container_name: mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${DB_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${DB_PASSWORD}
      MONGO_INITDB_DATABASE: ${DB_NAME}
    volumes:
      - mongodb_data:/data/db
    networks:
      - app-network

  app:
    build:
      context: .
      dockerfile: Dockerfile.production
    container_name: main-app
    environment:
      NODE_ENV: production
      APP_PORT: 3000
      DB_HOST: mongodb
      DB_PORT: 27017
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_NAME: ${DB_NAME}
      DB_NAME_AUTH: ${DB_NAME_AUTH}
      TOKEN_KEY: ${TOKEN_KEY}
      USER_NAME: ${USER_NAME}
      PASSWORD: ${PASSWORD}
    ports:
      - "80:3000"
    depends_on:
      - mongodb
    networks:
      - app-network

  socket-server:
    build:
      context: ./arduino
      dockerfile: Dockerfile
    container_name: socket-server
    environment:
      NODE_ENV: production
      SOCKET_PORT: 4000
      USER_NAME: ${USER_NAME}
      PASSWORD: ${PASSWORD}
    expose:
      - "4000"
    depends_on:
      - mongodb
    networks:
      - app-network

volumes:
  mongodb_data:

networks:
  app-network:
    driver: bridge
```

## 🌍 Step 4: Environment Configuration

### 4.1 Create Environment Files

```bash
# .env.production
NODE_ENV=production
APP_PORT=3000
SOCKET_PORT=4000

# Database
DB_USER=your_db_user
DB_PASSWORD=your_secure_password
DB_NAME_AUTH=auth_db
DB_NAME=main_db
DB_HOST=mongodb
DB_PORT=27017

# Security
TOKEN_KEY=your_very_secure_secret_key_here

# Arduino
USER_NAME=your_arduino_user
PASSWORD=your_arduino_password
```

### 4.2 Update Socket Server CORS

```javascript
// arduino/src/server.ts (or wherever your socket server is)
export const io = new Server(httpServer, {
    cors: {
        origin: process.env.NODE_ENV === 'production' 
            ? ["http://localhost:3000", "http://backend-api:3000"] // Docker service names
            : [
                "http://localhost:3000",
                "http://localhost:5173",
            ],
        methods: ["GET", "POST"],
    },
});
```

## 🚀 Step 5: Build and Deploy

### 5.1 Build for Production

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd ../backend/api
npm run build

# Build socket server
cd ../../arduino
npm run build
```

### 5.2 Deploy with Docker

```bash
# Using docker-compose
docker-compose -f docker-compose.yml --env-file .env.production up -d

# Or build and run manually
docker-compose build
docker-compose up -d
```

### 5.3 Verify Deployment

```bash
# Check running containers
docker ps

# Check logs
docker-compose logs backend-api
docker-compose logs socket-server

# Test endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000  # Should serve React app
```

## 🔍 Step 6: Testing

### 6.1 Local Testing

1. **Development mode**: `npm run dev` (uses Vite proxy)
2. **Production preview**: `npm run build && npm run preview` (uses Vite proxy)
3. **Production simulation**: Use Docker compose locally

### 6.2 Production Testing

1. Access your app at `http://your-domain.com` or `http://localhost:3000`
2. Verify Socket.IO connection in browser dev tools
3. Test API endpoints: `http://your-domain.com/api/*`
4. Check WebSocket connection in Network tab

## 🛠️ Troubleshooting

### Common Issues

1. **Socket.IO not connecting**: Check CORS configuration and proxy setup
2. **API routes not working**: Verify `/api` prefix in your routes
3. **Static files not served**: Check build output and static file serving
4. **Database connection**: Verify MongoDB connection string and credentials

### Debug Commands

```bash
# Check container logs
docker logs backend-api
docker logs socket-server

# Execute into container
docker exec -it backend-api sh

# Check network connectivity
docker network ls
docker network inspect app-network
```

## 📝 Notes

- **Development**: Uses Vite proxy for Socket.IO
- **Production**: Uses Express proxy for Socket.IO
- **Docker**: All services communicate via Docker network
- **Security**: Use proper secrets management in production
- **Scaling**: Consider using Redis for Socket.IO scaling if needed

## 🔒 Security Considerations

1. Use proper environment variable management (Docker secrets, etc.)
2. Set up proper CORS origins for production
3. Use HTTPS in production
4. Implement rate limiting
5. Use proper authentication and authorization
6. Keep dependencies updated