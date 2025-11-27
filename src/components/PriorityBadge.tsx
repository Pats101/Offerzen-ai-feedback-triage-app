import React from 'react'

interface PriorityBadgeProps {
  priority: string
}

// Modern SaaS-style priority badge with specified colors
export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getPriorityStyle = (priority: string) => {
    const upperPriority = priority.toUpperCase()

    switch (upperPriority) {
      case 'P0':
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          border: 'border-red-200',
          label: 'P0'
        }
      case 'P1':
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          border: 'border-red-200',
          label: 'P1'
        }
      case 'P2':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-700',
          border: 'border-orange-200',
          label: 'P2'
        }
      case 'P3':
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          border: 'border-gray-200',
          label: 'P3'
        }
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          border: 'border-gray-200',
          label: priority
        }
    }
  }

  const style = getPriorityStyle(priority)

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}
    >
      {style.label}
    </span>
  )
}
