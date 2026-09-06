 import React, { createContext, useState, useContext, useEffect } from 'react'

const CurrencyContext = createContext()

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('USD')
  const [symbol, setSymbol] = useState('$')
  const [rates, setRates] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadCurrency = () => {
      const orgData = localStorage.getItem('organizationData')
      if (orgData) {
        try {
          const org = JSON.parse(orgData)
          if (org.currency) {
            setCurrency(org.currency)
            setSymbol(org.currency_symbol || getSymbol(org.currency))
          }
        } catch (error) {
          console.error('Error loading organization currency:', error)
        }
      }
    }
    loadCurrency()
  }, [])

  const getSymbol = (code) => {
    const symbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      NGN: '₦',
      KES: 'KSh',
      ZAR: 'R',
      CAD: 'C$',
      AUD: 'A$',
      JPY: '¥',
      CNY: '¥',
      INR: '₹',
      BRL: 'R$',
      MXN: 'MX$',
      BWP: 'P',      // Botswana Pula
      ZMW: 'ZK'      // Zambian Kwacha
    }
    return symbols[code] || '$'
  }

  const formatCurrency = (amount, code = null) => {
    const currencyCode = code || currency
    const currencySymbol = getSymbol(currencyCode)
    
    if (amount === null || amount === undefined || isNaN(amount)) {
      return `${currencySymbol}0.00`
    }
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount)
    } catch (error) {
      return `${currencySymbol}${Number(amount).toFixed(2)}`
    }
  }

  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return amount
    // For now, return the same amount
    return amount
  }

  const value = {
    currency,
    symbol,
    setCurrency,
    setSymbol,
    formatCurrency,
    convertCurrency,
    getSymbol,
    rates,
    loading
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}

export default CurrencyContext