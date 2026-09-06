import React, { useState } from 'react'
import Button from '../common/Button'

const HelpCenter = ({ onStartTour }) => {
  const [isOpen, setIsOpen] = useState(false)

  const helpItems = [
    {
      icon: '📊',
      title: 'Getting Started',
      description: 'Learn the basics of Fezher Supreme and how to navigate the dashboard.',
      link: '#getting-started'
    },
    {
      icon: '📦',
      title: 'Managing Products',
      description: 'Add, edit, and organize your product catalog.',
      link: '#products-help'
    },
    {
      icon: '💰',
      title: 'Creating Sales',
      description: 'Learn how to create and manage sales orders.',
      link: '#sales-help'
    },
    {
      icon: '💳',
      title: 'Tracking Expenses',
      description: 'Keep track of all your business expenses.',
      link: '#expenses-help'
    },
    {
      icon: '📧',
      title: 'Email Reports',
      description: 'Set up automated email reports for your business.',
      link: '#email-help'
    },
    {
      icon: '🏦',
      title: 'Bank Reconciliation',
      description: 'Reconcile your bank accounts with your records.',
      link: '#bank-help'
    },
  ]

  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Help Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">🆘 Help Center</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-800">🎯 Take a Tour</h3>
                <p className="text-sm text-blue-600 mt-1">
                  New to Fezher Supreme? Take a guided tour to learn about all the features!
                </p>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="mt-3"
                  onClick={() => {
                    setIsOpen(false)
                    onStartTour()
                  }}
                >
                  Start Tour
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {helpItems.map((item, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    <a 
                      href={item.link} 
                      className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
                      onClick={(e) => {
                        e.preventDefault()
                        // Scroll to section or show help
                      }}
                    >
                      Learn More →
                    </a>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  Need more help? Contact us at <a href="mailto:support@fezhersupreme.co.za" className="text-blue-600">support@fezhersupreme.co.za</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default HelpCenter