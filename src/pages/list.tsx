import React, { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import { Tag } from '@/components/Tag'
import { PriorityBadge } from '@/components/PriorityBadge'
import { SentimentBadge } from '@/components/SentimentBadge'
import { FeedbackDrawer } from '@/components/FeedbackDrawer'
import { NavButton } from '@/components/NavButton'
import { getApiUrl } from '@/lib/api-config'

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

      const response = await fetch(getApiUrl(`/api/feedback?${params.toString()}`))

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength).trim() + '...'
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Feedback Triage</h1>
              <p className="text-sm text-gray-600 mt-1">Review and prioritize customer feedback</p>
            </div>
            <div className="flex items-center gap-3">
              <NavButton
                href="/"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                }
              >
                Home
              </NavButton>
              <NavButton
                href="/submit"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              >
                Submit Feedback
              </NavButton>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Priority Filter */}
            <div>
              <label htmlFor="priority-filter" className="block text-xs font-medium text-gray-700 mb-1.5">
                Priority
              </label>
              <select
                id="priority-filter"
                value={filters.priority}
                onChange={(e) => {
                  setFilters({ ...filters, priority: e.target.value })
                  setPage(1)
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Priorities</option>
                <option value="P0">P0 - Critical</option>
                <option value="P1">P1 - High</option>
                <option value="P2">P2 - Medium</option>
                <option value="P3">P3 - Low</option>
              </select>
            </div>

            {/* Sentiment Filter */}
            <div>
              <label htmlFor="sentiment-filter" className="block text-xs font-medium text-gray-700 mb-1.5">
                Sentiment
              </label>
              <select
                id="sentiment-filter"
                value={filters.sentiment}
                onChange={(e) => {
                  setFilters({ ...filters, sentiment: e.target.value })
                  setPage(1)
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Sentiments</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>

            {/* Tag Filter */}
            <div>
              <label htmlFor="tag-filter" className="block text-xs font-medium text-gray-700 mb-1.5">
                Tags
              </label>
              <input
                id="tag-filter"
                type="text"
                value={filters.tag}
                onChange={(e) => {
                  setFilters({ ...filters, tag: e.target.value })
                  setPage(1)
                }}
                placeholder="Filter by tag..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4" />
              <p className="text-sm text-gray-600">Loading feedback...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-800 font-medium">Error: {error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && feedbackList.length === 0 && (
          <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-4 text-sm font-medium text-gray-900">No feedback found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or check back later.</p>
          </div>
        )}

        {/* Feedback Cards */}
        {!loading && !error && feedbackList.length > 0 && (
          <div className="space-y-3">
            {feedbackList.map((feedback) => (
              <div
                key={feedback.id}
                onClick={() => handleViewDetails(feedback.id)}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer group"
              >
                {/* Top Row: Priority, Sentiment, Tags */}
                <div className="flex items-center gap-2 mb-3">
                  <PriorityBadge priority={feedback.priority} />
                  <SentimentBadge sentiment={feedback.sentiment} />

                  {/* Tags */}
                  {feedback.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 ml-1">
                      {feedback.tags.slice(0, 3).map((tag, index) => (
                        <Tag key={index} label={tag} />
                      ))}
                      {feedback.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          +{feedback.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Summary */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {feedback.summary}
                </h3>

                {/* Text Preview */}
                <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                  {truncateText(feedback.text)}
                </p>

                {/* Bottom Row: Metadata & View Details */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {feedback.email && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium">{feedback.email}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(feedback.createdAt)}
                    </span>
                  </div>

                  <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                    View Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
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
