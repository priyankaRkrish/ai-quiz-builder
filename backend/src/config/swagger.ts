import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Quiz Generator API',
      version: '1.0.0',
      description: 'A comprehensive API for generating AI-powered quizzes on any topic',
      contact: {
        name: 'AI Quiz Generator Team',
        email: 'support@aiquizgenerator.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      },
      {
        url: 'https://api.aiquizgenerator.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Quiz: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the quiz'
            },
            topic: {
              type: 'string',
              description: 'The topic of the quiz'
            },
            model: {
              type: 'string',
              description: 'AI model used to generate the quiz'
            },
            questions: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Question'
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the quiz was created'
            },
            expiresAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the quiz expires'
            }
          }
        },
        Question: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the question'
            },
            question: {
              type: 'string',
              description: 'The question text'
            },
            options: {
              type: 'object',
              properties: {
                A: { type: 'string' },
                B: { type: 'string' },
                C: { type: 'string' },
                D: { type: 'string' }
              },
              description: 'Multiple choice options'
            }
          }
        },
        QuizSubmission: {
          type: 'object',
          required: ['quizId', 'answers'],
          properties: {
            quizId: {
              type: 'string',
              description: 'ID of the quiz to submit'
            },
            answers: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['A', 'B', 'C', 'D']
              },
              description: 'Array of user answers'
            }
          }
        },
        QuizResult: {
          type: 'object',
          properties: {
            quizId: {
              type: 'string',
              description: 'ID of the submitted quiz'
            },
            score: {
              type: 'number',
              description: 'Number of correct answers'
            },
            totalQuestions: {
              type: 'number',
              description: 'Total number of questions'
            },
            percentage: {
              type: 'number',
              description: 'Percentage score'
            },
            results: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/QuestionResult'
              }
            },
            feedback: {
              type: 'string',
              description: 'Feedback based on performance'
            }
          }
        },
        QuestionResult: {
          type: 'object',
          properties: {
            questionIndex: {
              type: 'number',
              description: 'Index of the question'
            },
            userAnswer: {
              type: 'string',
              enum: ['A', 'B', 'C', 'D'],
              description: 'User\'s selected answer'
            },
            correctAnswer: {
              type: 'string',
              enum: ['A', 'B', 'C', 'D'],
              description: 'Correct answer'
            },
            isCorrect: {
              type: 'boolean',
              description: 'Whether the user answered correctly'
            },
            explanation: {
              type: 'string',
              description: 'Explanation of the correct answer'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              description: 'Unique user identifier'
            },
            username: {
              type: 'string',
              description: 'User\'s username'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User\'s email address'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the user was created'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the authentication was successful'
            },
            user: {
              $ref: '#/components/schemas/User'
            },
            token: {
              type: 'string',
              description: 'JWT authentication token'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/types/*.ts'], // Path to the API docs
};

export const specs = swaggerJsdoc(options);
