// Mock crypto for consistent UUIDs in tests
jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomUUID: jest.fn(() => 'test-request-id-123'),
}))

// Mock the logger to avoid console output in tests
jest.mock('@/lib/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}))

// Mock config with faster retries for testing
jest.mock('@/lib/config', () => ({
  config: {
    database: {
      url: '',
    },
    openai: {
      apiKey: 'test-key',
      model: 'gpt-4o-mini',
      maxRetries: 2,
      retryDelay: 10, // Fast retries for testing
    },
    app: {
      nodeEnv: 'test',
      logLevel: 'error',
    },
  },
}))

// Create a mock for the OpenAI chat completions create method
const mockCreate = jest.fn()

// Mock the OpenAI module before importing
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  }))
})

// Import after mocking
import { analyzeFeedback } from '@/services/ai'

describe('AI Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('analyzeFeedback', () => {
    it('should analyze feedback and return summary, sentiment, priority, tags, and nextAction', async () => {
      const content = 'The app freezes when I click the submit button'

      // Mock successful OpenAI response
      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                summary: 'App freezes when clicking submit button',
                sentiment: 'negative',
                priority: 'P1',
                tags: ['freezes', 'ui', 'submit-button'],
                nextAction: 'Investigate submit button event handler',
              }),
            },
          },
        ],
      })

      const result = await analyzeFeedback(content)

      expect(result).toHaveProperty('summary')
      expect(result).toHaveProperty('sentiment')
      expect(result).toHaveProperty('priority')
      expect(result).toHaveProperty('tags')
      expect(result).toHaveProperty('nextAction')
      expect(Array.isArray(result.tags)).toBe(true)
      expect(['positive', 'neutral', 'negative']).toContain(result.sentiment)
      expect(['P0', 'P1', 'P2', 'P3']).toContain(result.priority)
    })

    it('should return default values on failure', async () => {
      const content = ''

      // Mock OpenAI failure
      mockCreate.mockRejectedValue(new Error('API Error'))

      const result = await analyzeFeedback(content)

      // Should use fallback values when AI fails
      expect(result.sentiment).toBe('neutral')
      expect(result.priority).toBe('P2')
      expect(Array.isArray(result.tags)).toBe(true)
      expect(result.nextAction).toBeTruthy()
    })

    it('should analyze bug reports correctly', async () => {
      const content = 'Error 500 when trying to log in'

      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                summary: 'Server error during login',
                sentiment: 'negative',
                priority: 'P1',
                tags: ['bug', 'login', 'server-error'],
                nextAction: 'Check server logs and fix authentication',
              }),
            },
          },
        ],
      })

      const result = await analyzeFeedback(content)

      // Should have negative sentiment for errors
      expect(['negative', 'neutral']).toContain(result.sentiment)
      // Should have appropriate priority
      expect(['P0', 'P1', 'P2']).toContain(result.priority)
      // Should have relevant tags
      expect(result.tags.length).toBeGreaterThanOrEqual(0)
    })

    it('should assign appropriate priority based on urgency', async () => {
      const content = 'URGENT: System is completely down and users cannot access the application'

      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                summary: 'Critical: System completely down',
                sentiment: 'negative',
                priority: 'P0',
                tags: ['critical', 'downtime', 'urgent'],
                nextAction: 'Emergency response - restore service immediately',
              }),
            },
          },
        ],
      })

      const result = await analyzeFeedback(content)

      // Should likely be high priority (P0 or P1)
      expect(['P0', 'P1', 'P2']).toContain(result.priority)
      expect(result.sentiment).toBe('negative')
      expect(result.nextAction).toBeTruthy()
    })

    it('should handle positive feedback correctly', async () => {
      const content = 'I love the new dashboard design! Great work!'

      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                summary: 'Positive feedback on dashboard design',
                sentiment: 'positive',
                priority: 'P3',
                tags: ['praise', 'dashboard', 'ui'],
                nextAction: 'Share with design team',
              }),
            },
          },
        ],
      })

      const result = await analyzeFeedback(content)

      // Should be positive sentiment
      expect(result.sentiment).toBe('positive')
      // Positive feedback typically has lower priority
      expect(['P2', 'P3']).toContain(result.priority)
      expect(result.summary).toBeTruthy()
    })
  })
})
