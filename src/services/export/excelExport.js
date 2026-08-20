// src/services/export/excelExport.js
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportDashboardExcel = (dashboard) => {
  try {
    console.log("========== EXCEL EXPORT ==========");
    console.log("Dashboard data received:", !!dashboard);
    
    if (!dashboard) {
      throw new Error("No dashboard data available to export");
    }

    console.log("Dashboard metrics:", {
      revenue: dashboard.revenue,
      expenses: dashboard.expenses,
      profit: dashboard.profit,
      totalSales: dashboard.totalSales,
      healthScore: dashboard.health?.overall
    });

    const workbook = XLSX.utils.book_new();

    // 1. Summary Sheet - Main metrics
    const summaryData = [
      { Metric: 'Revenue', Value: dashboard.revenue || 0 },
      { Metric: 'Expenses', Value: dashboard.expenses || 0 },
      { Metric: 'Profit', Value: dashboard.profit || 0 },
      { Metric: "Today's Sales", Value: dashboard.todaySales || 0 },
      { Metric: 'Total Sales', Value: dashboard.totalSales || 0 },
      { Metric: 'Total Purchases', Value: dashboard.totalPurchases || 0 },
      { Metric: 'Total Products', Value: dashboard.totalProducts || 0 },
      { Metric: 'Total Customers', Value: dashboard.totalCustomers || 0 },
      { Metric: 'Total Employees', Value: dashboard.totalEmployees || 0 },
      { Metric: 'Active Employees', Value: dashboard.activeEmployees || 0 },
      { Metric: 'Inventory Value', Value: dashboard.inventoryValue || 0 },
      { Metric: 'In Stock', Value: dashboard.inStock || 0 },
      { Metric: 'Low Stock', Value: dashboard.lowStock || 0 },
      { Metric: 'Out of Stock', Value: dashboard.outOfStock || 0 },
      { Metric: 'Health Score', Value: dashboard.health?.overall || 0 },
      { Metric: 'Period', Value: dashboard.period || 'Month' },
      { Metric: 'Generated', Value: new Date().toLocaleString() },
    ];

    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    // Set column widths
    summarySheet['!cols'] = [
      { wch: 20 },
      { wch: 20 }
    ];
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

    // 2. Revenue Trend Sheet
    if (dashboard.revenueTrend && dashboard.revenueTrend.length > 0) {
      const trendData = dashboard.revenueTrend.map(item => ({
        Period: item.period || '',
        Revenue: item.revenue || 0,
        Expenses: item.expenses || 0,
        Profit: item.profit || 0,
        Sales: item.sales || 0,
        Purchases: item.purchases || 0,
        Customers: item.customers || 0,
      }));
      
      const trendSheet = XLSX.utils.json_to_sheet(trendData);
      trendSheet['!cols'] = [
        { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, 
        { wch: 12 }, { wch: 12 }, { wch: 12 }
      ];
      XLSX.utils.book_append_sheet(workbook, trendSheet, "Revenue Trend");
    }

    // 3. Sales by Category Sheet
    if (dashboard.salesByCategory && dashboard.salesByCategory.length > 0) {
      const categoryData = dashboard.salesByCategory.map(item => ({
        Category: item.name || 'Uncategorized',
        Revenue: item.value || 0,
      }));
      
      const categorySheet = XLSX.utils.json_to_sheet(categoryData);
      categorySheet['!cols'] = [
        { wch: 25 },
        { wch: 15 }
      ];
      XLSX.utils.book_append_sheet(workbook, categorySheet, "Sales by Category");
    }

    // 4. Top Products Sheet
    if (dashboard.topProducts && dashboard.topProducts.length > 0) {
      const productData = dashboard.topProducts.map(item => ({
        Product: item.name || 'Unknown',
        Revenue: item.revenue || 0,
        Quantity: item.quantity || 0,
      }));
      
      const productSheet = XLSX.utils.json_to_sheet(productData);
      productSheet['!cols'] = [
        { wch: 30 },
        { wch: 15 },
        { wch: 12 }
      ];
      XLSX.utils.book_append_sheet(workbook, productSheet, "Top Products");
    }

    // 5. Customer Trend Sheet
    if (dashboard.customerTrend && dashboard.customerTrend.length > 0) {
      const customerData = dashboard.customerTrend.map(item => ({
        Period: item.period || '',
        'New Customers': item.newCustomers || 0,
        'Returning Customers': item.returning || 0,
      }));
      
      const customerSheet = XLSX.utils.json_to_sheet(customerData);
      customerSheet['!cols'] = [
        { wch: 15 },
        { wch: 18 },
        { wch: 18 }
      ];
      XLSX.utils.book_append_sheet(workbook, customerSheet, "Customer Trend");
    }

    // 6. Inventory Status Sheet
    if (dashboard.inventoryStatus) {
      const inventoryData = [
        { Status: 'In Stock', Count: dashboard.inventoryStatus.inStock || 0 },
        { Status: 'Low Stock', Count: dashboard.inventoryStatus.lowStock || 0 },
        { Status: 'Out of Stock', Count: dashboard.inventoryStatus.outOfStock || 0 },
      ];
      
      const inventorySheet = XLSX.utils.json_to_sheet(inventoryData);
      inventorySheet['!cols'] = [
        { wch: 20 },
        { wch: 15 }
      ];
      XLSX.utils.book_append_sheet(workbook, inventorySheet, "Inventory Status");
    }

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const filename = `ExecutiveDashboard_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      filename
    );

    console.log(`✅ Excel exported successfully: ${filename}`);
    return true;

  } catch (error) {
    console.error("❌ Excel Export Error:", error);
    throw new Error(`Failed to export Excel: ${error.message}`);
  }
};

export default exportDashboardExcel;