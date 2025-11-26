import { FeedbackController } from '@/controllers/feedbackController'
import { feedbackRepository } from '@/repositories/feedbackRepository'
import { analyzeFeedback } from '@/services/ai'

// Mock the dependencies
jest.mock('@/repositories/feedbackRepository')
jest.mock('@/services/ai')

const mockRepository = feedbackRepository as jest.Mocked<typeof feedbackRepository>
const mockAnalyzeFeedback = analyzeFeedback as jest.MockedFunction<typeof analyzeFeedback>

describe('FeedbackController', () => {
  let controller: FeedbackController

  beforeEach(() => {
    controller = new FeedbackController()
    jest.clearAllMocks()

    // Setup default AI mock
    mockAnalyzeFeedback.mockResolvedValue({
      summary: 'User reported a crash when clicking submit button',
      sentiment: 'negative',
      priority: 'P1',
      tags: ['crash', 'ui', 'submit-button'],
      nextAction: 'Investigate submit button event handler for null pointer exceptions',
    })
  })

  describe('createFeedback', () => {
    it('should create feedback with AI analysis', async () => {
      const mockFeedback = {
        id: '123',
        text: 'The app freezes when I click the submit button',
        email: 'user@example.com',
        summary: 'User reported a crash when clicking submit button',
        sentiment: 'negative' as const,
        priority: 'P1' as const,
        tags: ['crash', 'ui', 'submit-button'],
        nextAction: 'Investigate submit button event handler for null pointer exceptions',
        createdAt: new Date(),
      }

      mockRepository.create.mockResolvedValue(mockFeedback)

      const result = await controller.createFeedback({
        text: 'The app freezes when I click the submit button',
        email: 'user@example.com',
      })

      expect(result).toEqual(mockFeedback)
      expect(mockAnalyzeFeedback).toHaveBeenCalledWith('The app freezes when I click the submit button')
      expect(mockRepository.create).toHaveBeenCalledWith({
        text: 'The app freezes when I click the submit button',
        email: 'user@example.com',
        analysis: {
          summary: 'User reported a crash when clicking submit button',
          sentiment: 'negative',
          priority: 'P1',
          tags: ['crash', 'ui', 'submit-button'],
          nextAction: 'Investigate submit button event handler for null pointer exceptions',
        },
      })
    })

    it('should create feedback without email', async () => {
      const mockFeedback = {
        id: '124',
        text: 'Great new feature!',
        email: null,
        summary: 'Positive feedback on new feature',
        sentiment: 'positive' as const,
        priority: 'P3' as const,
        tags: ['feature', 'positive'],
        nextAction: 'Share with product team',
        createdAt: new Date(),
      }

      mockRepository.create.mockResolvedValue(mockFeedback)

      const result = await controller.createFeedback({
        text: 'Great new feature!',
      })

      expect(result).toEqual(mockFeedback)
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'Great new feature!',
          email: null,
        })
      )
    })
  })

  describe('listFeedback', () => {
    it('should list feedback with default pagination', async () => {
      const mockFeedbackList = [
        {
          id: '1',
          text: 'Feedback 1',
          email: 'user1@example.com',
          summary: 'First feedback summary',
          sentiment: 'neutral' as const,
          priority: 'P2' as const,
          tags: ['feature'],
          nextAction: 'Review and prioritize',
          createdAt: new Date(),
        },
        {
          id: '2',
          text: 'Feedback 2',
          email: null,
          summary: 'Second feedback summary',
          sentiment: 'positive' as const,
          priority: 'P3' as const,
          tags: ['ui'],
          nextAction: 'Share with design team',
          createdAt: new Date(),
        },
      ]

      mockRepository.findMany.mockResolvedValue(mockFeedbackList)
      mockRepository.count.mockResolvedValue(2)

      const result = await controller.listFeedback({ page: 1, limit: 10 })

      expect(result).toEqual({
        data: mockFeedbackList,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      })
      expect(mockRepository.findMany).toHaveBeenCalledWith({}, 0, 10)
      expect(mockRepository.count).toHaveBeenCalledWith({})
    })

    it('should handle custom page and limit', async () => {
      mockRepository.findMany.mockResolvedValue([])
      mockRepository.count.mockResolvedValue(25)

      const result = await controller.listFeedback({ page: 2, limit: 5 })

      expect(result.pagination).toEqual({
        page: 2,
        limit: 5,
        total: 25,
        totalPages: 5,
      })
      expect(mockRepository.findMany).toHaveBeenCalledWith({}, 5, 5)
    })

    it('should filter by priority', async () => {
      const mockFeedbackList = [
        {
          id: '1',
          text: 'Critical bug',
          email: 'user@example.com',
          summary: 'System is down',
          sentiment: 'negative' as const,
          priority: 'P0' as const,
          tags: ['critical', 'bug'],
          nextAction: 'Fix immediately',
          createdAt: new Date(),
        },
      ]

      mockRepository.findMany.mockResolvedValue(mockFeedbackList)
      mockRepository.count.mockResolvedValue(1)

      const result = await controller.listFeedback({ page: 1, limit: 10, priority: 'P0' })

      expect(result.data).toEqual(mockFeedbackList)
      expect(mockRepository.findMany).toHaveBeenCalledWith({ priority: 'P0' }, 0, 10)
      expect(mockRepository.count).toHaveBeenCalledWith({ priority: 'P0' })
    })

    it('should filter by sentiment', async () => {
      const mockFeedbackList = [
        {
          id: '2',
          text: 'Love this app!',
          email: null,
          summary: 'User loves the app',
          sentiment: 'positive' as const,
          priority: 'P3' as const,
          tags: ['praise'],
          nextAction: 'Share with team',
          createdAt: new Date(),
        },
      ]

      mockRepository.findMany.mockResolvedValue(mockFeedbackList)
      mockRepository.count.mockResolvedValue(1)

      const result = await controller.listFeedback({ page: 1, limit: 10, sentiment: 'positive' })

      expect(result.data).toEqual(mockFeedbackList)
      expect(mockRepository.findMany).toHaveBeenCalledWith({ sentiment: 'positive' }, 0, 10)
      expect(mockRepository.count).toHaveBeenCalledWith({ sentiment: 'positive' })
    })

    it('should filter by both priority and sentiment', async () => {
      mockRepository.findMany.mockResolvedValue([])
      mockRepository.count.mockResolvedValue(0)

      await controller.listFeedback({ page: 1, limit: 10, priority: 'P1', sentiment: 'negative' })

      expect(mockRepository.findMany).toHaveBeenCalledWith(
        { priority: 'P1', sentiment: 'negative' },
        0,
        10
      )
      expect(mockRepository.count).toHaveBeenCalledWith({
        priority: 'P1',
        sentiment: 'negative',
      })
    })

    it('should calculate pagination metadata correctly', async () => {
      mockRepository.findMany.mockResolvedValue([])
      mockRepository.count.mockResolvedValue(47)

      const result = await controller.listFeedback({ page: 3, limit: 10 })

      expect(result.pagination).toEqual({
        page: 3,
        limit: 10,
        total: 47,
        totalPages: 5, // Math.ceil(47 / 10) = 5
      })
    })

    it('should handle empty results', async () => {
      mockRepository.findMany.mockResolvedValue([])
      mockRepository.count.mockResolvedValue(0)

      const result = await controller.listFeedback({ page: 1, limit: 10 })

      expect(result).toEqual({
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      })
    })
  })
})
