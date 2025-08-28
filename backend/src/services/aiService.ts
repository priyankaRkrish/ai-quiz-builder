import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
// import { GoogleGenerativeAI } from '@google/generative-ai';
import { Quiz, QuestionWithAnswers, AIQuizRequest } from '../types/quiz';
import { v4 as uuidv4 } from 'uuid';
import { redisService } from './redisService';
import { prisma } from './prismaService';
import logger from './loggerService';

// Initialize AI clients conditionally
let openai: OpenAI | null = null;
let anthropic: Anthropic | null = null;
// let googleAI: GoogleGenerativeAI | null = null;

function initializeOpenAI() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

function initializeAnthropic() {
  if (!anthropic && process.env.ANTHROPIC_API_KEY) {
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropic;
}

// function initializeGoogleAI() {
//   if (!googleAI && process.env.GOOGLE_API_KEY) {
//     googleAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
//   }
//   return googleAI;
// }

// Helper function to determine provider from model name
function getProviderFromModel(model: string): 'openai' | 'anthropic' {
  if (model.startsWith('gpt-')) return 'openai';
  if (model.startsWith('claude-')) return 'anthropic';
  return 'openai'; // default fallback
}

export async function generateQuiz(topic: string, model: string = 'gpt-3.5-turbo', userId?: number, forceNew: boolean = false): Promise<Quiz> {
  try {
    // Use deterministic cache key for proper caching
    const cacheKey = `quiz:${topic.toLowerCase().trim()}:${model}`;
    
    // If forceNew is true, skip cache and existing quiz checks
    if (!forceNew) {
      // Check Redis cache first
      const cachedQuiz = await redisService.getQuizCache(cacheKey);
      if (cachedQuiz) {
        logger.info(`📚 Using cached quiz for topic: ${topic} with model: ${model}`);
        return JSON.parse(cachedQuiz);
      }

      // Check if quiz already exists in database with the same topic and model
      const existingQuizzes = await prisma.quiz.findMany({
        where: {
          topic: topic.trim(),
          model: model
        },
        include: {
          questions: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5 // Get the 5 most recent ones
      });

      // If there are existing quizzes, offer to reuse the most recent one
      // or generate a new one if user wants variety
      if (existingQuizzes.length > 0) {
        const mostRecentQuiz = existingQuizzes[0];
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        // If the most recent quiz is from today, offer to reuse it
        if (mostRecentQuiz.createdAt > oneDayAgo) {
          logger.info(`📚 Found recent quiz for topic: ${topic} with model: ${model}, offering to reuse`);
          
          // Convert to frontend format
          const frontendQuiz: Quiz = {
            id: mostRecentQuiz.id.toString(),
            topic: mostRecentQuiz.topic,
            model: mostRecentQuiz.model,
            questions: mostRecentQuiz.questions.map((q: any) => ({
              id: q.id.toString(),
              question: q.questionText,
              options: q.options as { A: string; B: string; C: string; D: string }
            })),
            createdAt: mostRecentQuiz.createdAt,
            expiresAt: mostRecentQuiz.expiresAt
          };

          // Cache the quiz in Redis for future use
          const cacheTTL = parseInt(process.env.REDIS_CACHE_TTL || '3600'); // 1 hour default
          await redisService.setQuizCache(cacheKey, JSON.stringify(frontendQuiz), cacheTTL);
          
          return frontendQuiz;
        }
      }
    } else {
      logger.info(`🔄 Force new quiz generation for topic: ${topic} with model: ${model}`);
    }

    // Validate model
    const availableModels = process.env.AVAILABLE_MODELS?.split(',') || ['gpt-3.5-turbo'];
    if (!availableModels.includes(model)) {
      throw new Error(`Invalid model: ${model}. Available models: ${availableModels.join(', ')}`);
    }

    logger.info(`🤖 Generating AI quiz for topic: ${topic} with model: ${model}`);
    
    const provider = getProviderFromModel(model);
    let response: string;

    switch (provider) {
      case 'openai':
        response = await generateWithOpenAI(topic, model);
        break;
      case 'anthropic':
        response = await generateWithAnthropic(topic, model);
        break;
      default:
        throw new Error(`Unsupported provider for model: ${model}`);
    }
    
    if (!response) {
      throw new Error('No response from AI service');
    }

    // Parse AI response and create quiz
    const questions = parseAIResponse(response);
    
    if (questions.length === 0) {
      throw new Error('Failed to parse AI response. Please try again with a different topic.');
    }

    // Create and store quiz in database with unique cache key
    const quiz = await createQuizInDatabase(topic, model, questions, userId);
    
    // Cache the quiz in Redis with the deterministic key
    const cacheTTL = parseInt(process.env.REDIS_CACHE_TTL || '3600'); // 1 hour default
    await redisService.setQuizCache(cacheKey, JSON.stringify(quiz), cacheTTL);
    
    return quiz;

  } catch (error) {
    logger.error('Error generating AI quiz:', error);
    throw new Error(`Failed to generate quiz: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function generateWithOpenAI(topic: string, model: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }
  
  const openaiClient = initializeOpenAI();
  if (!openaiClient) {
    throw new Error('Failed to initialize OpenAI client');
  }
  
  const prompt = createQuizPrompt(topic);
  const completion = await openaiClient.chat.completions.create({
    model: model,
    messages: [
      {
        role: "system",
        content: "You are an expert quiz creator. Generate educational multiple-choice questions that are accurate and engaging."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
    max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1000')
  });

  return completion.choices[0]?.message?.content || '';
}

async function generateWithAnthropic(topic: string, model: string): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key not configured');
  }
  
  const anthropicClient = initializeAnthropic();
  if (!anthropicClient) {
    throw new Error('Failed to initialize Anthropic client');
  }
  
  const prompt = createQuizPrompt(topic);
  const message = await anthropicClient.messages.create({
    model: model,
    max_tokens: parseInt(process.env.ANTHROPIC_MAX_TOKENS || '1000'),
    messages: [
      {
        role: "user",
        content: `You are an expert quiz creator. Generate educational multiple-choice questions that are accurate and engaging.\n\n${prompt}`
      }
    ]
  });

  return message.content[0]?.type === 'text' ? message.content[0].text : '';
}

// async function generateWithGoogle(topic: string, model: string): Promise<string> {
//   if (!process.env.GOOGLE_API_KEY) {
//     throw new Error('Google API key not configured');
//   }
//   
//   const googleClient = initializeGoogleAI();
//   if (!googleClient) {
//     throw new Error('Failed to initialize Google AI client');
//   }
//   
//   const prompt = createQuizPrompt(topic);
//   const genModel = googleClient.getGenerativeModel({ model: model });
//   const result = await genModel.generateContent([
//     "You are an expert quiz creator. Generate educational multiple-choice questions that are accurate and engaging.",
//     prompt
//   ]);
//
//   const response = result.response;
//   // Handle the response properly based on Google AI SDK v0.24+
//   if (response.text) {
//     return response.text();
//   } else {
//     // Fallback for different response formats
//     const candidates = response.candidates;
//     if (content && content.parts && content.parts.length > 0) {
//       return content.parts[0].text || '';
//     }
//   }
//   throw new Error('Unexpected response format from Google AI');
// }

function createQuizPrompt(topic: string): string {
  return `Create 5 multiple-choice questions about "${topic}". 
  
  Format each question exactly like this example:
  
  Q1: What is the primary function of X?
  A) Option A
  B) Option B  
  C) Option C
  D) Option D
  Correct: A
  Explanation: Brief explanation of why A is correct
  
  Requirements:
  - Each question should have exactly 4 options (A, B, C, D)
  - Only one correct answer per question
  - Make distractors plausible but clearly wrong
  - Include a brief explanation for each correct answer
  - Questions should test different aspects of the topic
  - Use clear, concise language
  
  Generate the quiz now:`;
}

function parseAIResponse(response: string): Omit<QuestionWithAnswers, 'id'>[] {
  try {
    const questions: Omit<QuestionWithAnswers, 'id'>[] = [];
    const questionBlocks = response.split(/Q\d+:/).filter(block => block.trim());
    
    for (const block of questionBlocks) {
      const lines = block.trim().split('\n').filter(line => line.trim());
      
      if (lines.length < 6) continue; // Need question + 4 options + correct answer
      
      const questionText = lines[0].trim();
      const options: { A: string; B: string; C: string; D: string } = {
        A: '',
        B: '',
        C: '',
        D: ''
      };
      
      let correctAnswer: 'A' | 'B' | 'C' | 'D' | null = null;
      let explanation = '';
      
      for (const line of lines) {
        if (line.startsWith('A)')) options.A = line.substring(2).trim();
        else if (line.startsWith('B)')) options.B = line.substring(2).trim();
        else if (line.startsWith('C)')) options.C = line.substring(2).trim();
        else if (line.startsWith('D)')) options.D = line.substring(2).trim();
        else if (line.startsWith('Correct:')) {
          const answer = line.substring(8).trim();
          if (['A', 'B', 'C', 'D'].includes(answer)) {
            correctAnswer = answer as 'A' | 'B' | 'C' | 'D';
          }
        }
        else if (line.startsWith('Explanation:')) {
          explanation = line.substring(12).trim();
        }
      }
      
      // Validate that we have all required parts
      if (options.A && options.B && options.C && options.D && correctAnswer) {
        questions.push({
          question: questionText,
          options,
          correctAnswer,
          explanation
        });
      }
    }
    
    if (questions.length === 0) {
      throw new Error('No valid questions could be parsed from AI response');
    }
    
    return questions.slice(0, 5); // Ensure max 5 questions
    
  } catch (error) {
    logger.error('Error parsing AI response:', error);
    throw new Error('Failed to parse AI response. Please try again.');
  }
}

async function createQuizInDatabase(topic: string, model: string, questions: Omit<QuestionWithAnswers, 'id'>[], userId?: number): Promise<Quiz> {
  try {
    // Create quiz in database
    const quiz = await prisma.quiz.create({
      data: {
        topic,
        model,
        userId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        isAiGenerated: true,
        cacheKey: `quiz:${topic.toLowerCase().trim()}:${model}`,
        questions: {
          create: questions.map((q: any, index: number) => ({
            questionText: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            questionOrder: index + 1
          }))
        }
      },
      include: {
        questions: true
      }
    });

    // Convert to frontend format (without correct answers and explanations)
    const frontendQuiz: Quiz = {
      id: quiz.id.toString(),
      topic: quiz.topic,
      model: quiz.model,
      questions: quiz.questions.map((q: any, index: number) => ({
        id: q.id.toString(),
        question: q.questionText,
        options: q.options as { A: string; B: string; C: string; D: string }
        // correctAnswer and explanation are intentionally omitted for frontend
      })),
      createdAt: quiz.createdAt,
      expiresAt: quiz.expiresAt
    };

    return frontendQuiz;
  } catch (error) {
    logger.error('Error creating quiz in database:', error);
    throw new Error('Failed to save quiz to database');
  }
}

export async function submitQuiz(quizId: string, answers: ('A' | 'B' | 'C' | 'D')[], userId?: number) {
  try {
    // Get quiz from database
    const quiz = await prisma.quiz.findUnique({
      where: { id: parseInt(quizId) },
      include: { questions: true }
    });

    if (!quiz) {
      throw new Error('Quiz not found');
    }

    // Check if quiz has expired
    if (quiz.expiresAt && new Date() > quiz.expiresAt) {
      throw new Error('Quiz has expired');
    }

    // Calculate score
    let correctAnswers = 0;
    const results = quiz.questions.map((question: any, index: number) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      
      return {
        questionIndex: index,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      };
    });

    const score = correctAnswers;
    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    // Generate feedback based on score
    let feedback = '';
    if (percentage >= 90) feedback = 'Excellent! You have a deep understanding of this topic.';
    else if (percentage >= 80) feedback = 'Great job! You have a solid grasp of the material.';
    else if (percentage >= 70) feedback = 'Good work! You understand most of the concepts.';
    else if (percentage >= 60) feedback = 'Not bad! You have a basic understanding, but there\'s room for improvement.';
    else feedback = 'Keep studying! Review the material and try again.';

    const quizResult = {
      quizId,
      score,
      totalQuestions,
      percentage,
      results,
      feedback
    };

    return quizResult;
  } catch (error) {
    logger.error('Error submitting quiz:', error);
    throw new Error(`Failed to submit quiz: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}