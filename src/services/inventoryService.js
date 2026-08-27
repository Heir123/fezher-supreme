 import { supabase } from './supabase'

export const inventoryService = {
  // Get all inventory with product details
  getInventory: async () => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          products (
            id,
            name,
            selling_price,
            sku,
            description
          )
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      console.error('getInventory error:', error)
      return { data: [], error: error.message }
    }
  },

  // Get inventory by product
  getInventoryByProduct: async (productId) => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('product_id', productId)
      
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error: error.message }
    }
  },

  // Get inventory by warehouse
  getInventoryByWarehouse: async (warehouse) => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          products (
            id,
            name,
            selling_price,
            sku
          )
        `)
        .eq('warehouse', warehouse)
      
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error: error.message }
    }
  },

  // Update inventory quantity
  updateQuantity: async (inventoryId, quantity, movementType, notes = '') => {
    try {
      // Get current inventory
      const { data: current, error: getError } = await supabase
        .from('inventory')
        .select('quantity, product_id')
        .eq('id', inventoryId)
        .single()
      
      if (getError) throw getError

      // Update inventory
      const { data, error } = await supabase
        .from('inventory')
        .update({ 
          quantity, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', inventoryId)
        .select()
        .single()
      
      if (error) throw error

      // Log movement
      const { error: movementError } = await supabase
        .from('inventory_movements')
        .insert([{
          inventory_id: inventoryId,
          product_id: current.product_id,
          quantity_change: quantity - current.quantity,
          previous_quantity: current.quantity,
          new_quantity: quantity,
          movement_type: movementType,
          notes: notes,
          created_at: new Date().toISOString()
        }])
      
      if (movementError) throw movementError

      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Add stock
  addStock: async (productId, quantity, warehouse = 'Main', notes = '') => {
    try {
      // Check if inventory exists
      const { data: existing } = await supabase
        .from('inventory')
        .select('*')
        .eq('product_id', productId)
        .eq('warehouse', warehouse)
        .maybeSingle()

      if (existing) {
        return await inventoryService.updateQuantity(
          existing.id, 
          existing.quantity + quantity, 
          'stock_in', 
          notes
        )
      } else {
        // Create new inventory
        const { data, error } = await supabase
          .from('inventory')
          .insert([{
            product_id: productId,
            quantity: quantity,
            warehouse: warehouse,
            status: 'available',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single()
        
        if (error) throw error
        return { data, error: null }
      }
    } catch (error) {
      console.error('addStock error:', error)
      return { data: null, error: error.message }
    }
  },

  // Remove stock
  removeStock: async (productId, quantity, warehouse = 'Main', notes = '') => {
    try {
      const { data: existing } = await supabase
        .from('inventory')
        .select('*')
        .eq('product_id', productId)
        .eq('warehouse', warehouse)
        .maybeSingle()

      if (!existing) {
        return { data: null, error: 'Product not found in inventory' }
      }

      if (existing.quantity < quantity) {
        return { data: null, error: 'Insufficient stock' }
      }

      return await inventoryService.updateQuantity(
        existing.id,
        existing.quantity - quantity,
        'stock_out',
        notes
      )
    } catch (error) {
      console.error('removeStock error:', error)
      return { data: null, error: error.message }
    }
  },

  // Get low stock items
  getLowStockItems: async (threshold = 10) => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          products (
            id,
            name,
            selling_price,
            sku
          )
        `)
        .lt('quantity', threshold)
        .order('quantity')
      
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error: error.message }
    }
  },

  // Get inventory movements
  getMovements: async (inventoryId = null, limit = 50) => {
    try {
      let query = supabase
        .from('inventory_movements')
        .select(`
          *,
          products (
            id,
            name,
            sku
          ),
          profiles (
            full_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (inventoryId) {
        query = query.eq('inventory_id', inventoryId)
      }

      const { data, error } = await query
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error: error.message }
    }
  },

  // Get inventory summary
  getInventorySummary: async () => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('quantity, status, warehouse')
      
      if (error) throw error
      
      const summary = {
        totalItems: data?.length || 0,
        totalQuantity: data?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0,
        byWarehouse: {},
        byStatus: {}
      }

      data?.forEach(item => {
        // By warehouse
        if (!summary.byWarehouse[item.warehouse]) {
          summary.byWarehouse[item.warehouse] = { count: 0, quantity: 0 }
        }
        summary.byWarehouse[item.warehouse].count += 1
        summary.byWarehouse[item.warehouse].quantity += item.quantity || 0

        // By status
        if (!summary.byStatus[item.status]) {
          summary.byStatus[item.status] = { count: 0, quantity: 0 }
        }
        summary.byStatus[item.status].count += 1
        summary.byStatus[item.status].quantity += item.quantity || 0
      })

      return { data: summary, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  }
}