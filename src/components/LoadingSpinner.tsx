import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  color?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text = 'Loading...',
  color = 'border-indigo-600',
}) => {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div
          className={`inline-block animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${color} mb-4`}
          role="status"
          aria-label="Loading"
        />
        {text && <p className="text-sm text-gray-600">{text}</p>}
      </div>
    </div>
  )
}
