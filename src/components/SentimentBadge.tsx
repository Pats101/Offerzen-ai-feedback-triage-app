import React from 'react'

interface SentimentBadgeProps {
  sentiment: 'positive' | 'neutral' | 'negative'
}

// Modern SaaS-style sentiment badge with specified colors
export const SentimentBadge: React.FC<SentimentBadgeProps> = ({ sentiment }) => {
  const getSentimentStyle = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          border: 'border-green-200',
          label: 'Positive'
        }
      case 'negative':
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          border: 'border-red-200',
          label: 'Negative'
        }
      case 'neutral':
      default:
        return {
          bg: 'bg-slate-100',
          text: 'text-slate-700',
          border: 'border-slate-200',
          label: 'Neutral'
        }
    }
  }

  const style = getSentimentStyle(sentiment)

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}
    >
      {style.label}
    </span>
  )
}
