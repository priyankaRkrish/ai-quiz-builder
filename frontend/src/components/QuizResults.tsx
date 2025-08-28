import React from 'react';
import type { QuizResult, Quiz } from '../types/quiz';

interface QuizResultsProps {
  results: QuizResult;
  quiz: Quiz; // Add the original quiz data
  onStartOver: () => void;
  onNewQuiz: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ results, quiz, onStartOver, onNewQuiz }) => {
  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-success-600';
    if (percentage >= 80) return 'text-success-500';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-error-600';
  };

  const getScoreEmoji = (percentage: number) => {
    if (percentage >= 90) return '🎉';
    if (percentage >= 80) return '🎊';
    if (percentage >= 70) return '👍';
    if (percentage >= 60) return '😊';
    if (percentage >= 50) return '🤔';
    return '💪';
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return 'Outstanding!';
    if (percentage >= 80) return 'Excellent!';
    if (percentage >= 70) return 'Great job!';
    if (percentage >= 60) return 'Good work!';
    if (percentage >= 50) return 'Not bad!';
    return 'Keep learning!';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Quiz Results
        </h2>
        <p className="text-lg text-gray-600">
          Here's how you performed
        </p>
      </div>

      {/* Score Summary */}
      <div className="card mb-8">
        <div className="text-center">
          <div className="text-6xl mb-4">
            {getScoreEmoji(results.percentage)}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {getScoreMessage(results.percentage)}
          </h3>
          <div className={`text-4xl font-bold ${getScoreColor(results.percentage)} mb-2`}>
            {results.score}/{results.totalQuestions}
          </div>
          <div className={`text-xl font-semibold ${getScoreColor(results.percentage)} mb-4`}>
            {results.percentage}%
          </div>
          <p className="text-gray-600 text-lg">
            {results.feedback}
          </p>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="card mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Question-by-Question Breakdown
        </h3>
        <div className="space-y-6">
          {results.results.map((result, index) => {
            const question = quiz.questions[index];
            return (
              <div
                key={index}
                className={`p-6 rounded-lg border-2 ${
                  result.isCorrect
                    ? 'border-success-200 bg-success-50'
                    : 'border-error-200 bg-error-50'
                }`}
              >
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <span className="font-medium text-gray-900 text-lg">
                    Question {index + 1}
                  </span>
                  <div className="flex items-center space-x-2">
                    {result.isCorrect ? (
                      <span className="text-success-600 font-semibold text-lg">✓ Correct</span>
                    ) : (
                      <span className="text-error-600 font-semibold text-lg">✗ Incorrect</span>
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    {question.question}
                  </h4>
                  
                  {/* Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(question.options).map(([key, option]) => {
                      let optionStyle = "p-3 rounded-lg border-2 text-sm font-medium ";
                      let isCorrect = result.correctAnswer === key;
                      let isUserAnswer = result.userAnswer === key;
                      
                      if (isCorrect) {
                        optionStyle += "bg-success-100 border-success-300 text-success-800";
                      } else if (isUserAnswer && !isCorrect) {
                        optionStyle += "bg-error-100 border-error-300 text-error-800";
                      } else {
                        optionStyle += "bg-gray-50 border-gray-200 text-gray-700";
                      }
                      
                      return (
                        <div key={key} className={optionStyle}>
                          <span className="font-bold mr-2">{key}.</span>
                          {option}
                          {isCorrect && (
                            <span className="ml-2 inline-block bg-success-200 text-success-800 text-xs px-2 py-1 rounded-full font-medium">
                              Correct
                            </span>
                          )}
                          {isUserAnswer && !isCorrect && (
                            <span className="ml-2 inline-block bg-error-200 text-error-800 text-xs px-2 py-1 rounded-full font-medium">
                              Your Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Answer Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-gray-600">Your answer:</span>
                    <span className={`ml-2 font-medium ${
                      result.isCorrect ? 'text-success-600' : 'text-error-600'
                    }`}>
                      {result.userAnswer}
                    </span>
                  </div>
                  {!result.isCorrect && (
                    <div>
                      <span className="text-gray-600">Correct answer:</span>
                      <span className="ml-2 font-medium text-success-600">
                        {result.correctAnswer}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Explanation */}
                {result.explanation && (
                  <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                    <span className="text-gray-700 font-medium">Explanation: </span>
                    <span className="text-gray-600">{result.explanation}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onStartOver}
          className="btn-secondary text-lg py-3 px-8"
        >
          <span className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Retry This Quiz</span>
          </span>
        </button>
        
        <button
          onClick={onNewQuiz}
          className="btn-primary text-lg py-3 px-8"
        >
          <span className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Create New Quiz</span>
          </span>
        </button>
      </div>

      {/* Share Results */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 mb-2">
          Share your results with friends!
        </p>
        <div className="flex justify-center space-x-4">
          <button className="text-primary-600 hover:text-primary-700 font-medium">
            Share on Twitter
          </button>
          <button className="text-primary-600 hover:text-primary-700 font-medium">
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
