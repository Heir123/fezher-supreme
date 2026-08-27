 import { supabase } from './supabase'

export const salesService = {
  // Get all sales
  getSales: async () => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          customers (
            id,
            name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      const transformedData = data?.map(sale => ({
        ...sale,
        customer_name: sale.customers?.name || 'Unknown Customer',
        customer_email: sale.customers?.email || '',
        customer_phone: sale.customers?.phone || '',
        sale_date: sale.created_at?.split('T')[0] || new Date().toISOString().split('T')[0]
      })) || []
      
      return { data: transformedData, error: null }
    } catch (error) {
      console.error('getSales error:', error)
      return { data: [], error: error.message }
    }
  },

  // Get a single sale by ID
  getSaleById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          customers (
            id,
            name,
            email,
            phone
          ),
          sale_items (*)
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      
      const transformedData = {
        ...data,
        customer_name: data?.customers?.name || 'Unknown Customer',
        customer_email: data?.customers?.email || '',
        customer_phone: data?.customers?.phone || '',
        sale_date: data?.created_at?.split('T')[0] || new Date().toISOString().split('T')[0]
      }
      
      return { data: transformedData, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Create a new sale
  createSale: async (saleData) => {
    try {
      const { customer_name, customer_email, customer_phone, items, ...saleInfo } = saleData
      
      // Find or create customer
      let customerId = null
      
      if (customer_email || customer_phone) {
        let query = supabase.from('customers').select('id')
        
        if (customer_email) {
          query = query.eq('email', customer_email)
        } else if (customer_phone) {
          query = query.eq('phone', customer_phone)
        }
        
        const { data: existingCustomer } = await query.single()
        
        if (existingCustomer) {
          customerId = existingCustomer.id
        } else if (customer_name) {
          const { data: newCustomer, error: customerError } = await supabase
            .from('customers')
            .insert([{
              name: customer_name,
              email: customer_email || null,
              phone: customer_phone || null,
              company_id: '196a067f-9cc4-4d99-88cd-f905b5a1ad3f',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }])
            .select()
            .single()
          
          if (!customerError && newCustomer) {
            customerId = newCustomer.id
          }
        }
      }
      
      // Generate invoice number
      const invoiceNumber = `INV-${Date.now()}`
      
      // Create sale
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert([{
          company_id: '196a067f-9cc4-4d99-88cd-f905b5a1ad3f',
          customer_id: customerId,
          invoice_number: invoiceNumber,
          total_amount: saleInfo.total_amount || 0,
          status: saleInfo.status || 'pending',
          created_at: new Date().toISOString()
        }])
        .select()
        .single()
      
      if (saleError) throw saleError
      
      // If there are items, create them
      if (items && items.length > 0 && sale) {
        const saleItems = items.map(item => ({
          sale_id: sale.id,
          product_id: item.product_id || null,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.quantity * item.unit_price
        }))
        
        const { error: itemsError } = await supabase
          .from('sale_items')
          .insert(saleItems)
        
        if (itemsError) throw itemsError
      }
      
      // Get the complete sale with customer info
      const { data: completeSale } = await supabase
        .from('sales')
        .select(`
          *,
          customers (
            id,
            name,
            email,
            phone
          ),
          sale_items (*)
        `)
        .eq('id', sale.id)
        .single()
      
      const transformedData = {
        ...completeSale,
        customer_name: completeSale?.customers?.name || customer_name || 'Unknown Customer',
        customer_email: completeSale?.customers?.email || customer_email || '',
        customer_phone: completeSale?.customers?.phone || customer_phone || '',
        sale_date: completeSale?.created_at?.split('T')[0] || new Date().toISOString().split('T')[0]
      }
      
      return { data: transformedData, error: null }
    } catch (error) {
      console.error('createSale error:', error)
      return { data: null, error: error.message }
    }
  },

  // Update a sale
  updateSale: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Delete a sale
  deleteSale: async (id) => {
    try {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  // Get sales by status
  getSalesByStatus: async (status) => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          customers (
            id,
            name,
            email,
            phone
          )
        `)
        .eq('status', status)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      const transformedData = data?.map(sale => ({
        ...sale,
        customer_name: sale.customers?.name || 'Unknown Customer',
        customer_email: sale.customers?.email || '',
        customer_phone: sale.customers?.phone || '',
        sale_date: sale.created_at?.split('T')[0] || new Date().toISOString().split('T')[0]
      })) || []
      
      return { data: transformedData, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Get sales statistics
  getSalesStats: async () => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('total_amount, status')
      
      if (error) throw error
      
      const stats = {
        total: data?.length || 0,
        totalRevenue: data?.reduce((sum, sale) => sum + (sale.total_amount || 0), 0) || 0,
        completed: data?.filter(s => s.status === 'Paid' || s.status === 'completed').length || 0,
        pending: data?.filter(s => s.status === 'pending').length || 0,
        cancelled: data?.filter(s => s.status === 'cancelled').length || 0
      }
      
      return { data: stats, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  }
}