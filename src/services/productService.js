import { supabase } from './supabase'

export const getProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name')
    
    if (error) throw error
    
    const transformedData = data?.map(product => ({
      ...product,
      price: product.selling_price || 0,
      stock: product.stock_quantity || 0,
      category: product.brand || ''
    })) || []
    
    return { data: transformedData, error: null }
  } catch (error) {
    console.error('getProducts error:', error)
    return { data: [], error: error.message }
  }
}

export const getProductById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    
    const transformedData = {
      ...data,
      price: data?.selling_price || 0,
      stock: data?.stock_quantity || 0,
      category: data?.brand || ''
    }
    
    return { data: transformedData, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const createProduct = async (product) => {
  try {
    const dbProduct = {
      name: product.name,
      description: product.description || '',
      selling_price: product.price || 0,
      stock_quantity: product.stock || 0,
      brand: product.category || '',
      cost_price: product.cost_price || 0,
      minimum_stock: product.minimum_stock || 0,
      reorder_level: product.reorder_level || 0,
      status: product.status || 'active',
      sku: product.sku || `SKU-${Date.now()}`,
      company_id: product.company_id || '196a067f-9cc4-4d99-88cd-f905b5a1ad3f',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('products')
      .insert([dbProduct])
      .select()
      .single()
    
    if (error) throw error
    
    const transformedData = {
      ...data,
      price: data?.selling_price || 0,
      stock: data?.stock_quantity || 0,
      category: data?.brand || ''
    }
    
    return { data: transformedData, error: null }
  } catch (error) {
    console.error('createProduct error:', error)
    return { data: null, error: error.message }
  }
}

export const updateProduct = async (id, updates) => {
  try {
    const dbUpdates = {
      name: updates.name,
      description: updates.description || '',
      selling_price: updates.price || 0,
      stock_quantity: updates.stock || 0,
      brand: updates.category || '',
      updated_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('products')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    const transformedData = {
      ...data,
      price: data?.selling_price || 0,
      stock: data?.stock_quantity || 0,
      category: data?.brand || ''
    }
    
    return { data: transformedData, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const deleteProduct = async (id) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

export const getProductsByCategory = async (category) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('brand', category)
    
    if (error) throw error
    
    const transformedData = data?.map(product => ({
      ...product,
      price: product.selling_price || 0,
      stock: product.stock_quantity || 0,
      category: product.brand || ''
    })) || []
    
    return { data: transformedData, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const getLowStockProducts = async (threshold = 10) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .lt('stock_quantity', threshold)
      .order('stock_quantity')
    
    if (error) throw error
    
    const transformedData = data?.map(product => ({
      ...product,
      price: product.selling_price || 0,
      stock: product.stock_quantity || 0,
      category: product.brand || ''
    })) || []
    
    return { data: transformedData, error: null }
  } catch (error) {
    return { data: [], error: error.message }
  }
}