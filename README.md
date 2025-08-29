# AI Quiz App 🧠

A full-stack AI-powered quiz application that automatically generates multiple-choice quizzes based on user-provided topics using multiple AI models including OpenAI GPT, Anthropic Claude, and Google Gemini.

## 🚀 Features

- **Multi-AI Model Support**: Generate quizzes using OpenAI GPT, Anthropic Claude, or Google Gemini
- **AI-Powered Quiz Generation**: Automatically creates 5 multiple-choice questions on any topic
- **Factual Accuracy with RAG**: Retrieval-augmented generation using Wikipedia for improved accuracy
- **Smart Quiz Reuse**: Intelligent caching and reuse of recent quizzes for cost efficiency
- **Force New Generation**: Option to generate completely new quizzes even for existing topics
- **Interactive Quiz Interface**: Step-by-step navigation with progress tracking and loading states
- **Detailed Results**: Score calculation with explanations and feedback
- **Modern UI/UX**: Responsive design with smooth animations and professional loading states
- **Real-time API**: Fast quiz generation and submission
- **Professional Logging**: Structured logging with Winston
- **Security Features**: Helmet security headers and rate limiting
- **API Documentation**: Complete Swagger/OpenAPI documentation
- **Common Components**: Reusable UI components for consistency and maintainability

## 🏗️ Architecture

```
ai-quiz-app/
├── frontend/           # React + TypeScript + Vite
│   ├── src/
│   │   ├── common/     # 🆕 Reusable UI components
│   │   │   ├── ui/     # LoadingSpinner, Button, etc.
│   │   │   └── index.ts
│   │   ├── components/ # Feature-specific components
│   │   ├── services/   # API services
│   │   └── types/      # TypeScript interfaces
│   └── README.md       # Frontend documentation
├── backend/            # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── routes/     # API endpoints
│   │   ├── services/   # AI integration & logging
│   │   ├── config/     # Swagger configuration
│   │   └── types/      # TypeScript interfaces
│   └── README.md       # Backend documentation
└── README.md           # This file
```

## ✨ Key Features & Capabilities

### **Enhanced User Experience**
- **Quiz Generation Loading**: Full-screen overlay with spinner and informative messages
- **Quiz Submission Loading**: Button states and loading indicators during submission
- **Form Disabling**: Prevents multiple submissions and provides clear feedback
- **Professional Loading Overlays**: Consistent loading experience across the app

### **Intelligent Quiz Management**
- **Smart Caching System**: Redis-based caching for fast quiz retrieval
- **Quiz Reuse Logic**: Automatically reuses recent quizzes (within 24 hours)
- **Force New Generation**: User option to generate completely new quizzes (clears existing topic cache)
- **Cost Optimization**: Reduces AI API calls through intelligent reuse

### **Modern Architecture**
- **Reusable UI Components**: LoadingSpinner, Button, and more in `common/ui/`
- **Consistent Design**: Standardized component patterns across the application
- **Easy Maintenance**: Centralized location for shared components
- **Scalable Structure**: Easy to add new common components

### **Performance & Reliability**
- **Database Optimization**: Efficient queries and proper schema management
- **Migration System**: Robust database schema management with Prisma
- **Error Handling**: Comprehensive error handling and fallback strategies

### **AI-Powered Intelligence**
- **Retrieval-Augmented Generation**: Wikipedia integration for current, factual information
- **Reduced AI Hallucination**: Questions grounded in verified sources
- **Source Attribution**: Wikipedia sources provided for transparency
- **Configurable Features**: Can be enabled/disabled via environment variables

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Axios** for HTTP requests
- **React Router** for client-side routing
- **Lucide React** for consistent iconography

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Multiple AI Providers**: OpenAI GPT, Anthropic Claude, Google Gemini
- **Winston** for structured logging
- **Helmet** for security headers
- **Express Rate Limit** for API protection
- **Swagger/OpenAPI** for API documentation
- **Redis** for intelligent caching
- **PostgreSQL** with Prisma ORM

## 📋 Requirements

- Node.js v18 or higher
- npm or yarn
- Docker and Docker Compose
- OpenAI API key (optional)
- Anthropic API key (optional)
- Google API key (optional)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ai-quiz-app
```

### 2. Backend Setup
```bash
cd backend
docker-compose up -d --build
```

The backend will run on `http://localhost:3001`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Open Your Browser
Navigate to `http://localhost:5173` and start creating quizzes!

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_TEMPERATURE=0.7
OPENAI_MAX_TOKENS=1000

# Anthropic Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_MODEL=claude-3-sonnet-20240229

# Google Gemini Configuration
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_MODEL=gemini-1.5-pro

# Available AI Models (comma-separated)
AVAILABLE_MODELS=gpt-3.5-turbo,gpt-4,gpt-4-turbo,claude-3-sonnet-20240229,claude-3-haiku-20240307,gemini-1.5-pro,gemini-1.5-flash

# Database Configuration
DATABASE_URL="postgresql://postgres:password@postgres:5432/ai_quiz_app?schema=public"

# Redis Configuration
REDIS_URL=redis://redis:6379
REDIS_CACHE_TTL=3600

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3001
```

## 📚 API Documentation

### Swagger UI
Access the interactive API documentation at: `http://localhost:3001/api-docs`

The Swagger documentation includes:
- **Authentication endpoints** (signup, signin, logout)
- **Quiz endpoints** (generate, submit, retrieve)
- **Request/response schemas** with examples
- **Interactive testing** of all API endpoints
- **Security requirements** and authentication

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

#### Quiz Management
- `GET /api/quiz/models` - Get available AI models
- `POST /api/quiz/generate` - Generate new quiz (with forceNew option)
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/:id` - Get quiz by ID

#### Health Check
- `GET /health` - API health status

## 🎯 Quiz Generation Features

### **Smart Quiz Reuse**
- **Automatic Detection**: Finds recent quizzes for the same topic/model
- **24-Hour Window**: Reuses quizzes created within the last day
- **Cost Optimization**: Reduces AI API calls through intelligent reuse
- **User Choice**: Option to force new generation when desired

### **Force New Generation**
- **Checkbox Option**: "Force New Quiz Generation" in the UI
- **Bypass Cache**: Skips existing quiz checks when enabled
- **Fresh Content**: Always generates new questions for variety
- **Clear Feedback**: Button text changes to indicate action

### **Loading States**
- **Generation Loading**: Full-screen overlay during AI processing
- **Submission Loading**: Button states and form disabling
- **Professional UI**: Consistent loading experience throughout
- **User Feedback**: Clear indication of what's happening

## 🔐 Security Features

- **JWT Authentication** for secure user sessions
- **Helmet** security headers to prevent common attacks
- **Rate Limiting** to prevent API abuse
- **Input Validation** on all endpoints
- **CORS Protection** for cross-origin requests

## 📊 Logging

The application uses Winston for structured logging:
- **Console output** with colored log levels
- **File logging** to `logs/error.log` and `logs/all.log`
- **Environment-based** log levels (debug in dev, warn in prod)
- **Structured format** with timestamps

## 🚀 Deployment

### Docker Support
The application includes Docker configuration for easy deployment:
```bash
cd backend
docker-compose up -d --build
```

### Environment Configuration
- Set `NODE_ENV=production` for production
- Configure production database and Redis URLs
- Set secure JWT secrets
- Configure production API keys

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation at `/api-docs`
- Review the logs in the `logs/` directory
- Open an issue on GitHub

---

**Happy Quizzing! 🎯🧠**
