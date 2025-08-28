# 🏗️ System Architecture Diagrams

This document contains essential diagrams to help interviewers understand the AI Quiz App architecture and the new RAG implementation.

## 🎯 **1. System Architecture Overview**

```mermaid
graph TB
    subgraph "Frontend (React + TypeScript)"
        UI[User Interface]
        Auth[Authentication]
        Quiz[Quiz Components]
    end
    
    subgraph "Backend (Node.js + Express)"
        API[API Gateway]
        AuthM[Auth Middleware]
        RateL[Rate Limiting]
    end
    
    subgraph "Core Services"
        AIService[AI Service<br/>Multi-Provider]
        QuizService[Quiz Service]
        CacheService[Redis Cache]
        DBService[Database Service]
    end
    
    subgraph "External APIs"
        OpenAI[OpenAI GPT]
        Claude[Anthropic Claude]
        Wiki[Wikipedia API]
    end
    
    subgraph "Data Layer"
        Redis[(Redis Cache)]
        Postgres[(PostgreSQL)]
    end
    
    UI --> API
    Auth --> API
    Quiz --> API
    
    API --> AuthM
    API --> RateL
    API --> AIService
    API --> QuizService
    
    AIService --> OpenAI
    AIService --> Claude
    AIService --> Wiki
    
    QuizService --> CacheService
    QuizService --> DBService
    
    CacheService --> Redis
    DBService --> Postgres
    
    style AIService fill:#e1f5fe
    style Wiki fill:#f3e5f5
    style CacheService fill:#e8f5e8
```

## 🔍 **2. RAG (Retrieval-Augmented Generation) Flow**

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant AI as AI Service
    participant W as Wikipedia API
    participant C as Cache
    participant DB as Database
    
    U->>F: Request Quiz Topic
    F->>B: POST /api/quiz/generate
    
    Note over B: Check Cache First
    B->>C: Get Cached Quiz
    
    alt Quiz Found in Cache
        C-->>B: Return Cached Quiz
        B-->>F: Return Quiz
        F-->>U: Display Quiz
    else Generate New Quiz
        Note over B: RAG Implementation
        B->>AI: Generate Quiz with Topic
        
        AI->>W: Search Wikipedia
        W-->>AI: Return Article Results
        
        AI->>W: Get Article Content
        W-->>AI: Return Factual Context
        
        Note over AI: Inject Context into Prompt
        AI->>AI: Create Enhanced Prompt
        
        AI->>AI: Generate Questions with Context
        AI-->>B: Return Enhanced Quiz
        
        B->>DB: Store Quiz
        B->>C: Cache Quiz
        B-->>F: Return Quiz
        F-->>U: Display Quiz
    end
```

## 🌊 **3. API Request Flow**

```mermaid
flowchart TD
    A[Client Request] --> B{Authentication?}
    B -->|No| C[Return 401]
    B -->|Yes| D[Rate Limit Check]
    
    D -->|Exceeded| E[Return 429]
    D -->|OK| F[Route Handler]
    
    F --> G{Quiz Generation?}
    G -->|No| H[Other Endpoints]
    G -->|Yes| I[RAG Process]
    
    I --> J[Check Cache]
    J -->|Hit| K[Return Cached Quiz]
    J -->|Miss| L[Wikipedia Context Retrieval]
    
    L --> M{Context Found?}
    M -->|No| N[Standard AI Generation]
    M -->|Yes| O[Enhanced AI Generation]
    
    N --> P[Store & Cache]
    O --> P
    P --> Q[Return Quiz]
    
    style I fill:#e1f5fe
    style L fill:#f3e5f5
    style O fill:#e8f5e8
```

## 🗄️ **4. Database Schema**

```mermaid
erDiagram
    USERS {
        int id PK
        string email UK
        string password_hash
        timestamp created_at
        timestamp updated_at
    }
    
    QUIZZES {
        int id PK
        string topic
        string model
        int user_id FK
        timestamp created_at
        timestamp expires_at
    }
    
    QUESTIONS {
        int id PK
        int quiz_id FK
        string question_text
        json options
        string correct_answer
        string explanation
        timestamp created_at
    }
    
    QUIZ_ATTEMPTS {
        int id PK
        int quiz_id FK
        int user_id FK
        int score
        json answers
        timestamp completed_at
    }
    
    CACHE_ENTRIES {
        string key PK
        text value
        int ttl
        timestamp created_at
    }
    
    USERS ||--o{ QUIZZES : creates
    USERS ||--o{ QUIZ_ATTEMPTS : attempts
    QUIZZES ||--o{ QUESTIONS : contains
    QUIZZES ||--o{ QUIZ_ATTEMPTS : attempted
```

## 🎨 **5. Frontend Component Hierarchy**

```mermaid
graph TD
    App[App.tsx] --> AuthContext[AuthContext]
    App --> Router[Router]
    
    Router --> LandingPage[LandingPage]
    Router --> AuthPage[AuthPage]
    Router --> QuizInterface[QuizInterface]
    
    AuthPage --> LoginForm[LoginForm]
    AuthPage --> SignupForm[SignupForm]
    
    QuizInterface --> TopicInput[TopicInput]
    QuizInterface --> QuizComponent[QuizComponent]
    QuizInterface --> QuizResults[QuizResults]
    
    QuizComponent --> Header[Header]
    
    subgraph "Common UI Components"
        Common[common/ui/]
        Common --> LoadingSpinner[LoadingSpinner]
        Common --> Button[Button]
        Common --> Card[Card]
    end
    
    TopicInput --> Common
    QuizComponent --> Common
    QuizResults --> Common
    
    style Common fill:#e8f5e8
    style QuizInterface fill:#e1f5fe
```

## 🔄 **6. Data Flow in RAG System**

```mermaid
graph LR
    subgraph "Input Layer"
        Topic[Quiz Topic]
    end
    
    subgraph "Retrieval Layer"
        Search[Wikipedia Search]
        Content[Content Extraction]
        Context[Factual Context]
    end
    
    subgraph "Generation Layer"
        Prompt[Enhanced Prompt]
        AI[AI Model]
        Questions[Quiz Questions]
    end
    
    subgraph "Output Layer"
        Quiz[Final Quiz]
        Cache[Redis Cache]
        DB[Database]
    end
    
    Topic --> Search
    Search --> Content
    Content --> Context
    Context --> Prompt
    Prompt --> AI
    AI --> Questions
    Questions --> Quiz
    Quiz --> Cache
    Quiz --> DB
    
    style Context fill:#f3e5f5
    style Prompt fill:#e1f5fe
    style AI fill:#e8f5e8
```

## 📊 **7. Performance & Caching Strategy**

```mermaid
graph TD
    A[Quiz Request] --> B{Cache Hit?}
    B -->|Yes| C[Return Cached Quiz]
    B -->|No| D{DB Hit?}
    
    D -->|Yes| E[Return DB Quiz]
    D -->|No| F[Generate New Quiz]
    
    F --> G[RAG Process]
    G --> H[Wikipedia + AI]
    H --> I[Store in DB]
    I --> J[Cache Result]
    
    E --> K[Update Cache TTL]
    C --> L[Extend Cache TTL]
    
    style G fill:#e1f5fe
    style H fill:#f3e5f5
    style J fill:#e8f5e8
```
