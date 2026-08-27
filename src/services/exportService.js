import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export const exportService = {
  // Export chart as image (PNG)
  exportChartAsImage: async (chartElement, filename = 'chart.png') => {
    try {
      const canvas = await html2canvas(chartElement, {
        scale: 2,
        backgroundColor: '#ffffff',
        allowTaint: true,
        useCORS: true,
        logging: false
      })
      
      const link = document.createElement('a')
      link.download = filename
      link.href = canvas.toDataURL('image/png')
      link.click()
      
      return { success: true, error: null }
    } catch (error) {
      console.error('Export image error:', error)
      return { success: false, error: error.message }
    }
  },

  // Export data to PDF
  exportToPDF: async (element, filename = 'report.pdf', title = 'Report') => {
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        allowTaint: true,
        useCORS: true,
        logging: false
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      
      pdf.setFontSize(18)
      pdf.text(title, 14, 20)
      
      pdf.addImage(imgData, 'PNG', 0, 30, pdfWidth, pdfHeight)
      pdf.save(filename)
      
      return { success: true, error: null }
    } catch (error) {
      console.error('Export PDF error:', error)
      return { success: false, error: error.message }
    }
  },

  // Export data to Excel
  exportToExcel: (data, filename = 'data.xlsx', sheetName = 'Data') => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
      
      // Auto-column widths
      const maxWidth = 20
      const colWidths = []
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
      for (let col = range.s.c; col <= range.e.c; col++) {
        let maxLen = 0
        for (let row = range.s.r; row <= range.e.r; row++) {
          const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })]
          if (cell && cell.v) {
            maxLen = Math.max(maxLen, String(cell.v).length)
          }
        }
        colWidths.push({ wch: Math.min(maxLen + 2, maxWidth) })
      }
      worksheet['!cols'] = colWidths
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
      saveAs(blob, filename)
      
      return { success: true, error: null }
    } catch (error) {
      console.error('Export Excel error:', error)
      return { success: false, error: error.message }
    }
  },

  // Export sales data to Excel
  exportSalesToExcel: (sales) => {
    const data = sales.map(sale => ({
      'Invoice': sale.invoice_number || '',
      'Customer': sale.customer_name || '',
      'Amount': sale.total_amount || 0,
      'Date': sale.sale_date || '',
      'Status': sale.status || '',
      'Payment Method': sale.payment_method || ''
    }))
    return exportService.exportToExcel(data, 'sales_report.xlsx', 'Sales')
  },

  // Export products data to Excel
  exportProductsToExcel: (products) => {
    const data = products.map(product => ({
      'Name': product.name || '',
      'Category': product.category || '',
      'Price': product.price || 0,
      'Stock': product.stock || 0,
      'Description': product.description || ''
    }))
    return exportService.exportToExcel(data, 'products_report.xlsx', 'Products')
  },

  // Export customers data to Excel
  exportCustomersToExcel: (customers) => {
    const data = customers.map(customer => ({
      'Name': customer.name || '',
      'Email': customer.email || '',
      'Phone': customer.phone || '',
      'Total Sales': customer.total_sales || 0,
      'Total Spent': customer.total_spent || 0
    }))
    return exportService.exportToExcel(data, 'customers_report.xlsx', 'Customers')
  },

  // Print report
  printReport: (element) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Please allow pop-ups for printing')
      return { success: false, error: 'Pop-up blocked' }
    }
    
    const content = element.innerHTML
    printWindow.document.write(`
      <html>
        <head>
          <title>Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .header { text-align: center; margin-bottom: 20px; }
            .header h1 { color: #2563eb; }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
    
    return { success: true, error: null }
  }
}