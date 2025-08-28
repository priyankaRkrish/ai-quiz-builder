import { Pool } from 'pg';
import { redisService } from '../services/redisService';

// PostgreSQL Configuration
export const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Database initialization function
export async function initializeDatabase() {
  try {
    // Test PostgreSQL connection
    const client = await pgPool.connect();
    console.log('✅ PostgreSQL connected successfully');
    client.release();

    // Test Redis connection
    await redisService.connect();
    
    // Create tables if they don't exist
    await createTables();
    
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

// Create database tables
async function createTables() {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      username VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createQuizzesTable = `
    CREATE TABLE IF NOT EXISTS quizzes (
      id SERIAL PRIMARY KEY,
      topic VARCHAR(255) NOT NULL,
      user_id INTEGER REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP NOT NULL,
      is_ai_generated BOOLEAN DEFAULT false,
      cache_key VARCHAR(255) UNIQUE
    );
  `;

  const createQuestionsTable = `
    CREATE TABLE IF NOT EXISTS questions (
      id SERIAL PRIMARY KEY,
      quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
      question_text TEXT NOT NULL,
      option_a TEXT NOT NULL,
      option_b TEXT NOT NULL,
      option_c TEXT NOT NULL,
      option_d TEXT NOT NULL,
      correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
      explanation TEXT,
      question_order INTEGER NOT NULL
    );
  `;

  const createQuizSubmissionsTable = `
    CREATE TABLE IF NOT EXISTS quiz_submissions (
      id SERIAL PRIMARY KEY,
      quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id),
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      percentage DECIMAL(5,2) NOT NULL
    );
  `;

  const createUserAnswersTable = `
    CREATE TABLE IF NOT EXISTS user_answers (
      id SERIAL PRIMARY KEY,
      submission_id INTEGER REFERENCES quiz_submissions(id) ON DELETE CASCADE,
      question_id INTEGER REFERENCES questions(id),
      user_answer CHAR(1) CHECK (user_answer IN ('A', 'B', 'C', 'D')),
      is_correct BOOLEAN NOT NULL,
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pgPool.query(createUsersTable);
    await pgPool.query(createQuizzesTable);
    await pgPool.query(createQuestionsTable);
    await pgPool.query(createQuizSubmissionsTable);
    await pgPool.query(createUserAnswersTable);
    
    console.log('✅ Database tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
}

// Close database connections
export async function closeDatabase() {
  await pgPool.end();
  await redisService.disconnect();
  console.log('✅ Database connections closed');
}
