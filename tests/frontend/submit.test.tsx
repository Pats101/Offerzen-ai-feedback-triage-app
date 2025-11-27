import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import SubmitFeedback from '@/pages/submit'
import { ToastProvider } from '@/contexts/ToastContext'

// Mock fetch
global.fetch = jest.fn()

// Helper function to render with ToastProvider
const renderWithToast = (component: React.ReactElement) => {
  return render(<ToastProvider>{component}</ToastProvider>)
}

describe('SubmitFeedback Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the submit feedback form', () => {
    renderWithToast(<SubmitFeedback />)

    // Use getByRole to get the heading specifically
    expect(screen.getByRole('heading', { name: 'Submit Feedback' })).toBeInTheDocument()
    expect(screen.getByLabelText('Your Feedback')).toBeInTheDocument()
    expect(screen.getByLabelText('Email (optional)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit feedback/i })).toBeInTheDocument()
  })

  it('should enable submit button when textarea has content', () => {
    renderWithToast(<SubmitFeedback />)

    const textarea = screen.getByLabelText('Your Feedback')
    const submitButton = screen.getByRole('button', { name: /submit feedback/i })

    fireEvent.change(textarea, { target: { value: 'This is my feedback' } })

    // Button is not disabled based on content, only on loading state
    expect(submitButton).not.toBeDisabled()
  })

  it('should submit feedback successfully', async () => {
    const mockResponse = {
      id: '123',
      text: 'This is my feedback',
      email: null,
      summary: 'User feedback',
      sentiment: 'neutral',
      priority: 'P2',
      tags: ['feedback'],
      nextAction: 'Review',
      createdAt: new Date().toISOString(),
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    renderWithToast(<SubmitFeedback />)

    const textarea = screen.getByLabelText('Your Feedback')
    const submitButton = screen.getByRole('button', { name: /submit feedback/i })

    fireEvent.change(textarea, { target: { value: 'This is my feedback' } })
    fireEvent.click(submitButton)

    // Toast should show success message (not alert)
    await waitFor(() => {
      expect(screen.getByText('Feedback submitted successfully!')).toBeInTheDocument()
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'This is my feedback', email: undefined }),
    })

    // Textarea should be cleared
    await waitFor(() => {
      expect(textarea).toHaveValue('')
    })
  })

  it('should submit feedback with email', async () => {
    const mockResponse = {
      id: '124',
      text: 'Feedback with email',
      email: 'test@example.com',
      summary: 'User feedback',
      sentiment: 'positive',
      priority: 'P3',
      tags: ['feedback'],
      nextAction: 'Review',
      createdAt: new Date().toISOString(),
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    renderWithToast(<SubmitFeedback />)

    const textarea = screen.getByLabelText('Your Feedback')
    const emailInput = screen.getByLabelText('Email (optional)')
    const submitButton = screen.getByRole('button', { name: /submit feedback/i })

    fireEvent.change(textarea, { target: { value: 'Feedback with email' } })
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    // Toast should show success message
    await waitFor(() => {
      expect(screen.getByText('Feedback submitted successfully!')).toBeInTheDocument()
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Feedback with email', email: 'test@example.com' }),
    })
  })

  it('should handle submission error', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    })

    renderWithToast(<SubmitFeedback />)

    const textarea = screen.getByLabelText('Your Feedback')
    const submitButton = screen.getByRole('button', { name: /submit feedback/i })

    fireEvent.change(textarea, { target: { value: 'This is my feedback' } })
    fireEvent.click(submitButton)

    // Toast should show error message
    await waitFor(() => {
      expect(screen.getByText('Failed to submit feedback. Please try again.')).toBeInTheDocument()
    })
  })

  it('should show loading state during submission', async () => {
    ;(global.fetch as jest.Mock).mockImplementationOnce(
      () => new Promise(resolve => setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 100))
    )

    renderWithToast(<SubmitFeedback />)

    const textarea = screen.getByLabelText('Your Feedback')
    const submitButton = screen.getByRole('button', { name: /submit feedback/i })

    fireEvent.change(textarea, { target: { value: 'This is my feedback' } })
    fireEvent.click(submitButton)

    // Should show loading state
    expect(screen.getByText('Submitting...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })
})
