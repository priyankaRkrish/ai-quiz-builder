import React, { useState, useEffect } from 'react';
import type { Quiz } from '../types/quiz';
import { quizAPI } from '../services/api';
import { Zap, Info, RefreshCw } from 'lucide-react';
import { LoadingSpinner } from '../common';

interface TopicInputProps {
  onQuizGenerated: (topic: string, model: string, forceNew?: boolean) => void;
  isGenerating?: boolean;
}

const TopicInput: React.FC<TopicInputProps> = ({ onQuizGenerated, isGenerating = false }) => {
  const [topic, setTopic] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [availableModels, setAvailableModels] = useState<string[]>(['gpt-3.5-turbo']);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [forceNew, setForceNew] = useState(false);
  const [suggestions] = useState([
    'Photosynthesis',
    'Neural Networks',
    'Ancient Rome',
    'Quantum Physics',
    'World War II',
    'Machine Learning',
    'Human Anatomy',
    'Climate Change',
    'Shakespeare',
    'Space Exploration'
  ]);

  useEffect(() => {
    // Fetch available models from API
    const fetchModels = async () => {
      try {
        const models = await quizAPI.getAvailableModels();
        setAvailableModels(models);
        setSelectedModel(models[0]); // Set first model as default
      } catch (err) {
        console.error('Failed to fetch models:', err);
        // Keep default model if API call fails
      }
    };

    fetchModels();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setError('');
    setInfo('');

    try {
      // Call the callback with topic, model, and forceNew flag
      onQuizGenerated(topic.trim(), selectedModel, forceNew);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate quiz');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!isGenerating) {
      setTopic(suggestion);
      setError('');
      setInfo('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Topic Input */}
        <div>
          <label htmlFor="topic" className="block text-lg font-semibold text-gray-800 mb-3">
            What would you like to learn about?
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Photosynthesis, Neural Networks, Ancient Rome..."
            className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
            autoFocus
            disabled={isGenerating}
          />
        </div>

        {/* Model Selection */}
        <div>
          <label htmlFor="model" className="block text-lg font-semibold text-gray-800 mb-3">
            Select AI Model
          </label>
          <select
            id="model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={isGenerating}
          >
            {availableModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm text-gray-500">
            Different models may provide varying levels of detail and accuracy
          </p>
        </div>

        {/* Force New Quiz Option */}
        <div>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={forceNew}
              onChange={(e) => setForceNew(e.target.checked)}
              disabled={isGenerating}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
            />
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-semibold text-gray-800">
                Force New Quiz Generation
              </span>
            </div>
          </label>
          <p className="mt-2 text-sm text-gray-500 ml-8">
            Check this to generate a completely new quiz even if one exists for this topic
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Info Display */}
        {info && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center space-x-2">
              <Info className="h-5 w-5 text-blue-600" />
              <p className="text-blue-700 font-medium">{info}</p>
            </div>
          </div>
        )}

        {/* Generate Quiz Button */}
        <button
          type="submit"
          disabled={!topic.trim() || isGenerating}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold text-xl py-5 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed"
        >
          <span className="flex items-center justify-center space-x-3">
            {isGenerating ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Generating Quiz...</span>
              </>
            ) : (
              <>
                {forceNew ? <RefreshCw className="h-6 w-6" /> : <Zap className="h-6 w-6" />}
                <span>{forceNew ? 'Generate New Quiz' : 'Generate Quiz'}</span>
              </>
            )}
          </span>
        </button>
      </form>

      {/* Popular Topics */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Popular Topics</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={isGenerating}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-700 rounded-full transition-all duration-200 border border-gray-200 hover:border-blue-300 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-200 disabled:hover:text-gray-400"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center space-x-2 text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
          <Info className="w-4 h-4" />
          <span>Use "Force New Quiz" to get different questions on the same topic</span>
        </div>
      </div>
    </div>
  );
};

export default TopicInput;
