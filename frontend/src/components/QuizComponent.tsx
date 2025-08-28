import React, { useState } from 'react';
import type { Quiz, QuizResult } from '../types/quiz';
import { quizAPI } from '../services/api';

interface QuizComponentProps {
  quiz: Quiz;
  onQuizCompleted: (results: QuizResult) => void;
  setIsLoading: (loading: boolean) => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ 
  quiz, 
  onQuizCompleted, 
  setIsLoading 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<('A' | 'B' | 'C' | 'D')[]>([]);
  const [error, setError] = useState('');

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const canProceed = answers[currentQuestionIndex] !== undefined;

  const handleAnswerSelect = (answer: 'A' | 'B' | 'C' | 'D') => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
    setError('');
  };

  const handleNext = () => {
    if (!canProceed) {
      setError('Please select an answer before continuing');
      return;
    }

    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setError('');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (answers.length !== quiz.questions.length || answers.some(a => !a)) {
      setError('Please answer all questions before submitting');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const results = await quizAPI.submitQuiz(quiz.id, answers);
      onQuizCompleted(results.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Quiz: {quiz.topic}
        </h2>
        <p className="text-lg text-gray-600">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>{currentQuestionIndex + 1} / {quiz.questions.length}</span>
          <span>{Math.round(getProgressPercentage())}%</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="card mb-8">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {currentQuestion.question}
          </h3>
        </div>

        <div className="space-y-3">
          {(['A', 'B', 'C', 'D'] as const).map((option) => (
            <label
              key={option}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                answers[currentQuestionIndex] === option
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-primary-200 hover:border-primary-300 hover:bg-primary-50'
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={option}
                checked={answers[currentQuestionIndex] === option}
                onChange={() => handleAnswerSelect(option)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                answers[currentQuestionIndex] === option
                  ? 'border-primary-500 bg-primary-500'
                  : 'border-gray-300'
              }`}>
                {answers[currentQuestionIndex] === option && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span className="font-medium text-gray-900">
                {option}) {currentQuestion.options[option]}
              </span>
            </label>
          ))}
        </div>

        {error && (
          <p className="mt-4 text-sm text-error-600 text-center">{error}</p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Previous</span>
          </span>
        </button>

        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`${
            isLastQuestion ? 'btn-success' : 'btn-primary'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span className="flex items-center space-x-2">
            <span>{isLastQuestion ? 'Submit Quiz' : 'Next'}</span>
            {!isLastQuestion && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </span>
        </button>
      </div>

      {/* Quiz Info */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Quiz expires on {new Date(quiz.expiresAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default QuizComponent;
