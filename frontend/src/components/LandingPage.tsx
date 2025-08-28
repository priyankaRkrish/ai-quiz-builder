
import { Brain, Target, Award, Zap } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import TopicInput from "./TopicInput"
import { LoadingSpinner } from "../common"
import type { Quiz } from "../types/quiz"
import { quizAPI } from "../services/api"

export function LandingPage() {
  const navigate = useNavigate()
  const [isGenerating, setIsGenerating] = useState(false)

  const handleQuizGenerated = async (topic: string, model: string, forceNew: boolean = false) => {
    setIsGenerating(true)
    try {
      const quiz = await quizAPI.generateQuiz(topic, model, forceNew);
      
      // Navigate to the quiz route with the topic as a parameter
      navigate(`/quiz/${encodeURIComponent(topic)}`, { 
        state: { quiz, topic } 
      });
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert(`Failed to generate quiz: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        

        {/* Quiz Generation Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 max-w-4xl mx-auto border border-white/20">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Create Your Quiz</h2>
            <p className="text-lg text-gray-600">
              Enter any topic and we'll generate a personalized quiz for you.
            </p>
          </div>

          <TopicInput 
            onQuizGenerated={handleQuizGenerated}
            isGenerating={isGenerating}
          />

          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Each quiz contains 5 multiple-choice questions with explanations</span>
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {isGenerating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-4 text-center">
              <LoadingSpinner size="xl" text="Generating Quiz" />
              <p className="text-gray-600 mt-4">
                Our AI is creating a personalized quiz for you. This may take a few moments...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
