# 🚀 AI Quiz App - Setup Guide

This guide will help you set up the AI Quiz App with:
- 🗄️ **PostgreSQL Database** with Prisma ORM
- 🔐 **User Authentication** (signup/signin)
- 🧠 **Redis Caching** for quiz topics
- 🐳 **Backend Docker Containerization** (Backend + Database)
- 🔒 **Secure quiz submission** without exposing answers

## 📋 **Prerequisites**

- ✅ Node.js 20.x (already installed!)
- ✅ Docker and Docker Compose
- ✅ OpenAI API key 

## 🐳 **Backend Containerized Setup (Recommended)**

### **Step 1: Start Backend Services with Docker**
```bash
# From the backend directory
cd backend

# Start the backend application stack
docker-compose up -d --build

# Check all services are running
docker-compose ps
```

### **Step 2: Access Your Services**
- **Backend API**: http://localhost:3001
- **Database**: localhost:5432
- **Redis**: localhost:6379
- **pgAdmin**: http://localhost:5050 (admin@aiquiz.com / admin123)

### **Step 3: View Logs**
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f postgres
```

## 🔧 **Development Setup (Frontend + Backend)**

### **Step 1: Start Only Database Services**
```bash
cd backend

# Start only database services
docker-compose up -d --build postgres redis pgadmin

# Start backend in development mode
npm run dev

# In another terminal, start frontend
cd ../frontend
npm run dev
```

## 🧪 **Testing the Setup**

### **1. Health Check**
```bash
# Backend health
curl http://localhost:3001/health
```

### **2. User Registration**
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "testuser"
  }'
```

### **3. Generate Quiz**
```bash
# Use the token from registration
curl -X POST http://localhost:3001/api/quiz/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"topic": "Photosynthesis"}'
```

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React Dev)   │◄──►│   (Docker)      │◄──►│   (PostgreSQL)  │
│   Port 5173     │    │   Port 3001     │    │   Port 5432     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │     Redis       │
                       │   (Cache)       │
                       │   Port 6379     │
                       └─────────────────┘
```

## 🔐 **Security Features**

- ✅ **JWT Authentication** for protected routes
- ✅ **Password Hashing** with bcrypt
- ✅ **Answer Validation** on backend only
- ✅ **Input Validation** and sanitization
- ✅ **Rate Limiting** (configurable)
- ✅ **Security Headers** (XSS protection, CSRF, etc.)
- ✅ **Health Checks** for all services

## 🚀 **Production Deployment**

### **Environment Variables**
```bash
# Set your OpenAI API key
export OPENAI_API_KEY=your_actual_api_key

# Start with production environment
docker-compose --env-file .env.production up -d --build
```

### **Scaling**
```bash
# Scale backend services
docker-compose up -d --scale backend=3 --build
```

## 🔧 **Development Commands**

```bash
# Backend operations
docker-compose up -d --build          # Start all services
docker-compose down                   # Stop all services
docker-compose restart                # Restart all services
docker-compose logs -f                # View all logs

# Individual service operations
docker-compose up -d postgres redis    # Start only databases
docker-compose up -d backend           # Start only backend

# Build and rebuild
docker-compose build                    # Build all images
docker-compose build backend            # Build only backend

# Database operations
docker-compose exec postgres psql -U postgres -d ai_quiz_app
docker-compose exec redis redis-cli
```

## 🚨 **Troubleshooting**

### **Container Issues**
```bash
# Check container status
docker-compose ps

# View container logs
docker-compose logs -f [service_name]

# Restart specific service
docker-compose restart [service_name]

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d --build
```

### **Database Connection Issues**
```bash
# Check database health
docker-compose exec postgres pg_isready -U postgres

# Reset database
docker-compose down -v
docker-compose up -d --build
```

### **Port Conflicts**
```bash
# Check what's using ports
lsof -i :3001
lsof -i :5432
lsof -i :6379

# Change ports in docker-compose.yml if needed
```

---

**Happy Coding! 🚀✨**
