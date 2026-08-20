// src/services/export/excelReportService.js
import ExcelJS from 'exceljs';

export const generateExcelReport = async (dashboard) => {
  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Fezher Supreme';
    workbook.created = new Date();
    
    // 1. Summary Sheet
    const summarySheet = workbook.addWorksheet('Executive Summary');
    
    // Add title
    summarySheet.mergeCells('A1:D1');
    const titleCell = summarySheet.getCell('A1');
    titleCell.value = 'Fezher Supreme Executive Report';
    titleCell.font = { size: 16, bold: true, color: { argb: 'FF1A237E' } };
    titleCell.alignment = { horizontal: 'center' };
    
    summarySheet.addRow([]);
    summarySheet.addRow(['Generated:', new Date().toLocaleString()]);
    summarySheet.addRow(['Period:', dashboard?.period || 'Month']);
    summarySheet.addRow([]);
    
    // Financial Summary
    summarySheet.addRow(['📈 FINANCIAL SUMMARY']);
    summarySheet.getRow(summarySheet.rowCount).font = { bold: true, size: 12 };
    summarySheet.addRow([]);
    
    const financialData = [
      ['Metric', 'Value'],
      ['Revenue', dashboard?.revenue || 0],
      ['Expenses', dashboard?.expenses || 0],
      ['Profit', dashboard?.profit || 0],
    ];
    
    financialData.forEach(row => {
      summarySheet.addRow(row);
    });
    
    summarySheet.addRow([]);
    
    // Business Metrics
    summarySheet.addRow(['📊 BUSINESS METRICS']);
    summarySheet.getRow(summarySheet.rowCount).font = { bold: true, size: 12 };
    summarySheet.addRow([]);
    
    const metricsData = [
      ['Metric', 'Value'],
      ['Total Sales', dashboard?.totalSales || 0],
      ['Total Products', dashboard?.totalProducts || 0],
      ['Total Customers', dashboard?.totalCustomers || 0],
      ['Total Employees', dashboard?.totalEmployees || 0],
      ['Health Score', `${dashboard?.health?.overall || 0}%`],
    ];
    
    metricsData.forEach(row => {
      summarySheet.addRow(row);
    });
    
    // Style the summary sheet
    summarySheet.getColumn(1).width = 20;
    summarySheet.getColumn(2).width = 20;
    
    // 2. Revenue Trend Sheet
    if (dashboard?.revenueTrend && dashboard.revenueTrend.length > 0) {
      const trendSheet = workbook.addWorksheet('Revenue Trend');
      
      trendSheet.addRow(['Period', 'Revenue', 'Expenses', 'Profit', 'Sales']);
      trendSheet.getRow(1).font = { bold: true };
      
      dashboard.revenueTrend.forEach(item => {
        trendSheet.addRow([
          item.period || '',
          item.revenue || 0,
          item.expenses || 0,
          item.profit || 0,
          item.sales || 0,
        ]);
      });
      
      trendSheet.getColumn(1).width = 15;
      trendSheet.getColumn(2).width = 15;
      trendSheet.getColumn(3).width = 15;
      trendSheet.getColumn(4).width = 15;
      trendSheet.getColumn(5).width = 15;
    }
    
    // 3. Sales by Category Sheet
    if (dashboard?.salesByCategory && dashboard.salesByCategory.length > 0) {
      const categorySheet = workbook.addWorksheet('Sales by Category');
      
      categorySheet.addRow(['Category', 'Revenue']);
      categorySheet.getRow(1).font = { bold: true };
      
      dashboard.salesByCategory.forEach(item => {
        categorySheet.addRow([
          item.name || 'Uncategorized',
          item.value || 0,
        ]);
      });
      
      categorySheet.getColumn(1).width = 25;
      categorySheet.getColumn(2).width = 15;
    }
    
    // 4. Top Products Sheet
    if (dashboard?.topProducts && dashboard.topProducts.length > 0) {
      const productSheet = workbook.addWorksheet('Top Products');
      
      productSheet.addRow(['Product', 'Revenue', 'Quantity']);
      productSheet.getRow(1).font = { bold: true };
      
      dashboard.topProducts.forEach(item => {
        productSheet.addRow([
          item.name || 'Unknown',
          item.revenue || 0,
          item.quantity || 0,
        ]);
      });
      
      productSheet.getColumn(1).width = 30;
      productSheet.getColumn(2).width = 15;
      productSheet.getColumn(3).width = 15;
    }
    
    // Generate the file as base64
    const buffer = await workbook.xlsx.writeBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    
    return base64;
    
  } catch (error) {
    console.error('Excel Generation Error:', error);
    throw error;
  }
};

export default generateExcelReport;