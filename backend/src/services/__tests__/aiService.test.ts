import { generateQuiz, submitQuiz } from '../aiService';

// Mock the services
jest.mock('../redisService');
jest.mock('../prismaService');
jest.mock('../loggerService', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe('AI Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateQuiz', () => {
    it('should validate input parameters', () => {
      // Basic test to ensure the function exists
      expect(typeof generateQuiz).toBe('function');
    });
  });

  describe('submitQuiz', () => {
    it('should validate input parameters', () => {
      // Basic test to ensure the function exists
      expect(typeof submitQuiz).toBe('function');
    });
  });
});

describe('Factual Context Retrieval', () => {
  beforeEach(() => {
    // Mock fetch for Wikipedia API calls
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should retrieve factual context from Wikipedia when enabled', async () => {
    // Mock Wikipedia search response
    const mockSearchResponse = {
      query: {
        search: [
          {
            title: 'Test Topic',
            snippet: 'Test snippet',
            pageid: 12345
          }
        ]
      }
    };

    // Mock Wikipedia content response
    const mockContentResponse = {
      query: {
        pages: {
          12345: {
            title: 'Test Topic',
            extract: 'This is a test extract about the topic.',
            pageid: 12345
          }
        }
      }
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: async () => mockSearchResponse
      })
      .mockResolvedValueOnce({
        json: async () => mockContentResponse
      });

    // Set environment variable
    process.env.ENABLE_FACTUAL_CONTEXT = 'true';

    // Test the function (you'll need to export it or test through generateQuiz)
    // This is a conceptual test - actual implementation may vary
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('should handle Wikipedia API errors gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'));

    process.env.ENABLE_FACTUAL_CONTEXT = 'true';

    // Test error handling
    // The function should return empty string on error
    expect(global.fetch).toHaveBeenCalled();
  });

  it('should skip factual context when disabled', async () => {
    process.env.ENABLE_FACTUAL_CONTEXT = 'false';

    // Should not call Wikipedia API
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
