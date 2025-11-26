import React from 'react'

interface PriorityBadgeProps {
  priority: string
}

// Simple badge component for displaying priority levels
export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const priorityStyles: Record<string, string> = {
    low: 'bg-gray-200 text-gray-700',
    medium: 'bg-yellow-200 text-yellow-800',
    high: 'bg-orange-200 text-orange-800',
    critical: 'bg-red-200 text-red-800',
  }

  const colorClass = priorityStyles[priority.toLowerCase()] || priorityStyles.medium

  return (
    <span className={`inline-block px-3 py-1 rounded text-xs font-semibold uppercase ${colorClass}`}>
      {priority}
    </span>
  )
}

// TODO: consider using color from design system once we have one
