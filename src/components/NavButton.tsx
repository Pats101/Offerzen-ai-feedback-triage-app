import React from 'react'
import Link from 'next/link'

interface NavButtonProps {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
}

// Reusable navigation button with light indigo styling
export const NavButton: React.FC<NavButtonProps> = ({ href, icon, children }) => {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
    >
      {icon}
      {children}
    </Link>
  )
}
