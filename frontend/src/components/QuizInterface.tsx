import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { RotateCcw, Trophy } from "lucide-react"
import type { Quiz, QuizResult } from "../types/quiz"
import QuizResults from "./QuizResults"
import { LoadingSpinner } from "../common"
import { quizAPI } from "../services/api"

export function QuizInterface() {
  const location = useLocation()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [topic, setTopic] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<('A' | 'B' | 'C' | 'D')[]>([])
  const [showResults, setShowResults] = useState(false)
  const [quizResults, setQuizResults] = useState<QuizResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get quiz data from route state
  useEffect(() => {
    if (location.state?.quiz && location.state?.topic) {
      setQuiz(location.state.quiz)
      setTopic(location.state.topic)
    } else {
      // If no quiz data in state, redirect back to landing
      navigate('/', { replace: true })
    }
  }, [location.state, navigate])

  // Initialize selectedAnswers array when quiz is loaded
  useEffect(() => {
    if (quiz) {
      // Initialize with undefined values for all questions
      const initialAnswers = new Array(quiz.questions.length).fill(undefined) as ('A' | 'B' | 'C' | 'D')[]
      setSelectedAnswers(initialAnswers)
    }
  }, [quiz])

  // If no quiz data, don't render anything
  if (!quiz || !topic) {
    return null
  }

  const handleAnswerSelect = (answer: 'A' | 'B' | 'C' | 'D') => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answer
    setSelectedAnswers(newAnswers)
  }

  const nextQuestion = async () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Submit quiz to backend
      await submitQuiz()
    }
  }

  const submitQuiz = async () => {
    if (isSubmitting) return
    
    // Validate that all questions have answers
    if (selectedAnswers.length !== quiz.questions.length) {
      alert('Please answer all questions before submitting the quiz.');
      return;
    }
    
    // Check for undefined answers
    const hasUndefinedAnswers = selectedAnswers.some(answer => answer === undefined);
    if (hasUndefinedAnswers) {
      alert('Please answer all questions before submitting the quiz.');
      return;
    }
    
    setIsSubmitting(true)
    try {
      const response = await quizAPI.submitQuiz(quiz.id, selectedAnswers);
      
      // Store results and show them
      setQuizResults(response);
      setShowResults(true)
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert(`Failed to submit quiz: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false)
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleStartOver = () => {
    setCurrentQuestion(0)
    // Reset to undefined values for all questions
    const resetAnswers = new Array(quiz.questions.length).fill(undefined) as ('A' | 'B' | 'C' | 'D')[]
    setSelectedAnswers(resetAnswers)
    setShowResults(false)
    setQuizResults(null)
  }

  const handleNewQuiz = () => {
    navigate('/', { replace: true })
  }

  // Since we don't have correct answers in frontend, we can't calculate score locally
  // Score will be calculated by the backend when submitting
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  if (showResults && quizResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <QuizResults 
            results={quizResults}
            quiz={quiz}
            onStartOver={handleStartOver}
            onNewQuiz={handleNewQuiz}
          />
        </div>
      </div>
    )
  }

  const question = quiz.questions[currentQuestion]
  const selectedAnswer = selectedAnswers[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-block bg-primary-100 text-primary-800 px-4 py-2 rounded-full font-medium">
              {topic}
            </span>
            <span className="text-lg text-primary-600 font-medium">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-primary-200 rounded-full h-3 mb-6">
            <div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-primary-800 mb-6">{question.question}</h2>
          
          <div className="space-y-4">
            {Object.entries(question.options).map(([key, option]) => (
              <button
                key={key}
                onClick={() => handleAnswerSelect(key as 'A' | 'B' | 'C' | 'D')}
                disabled={isSubmitting}
                className={`w-full p-5 text-left rounded-xl border-2 transition-all duration-200 font-medium text-lg ${
                  selectedAnswer === key
                    ? "border-primary-500 bg-primary-50 text-primary-700 shadow-md"
                    : "border-primary-200 hover:border-primary-300 hover:bg-primary-50 text-primary-700"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="font-bold mr-4 text-xl text-primary-600">{key}.</span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={previousQuestion}
            disabled={currentQuestion === 0 || isSubmitting}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              currentQuestion === 0 || isSubmitting
                ? "bg-primary-200 text-primary-400 cursor-not-allowed"
                : "bg-white text-primary-700 hover:bg-primary-50 border-2 border-primary-200 hover:border-primary-300"
            }`}
          >
            Previous
          </button>

          <button
            onClick={nextQuestion}
            disabled={selectedAnswer === undefined || isSubmitting}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 relative ${
              selectedAnswer === undefined || isSubmitting
                ? "bg-primary-300 text-primary-500 cursor-not-allowed"
                : "bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center space-x-2">
                <LoadingSpinner size="sm" />
                <span>Submitting...</span>
              </span>
            ) : (
              currentQuestion === quiz.questions.length - 1 ? "Finish Quiz" : "Next Question"
            )}
          </button>
        </div>

        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-4 text-center">
              <LoadingSpinner size="xl" text="Submitting Quiz" />
              <p className="text-gray-600 mt-4">Please wait while we process your answers...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
