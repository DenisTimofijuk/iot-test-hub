# Development Guide

**Setup, workflow, and best practices for IoT Test Hub development**

## 🛠️ Prerequisites

### Required Software
- **Node.js**: v14+ (recommended v18+)
- **MongoDB**: v4.4+ (local or Atlas)
- **Git**: Version control
- **VS Code**: Recommended editor

### Hardware Requirements
- **ESP8266**: Arduino-compatible board
- **DHT22**: Temperature/humidity sensor
- **CCS811**: Air quality sensor  
- **USB Cable**: Serial communication

## 🚀 Initial Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd iot-test-hub
```

### 2. Install Dependencies
```bash
# Install all workspace dependencies
npm install

# Individual workspace installs (if needed)
npm install --workspace=frontend
npm install --workspace=backend/api
npm install --workspace=arduino
```

### 3. Environment Configuration

**Root `.env`:**
```bash
NODE_ENV=development
```

**Backend `.env` (`backend/api/.env`):**
```bash
APP_PORT=3000
NODE_ENV=development
DB_USER=database_user
DB_PASSWORD=database_user_password
DB_NAME_AUTH=authentication_database_name
DB_NAME=database_name
DB_PORT=5432
DB_HOST=localhost
TOKEN_KEY=your_secret_key
```

**Arduino `.env` (`arduino/.env`):**
```bash
USER_NAME=user_name_created_in_users_collection
PASSWORD=user_password
```

### 4. Database Setup
```bash
# Initialize MongoDB collections and indexes
npm run dev:db-setup
```

## 🏃‍♂️ Development Workflow

### Start Development Environment
```bash
# Start all services (recommended)
npm run dev

# Or start individual services:
npm run dev:api          # Backend only
npm run dev:frontend     # Frontend only  
npm run dev:arduino      # Arduino + Backend
```

### Service URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Socket Server**: http://localhost:4000
- **MongoDB**: mongodb://localhost:27017

## 🔧 Development Commands

### Root Level (Monorepo)
```bash
npm run dev              # Start all services
npm run start:api        # Production backend
npm run start:frontend   # Production frontend
npm run dev:db-setup     # Initialize database
```

### Backend Commands
```bash
cd backend/api
npm run dev              # Development server
npm run build            # TypeScript compilation
npm run start            # Production server
npm run setup            # Database setup
npm run lint             # Code linting
```

### Frontend Commands  
```bash
cd frontend
npm run dev              # Development server
npm run build            # Production build
npm run preview          # Preview build
npm run lint             # Code linting
```

### Arduino Commands
```bash
cd arduino
npm run dev              # Development mode
npm run build            # Production build
npm run start            # Production start
npm run test             # Run tests
```

## 🧪 Testing Strategy

### Unit Testing
```bash
# Backend tests
cd backend/api && npm test

# Arduino tests  
cd arduino && npm test

# Frontend tests (future)
cd frontend && npm test
```

### Integration Testing
```bash
# Hardware-in-the-loop tests
cd arduino && npm run test:integration

# API endpoint tests
cd backend/api && npm run test:api
```

### Manual Testing Checklist
- [ ] Serial connection to ESP8266
- [ ] Sensor data reception
- [ ] API authentication flow
- [ ] Real-time data streaming
- [ ] Frontend data visualization
- [ ] Error recovery mechanisms

## 🐛 Debugging

### Backend Debugging
```bash
# Enable debug logging
LOG_LEVEL=debug npm run dev

# MongoDB connection issues
# Check MONGODB_URI in .env
# Ensure MongoDB service is running
```

### Arduino Debugging
```bash
# Serial port issues
ls /dev/ttyUSB*          # Linux
ls /dev/cu.*             # macOS

# Permission issues (Linux)
sudo usermod -a -G dialout $USER
# Logout/login after this command
```

### Frontend Debugging
```bash
# Network issues
# Check browser developer tools
# Verify API_URL in .env
# Check CORS configuration
```

## 📁 Project Structure Best Practices

### Code Organization
```
├── shared/              # Shared types/utilities
├── backend/api/
│   ├── src/
│   │   ├── controllers/ # Business logic
│   │   ├── models/      # Database schemas
│   │   ├── routes/      # API endpoints
│   │   ├── middlewares/ # Request processing
│   │   ├── utils/       # Helper functions
│   │   └── types/       # TypeScript definitions
├── arduino/
│   ├── src/
│   │   ├── config/      # Configuration
│   │   ├── types/       # Type definitions
│   │   └── *.ts         # Core modules
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI
    │   ├── pages/       # Route components
    │   ├── types/       # Type definitions
    │   └── util/        # Helper functions
```

### Naming Conventions
- **Files**: camelCase.ts, PascalCase.tsx
- **Components**: PascalCase
- **Functions**: camelCase  
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase

## 🔒 Security Considerations

### Development Security
- Never commit `.env` files
- Use strong JWT secrets
- Validate all inputs
- Sanitize database queries

### Production Security
- Enable HTTPS
- Use environment-specific configs
- Implement rate limiting
- Regular dependency updates

## 🚀 Deployment Preparation

### Build Process
```bash
# Backend build
cd backend/api && npm run build

# Frontend build  
cd frontend && npm run build

# Arduino build
cd arduino && npm run build
```

### Environment Variables
- Ensure all `.env` files are configured
- Use different secrets for production
- Configure proper CORS origins

## 📝 Code Quality

### Linting
```bash
# Run linters
npm run lint --workspace=backend/api
npm run lint --workspace=frontend
```

### Type Checking
```bash
# TypeScript compilation check
npm run build --workspace=backend/api
npm run build --workspace=frontend
npm run build --workspace=arduino
```

### Git Workflow
```bash
# Feature development
git checkout -b feature/sensor-validation
git add .
git commit -m "feat: add sensor data validation"
git push origin feature/sensor-validation

# Create pull request for review
```

## 🆘 Common Issues & Solutions

### Port Already in Use
```bash
# Find process using port
lsof -ti:3000
kill -9 <PID>

# Or use different ports in .env
```

### Serial Port Access Denied
```bash
# Linux: Add user to dialout group
sudo usermod -a -G dialout $USER

# macOS: Check Security & Privacy settings
```

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux

# Check connection string in .env
```

### Frontend Build Issues  
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

## 📚 Learning Resources

- **TypeScript**: https://www.typescriptlang.org/docs/
- **React**: https://react.dev/learn
- **Express.js**: https://expressjs.com/
- **MongoDB**: https://docs.mongodb.com/
- **Socket.io**: https://socket.io/docs/
- **SerialPort**: https://serialport.io/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs

## 🔄 Continuous Integration

### Pre-commit Hooks
```bash
# Install husky for git hooks
npm install --save-dev husky

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint"
```

### GitHub Actions (Future)
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test
```

## 📊 Performance Monitoring

### Development Metrics
```bash
# Bundle size analysis
cd frontend && npm run build -- --analyze

# Memory usage monitoring
node --inspect backend/api/dist/index.js
```

### Production Monitoring
- Database query performance
- API response times
- Real-time connection stability
- Memory usage patterns

## 🤝 Contributing Guidelines

### Code Style
- Use TypeScript strict mode
- Follow ESLint configurations
- Write meaningful commit messages
- Add comments for complex logic

### Pull Request Process
1. Create feature branch
2. Implement changes with tests
3. Update documentation
4. Submit PR with description
5. Address review feedback
6. Merge after approval

## 📋 Release Checklist

### Pre-release
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Version numbers bumped
- [ ] Changelog updated
- [ ] Security review completed

### Release Process
- [ ] Create release branch
- [ ] Build production artifacts
- [ ] Deploy to staging
- [ ] Validate functionality
- [ ] Deploy to production
- [ ] Monitor for issues