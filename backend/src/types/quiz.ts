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

export interface QuestionWithAnswers extends Question {
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
}

export interface Quiz {
  id: string;
  topic: string;
  model: string;
  questions: Question[];
  createdAt: Date;
  expiresAt: Date;
}

export interface QuizWithAnswers extends Omit<Quiz, 'questions'> {
  questions: QuestionWithAnswers[];
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
  userAnswer: 'A' | 'B' | 'D' | 'C';
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  explanation?: string;
}

export interface AIQuizRequest {
  topic: string;
  model: string;
  numberOfQuestions?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface AIQuizResponse {
  questions: Omit<QuestionWithAnswers, 'id'>[];
}
