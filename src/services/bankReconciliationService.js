import { supabase } from './supabase'

export const bankReconciliationService = {
  // Get all bank accounts
  getBankAccounts: async () => {
    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .order('account_name')
      
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error: error.message }
    }
  },

  // Get bank account by ID
  getBankAccountById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Get bank transactions
  getBankTransactions: async (accountId = null, status = null) => {
    try {
      let query = supabase
        .from('bank_transactions')
        .select('*')
        .order('transaction_date', { ascending: false })
      
      if (accountId) {
        query = query.eq('bank_account_id', accountId)
      }
      
      if (status) {
        query = query.eq('status', status)
      }
      
      const { data, error } = await query
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error: error.message }
    }
  },

  // Update transaction status
  updateTransactionStatus: async (id, status, reconciledBy = null) => {
    try {
      const updates = { 
        status, 
        updated_at: new Date().toISOString() 
      }
      
      if (status === 'reconciled') {
        updates.reconciled_at = new Date().toISOString()
        updates.reconciled_by = reconciledBy
      }
      
      const { data, error } = await supabase
        .from('bank_transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Bulk reconcile transactions
  bulkReconcile: async (ids, reconciledBy) => {
    try {
      const { data, error } = await supabase
        .from('bank_transactions')
        .update({
          status: 'reconciled',
          reconciled_at: new Date().toISOString(),
          reconciled_by: reconciledBy,
          updated_at: new Date().toISOString()
        })
        .in('id', ids)
        .select()
      
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error: error.message }
    }
  },

  // Get reconciliation summary
  getReconciliationSummary: async (accountId) => {
    try {
      const { data: transactions, error } = await supabase
        .from('bank_transactions')
        .select('status, amount, transaction_type')
        .eq('bank_account_id', accountId)
      
      if (error) throw error
      
      const summary = {
        total: transactions?.length || 0,
        pending: transactions?.filter(t => t.status === 'pending').length || 0,
        cleared: transactions?.filter(t => t.status === 'cleared').length || 0,
        reconciled: transactions?.filter(t => t.status === 'reconciled').length || 0,
        totalAmount: transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0,
        pendingAmount: transactions?.filter(t => t.status === 'pending').reduce((sum, t) => sum + (t.amount || 0), 0) || 0
      }
      
      return { data: summary, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  }
}