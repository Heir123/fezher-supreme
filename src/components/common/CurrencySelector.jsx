 import React, { useState, useEffect, useRef } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { useCurrency } from '../../context/CurrencyContext'
import './CurrencySelector.css'

function CurrencySelector() {
  const { currency, setCurrency, setSymbol, getSymbol } = useCurrency()
  const [isOpen, setIsOpen] = useState(false)
  const [currencies, setCurrencies] = useState([])
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    fetchCurrencies()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchCurrencies = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:3000/api/currencies')
      if (!response.ok) {
        throw new Error('Failed to fetch currencies')
      }
      const data = await response.json()
      setCurrencies(data)
    } catch (error) {
      console.error('Error loading currencies:', error)
      // Fallback currencies including BWP and ZMW
      setCurrencies([
        { code: 'USD', name: 'US Dollar', symbol: '$' },
        { code: 'EUR', name: 'Euro', symbol: '€' },
        { code: 'GBP', name: 'British Pound', symbol: '£' },
        { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
        { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
        { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
        { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
        { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
        { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
        { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
        { code: 'BWP', name: 'Botswana Pula', symbol: 'P' },
        { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'ZK' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = async (code) => {
    try {
      setCurrency(code)
      setSymbol(getSymbol(code))
      setIsOpen(false)
      
      const orgData = localStorage.getItem('organizationData')
      if (orgData) {
        const org = JSON.parse(orgData)
        const response = await fetch(`http://localhost:3000/api/organizations/${org.id}/currency`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({ currency: code })
        })
        
        if (response.ok) {
          const result = await response.json()
          const updatedOrg = { ...org, currency: code, currency_symbol: getSymbol(code) }
          localStorage.setItem('organizationData', JSON.stringify(updatedOrg))
          window.location.reload()
        }
      }
    } catch (error) {
      console.error('Error updating currency:', error)
    }
  }

  return (
    <div className="currency-selector" ref={dropdownRef}>
      <button 
        className="currency-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
      >
        <span className="currency-code">{currency}</span>
        <span className="currency-symbol">{getSymbol(currency)}</span>
        <ChevronDown size={16} className={`currency-chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="currency-dropdown">
          {loading ? (
            <div className="currency-loading">Loading currencies...</div>
          ) : (
            currencies.map((curr) => (
              <button
                key={curr.code}
                className={`currency-item ${curr.code === currency ? 'active' : ''}`}
                onClick={() => handleSelect(curr.code)}
              >
                <span className="currency-item-code">{curr.code}</span>
                <span className="currency-item-name">{curr.name}</span>
                <span className="currency-item-symbol">{curr.symbol}</span>
                {curr.code === currency && <Check size={16} className="currency-item-check" />}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default CurrencySelector