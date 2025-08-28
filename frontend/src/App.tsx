import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { QuizInterface } from './components/QuizInterface';
import AuthPage from './components/AuthPage';
import Header from './components/Header';
import { LoadingSpinner } from './common';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" text="Loading..." />
          <p className="text-gray-600 mt-4">Initializing AI Quiz App...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <LandingPage />
              ) : (
                <Navigate to="/auth" replace />
              )
            } 
          />
          <Route 
            path="/auth" 
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <AuthPage />
              )
            } 
          />
          <Route 
            path="/quiz/:topic" 
            element={
              isAuthenticated ? (
                <QuizInterface />
              ) : (
                <Navigate to="/auth" replace />
              )
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
