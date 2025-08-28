import { Router, Request, Response } from 'express';
import { generateQuiz } from '../services/aiService';
import { Quiz, QuizSubmission, QuizResult } from '../types/quiz';
import { prisma } from '../services/prismaService';
import logger from '../services/loggerService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { Decimal } from '@prisma/client/runtime/library';

const router = Router();

/**
 * @swagger
 * /api/quiz/models:
 *   get:
 *     summary: Get available AI models
 *     description: Retrieve a list of all available AI models for quiz generation
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available models
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 models:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["gpt-3.5-turbo", "gpt-4", "claude-3-sonnet-20240229"]
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/models', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const availableModels = process.env.AVAILABLE_MODELS?.split(',') || ['gpt-3.5-turbo'];
    
    res.json({
      success: true,
      models: availableModels
    });
  } catch (error) {
    logger.error('Error fetching models:', error);
    res.status(500).json({ 
      error: 'Failed to fetch available models' 
    });
  }
});

/**
 * @swagger
 * /api/quiz/generate:
 *   post:
 *     summary: Generate a new quiz
 *     description: Create a new AI-generated quiz based on the specified topic and AI model
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topic
 *             properties:
 *               topic:
 *                 type: string
 *                 description: The topic for the quiz
 *                 example: "Quantum Physics"
 *               model:
 *                 type: string
 *                 description: AI model to use for generation
 *                 example: "gpt-3.5-turbo"
 *     responses:
 *       200:
 *         description: Quiz generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 quiz:
 *                   $ref: '#/components/schemas/Quiz'
 *                 message:
 *                   type: string
 *                   example: "Quiz generated successfully for topic: Quantum Physics"
 *       400:
 *         description: Bad request - invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/generate', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { topic, model = 'gpt-3.5-turbo', forceNew = false } = req.body;
    const userId = req.user?.id;
    
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Topic is required and must be a non-empty string' 
      });
    }

    if (!model || typeof model !== 'string') {
      return res.status(400).json({ 
        error: 'Model must be a valid string' 
      });
    }

    logger.info(`🎯 Generating quiz for topic: ${topic} with model: ${model} for user: ${userId}${forceNew ? ' (forced new)' : ''}`);
    
    // If forceNew is true, we'll skip cache and existing quiz checks
    const quiz = await generateQuiz(topic.trim(), model, userId, forceNew);
    
    // Ensure correct answers and explanations are never sent to frontend
    const frontendQuiz = {
      id: quiz.id,
      topic: quiz.topic,
      model: quiz.model,
      createdAt: quiz.createdAt,
      expiresAt: quiz.expiresAt,
      questions: quiz.questions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options
        // correctAnswer and explanation are intentionally omitted
      }))
    };
    
    res.json({
      success: true,
      quiz: frontendQuiz,
      message: `Quiz generated successfully for topic: ${topic}${forceNew ? ' (new generation)' : ''}`
    });
    
  } catch (error) {
    logger.error('Error generating quiz:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to generate quiz. Please try again.' 
    });
  }
});

/**
 * @swagger
 * /api/quiz/submit:
 *   post:
 *     summary: Submit quiz answers
 *     description: Submit answers for a quiz and receive results with scoring and feedback
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuizSubmission'
 *     responses:
 *       200:
 *         description: Quiz submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 result:
 *                   $ref: '#/components/schemas/QuizResult'
 *       400:
 *         description: Bad request - invalid input or quiz expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Quiz not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/submit', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { quizId, answers }: QuizSubmission = req.body;
    const userId = req.user?.id;
    
    if (!quizId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ 
        error: 'Quiz ID and answers array are required' 
      });
    }

    // Fetch quiz from database with correct answers
    const storedQuiz = await prisma.quiz.findUnique({
      where: { id: parseInt(quizId) },
      include: {
        questions: {
          orderBy: { questionOrder: 'asc' }
        }
      }
    });
    
    if (!storedQuiz) {
      return res.status(404).json({ 
        error: 'Quiz not found' 
      });
    }

    // Check if quiz has expired
    if (new Date() > storedQuiz.expiresAt) {
      return res.status(400).json({ 
        error: 'Quiz has expired' 
      });
    }

    // Optional: Check if user owns this quiz (for additional security)
    if (storedQuiz.userId && storedQuiz.userId !== userId) {
      return res.status(403).json({ 
        error: 'Access denied. You can only submit your own quizzes.' 
      });
    }

    // Calculate score
    let correctAnswers = 0;
    const results = answers.map((answer, index) => {
      const question = storedQuiz.questions[index];
      const isCorrect = answer === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      
      return {
        questionIndex: index,
        userAnswer: answer,
        correctAnswer: question.correctAnswer as 'A' | 'B' | 'C' | 'D',
        isCorrect,
        explanation: question.explanation || 'No explanation available'
      };
    });

    const score = correctAnswers;
    const totalQuestions = storedQuiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    // Save quiz submission to database
    let quizSubmission;
    try {
      quizSubmission = await prisma.quizSubmission.create({
        data: {
          quizId: parseInt(quizId),
          userId: userId!,
          score,
          totalQuestions,
          percentage: new Decimal(percentage)
        }
      });
    } catch (dbError) {
      logger.error('Failed to save quiz submission to database:', dbError);
      throw new Error('Failed to save quiz submission');
    }

    // Save individual user answers to database
    const userAnswersData = answers.map((answer, index) => {
      const question = storedQuiz.questions[index];
      const isCorrect = answer === question.correctAnswer;
      
      return {
        submissionId: quizSubmission.id,
        questionId: question.id,
        userAnswer: answer,
        isCorrect
      };
    });

    try {
      await prisma.userAnswer.createMany({
        data: userAnswersData
      });
    } catch (dbError) {
      logger.error('Failed to save user answers to database:', dbError);
      // Try to clean up the submission if answers fail to save
      try {
        await prisma.quizSubmission.delete({
          where: { id: quizSubmission.id }
        });
      } catch (cleanupError) {
        logger.error('Failed to cleanup quiz submission after user answers save failure:', cleanupError);
      }
      throw new Error('Failed to save user answers');
    }

    logger.info(`📊 Quiz submission saved: ID ${quizSubmission.id}, User ${userId}, Score ${score}/${totalQuestions} (${percentage}%)`);

    const quizResult: QuizResult = {
      quizId,
      score,
      totalQuestions,
      percentage,
      results,
      feedback: getFeedback(percentage)
    };

    res.json({
      success: true,
      result: quizResult
    });
    
  } catch (error) {
    logger.error('Error submitting quiz:', error);
    res.status(500).json({ 
      error: 'Failed to process quiz submission. Please try again.' 
    });
  }
});

/**
 * @swagger
 * /api/quiz/{id}:
 *   get:
 *     summary: Get quiz by ID
 *     description: Retrieve a quiz by its ID for review purposes (without correct answers)
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *         example: "123"
 *     responses:
 *       200:
 *         description: Quiz retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 quiz:
 *                   $ref: '#/components/schemas/Quiz'
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Quiz not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    const storedQuiz = await prisma.quiz.findUnique({
      where: { id: parseInt(id) },
      include: {
        questions: {
          orderBy: { questionOrder: 'asc' }
        }
      }
    });
    
    if (!storedQuiz) {
      return res.status(404).json({ 
        error: 'Quiz not found' 
      });
    }

    // Check if user owns this quiz (for additional security)
    if (storedQuiz.userId && storedQuiz.userId !== userId) {
      return res.status(403).json({ 
        error: 'Access denied. You can only access your own quizzes.' 
      });
    }

    // Return quiz without correct answers for review
    const reviewQuiz = {
      id: storedQuiz.id.toString(),
      topic: storedQuiz.topic,
      model: storedQuiz.model,
      createdAt: storedQuiz.createdAt,
      expiresAt: storedQuiz.expiresAt,
      questions: storedQuiz.questions.map((q: any) => ({
        id: q.id.toString(),
        question: q.questionText,
        options: q.options as { A: string; B: string; C: string; D: string }
        // correctAnswer and explanation are intentionally omitted
      }))
    };

    res.json({
      success: true,
      quiz: reviewQuiz
    });
    
  } catch (error) {
    logger.error('Error fetching quiz:', error);
    res.status(500).json({ 
      error: 'Failed to fetch quiz' 
    });
  }
});

// Helper function to generate feedback based on score
function getFeedback(percentage: number): string {
  if (percentage >= 90) return "Excellent! You have a deep understanding of this topic.";
  if (percentage >= 80) return "Great job! You have a solid grasp of this topic.";
  if (percentage >= 70) return "Good work! You understand most of the key concepts.";
  if (percentage >= 60) return "Not bad! You have a basic understanding but room for improvement.";
  if (percentage >= 50) return "You're on the right track! Review the material and try again.";
  return "Keep studying! This topic needs more attention.";
}

/**
 * @swagger
 * /api/quiz/submissions/history:
 *   get:
 *     summary: Get user's quiz submission history
 *     description: Retrieve a list of all quiz submissions for the authenticated user
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Quiz submission history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 submissions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       quizId:
 *                         type: integer
 *                         example: 7
 *                       topic:
 *                         type: string
 *                         example: "Quantum Physics"
 *                       score:
 *                         type: integer
 *                         example: 4
 *                       totalQuestions:
 *                         type: integer
 *                         example: 5
 *                       percentage:
 *                         type: number
 *                         example: 80.0
 *                       submittedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-15T10:30:00Z"
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/submissions/history', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    const submissions = await prisma.quizSubmission.findMany({
      where: { userId },
      include: {
        quiz: {
          select: {
            topic: true
          }
        }
      },
      orderBy: {
        submittedAt: 'desc'
      }
    });

    const formattedSubmissions = submissions.map(submission => ({
      id: submission.id,
      quizId: submission.quizId,
      topic: submission.quiz.topic,
      score: submission.score,
      totalQuestions: submission.totalQuestions,
      percentage: submission.percentage.toNumber(),
      submittedAt: submission.submittedAt
    }));

    res.json({
      success: true,
      submissions: formattedSubmissions
    });
    
  } catch (error) {
    logger.error('Error fetching quiz submission history:', error);
    res.status(500).json({ 
      error: 'Failed to fetch quiz submission history' 
    });
  }
});

/**
 * @swagger
 * /api/quiz/submissions/{id}:
 *   get:
 *     summary: Get detailed quiz submission results
 *     description: Retrieve detailed results for a specific quiz submission including individual question answers
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Submission ID
 *         example: "1"
 *     responses:
 *       200:
 *         description: Submission details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 submission:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     quizId:
 *                       type: integer
 *                       example: 7
 *                     topic:
 *                       type: string
 *                       example: "Quantum Physics"
 *                     score:
 *                       type: integer
 *                       example: 4
 *                     totalQuestions:
 *                       type: integer
 *                       example: 5
 *                     percentage:
 *                       type: number
 *                       example: 80.0
 *                     submittedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T10:30:00Z"
 *                     userAnswers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           questionText:
 *                             type: string
 *                             example: "What is quantum entanglement?"
 *                           userAnswer:
 *                             type: string
 *                             example: "A"
 *                           correctAnswer:
 *                             type: string
 *                             example: "B"
 *                           isCorrect:
 *                             type: boolean
 *                             example: false
 *                           explanation:
 *                             type: string
 *                             example: "Quantum entanglement is a phenomenon where..."
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Submission not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/submissions/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    const submission = await prisma.quizSubmission.findUnique({
      where: { id: parseInt(id) },
      include: {
        quiz: {
          select: {
            topic: true
          }
        },
        userAnswers: {
          include: {
            question: {
              select: {
                questionText: true,
                explanation: true
              }
            }
          },
          orderBy: {
            question: {
              questionOrder: 'asc'
            }
          }
        }
      }
    });
    
    if (!submission) {
      return res.status(404).json({ 
        error: 'Submission not found' 
      });
    }

    // Check if user owns this submission
    if (submission.userId !== userId) {
      return res.status(403).json({ 
        error: 'Access denied. You can only view your own submissions.' 
      });
    }

    const formattedSubmission = {
      id: submission.id,
      quizId: submission.quizId,
      topic: submission.quiz.topic,
      score: submission.score,
      totalQuestions: submission.totalQuestions,
      percentage: submission.percentage.toNumber(),
      submittedAt: submission.submittedAt,
      userAnswers: submission.userAnswers.map(ua => ({
        questionText: ua.question.questionText,
        userAnswer: ua.userAnswer,
        correctAnswer: ua.question.explanation ? 'Hidden for security' : 'Hidden for security',
        isCorrect: ua.isCorrect,
        explanation: ua.question.explanation || 'No explanation available'
      }))
    };

    res.json({
      success: true,
      submission: formattedSubmission
    });
    
  } catch (error) {
    logger.error('Error fetching submission details:', error);
    res.status(500).json({ 
      error: 'Failed to fetch submission details' 
    });
  }
});

export { router as quizRoutes };
