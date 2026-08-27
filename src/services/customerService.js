 import { supabase } from './supabase'

export const customerService = {
  // Get all customers
  getCustomers: async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name')
      
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      console.error('getCustomers error:', error)
      return { data: [], error: error.message }
    }
  },

  // Get a single customer by ID
  getCustomerById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Create a new customer
  createCustomer: async (customer) => {
    try {
      const dbCustomer = {
        name: customer.name,
        email: customer.email || null,
        phone: customer.phone || null,
        address: customer.address || null,
        company_id: customer.company_id || '196a067f-9cc4-4d99-88cd-f905b5a1ad3f',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const { data, error } = await supabase
        .from('customers')
        .insert([dbCustomer])
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('createCustomer error:', error)
      return { data: null, error: error.message }
    }
  },

  // Update a customer
  updateCustomer: async (id, updates) => {
    try {
      const dbUpdates = {
        name: updates.name,
        email: updates.email || null,
        phone: updates.phone || null,
        address: updates.address || null,
        updated_at: new Date().toISOString()
      }
      
      const { data, error } = await supabase
        .from('customers')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Delete a customer
  deleteCustomer: async (id) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  // Get customers with sales count
  getCustomersWithSales: async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          sales (id, total_amount)
        `)
        .order('name')
      
      if (error) throw error
      
      const transformedData = data?.map(customer => ({
        ...customer,
        total_sales: customer.sales?.length || 0,
        total_spent: customer.sales?.reduce((sum, sale) => sum + (sale.total_amount || 0), 0) || 0
      })) || []
      
      return { data: transformedData, error: null }
    } catch (error) {
      return { data: [], error: error.message }
    }
  }
}