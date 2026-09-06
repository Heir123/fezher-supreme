import React from 'react'
import Button from './Button'

const EmptyState = ({ 
  title = 'No data found', 
  description = 'Add your first item to get started.',
  icon = '📭',
  actionText = '',
  onAction = null,
  actionVariant = 'primary'
}) => {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      {actionText && onAction && (
        <Button variant={actionVariant} onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  )
}

export default EmptyState