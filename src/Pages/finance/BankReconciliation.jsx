import React, { useState, useEffect } from 'react'
import { bankReconciliationService } from '../../services/bankReconciliationService'
import { notificationService } from '../../services/notificationService'
import Button from '../../components/common/Button'
import { formatCurrency, formatDate } from '../../utils/helpers'

const BankReconciliation = () => {
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [selectedTransactions, setSelectedTransactions] = useState([])
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      // Load accounts
      const { data: accountsData, error: accountsError } = await bankReconciliationService.getBankAccounts()
      if (accountsError) throw new Error(accountsError)
      setAccounts(accountsData || [])
      
      if (accountsData && accountsData.length > 0) {
        setSelectedAccount(accountsData[0])
        await loadTransactions(accountsData[0].id)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadTransactions = async (accountId) => {
    try {
      const { data, error } = await bankReconciliationService.getBankTransactions(accountId)
      if (error) throw new Error(error)
      setTransactions(data || [])
      
      // Load summary
      const { data: summaryData, error: summaryError } = await bankReconciliationService.getReconciliationSummary(accountId)
      if (summaryError) throw new Error(summaryError)
      setSummary(summaryData)
    } catch (err) {
      notificationService.error('Failed to load transactions', err.message)
    }
  }

  const handleAccountChange = (accountId) => {
    const account = accounts.find(a => a.id === accountId)
    setSelectedAccount(account)
    loadTransactions(accountId)
    setSelectedTransactions([])
  }

  const handleToggleTransaction = (id) => {
    setSelectedTransactions(prev =>
      prev.includes(id) 
        ? prev.filter(t => t !== id) 
        : [...prev, id]
    )
  }

  const handleReconcile = async () => {
    if (selectedTransactions.length === 0) {
      notificationService.warning('No Selection', 'Please select at least one transaction to reconcile')
      return
    }

    if (!confirm(`Reconcile ${selectedTransactions.length} transaction(s)?`)) return

    try {
      const { data, error } = await bankReconciliationService.bulkReconcile(selectedTransactions, 'system')
      if (error) throw new Error(error)
      
      notificationService.success('Reconciled', `${selectedTransactions.length} transaction(s) reconciled`)
      setSelectedTransactions([])
      loadTransactions(selectedAccount.id)
    } catch (err) {
      notificationService.error('Failed to reconcile', err.message)
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      const { data, error } = await bankReconciliationService.updateTransactionStatus(id, status)
      if (error) throw new Error(error)
      notificationService.success('Updated', `Transaction status updated to ${status}`)
      loadTransactions(selectedAccount.id)
    } catch (err) {
      notificationService.error('Failed to update', err.message)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'reconciled': return 'text-green-800 bg-green-100'
      case 'cleared': return 'text-blue-800 bg-blue-100'
      case 'pending': return 'text-yellow-800 bg-yellow-100'
      default: return 'text-gray-800 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bank reconciliation...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Error: {error}
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">🏦 Bank Reconciliation</h1>
        <select
          value={selectedAccount?.id || ''}
          onChange={(e) => handleAccountChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {accounts.map(account => (
            <option key={account.id} value={account.id}>{account.account_name}</option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm font-medium text-gray-500">Total Transactions</p>
            <p className="text-xl font-bold text-gray-900">{summary.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm font-medium text-gray-500">Pending</p>
            <p className="text-xl font-bold text-yellow-600">{summary.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm font-medium text-gray-500">Cleared</p>
            <p className="text-xl font-bold text-blue-600">{summary.cleared}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm font-medium text-gray-500">Reconciled</p>
            <p className="text-xl font-bold text-green-600">{summary.reconciled}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mb-6">
        <Button 
          variant="primary" 
          onClick={handleReconcile}
          disabled={selectedTransactions.length === 0}
        >
          Reconcile Selected ({selectedTransactions.length})
        </Button>
        <Button variant="secondary" onClick={() => loadTransactions(selectedAccount?.id)}>
          Refresh
        </Button>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={transactions.length > 0 && selectedTransactions.length === transactions.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTransactions(transactions.map(t => t.id))
                      } else {
                        setSelectedTransactions([])
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedTransactions.includes(transaction.id)}
                        onChange={() => handleToggleTransaction(transaction.id)}
                        disabled={transaction.status === 'reconciled'}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(transaction.transaction_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={transaction.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.transaction_type === 'credit' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        transaction.transaction_type === 'credit' 
                          ? 'text-green-800 bg-green-100' 
                          : 'text-red-800 bg-red-100'
                      }`}>
                        {transaction.transaction_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(transaction.status)}`}>
                        {transaction.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {transaction.status !== 'reconciled' && (
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleUpdateStatus(transaction.id, 'cleared')}
                          >
                            Clear
                          </Button>
                          <Button 
                            variant="primary" 
                            size="sm" 
                            onClick={() => handleUpdateStatus(transaction.id, 'reconciled')}
                          >
                            Reconcile
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default BankReconciliation