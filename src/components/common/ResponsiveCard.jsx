import React from 'react'
import './ResponsiveCard.css'

function ResponsiveCard({ children, className = '', ...props }) {
  return (
    <div className={`responsive-card ${className}`} {...props}>
      {children}
    </div>
  )
}

export default ResponsiveCard