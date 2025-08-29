# AI Quiz App - Backend

A Node.js/Express backend for the AI-powered quiz application that generates multiple-choice quizzes using multiple AI models including OpenAI GPT, Anthropic Claude, and Google Gemini.

## Features

- 🚀 **RESTful API** endpoints for quiz generation and submission
- 🤖 **Multi-AI Model Support**: OpenAI GPT, Anthropic Claude, Google Gemini
- 🧠 **AI-Powered Quiz Generation**: Creates 5 multiple-choice questions on any topic
- **Smart Quiz Reuse**: Intelligent caching and reuse of recent quizzes
- **Force New Generation**: Option to generate completely new quizzes (clears existing topic cache)
- 📚 **Redis Caching**: Fast quiz retrieval and intelligent caching
- 🗄️ **Database Integration**: PostgreSQL with Prisma ORM for persistent storage
- 🔒 **JWT Authentication**: Secure user sessions and API access
- 📊 **Score Calculation**: Detailed feedback with explanations
- 🎯 **Input Validation**: Comprehensive validation and error handling
- 📖 **API Documentation**: Complete Swagger/OpenAPI documentation
- 🚦 **Rate Limiting**: API protection against abuse
- 📝 **Professional Logging**: Structured logging with Winston

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **AI Integration**: OpenAI GPT, Anthropic Claude, Google Gemini
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis
- **Authentication**: JWT
- **Documentation**: Swagger/OpenAPI
- **Development**: Nodemon, ts-node, Jest

## Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- PostgreSQL database
- Redis server
- AI API keys (optional, but recommended for full functionality)

## Installation

### **Option 1: Docker (Recommended)**

1. Clone the repository and navigate to backend:
   ```bash
   cd backend
   ```

2. Set up environment variables:
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your configuration:
   ```bash
   # AI API Keys
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   GOOGLE_API_KEY=your_google_api_key_here
   
   # JWT
   JWT_SECRET=your_jwt_secret_key_here
   ```

3. Start all services with Docker:
   ```bash
   docker-compose up -d --build
   ```

4. Run database migrations:
   ```bash
   docker-compose exec backend npx prisma migrate dev
   docker-compose exec backend npx prisma generate
   ```

### **Option 2: Local Development**

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your configuration:
   ```bash
   # AI API Keys
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   GOOGLE_API_KEY=your_google_api_key_here
   
   # Database
   DATABASE_URL="postgresql://postgres:password@localhost:5432/ai_quiz_app?schema=public"
   
   # Redis
   REDIS_URL=redis://localhost:6379
   
   # JWT
   JWT_SECRET=your_jwt_secret_key_here
   ```

3. Start database services:
   ```bash
   docker-compose up -d --build postgres redis pgadmin
   ```

4. Set up the database:
   ```bash
   # Run database migrations
   npx prisma migrate dev
   
   # Generate Prisma client
   npx prisma generate
   ```

5. Build the project:
   ```bash
   npm run build
   ```

## Development

### **Option 1: Full Docker Development**
```bash
# Start all services with hot reload
docker-compose up -d --build

# View logs
docker-compose logs -f backend
```

### **Option 2: Hybrid Development (Recommended)**
```bash
# Start only database services
docker-compose up -d --build postgres redis pgadmin

# Start backend locally with hot reload
npm run dev
```

The server will run on `http://localhost:3001`

## Production

Build and start the production server:
```bash
npm run build
npm start
```

## Smart Quiz Reuse System

### **Intelligent Caching**
- **Redis Integration**: Fast quiz retrieval from cache
- **24-Hour Window**: Automatically reuses recent quizzes
- **Cost Optimization**: Reduces AI API calls through smart reuse

### **Force New Generation**
- **API Parameter**: `forceNew` flag to bypass cache and existing quizzes
- **Fresh Content**: Always generates new questions when requested
- **User Choice**: Frontend option to force new generation

### **Database Integration**
- **Efficient Queries**: Optimized database queries for existing quizzes
- **Migration System**: Proper database schema management with Prisma
- **Performance**: Fast quiz retrieval and storage

## API Endpoints

### **Authentication** (`/api/auth`)
- **POST** `/api/auth/signup` - User registration with email, password, and username
- **POST** `/api/auth/signin` - User login with email and password
- **POST** `/api/auth/logout` - User logout (client-side token removal)
- **GET** `/api/auth/profile` - Get current user profile (requires authentication)

### **Quiz Management** (`/api/quiz`)
- **GET** `/api/quiz/models` - Get available AI models for quiz generation
- **POST** `/api/quiz/generate` - Generate new AI quiz based on topic and model
  - **Parameters**: `topic` (required), `model` (optional), `forceNew` (optional)
  - **forceNew**: Set to `true` to bypass cache, clear existing topic cache, and generate completely new quiz
- **POST** `/api/quiz/submit` - Submit quiz answers and get results with scoring
- **GET** `/api/quiz/:id` - Get quiz details by ID (without correct answers)
- **GET** `/api/quiz/submissions/history` - Get user's quiz submission history
- **GET** `/api/quiz/submissions/:id` - Get detailed submission results by ID

### **System**
- **GET** `/health` - Server health check
- **GET** `/api-docs` - Interactive API documentation (Swagger/OpenAPI)

### **Authentication Required**
All quiz endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Enhanced Quiz Generation

### **Retrieval-Augmented Generation (RAG)**
- **Wikipedia Integration**: Automatically retrieves factual context for quiz topics
- **Improved Accuracy**: Questions grounded in current, verified information
- **Configurable**: Enable/disable via `ENABLE_FACTUAL_CONTEXT` environment variable
- **Fallback Support**: Gracefully falls back to standard AI generation if Wikipedia unavailable

### **Multi-AI Model Support**
```typescript
// Available models
const models = [
  'gpt-3.5-turbo',
  'gpt-4',
  'gpt-4-turbo',
  'claude-3-sonnet-20240229',
  'claude-3-haiku-20240307',
  'gemini-1.5-pro',
  'gemini-1.5-flash'
];
```

### **Smart Generation Logic**
1. **Check Redis Cache**: Fast retrieval of cached quizzes
2. **Database Lookup**: Find recent quizzes for the same topic/model
3. **AI Generation**: Generate new quiz if no recent one exists
4. **Cache Storage**: Store new quiz in Redis for future use

### **Force New Generation**
```typescript
// API request with forceNew flag
POST /api/quiz/generate
{
  "topic": "Quantum Physics",
  "model": "gpt-4",
  "forceNew": true  // Skip cache and existing quiz checks
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `OPENAI_API_KEY` | OpenAI API key | undefined |
| `ANTHROPIC_API_KEY` | Anthropic API key | undefined |
| `GOOGLE_API_KEY` | Google API key | undefined |
| `DATABASE_URL` | PostgreSQL connection string | undefined |
| `REDIS_URL` | Redis connection string | redis://localhost:6379 |
| `REDIS_CACHE_TTL` | Cache time-to-live (seconds) | 3600 |
| `JWT_SECRET` | JWT signing secret | undefined |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |

## Architecture

```
src/
├── server.ts              # Main server entry point
├── config/
│   └── swagger.ts         # Swagger/OpenAPI configuration
├── database/
│   └── config.ts          # Database configuration
├── middleware/
│   └── auth.ts            # JWT authentication middleware
├── routes/
│   ├── auth.ts            # Authentication endpoints
│   └── quiz.ts            # Quiz-related API endpoints
├── services/
│   ├── aiService.ts       # Multi-AI integration and quiz generation
│   ├── prismaService.ts   # Database service
│   ├── redisService.ts    # Redis caching service
│   └── loggerService.ts   # Winston logging service
├── types/
│   └── quiz.ts            # TypeScript interfaces
└── prisma/
    └── schema.prisma      # Database schema
```

## Database Schema

### **Quiz Model**
```prisma
model Quiz {
  id            Int      @id @default(autoincrement())
  topic         String
  model         String   @default("gpt-3.5-turbo")
  userId        Int?     @map("user_id")
  createdAt     DateTime @default(now())
  expiresAt     DateTime
  isAiGenerated Boolean  @default(false)
  cacheKey      String?
  
  user        User?            @relation(fields: [userId], references: [id])
  questions   Question[]
  submissions QuizSubmission[]
}
```

### **Key Features**
- **Smart Caching**: Cache key management for efficient retrieval
- **User Association**: Link quizzes to specific users
- **Expiration**: Automatic quiz expiration for security
- **Relationships**: Proper database relationships with Prisma

## Redis Caching

### **Cache Strategy**
- **Quiz Storage**: Store generated quizzes with TTL
- **Smart Keys**: Deterministic cache keys for topic/model combinations
- **Performance**: Fast retrieval for repeated topic requests
- **Cost Optimization**: Reduce AI API calls through intelligent reuse

### **Cache Implementation**
```typescript
// Cache key format
const cacheKey = `quiz:${topic.toLowerCase().trim()}:${model}`;

// Cache operations
await redisService.setQuizCache(cacheKey, quizData, ttl);
const cachedQuiz = await redisService.getQuizCache(cacheKey);
```

## Error Handling

The API includes comprehensive error handling:
- **Input Validation**: 400 Bad Request for invalid input
- **Authentication**: 401 Unauthorized for missing/invalid tokens
- **Resource Not Found**: 404 for missing quizzes/users
- **Rate Limiting**: 429 Too Many Requests for API abuse
- **Internal Errors**: 500 for server-side issues
- **Graceful Fallbacks**: Fallback quizzes when AI services fail

## Security Features

- **JWT Authentication**: Secure user sessions
- **Helmet**: Security headers to prevent common attacks
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Comprehensive validation on all endpoints
- **CORS Protection**: Cross-origin request handling
- **Environment Variables**: Secure configuration management

## Logging

### **Winston Integration**
- **Console Output**: Colored log levels for development
- **File Logging**: Persistent logs in `logs/` directory
- **Structured Format**: JSON logging with timestamps
- **Environment-Based**: Different log levels for dev/prod

### **Log Categories**
- **AI Service**: Quiz generation and AI interactions
- **Database**: Database operations and queries
- **Authentication**: User login/logout events
- **API Requests**: Endpoint access and performance

## API Documentation

### **Swagger/OpenAPI**
- **Interactive Docs**: Available at `/api-docs`
- **Request/Response Schemas**: Complete API specification
- **Authentication**: JWT token requirements
- **Testing**: Interactive API testing interface

### **Documentation Features**
- **Endpoint Descriptions**: Clear explanation of each endpoint
- **Request Examples**: Sample requests with all parameters
- **Response Schemas**: Detailed response structure
- **Error Codes**: Comprehensive error documentation

## Testing

Run tests with Jest:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Docker Support

The application includes Docker configuration for easy development and deployment:

### **Quick Start**
```bash
# Start all services (backend + database)
docker-compose up -d --build

# Check service status
docker-compose ps

# View all logs
docker-compose logs -f
```

### **Service Management**
```bash
# Start only database services
docker-compose up -d --build postgres redis pgadmin

# Start only backend
docker-compose up -d --build backend

# Stop all services
docker-compose down

# Restart services
docker-compose restart
```

### **Development Workflow**
```bash
# Start databases, run backend locally
docker-compose up -d --build postgres redis pgadmin
npm run dev

# Full containerized development
docker-compose up -d --build
```

### **Production Deployment**
```bash
# Production environment
docker-compose --env-file .env.production up -d --build

# Scale backend services
docker-compose up -d --scale backend=3 --build
```

## Future Enhancements

- **WebSocket Support**: Real-time quiz updates
- **Analytics**: User behavior and quiz performance metrics
- **Advanced Caching**: Multi-level caching strategies
- **Microservices**: Service decomposition for scalability
- **GraphQL**: Alternative to REST API
- **Event Streaming**: Real-time event processing
- **Machine Learning**: Quiz difficulty adaptation

## Contributing

1. Follow TypeScript best practices
2. Add proper error handling and validation
3. Include JSDoc comments for public functions
4. Write tests for new features
5. Update this README for new features
6. Follow the established code patterns

## License

ISC
