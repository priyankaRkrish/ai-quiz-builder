export interface Question {
  id: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  // correctAnswer and explanation are not sent to frontend for security
}

export interface Quiz {
  id: string;
  topic: string;
  model: string;
  questions: Question[];
  createdAt: Date;
  expiresAt: Date;
}

export interface QuizSubmission {
  quizId: string;
  answers: ('A' | 'B' | 'C' | 'D')[];
}

export interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  results: QuestionResult[];
  feedback: string;
}

export interface QuestionResult {
  questionIndex: number;
  userAnswer: 'A' | 'B' | 'C' | 'D';
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  explanation?: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface QuizGenerationRequest {
  topic: string;
  model: string;
  forceNew?: boolean;
}

export interface QuizGenerationResponse {
  quiz: Quiz;
  message: string;
}

export interface QuizSubmissionResponse {
  result: QuizResult;
}
