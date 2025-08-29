# AI Quiz App - Frontend

A modern, responsive React frontend for the AI-powered quiz application built with TypeScript, Vite, and Tailwind CSS.

## Features

- 🎨 **Modern UI/UX**: Clean, responsive design with smooth animations and professional loading states
- 📱 **Mobile-First**: Optimized for all device sizes
- 🚀 **Fast Performance**: Built with Vite for rapid development and fast builds
- 🎯 **Interactive Quiz**: Step-by-step quiz navigation with progress tracking and loading indicators
- 📊 **Detailed Results**: Comprehensive feedback with explanations
- 🔄 **State Management**: Efficient React state management for smooth user experience
- 🎨 **Tailwind CSS**: Utility-first CSS framework for consistent styling
- **Smart Quiz Reuse**: Intelligent caching and reuse of recent quizzes
- **Force New Generation**: Option to generate completely new quizzes for variety (clears existing topic cache)
- **Common Components**: Reusable UI components for consistency and maintainability

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Development**: ESLint, Prettier

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see backend README)

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (optional):
   ```bash
   # Create .env file
   VITE_API_URL=http://localhost:3001
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Structure

```
src/
├── common/              # Reusable UI components
│   ├── ui/             # Common UI components
│   │   ├── LoadingSpinner.tsx
│   │   ├── Button.tsx
│   │   └── index.ts
│   ├── index.ts        # Main export file
│   └── README.md       # Common components documentation
├── components/          # Feature-specific components
│   ├── Header.tsx      # App header with navigation
│   ├── LandingPage.tsx # Main landing page with quiz generation
│   ├── TopicInput.tsx  # Topic input form with smart options
│   ├── QuizInterface.tsx # Main quiz interface
│   ├── QuizResults.tsx # Results display
│   └── AuthPage.tsx    # Authentication components
├── services/           # API services
│   └── api.ts         # HTTP client and API calls
├── types/             # TypeScript interfaces
│   └── quiz.ts        # Quiz-related types
├── contexts/          # React contexts
│   └── AuthContext.tsx # Authentication context
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles and Tailwind imports
```

## Common Components

### **LoadingSpinner**
A reusable loading spinner with multiple sizes and optional text.

```tsx
import { LoadingSpinner } from '../common';

// Basic usage
<LoadingSpinner />

// With size and text
<LoadingSpinner size="xl" text="Loading..." />

// With custom classes
<LoadingSpinner className="my-4" />
```

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `text`: Optional text to display below the spinner
- `className`: Additional CSS classes

### **Button**
A reusable button component with multiple variants and sizes.

```tsx
import { Button } from '../common';

// Basic usage
<Button>Click me</Button>

// With variant and size
<Button variant="secondary" size="lg">Large Secondary</Button>

// With custom classes
<Button className="w-full" onClick={handleClick}>Custom Button</Button>
```

**Props:**
- `children`: Button content
- `variant`: 'primary' | 'secondary' | 'outline' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `disabled`: Boolean to disable the button
- `onClick`: Click handler function
- `type`: 'button' | 'submit' | 'reset' (default: 'button')
- `className`: Additional CSS classes

## Components

### Header
- App title and branding
- Status indicators
- Responsive navigation

### LandingPage
- Main landing page with quiz generation form
- Smart quiz reuse options
- Force new generation checkbox
- Professional loading states

### TopicInput
- Topic input form with validation
- Popular topic suggestions
- AI model selection
- Force new quiz generation option
- Error handling and loading states

### QuizInterface
- Interactive quiz interface with loading states
- Progress tracking
- Navigation between questions
- Answer selection with visual feedback
- Submission loading overlay

### QuizResults
- Score display with emojis and colors
- Question-by-question breakdown
- Detailed explanations
- Action buttons for retry/new quiz

### AuthPage
- User authentication (login/signup)
- Form validation and error handling
- Loading states during authentication

## Smart Quiz Reuse System

### **Intelligent Caching**
- **Redis Integration**: Fast quiz retrieval from cache
- **24-Hour Window**: Automatically reuses recent quizzes
- **Cost Optimization**: Reduces AI API calls through smart reuse

### **Force New Generation**
- **Checkbox Option**: "Force New Quiz Generation" in the UI
- **Bypass Cache**: Skips existing quiz checks when enabled
- **Fresh Content**: Always generates new questions for variety
- **Clear Feedback**: Button text changes to indicate action

### **User Experience**
- **Automatic Detection**: Finds recent quizzes for the same topic/model
- **User Choice**: Option to force new generation when desired
- **Clear Messaging**: Informs users about quiz reuse vs. new generation

## 🆕 Loading States & User Experience

### **Quiz Generation Loading**
- **Full-Screen Overlay**: Professional loading experience during AI processing
- **Informative Messages**: Clear indication of what's happening
- **Form Disabling**: Prevents multiple submissions during generation

### **Quiz Submission Loading**
- **Button States**: Loading text and spinner in submit button
- **Form Disabling**: Prevents interaction during submission
- **Loading Overlay**: Full-screen overlay during answer processing

### **Consistent Experience**
- **Professional UI**: Loading states throughout the application
- **User Feedback**: Clear indication of current operations
- **Accessibility**: Proper disabled states and loading indicators

## API Integration

The frontend communicates with the backend through the `quizAPI` service:

- **Quiz Generation**: POST `/api/quiz/generate` (with forceNew option)
- **Quiz Submission**: POST `/api/quiz/submit`
- **Quiz Retrieval**: GET `/api/quiz/:id`
- **Model List**: GET `/api/quiz/models`
- **Health Check**: GET `/health`

### **Enhanced API Features**
- **Force New Generation**: `forceNew` parameter for fresh quiz generation
- **Smart Caching**: Automatic quiz reuse for cost efficiency
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Styling

Built with Tailwind CSS featuring:
- Custom color palette (primary, success, error)
- Responsive design utilities
- Smooth transitions and animations
- Consistent component styling
- Professional loading states
- Dark mode ready (can be extended)

## State Management

Uses React's built-in state management:
- `useState` for local component state
- `useContext` for authentication state
- Props for parent-child communication
- Efficient state updates with proper dependencies

## Error Handling

Comprehensive error handling including:
- Network errors with retry options
- API validation errors
- User input validation
- Graceful fallbacks
- User-friendly error messages
- Loading state management

## Performance Features

- **Lazy Loading**: Components loaded on demand
- **Optimized Re-renders**: Efficient state updates
- **Minimal Bundle Size**: Vite optimization
- **Smart Caching**: Redis-based quiz caching
- **Efficient Queries**: Optimized database operations

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ features
- CSS Grid and Flexbox
- Progressive Web App ready

## Future Enhancements

- **Offline Support**: Service worker for offline functionality
- **Dark Mode**: Toggle between light and dark themes
- **Accessibility**: ARIA labels and keyboard navigation
- **Internationalization**: Multi-language support
- **Analytics**: User behavior tracking
- **Social Features**: Share results, leaderboards
- **Quiz History**: User quiz submission history
- **Performance Metrics**: Quiz completion time tracking

## Contributing

1. Follow TypeScript best practices
2. Use functional components with hooks
3. Maintain consistent styling with Tailwind
4. Add proper error boundaries
5. Include loading states for async operations
6. Use common components from `common/ui/`
7. Follow the established component patterns

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3001` |

## License

ISC
