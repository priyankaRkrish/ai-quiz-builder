# 🚀 AI Quiz App - Enhanced Setup Guide (Containerized)

This guide will help you set up the enhanced AI Quiz App with:
- 🗄️ **PostgreSQL Database** with Prisma ORM
- 🔐 **User Authentication** (signup/signin)
- 🧠 **Redis Caching** for quiz topics
- 🐳 **Full Docker Containerization** (Backend + Frontend + Database)
- 🔒 **Secure quiz submission** without exposing answers

## 📋 **Prerequisites**

- ✅ Node.js 20.x (already installed!)
- ✅ Docker and Docker Compose
- ✅ OpenAI API key (optional)

## 🐳 **Option 1: Full Containerized Setup (Recommended)**

### **Step 1: Start Everything with Docker**
```bash
# From the backend directory
cd backend

# Start the entire application stack
docker-compose up -d

# Check all services are running
docker-compose ps
```

### **Step 2: Access Your Application**
- **Frontend**: http://localhost (port 80)
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
docker-compose logs -f frontend
docker-compose logs -f postgres
```

## 🔧 **Option 2: Development Setup (Non-Containerized)**

### **Step 1: Start Only Database Services**
```bash
cd backend

# Start only database services
docker-compose up -d postgres redis pgadmin

# Start backend in development mode
npm run dev

# In another terminal, start frontend
cd ../frontend
npm run dev
```

## 🧪 **Testing the Containerized Setup**

### **1. Health Check**
```bash
# Frontend health
curl http://localhost/health

# Backend health
curl http://localhost:3001/health
```

### **2. User Registration**
```bash
curl -X POST http://localhost/api/auth/signup \
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
curl -X POST http://localhost/api/quiz/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"topic": "Photosynthesis"}'
```

## 🏗️ **Containerized Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Nginx)       │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)  │
│   Port 80       │    │   Port 3001     │    │   Port 5432     │
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
docker-compose --env-file .env.production up -d
```

### **Scaling**
```bash
# Scale backend services
docker-compose up -d --scale backend=3

# Scale frontend services
docker-compose up -d --scale frontend=2
```

## 🔧 **Development Commands**

```bash
# Full stack operations
docker-compose up -d          # Start all services
docker-compose down           # Stop all services
docker-compose restart        # Restart all services
docker-compose logs -f        # View all logs

# Individual service operations
docker-compose up -d postgres redis    # Start only databases
docker-compose up -d backend           # Start only backend
docker-compose up -d frontend          # Start only frontend

# Build and rebuild
docker-compose build                    # Build all images
docker-compose build backend            # Build only backend
docker-compose build frontend           # Build only frontend

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
docker-compose up -d
```

### **Database Connection Issues**
```bash
# Check database health
docker-compose exec postgres pg_isready -U postgres

# Reset database
docker-compose down -v
docker-compose up -d
```

### **Port Conflicts**
```bash
# Check what's using ports
lsof -i :80
lsof -i :3001
lsof -i :5432
lsof -i :6379

# Change ports in docker-compose.yml if needed
```

## 🎉 **Success Criteria**

Your containerized setup is successful when:
- ✅ All Docker containers are running
- ✅ Frontend accessible at http://localhost
- ✅ Backend API accessible at http://localhost:3001
- ✅ Database connection working
- ✅ User registration works
- ✅ Quiz generation works
- ✅ Health checks pass

## 🔮 **Next Steps**

After successful containerization:
1. **Customize Configuration**: Modify nginx.conf, Dockerfiles
2. **Add Monitoring**: Prometheus, Grafana, or similar
3. **CI/CD Pipeline**: GitHub Actions, GitLab CI, etc.
4. **Production Deployment**: AWS, GCP, Azure, or similar
5. **Load Balancing**: Nginx, HAProxy, or cloud load balancers

## 💡 **Benefits of This Containerized Setup**

- 🚀 **One Command Deployment**: `docker-compose up -d`
- 🔄 **Easy Scaling**: Scale services independently
- 🌍 **Environment Consistency**: Same setup everywhere
- 📦 **Self-Contained**: All dependencies included
- 🔒 **Production Ready**: Security, health checks, monitoring
- 📊 **Professional**: Industry-standard deployment approach

---

**Happy Containerizing! 🐳✨**
