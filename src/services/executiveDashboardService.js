import { supabase } from "./supabase";

/**
 * Get the start and end of day for a given date in local timezone (SAST)
 */
const getLocalDayRange = (date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
};

/**
 * Format date for display in charts based on period
 */
const formatPeriodLabel = (date, period) => {
  const d = new Date(date);
  switch (period) {
    case 'today':
      return d.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
    case 'week':
      return d.toLocaleDateString('en-ZA', { weekday: 'short' });
    case 'month':
      return d.toLocaleDateString('en-ZA', { day: 'numeric' });
    case 'quarter':
      return `Week ${Math.ceil((d.getDate()) / 7)}`;
    case 'year':
      return d.toLocaleDateString('en-ZA', { month: 'short' });
    default:
      return d.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' });
  }
};

/**
 * Generate date range for trend data based on period
 */
const generateDateRange = (startDate, endDate, period) => {
  const dates = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  // Set to start of day for proper comparison
  current.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  while (current <= end) {
    const pointStart = new Date(current);
    const pointEnd = new Date(current);
    
    // Set the end of the period based on the period type
    switch (period) {
      case 'today': {
        // FIXED: Hourly points with correct hour ranges
        pointStart.setMinutes(0, 0, 0);
        pointStart.setSeconds(0, 0);
        
        pointEnd.setTime(pointStart.getTime() + 60 * 60 * 1000 - 1);
        
        dates.push({
          date: new Date(pointStart),
          label: formatPeriodLabel(pointStart, period),
          start: new Date(pointStart),
          end: new Date(pointEnd),
        });
        
        current.setHours(current.getHours() + 1);
        break;
      }
        
      case 'week':
        // Daily for week
        pointStart.setHours(0, 0, 0, 0);
        pointEnd.setHours(23, 59, 59, 999);
        dates.push({
          date: new Date(current),
          label: formatPeriodLabel(current, period),
          start: pointStart,
          end: pointEnd
        });
        current.setDate(current.getDate() + 1);
        break;
        
      case 'month':
        // Daily for month
        pointStart.setHours(0, 0, 0, 0);
        pointEnd.setHours(23, 59, 59, 999);
        dates.push({
          date: new Date(current),
          label: formatPeriodLabel(current, period),
          start: pointStart,
          end: pointEnd
        });
        current.setDate(current.getDate() + 1);
        break;
        
      case 'quarter': {
        // Weekly for quarter - 7 day periods
        pointStart.setHours(0, 0, 0, 0);
        pointEnd.setDate(pointStart.getDate() + 6);
        pointEnd.setHours(23, 59, 59, 999);
        dates.push({
          date: new Date(current),
          label: formatPeriodLabel(current, period),
          start: pointStart,
          end: pointEnd
        });
        current.setDate(current.getDate() + 7);
        break;
      }
        
      case 'year': {
        // Monthly for year
        pointStart.setDate(1);
        pointStart.setHours(0, 0, 0, 0);
        pointEnd.setMonth(pointEnd.getMonth() + 1, 0);
        pointEnd.setHours(23, 59, 59, 999);
        dates.push({
          date: new Date(current),
          label: formatPeriodLabel(current, period),
          start: pointStart,
          end: pointEnd
        });
        current.setMonth(current.getMonth() + 1);
        break;
      }
        
      default:
        pointStart.setHours(0, 0, 0, 0);
        pointEnd.setHours(23, 59, 59, 999);
        dates.push({
          date: new Date(current),
          label: formatPeriodLabel(current, period),
          start: pointStart,
          end: pointEnd
        });
        current.setDate(current.getDate() + 1);
    }
  }
  
  return dates;
};

/**
 * Helper to get numeric value safely
 */
const getNumeric = (obj, fields, defaultValue = 0) => {
  for (const field of fields) {
    if (obj && obj[field] !== undefined && obj[field] !== null) {
      return Number(obj[field]);
    }
  }
  return defaultValue;
};

/**
 * Helper to get date string safely
 */
const getDate = (obj) => {
  if (!obj) return null;
  return obj.created_at || obj.createdAt || obj.date || null;
};

/**
 * Get executive dashboard data with proper date filtering
 * @param {Object} params - Dashboard parameters
 * @param {string} params.period - 'today', 'week', 'month', 'quarter', 'year'
 * @param {Date} params.startDate - Start date for filtering
 * @param {Date} params.endDate - End date for filtering
 */
export async function getExecutiveDashboard({ period, startDate, endDate }) {
  try {
    // Validate inputs
    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required');
    }

    // Set time boundaries for accurate filtering (local timezone)
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const startISO = start.toISOString();
    const endISO = end.toISOString();

    console.log(`Fetching dashboard data for period: ${period}`);
    console.log(`Date range: ${startISO} to ${endISO}`);

    // Build queries with proper date filtering
    // For sales, we filter by created_at and join with sale_items, products, categories
    const salesQuery = supabase
      .from("sales")
      .select(`
        id,
        created_at,
        total_amount,
        status,
        customer_id,
        sale_items (
          id,
          quantity,
          unit_price,
          total_price,
          product_id,
          products (
            id,
            name,
            category_id,
            categories (
              id,
              name
            )
          )
        )
      `)
      .gte("created_at", startISO)
      .lte("created_at", endISO);

    // For purchases, filter by created_at
    const purchasesQuery = supabase
      .from("purchases")
      .select(`
        id,
        created_at,
        total_amount,
        status,
        supplier_id
      `)
      .gte("created_at", startISO)
      .lte("created_at", endISO);

    // Execute all queries in parallel
    const [
      salesResult,
      purchasesResult,
      productsResult,
      customersResult,
      employeesResult,
    ] = await Promise.all([
      salesQuery,
      purchasesQuery,
      supabase.from("products").select("*"),
      supabase.from("customers").select("*"),
      supabase.from("employees").select("*"),
    ]);

    // Error handling
    if (salesResult.error) {
      console.error('Sales query error:', salesResult.error);
      throw new Error(`Sales query failed: ${salesResult.error.message}`);
    }
    if (purchasesResult.error) {
      console.error('Purchases query error:', purchasesResult.error);
      throw new Error(`Purchases query failed: ${purchasesResult.error.message}`);
    }
    if (productsResult.error) {
      console.error('Products query error:', productsResult.error);
      throw new Error(`Products query failed: ${productsResult.error.message}`);
    }
    if (customersResult.error) {
      console.error('Customers query error:', customersResult.error);
      throw new Error(`Customers query failed: ${customersResult.error.message}`);
    }
    if (employeesResult.error) {
      console.error('Employees query error:', employeesResult.error);
      throw new Error(`Employees query failed: ${employeesResult.error.message}`);
    }

    // Extract data
    const allSales = salesResult.data || [];
    const purchases = purchasesResult.data || [];
    const products = productsResult.data || [];
    const customers = customersResult.data || [];
    const employees = employeesResult.data || [];

    // =====================================================
    // EXECUTIVE SALES DEBUG
    // =====================================================

    console.log("========== EXECUTIVE SALES DEBUG ==========");
    console.log("Sales returned:", allSales.length);
    console.log("Purchases returned:", purchases.length);
    console.log("Products returned:", products.length);
    console.log("Customers returned:", customers.length);
    console.log("Employees returned:", employees.length);

    allSales.forEach((sale, index) => {
      console.log(`SALE ${index + 1}:`, {
        id: sale.id,
        status: sale.status,
        total_amount: sale.total_amount,
        created_at: sale.created_at,
      });
    });

    console.log("===========================================");

    // =====================================================
    // FILTER COMPLETED PURCHASES
    // =====================================================

    const completedPurchases = purchases.filter((purchase) => {
      const status = String(purchase.status || "")
        .trim()
        .toLowerCase();

      return (
        status === "received" ||
        status === "completed" ||
        status === "paid"
      );
    });

    // =====================================================
    // FILTER COMPLETED SALES
    // =====================================================

    const completedSales = allSales.filter((sale) => {
      const status = String(sale.status || "")
        .trim()
        .toLowerCase();

      return (
        status === "completed" ||
        status === "paid" ||
        status === "finalized"
      );
    });

    // Use only valid/completed sales
    const sales = completedSales;

    console.log(`Raw sales in period: ${allSales.length}`);
    console.log(`Completed sales: ${completedSales.length}`);
    console.log(`Using ${sales.length} sales for calculations`);

    console.log(`Purchases in period: ${purchases.length}`);
    console.log(`Completed purchases: ${completedPurchases.length}`);

    // Calculate financial metrics from sales
    const revenue = sales.reduce((sum, sale) => 
      sum + getNumeric(sale, ['total_amount']), 0
    );

    const expenses = completedPurchases.reduce((sum, purchase) => 
      sum + getNumeric(purchase, ['total_amount']), 0
    );

    const profit = revenue - expenses;

    // FIXED: Calculate today's sales using date objects
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const todaySales = sales
      .filter((sale) => {
        const saleDate = getDate(sale);
        if (!saleDate) return false;
        const saleTime = new Date(saleDate).getTime();
        return saleTime >= today.getTime() && saleTime <= todayEnd.getTime();
      })
      .reduce((sum, sale) => 
        sum + getNumeric(sale, ['total_amount']), 0
      );

    // Calculate employee status counts
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(emp => {
      const status = String(emp.status || '').toLowerCase();
      return status === 'active';
    }).length;

    // FIXED: Inventory calculations with clear classification
    const inventoryValue = products.reduce((sum, product) => {
      const stock = getNumeric(product, [
        'stock',
        'stock_quantity',
        'quantity'
      ]);

      const sellingPrice = getNumeric(product, [
        'price',
        'selling_price',
        'unit_price'
      ]);

      return sum + (stock * sellingPrice);
    }, 0);

    // FIXED: Mutually exclusive stock classification
    const outOfStock = products.filter(product => {
      const stock = getNumeric(product, [
        'stock',
        'stock_quantity',
        'quantity'
      ]);

      return stock <= 0;
    }).length;

    const lowStock = products.filter(product => {
      const stock = getNumeric(product, [
        'stock',
        'stock_quantity',
        'quantity'
      ]);

      const minimum = getNumeric(product, [
        'minimum_stock',
        'min_stock',
        'reorder_level'
      ], 5);

      return stock > 0 && stock <= minimum;
    }).length;

    const inStock = products.filter(product => {
      const stock = getNumeric(product, [
        'stock',
        'stock_quantity',
        'quantity'
      ]);

      const minimum = getNumeric(product, [
        'minimum_stock',
        'min_stock',
        'reorder_level'
      ], 5);

      return stock > minimum;
    }).length;

    // Generate trend data
    const dateRange = generateDateRange(start, end, period);
    
    const revenueTrend = dateRange.map(range => {
      const rangeStart = range.start.toISOString();
      const rangeEnd = range.end.toISOString();

      // Filter sales in this range
      const rangeSales = sales.filter(sale => {
        const saleDate = getDate(sale);
        return saleDate && saleDate >= rangeStart && saleDate <= rangeEnd;
      });

      // Filter purchases in this range
      const rangePurchases = completedPurchases.filter((purchase) => {
        const purchaseDate = getDate(purchase);
        return purchaseDate && purchaseDate >= rangeStart && purchaseDate <= rangeEnd;
      });

      // Calculate revenue (sales total_amount)
      const rangeRevenue = rangeSales.reduce((sum, sale) => 
        sum + getNumeric(sale, ['total_amount']), 0
      );

      // Calculate expenses (purchases total_amount)
      const rangeExpenses = rangePurchases.reduce((sum, purchase) => 
        sum + getNumeric(purchase, ['total_amount']), 0
      );

      // Count transactions
      const rangeSalesCount = rangeSales.length;
      const rangePurchasesCount = rangePurchases.length;

      // Count new customers in this range
      const rangeCustomers = customers.filter(customer => {
        const customerDate = customer.created_at;
        return customerDate && customerDate >= rangeStart && customerDate <= rangeEnd;
      }).length;

      return {
        period: range.label,
        revenue: rangeRevenue,
        expenses: rangeExpenses,
        profit: rangeRevenue - rangeExpenses,
        sales: rangeSalesCount,
        purchases: rangePurchasesCount,
        customers: rangeCustomers,
      };
    });

    // FIXED: Calculate sales by category using sale_items → products → categories
    const categorySales = {};

    sales.forEach((sale) => {
      if (!Array.isArray(sale.sale_items)) return;

      sale.sale_items.forEach((item) => {
        // FIXED: Direct access to category through relationships
        const categoryName = item.products?.categories?.name || "Uncategorized";
        
        const itemTotal = getNumeric(item, ['total_price'], 0);
        
        categorySales[categoryName] = (categorySales[categoryName] || 0) + itemTotal;
      });
    });

    const salesByCategory = Object.entries(categorySales)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
      
    console.log("FINAL salesByCategory:", salesByCategory);
    console.log("Sales by category:", salesByCategory);

    // FIXED: Calculate top products using sale_items → products
    const productRevenue = {};

    sales.forEach((sale) => {
      if (!Array.isArray(sale.sale_items)) return;

      sale.sale_items.forEach((item) => {
        const productId = item.product_id;
        if (!productId) return;

        // FIXED: Direct access to product name from relationship
        const productName = item.products?.name || `Product ${productId}`;
        
        const quantity = getNumeric(item, ['quantity'], 0);
        const totalPrice = getNumeric(item, ['total_price'], 0);

        if (!productRevenue[productId]) {
          productRevenue[productId] = {
            id: productId,
            name: productName,
            revenue: 0,
            quantity: 0,
          };
        }

        productRevenue[productId].revenue += totalPrice;
        productRevenue[productId].quantity += quantity;
      });
    });

    const topProducts = Object.values(productRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Calculate customer trend (new customers per period)
    const customerTrend = dateRange.map(range => {
      const rangeStart = range.start.toISOString();
      const rangeEnd = range.end.toISOString();

      const newCustomers = customers.filter(customer => {
        const customerDate = customer.created_at;
        return customerDate && customerDate >= rangeStart && customerDate <= rangeEnd;
      }).length;

      // Returning customers requires order history - set to 0 until implemented
      return {
        period: range.label,
        newCustomers: newCustomers,
        returning: 0, // Will be calculated when we have customer order history
      };
    });

    // FIXED: Remove fake targets - return null until real targets table exists
    const targetVsActual = null;

    // FIXED: Use null for not-yet-implemented metrics
    const pendingOrders = null;
    const outstandingInvoices = null;

    // ============================================
    // BUSINESS HEALTH SCORE
    // ============================================

    let healthScore = 0;

    // 1. Profitability — 30 points
    if (revenue > 0) {
      const profitMargin = profit / revenue;

      if (profitMargin >= 0.30) {
        healthScore += 30;
      } else if (profitMargin >= 0.20) {
        healthScore += 25;
      } else if (profitMargin >= 0.10) {
        healthScore += 20;
      } else if (profitMargin >= 0) {
        healthScore += 15;
      } else if (profitMargin >= -0.25) {
        healthScore += 5;
      }
    }

    // 2. Sales activity — 20 points
    const salesCount = sales.length;

    if (salesCount >= 20) {
      healthScore += 20;
    } else if (salesCount >= 10) {
      healthScore += 15;
    } else if (salesCount >= 5) {
      healthScore += 10;
    } else if (salesCount >= 1) {
      healthScore += 5;
    }

    // 3. Inventory health — 20 points
    if (products.length > 0) {
      const stockHealthRatio = inStock / products.length;

      if (stockHealthRatio >= 0.90) {
        healthScore += 20;
      } else if (stockHealthRatio >= 0.75) {
        healthScore += 15;
      } else if (stockHealthRatio >= 0.50) {
        healthScore += 10;
      } else if (stockHealthRatio > 0) {
        healthScore += 5;
      }
    }

    // Penalize out-of-stock and low-stock products
    if (outOfStock > 0) {
      healthScore -= Math.min(outOfStock * 3, 10);
    }

    if (lowStock > 0) {
      healthScore -= Math.min(lowStock * 2, 10);
    }

    // 4. Customer base — 15 points
    const customerCount = customers.length;

    if (customerCount >= 50) {
      healthScore += 15;
    } else if (customerCount >= 20) {
      healthScore += 12;
    } else if (customerCount >= 10) {
      healthScore += 9;
    } else if (customerCount >= 5) {
      healthScore += 6;
    } else if (customerCount >= 1) {
      healthScore += 3;
    }

    // 5. Employee activity — 15 points
    if (totalEmployees > 0) {
      const employeeActivity = activeEmployees / totalEmployees;

      if (employeeActivity >= 0.90) {
        healthScore += 15;
      } else if (employeeActivity >= 0.75) {
        healthScore += 12;
      } else if (employeeActivity >= 0.50) {
        healthScore += 8;
      } else if (employeeActivity > 0) {
        healthScore += 5;
      }
    }

    // Keep score between 0 and 100
    healthScore = Math.max(0, Math.min(100, Math.round(healthScore)));

    console.log("========== BUSINESS HEALTH ==========");
    console.log("Revenue:", revenue);
    console.log("Expenses:", expenses);
    console.log("Profit:", profit);
    console.log("Sales:", sales.length);
    console.log("Products:", products.length);
    console.log("Customers:", customers.length);
    console.log("Employees:", employees.length);
    console.log("Active employees:", activeEmployees);
    console.log("Low stock:", lowStock);
    console.log("Out of stock:", outOfStock);
    console.log("Business Health Score:", healthScore);
    console.log("=====================================");

    // Prepare final response
    const dashboardData = {
      // Basic metrics
      period,
      startDate: start.toISOString(),
      endDate: end.toISOString(),

      todaySales,
      revenue,
      expenses,
      profit,

      // Business Health
      health: {
        overall: healthScore,
      },
      
      totalSales: sales.length,
      totalPurchases: completedPurchases.length,
      
      totalCustomers: customers.length,
      totalProducts: products.length,
      totalEmployees: employees.length,
      activeEmployees,
      
      inventoryValue,
      lowStock,
      outOfStock,
      inStock,
      
      pendingOrders,
      outstandingInvoices,
      
      // Chart data
      revenueTrend,
      salesByCategory,
      topProducts,
      customerTrend,
      
      inventoryStatus: {
        inStock,
        lowStock,
        outOfStock
      },
      
      targetVsActual,
      
      // Raw data for reports
      sales,
      purchases,
      products,
      customers,
      employees,
    };

    console.log(`Dashboard data prepared successfully`);
    return dashboardData;

  } catch (error) {
    console.error("Executive dashboard error:", error);
    throw error;
  }
}