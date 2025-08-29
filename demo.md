# AI Quiz App Demo Guide 🎯

This guide will help you test the AI Quiz App and see it in action.

## 🚀 Quick Start

### **Start Backend Services and Application**

1. **Start backend with Docker:**
   ```bash
   cd backend
   docker-compose up -d --build
   ```

### **Start Frontend with npm run dev**

2. **Start the frontend in a new terminal:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open your browser:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001
   - Health Check: http://localhost:3001/health

## 🧪 Testing Scenarios

### 1. Basic Quiz Generation
- Enter a topic like "Photosynthesis" or "Neural Networks"
- Click "Generate Quiz"
- Verify that 5 questions are created
- Check that each question has 4 options (A, B, C, D)

### 2. Quiz Navigation
- Navigate through questions using Previous/Next buttons
- Verify progress bar updates correctly
- Ensure you can't proceed without selecting an answer

### 3. Quiz Submission
- Answer all 5 questions
- Submit the quiz
- Verify results are displayed correctly
- Check score calculation and feedback

### 4. Smart Quiz Reuse System
- Generate a quiz with the same topic and model
- Verify the app reuses recent quizzes (within 1 hour)
- Use "Force New Quiz Generation" checkbox to bypass reuse
- Test with different AI models (GPT-3.5, GPT-4, Claude)

### 5. Loading States & User Experience
- Observe loading indicators during quiz generation
- See loading overlay during quiz submission
- Verify smooth transitions between states
- Check responsive design on different screen sizes

### 6. Fallback System (No OpenAI API)
- Without setting OPENAI_API_KEY, the app should use fallback quizzes
- Test with topics like "Photosynthesis" or "Neural Networks"
- Verify fallback quizzes work seamlessly

### 7. Error Handling
- Try submitting empty topics
- Test with network issues
- Verify user-friendly error messages

## 🔧 API Testing

### Health Check
```bash
curl http://localhost:3001/health
```

### Generate Quiz
```bash
curl -X POST http://localhost:3001/api/quiz/generate \
  -H "Content-Type: application/json" \
  -d '{"topic": "Photosynthesis", "model": "gpt-3.5-turbo", "forceNew": false}'
```

### Submit Quiz
```bash
curl -X POST http://localhost:3001/api/quiz/submit \
  -H "Content-Type: application/json" \
  -d '{"quizId": "quiz_id_here", "answers": ["A", "B", "C", "D", "A"]}'
```

## 📱 UI Features to Test

### Loading States & Animations
- **Quiz Generation**: Full-screen loading overlay with spinner
- **Quiz Submission**: Loading overlay during answer processing
- **App Initialization**: Loading screen during auth check
- **Smooth transitions** between questions and states

### Responsive Design
- Test on different screen sizes (desktop, tablet, mobile)
- Verify mobile-friendly interface
- Check button accessibility and touch targets

### User Experience
- Clear navigation between quiz states
- Intuitive answer selection (A, B, C, D)
- Helpful feedback and explanations
- Professional loading overlays and spinners

## 🐛 Common Issues & Solutions

### Docker Issues
- **Containers not starting**: Check Docker is running and ports are available
- **Port conflicts**: Ensure ports 5432 (PostgreSQL) and 6379 (Redis) are available
- **Database connection**: Wait for containers to fully initialize

### Backend Issues
- **Port already in use**: Change PORT in backend/.env
- **Database connection**: Ensure Docker containers are running
- **OpenAI API errors**: Check API key and rate limits
- **Build errors**: Run `npm run build:backend`

### Frontend Issues
- **Build errors**: Run `npm run build:frontend`
- **Styling issues**: Check Tailwind CSS configuration
- **API connection**: Verify backend is running on port 3001

### General Issues
- **Node version**: Ensure Node.js 18+ is installed
- **Dependencies**: Run `npm run install:all`
- **Port conflicts**: Check if ports 3001 and 5173 are available

## 📊 Expected Results

### Quiz Generation
- ✅ 5 questions per quiz
- ✅ 4 options per question (A, B, C, D)
- ✅ 1 correct answer per question
- ✅ Explanations for correct answers
- ✅ Smart reuse of recent quizzes

### Quiz Results
- ✅ Score calculation (X/5)
- ✅ Percentage calculation
- ✅ Question-by-question breakdown
- ✅ Correct/incorrect indicators
- ✅ Explanations for all answers

### Performance & UX
- ✅ Quiz generation: < 10 seconds (or instant for reused quizzes)
- ✅ Quiz submission: < 2 seconds
- ✅ Smooth UI transitions and loading states
- ✅ Responsive interactions and animations

## 🎉 Success Criteria

The demo is successful when:
1. ✅ Docker database services start successfully
2. ✅ Backend runs locally with `npm run dev`
3. ✅ Frontend runs locally with `npm run dev`
4. ✅ Quiz generation works with AI or fallback
5. ✅ Smart quiz reuse system functions correctly
6. ✅ Loading states provide clear user feedback
7. ✅ Quiz interface is intuitive and responsive
8. ✅ Results are accurate and informative
9. ✅ Error handling is graceful
10. ✅ UI is polished and professional

## 🔮 Next Steps

After successful demo:
1. Add your OpenAI API key for AI-powered quizzes
2. Customize the UI/UX to your preferences
3. Add more fallback quizzes for different topics
4. Implement additional features (user accounts, quiz history, etc.)
5. Deploy to production
6. Explore the smart caching and quiz reuse features

## 🐳 Docker Commands Reference

```bash
# Start only database services
docker-compose up -d postgres redis

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Check service status
docker-compose ps
```

---

**Happy Testing! 🎯✨**
