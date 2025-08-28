# 🔍 RAG Implementation Deep Dive

## 🎯 **RAG Architecture Overview**

```mermaid
graph TB
    subgraph "User Input"
        Topic[Quiz Topic<br/>e.g., "Quantum Computing"]
    end
    
    subgraph "Retrieval Phase"
        Search[Wikipedia Search API]
        Results[Top 3 Results]
        Content[Article Content]
        Context[Factual Context]
    end
    
    subgraph "Generation Phase"
        Prompt[Enhanced Prompt<br/>+ Wikipedia Context]
        AI[AI Model<br/>GPT/Claude]
        Questions[Accurate Questions]
    end
    
    subgraph "Output & Storage"
        Quiz[Final Quiz]
        Cache[Redis Cache]
        DB[PostgreSQL]
    end
    
    Topic --> Search
    Search --> Results
    Results --> Content
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

## 🔄 **Detailed RAG Flow**

```mermaid
sequenceDiagram
    participant U as User
    participant S as System
    participant W as Wikipedia
    participant AI as AI Model
    participant C as Cache
    participant D as Database
    
    U->>S: Request Quiz: "AI Ethics"
    
    Note over S: Phase 1: Context Retrieval
    S->>W: Search: "AI Ethics"
    W-->>S: Return top articles
    
    S->>W: Get content for best match
    W-->>S: Return factual context
    
    Note over S: Phase 2: Enhanced Generation
    S->>S: Inject context into prompt
    S->>AI: Generate with context
    
    Note over AI: Prompt now includes:<br/>"Factual Context from Wikipedia:<br/>[AI Ethics article content]<br/>Source: [Wikipedia URL]"
    
    AI-->>S: Return accurate questions
    
    Note over S: Phase 3: Storage & Caching
    S->>D: Store quiz with metadata
    S->>C: Cache for future use
    S-->>U: Return enhanced quiz
    
    style W fill:#f3e5f5
    style AI fill:#e1f5fe
```

## 📊 **Before vs After RAG**

### **Before RAG (Standard AI)**
```
User Topic: "Quantum Computing"
AI Response: Based on training data (may be outdated)
Risk: Hallucination, outdated information
Quality: Variable, depends on training data
```

### **After RAG (Enhanced AI)**
```
User Topic: "Quantum Computing"
Wikipedia Context: Current quantum computing facts
AI Response: Grounded in verified, current information
Risk: Minimal, facts verified by Wikipedia
Quality: High, consistently accurate
```

## 🛠️ **Implementation Details**

### **Key Functions**
```typescript
// 1. Context Retrieval
async function retrieveFactualContext(topic: string): Promise<string>

// 2. Wikipedia Search
async function searchWikipedia(query: string): Promise<WikipediaSearchResult[]>

// 3. Content Extraction
async function getWikipediaPageContent(pageId: number): Promise<WikipediaPageContent>

// 4. Enhanced Prompt Creation
function createQuizPrompt(topic: string, factualContext: string): string
```

### **Environment Configuration**
```bash
# Enable/disable RAG
ENABLE_FACTUAL_CONTEXT=true

# Wikipedia API endpoint
WIKIPEDIA_API_BASE_URL=https://en.wikipedia.org/w/api.php
```

