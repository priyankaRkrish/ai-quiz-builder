import axios from 'axios';
import type { 
  QuizGenerationRequest, 
  QuizSubmission, 
  QuizSubmissionResponse,
  Quiz,
  QuizResult
} from '../types/quiz';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Function to clear auth data and redirect to login
const handleAuthError = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Redirect to login page
  window.location.href = '/auth';
};

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Add auth token to all requests if available
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    
    // Handle 401 Unauthorized responses
    if (error.response?.status === 401) {
      console.log('Token expired or invalid, redirecting to login...');
      handleAuthError();
    }
    
    return Promise.reject(error);
  }
);

export const quizAPI = {
  // Get available AI models
  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await api.get<{ success: boolean; models: string[] }>('/api/quiz/models');
      
      if (response.data.success && response.data.models) {
        return response.data.models;
      } else {
        throw new Error('Failed to fetch available models');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Authentication required');
        } else if (error.response?.status === 500) {
          throw new Error('Server error. Please try again later.');
        }
      }
      throw new Error('Failed to fetch available models. Please try again.');
    }
  },

  // Generate a new quiz based on topic and model
  async generateQuiz(topic: string, model: string = 'gpt-3.5-turbo', forceNew: boolean = false): Promise<Quiz> {
    try {
      const response = await api.post<{ success: boolean; quiz: Quiz; message: string }>('/api/quiz/generate', {
        topic,
        model,
        forceNew
      } as QuizGenerationRequest);
      
      if (response.data.success && response.data.quiz) {
        return response.data.quiz;
      } else {
        throw new Error(response.data.message || 'Failed to generate quiz');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          throw new Error('Please provide a valid topic and model');
        } else if (error.response?.status === 401) {
          throw new Error('Authentication required. Please log in again.');
        } else if (error.response?.status === 500) {
          throw new Error('Server error. Please try again later.');
        } else if (error.code === 'ECONNABORTED') {
          throw new Error('Request timeout. Please check your connection.');
        } else if (error.code === 'ERR_NETWORK') {
          throw new Error('Network error. Please check your connection.');
        }
      }
      throw new Error('Failed to generate quiz. Please try again.');
    }
  },

  // Submit quiz answers and get results
  async submitQuiz(quizId: string, answers: ('A' | 'B' | 'C' | 'D')[]): Promise<QuizResult> {
    try {
      const response = await api.post<{ success: boolean; result: QuizResult }>('/api/quiz/submit', {
        quizId,
        answers
      } as QuizSubmission);
      
      if (response.data.success && response.data.result) {
        return response.data.result;
      } else {
        throw new Error('Failed to submit quiz');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          throw new Error('Invalid quiz submission data');
        } else if (error.response?.status === 401) {
          throw new Error('Authentication required. Please log in again.');
        } else if (error.response?.status === 404) {
          throw new Error('Quiz not found or expired');
        } else if (error.response?.status === 500) {
          throw new Error('Server error. Please try again later.');
        }
      }
      throw new Error('Failed to submit quiz. Please try again.');
    }
  },

  // Get quiz by ID for review
  async getQuiz(quizId: string): Promise<Quiz> {
    try {
      const response = await api.get<{ success: boolean; quiz: Quiz }>(`/api/quiz/${quizId}`);
      
      if (response.data.success && response.data.quiz) {
        return response.data.quiz;
      } else {
        throw new Error('Failed to fetch quiz');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Authentication required. Please log in again.');
        } else if (error.response?.status === 404) {
          throw new Error('Quiz not found');
        }
      }
      throw new Error('Failed to fetch quiz. Please try again.');
    }
  },

  // Health check endpoint
  async healthCheck(): Promise<boolean> {
    try {
      const response = await api.get('/health');
      return response.status === 200;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
};

export default api;
