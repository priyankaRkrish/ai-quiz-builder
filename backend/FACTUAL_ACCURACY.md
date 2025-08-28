# Factual Accuracy Improvements with Retrieval-Augmented Generation

## Overview

This document explains how the AI Quiz App now uses **Retrieval-Augmented Generation (RAG)** to improve the factual accuracy of quiz questions by integrating real-time information from Wikipedia.

## What is Retrieval-Augmented Generation?

Retrieval-augmented generation combines AI language models with external knowledge sources to produce more accurate and up-to-date content. Instead of relying solely on the AI model's training data, the system:

1. **Retrieves** relevant, current information from Wikipedia
2. **Injects** this factual context into the AI prompt
3. **Generates** quiz questions grounded in verified information

## Benefits

- **Improved Accuracy**: Questions are based on current, factual information
- **Reduced Hallucination**: AI models are less likely to make up facts
- **Better Coverage**: Access to comprehensive, up-to-date knowledge
- **Source Attribution**: Questions can be traced back to Wikipedia sources
- **Consistent Quality**: More reliable across different topics and subjects

## How It Works

### 1. Topic Analysis
When a user requests a quiz on a specific topic, the system:
- Analyzes the topic for relevance
- Searches Wikipedia for related articles
- Retrieves the most relevant content

### 2. Context Retrieval
The system fetches:
- Article title and introduction
- Key factual information
- Source URL for verification

### 3. AI Generation
The retrieved context is injected into the AI prompt:
```
Factual Context from Wikipedia (Article Title):
[Retrieved content from Wikipedia]

Source: [Wikipedia URL]

Based on this factual information, create accurate quiz questions.
```

### 4. Quality Assurance
- Questions are generated based on verified facts
- Sources are provided for transparency
- Content is filtered for relevance and accuracy

## Configuration

### Environment Variables

```bash
# Enable/disable factual context retrieval
ENABLE_FACTUAL_CONTEXT=true

# Wikipedia API base URL (optional, defaults to official Wikipedia API)
WIKIPEDIA_API_BASE_URL=https://en.wikipedia.org/w/api.php
```

### Features

- **Automatic Fallback**: If Wikipedia retrieval fails, falls back to standard AI generation
- **Configurable**: Can be enabled/disabled via environment variable
- **Flexible API Endpoints**: Wikipedia API URL configurable via environment variable
- **Error Handling**: Graceful degradation if external APIs are unavailable
- **Logging**: Comprehensive logging for monitoring and debugging

## API Integration

### Wikipedia API
- Uses Wikipedia's public API (no authentication required)
- Searches for relevant articles based on topic
- Retrieves article introductions and summaries
- Provides source URLs for verification

### Rate Limiting
- Respects Wikipedia's API limits
- Implements exponential backoff for failed requests
- Caches results to reduce API calls

## Example Workflow

1. **User Request**: "Create a quiz about quantum computing"
2. **Context Retrieval**: System searches Wikipedia for "quantum computing"
3. **Content Fetch**: Retrieves article introduction and key facts
4. **AI Generation**: Creates quiz questions using retrieved context
5. **Result**: Accurate questions based on current quantum computing knowledge

## Monitoring and Logging

The system provides detailed logging for:
- Context retrieval attempts
- Wikipedia API responses
- Success/failure rates
- Performance metrics

### Log Examples
```
🔍 Retrieving factual context for topic: quantum computing
✅ Retrieved factual context for topic: quantum computing (Quantum Computing)
📚 Using factual context to generate accurate quiz questions
```

## Best Practices

### For Developers
1. **Enable by Default**: Set `ENABLE_FACTUAL_CONTEXT=true` in production
2. **Monitor Performance**: Watch for API response times and success rates
3. **Handle Failures**: Implement proper error handling and fallbacks
4. **Cache Results**: Use Redis caching to reduce API calls

### For Users
1. **Specific Topics**: Use specific, well-defined topics for best results
2. **Current Events**: Recent topics benefit most from factual context
3. **Technical Subjects**: Complex topics see significant accuracy improvements

## Troubleshooting

### Common Issues

1. **No Wikipedia Results**
   - Check topic specificity
   - Verify internet connectivity
   - Review API response logs

2. **Slow Response Times**
   - Check Wikipedia API status
   - Review network latency
   - Consider caching strategies

3. **Context Not Used**
   - Verify `ENABLE_FACTUAL_CONTEXT=true`
   - Check function call parameters
   - Review prompt generation logic

### Debug Mode

Enable detailed logging by setting log level to DEBUG:
```bash
LOG_LEVEL=debug
```

## Future Enhancements

### Planned Features
- **Multiple Sources**: Integration with other knowledge bases
- **Content Filtering**: AI-powered relevance scoring
- **Fact Verification**: Cross-reference multiple sources
- **Custom Knowledge**: User-provided fact sources

### Research Areas
- **Semantic Search**: Improve topic-to-article matching
- **Content Summarization**: Better context extraction
- **Quality Metrics**: Automated accuracy assessment
- **User Feedback**: Learn from quiz accuracy ratings

## Conclusion

Retrieval-augmented generation significantly improves the factual accuracy of AI-generated quiz questions by grounding them in current, verified information from Wikipedia. This approach reduces AI hallucination and provides users with more reliable educational content.

The system is designed to be robust, configurable, and maintainable, with comprehensive error handling and monitoring capabilities.
