import React, { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import { Tag } from '@/components/Tag'
import { PriorityBadge } from '@/components/PriorityBadge'
import { FeedbackDrawer } from '@/components/FeedbackDrawer'

interface Feedback {
  id: string
  text: string
  email: string | null
  createdAt: string
  summary: string
  sentiment: 'positive' | 'neutral' | 'negative'
  tags: string[]
  priority: 'P0' | 'P1' | 'P2' | 'P3'
  nextAction: string
}

interface PaginatedResponse {
  data: Feedback[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

const FeedbackList: NextPage = () => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    priority: '',
    sentiment: '',
    tag: '',
  })
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const fetchFeedback = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '10',
      })

      if (filters.priority) params.append('priority', filters.priority)
      if (filters.sentiment) params.append('sentiment', filters.sentiment)
      if (filters.tag) params.append('tag', filters.tag)

      const response = await fetch(`/api/feedback?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to fetch feedback')
      }

      const data: PaginatedResponse = await response.json()
      setFeedbackList(data.data)
      setTotalPages(data.pagination.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedback()
  }, [page, filters])

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600'
      case 'negative':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleViewDetails = (feedbackId: string) => {
    setSelectedFeedbackId(feedbackId)
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedFeedbackId(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Feedback List</h1>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) => {
                  setFilters({ ...filters, priority: e.target.value })
                  setPage(1)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">All</option>
                <option value="P0">P0 - Critical</option>
                <option value="P1">P1 - High</option>
                <option value="P2">P2 - Medium</option>
                <option value="P3">P3 - Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sentiment
              </label>
              <select
                value={filters.sentiment}
                onChange={(e) => {
                  setFilters({ ...filters, sentiment: e.target.value })
                  setPage(1)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">All</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tag
              </label>
              <input
                type="text"
                value={filters.tag}
                onChange={(e) => {
                  setFilters({ ...filters, tag: e.target.value })
                  setPage(1)
                }}
                placeholder="Filter by tag..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading feedback...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        {/* Feedback List */}
        {!loading && !error && feedbackList.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No feedback found. Try adjusting your filters.</p>
          </div>
        )}

        {!loading && !error && feedbackList.length > 0 && (
          <div className="space-y-4">
            {feedbackList.map((feedback) => (
              <div
                key={feedback.id}
                className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewDetails(feedback.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <PriorityBadge priority={feedback.priority} />
                      <span className={`font-medium ${getSentimentColor(feedback.sentiment)}`}>
                        {feedback.sentiment.charAt(0).toUpperCase() + feedback.sentiment.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(feedback.createdAt)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feedback.summary}
                    </h3>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{feedback.text}</p>

                {feedback.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {feedback.tags.map((tag, index) => (
                      <Tag key={index} label={tag} />
                    ))}
                  </div>
                )}

                <div className="border-t pt-4 mt-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Next Action:</span> {feedback.nextAction}
                  </p>
                  {feedback.email && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Contact:</span> {feedback.email}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Feedback Detail Drawer */}
      {selectedFeedbackId && (
        <FeedbackDrawer
          feedbackId={selectedFeedbackId}
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
        />
      )}
    </div>
  )
}

export default FeedbackList
