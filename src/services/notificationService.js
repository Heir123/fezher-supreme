import { toast } from 'sonner'

export const notificationService = {
  // Success messages
  success: (message, description = '') => {
    toast.success(message, {
      description: description,
      duration: 4000,
    })
  },

  // Error messages
  error: (message, description = '') => {
    toast.error(message, {
      description: description,
      duration: 5000,
    })
  },

  // Info messages
  info: (message, description = '') => {
    toast.info(message, {
      description: description,
      duration: 3000,
    })
  },

  // Warning messages
  warning: (message, description = '') => {
    toast.warning(message, {
      description: description,
      duration: 4000,
    })
  },

  // Loading messages
  loading: (message) => {
    return toast.loading(message)
  },

  // Dismiss toast
  dismiss: (id) => {
    toast.dismiss(id)
  },

  // Promise wrapper
  promise: (promise, messages) => {
    return toast.promise(promise, {
      loading: messages.loading || 'Processing...',
      success: messages.success || 'Success!',
      error: messages.error || 'Something went wrong',
    })
  },

  // Low stock alert
  lowStockAlert: (productName, stock) => {
    toast.warning(`⚠️ Low Stock Alert: ${productName}`, {
      description: `Only ${stock} units remaining. Please restock soon.`,
      duration: 10000,
    })
  },

  // Multiple low stock alerts
  lowStockAlerts: (products) => {
    if (products.length === 0) return
    
    if (products.length === 1) {
      notificationService.lowStockAlert(products[0].name, products[0].stock)
    } else {
      toast.warning(`⚠️ Low Stock Alert`, {
        description: `${products.length} products need restocking. Check inventory.`,
        duration: 10000,
      })
      products.forEach(product => {
        setTimeout(() => {
          toast.warning(`${product.name} - Only ${product.stock} units left`, {
            duration: 8000,
          })
        }, 1000)
      })
    }
  },

  // Sale created
  saleCreated: (invoiceNumber) => {
    toast.success(`✅ Sale Created`, {
      description: `Invoice ${invoiceNumber} has been created successfully.`,
      duration: 4000,
    })
  },

  // Product added
  productAdded: (productName) => {
    toast.success(`✅ Product Added`, {
      description: `${productName} has been added to inventory.`,
      duration: 4000,
    })
  },

  // Product updated
  productUpdated: (productName) => {
    toast.success(`✅ Product Updated`, {
      description: `${productName} has been updated successfully.`,
      duration: 4000,
    })
  },

  // Product deleted
  productDeleted: (productName) => {
    toast.success(`✅ Product Deleted`, {
      description: `${productName} has been removed from inventory.`,
      duration: 4000,
    })
  },

  // Sale updated
  saleUpdated: (invoiceNumber) => {
    toast.success(`✅ Sale Updated`, {
      description: `Invoice ${invoiceNumber} has been updated successfully.`,
      duration: 4000,
    })
  },

  // Sale deleted
  saleDeleted: (invoiceNumber) => {
    toast.success(`✅ Sale Deleted`, {
      description: `Invoice ${invoiceNumber} has been deleted.`,
      duration: 4000,
    })
  }
}