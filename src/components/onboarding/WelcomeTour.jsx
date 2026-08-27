 import React, { useState, useEffect } from 'react'
import Button from '../common/Button'

const WelcomeTour = ({ isFirstVisit, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isFirstVisit) {
      setIsOpen(true)
      setCurrentStep(0)
    }
  }, [isFirstVisit])

  const steps = [
    {
      title: '👋 Welcome to BizFlow!',
      description: 'This is your all-in-one business management platform. Let\'s take a quick tour!',
    },
    {
      title: '📊 Dashboard',
      description: 'Get a quick overview of your business performance with key metrics and stats.',
      target: '.dashboard-link',
    },
    {
      title: '📈 Analytics',
      description: 'View detailed analytics and charts to understand your business trends.',
      target: '.analytics-link',
    },
    {
      title: '📊 Profit & Loss',
      description: 'Track your profit and loss with detailed reports comparing revenue and expenses.',
      target: '.profit-loss-link',
    },
    {
      title: '💰 Sales',
      description: 'Create and manage sales orders, track revenue, and generate invoices.',
      target: '.sales-link',
    },
    {
      title: '📦 Inventory',
      description: 'Manage your inventory, track stock levels, and set up multiple warehouses.',
      target: '.inventory-link',
    },
    {
      title: '💬 Feedback',
      description: 'Found a bug or have a feature suggestion? Click the Feedback button to let us know!',
      target: '.feedback-btn',
    },
    {
      title: '🎉 You\'re All Set!',
      description: 'You\'re ready to start managing your business with BizFlow. Happy managing!',
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      // Highlight the target element if it exists
      const step = steps[currentStep + 1]
      if (step.target) {
        const element = document.querySelector(step.target)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          element.style.outline = '3px solid #2563eb'
          element.style.outlineOffset = '2px'
          setTimeout(() => {
            element.style.outline = 'none'
          }, 2000)
        }
      }
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setIsOpen(false)
    onComplete()
  }

  const handleSkip = () => {
    setIsOpen(false)
    onComplete()
  }

  if (!isOpen) return null

  const step = steps[currentStep]
  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 relative">
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-colors ${
                index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">{step.title.split(' ')[0]}</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h2>
          <p className="text-gray-600">{step.description}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Skip Tour
          </button>
          <div className="flex gap-2">
            {!isFirst && (
              <Button variant="secondary" onClick={handlePrevious}>
                Back
              </Button>
            )}
            <Button variant="primary" onClick={handleNext}>
              {isLast ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>

        {/* Step indicator */}
        <div className="text-center mt-4">
          <span className="text-sm text-gray-400">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
      </div>
    </div>
  )
}

export default WelcomeTour