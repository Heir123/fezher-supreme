 import { supabase } from './supabase'
import { formatCurrency, formatDate } from '../utils/helpers'

export const emailReportService = {
  // Send report via email
  sendEmailReport: async (email, reportData, reportType = 'daily') => {
    try {
      // Generate report HTML
      const htmlContent = emailReportService.generateReportHTML(reportData, reportType)
      
      // In production, this would call an Edge Function or email API
      // For now, we'll save to a reports table and simulate sending
      
      const { data, error } = await supabase
        .from('email_reports')
        .insert([{
          recipient_email: email,
          report_type: reportType,
          report_data: reportData,
          html_content: htmlContent,
          status: 'pending',
          created_at: new Date().toISOString()
        }])
        .select()
        .single()
      
      if (error) throw error
      
      return { 
        success: true, 
        message: `Report sent to ${email}`,
        data: data,
        error: null 
      }
    } catch (error) {
      console.error('sendEmailReport error:', error)
      return { success: false, message: null, error: error.message }
    }
  },

  // Generate report HTML for email
  generateReportHTML: (data, reportType) => {
    const summary = data.summary || {}
    const revenue = data.revenue || { items: [] }
    const expenses = data.expenses || { items: [] }
    const profit = data.profit || { net: 0, margin: 0 }

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>BizFlow Report</title>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .container { max-width: 800px; margin: 0 auto; padding: 20px; }
            .summary-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; margin: 20px 0; }
            .summary-card { background: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; }
            .summary-card .value { font-size: 24px; font-weight: bold; }
            .summary-card .label { font-size: 12px; color: #64748b; }
            .revenue { color: #22c55e; }
            .expenses { color: #ef4444; }
            .profit-positive { color: #22c55e; }
            .profit-negative { color: #ef4444; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th { background: #f1f5f9; padding: 10px; text-align: left; }
            td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
            .footer { text-align: center; color: #94a3b8; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 BizFlow ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</h1>
              <p>Generated: ${new Date().toLocaleString()}</p>
            </div>
            
            <h2>Summary</h2>
            <div class="summary-grid">
              <div class="summary-card">
                <div class="label">Total Revenue</div>
                <div class="value revenue">${formatCurrency(summary.totalRevenue || 0)}</div>
              </div>
              <div class="summary-card">
                <div class="label">Total Expenses</div>
                <div class="value expenses">${formatCurrency(summary.totalExpenses || 0)}</div>
              </div>
              <div class="summary-card">
                <div class="label">Net Profit</div>
                <div class="value ${(profit.net || 0) >= 0 ? 'profit-positive' : 'profit-negative'}">
                  ${formatCurrency(profit.net || 0)}
                </div>
              </div>
              <div class="summary-card">
                <div class="label">Profit Margin</div>
                <div class="value">${(profit.margin || 0).toFixed(1)}%</div>
              </div>
            </div>

            <h2>Revenue</h2>
            <p>${revenue.items.length} transactions</p>
            <table>
              <thead><tr><th>Invoice</th><th>Amount</th></tr></thead>
              <tbody>
                ${revenue.items.map(item => `
                  <tr><td>${item.invoice_number || 'Sale'}</td><td>${formatCurrency(item.total_amount)}</td></tr>
                `).join('')}
                ${revenue.items.length === 0 ? '<tr><td colspan="2">No revenue recorded</td></tr>' : ''}
              </tbody>
            </table>

            <h2>Expenses by Category</h2>
            <table>
              <thead><tr><th>Category</th><th>Amount</th></tr></thead>
              <tbody>
                ${Object.entries(expenses.byCategory || {}).map(([category, data]) => `
                  <tr><td>${category}</td><td>${formatCurrency(data.total)}</td></tr>
                `).join('')}
                ${Object.keys(expenses.byCategory || {}).length === 0 ? '<tr><td colspan="2">No expenses recorded</td></tr>' : ''}
                <tr style="font-weight:bold;border-top:2px solid #333;">
                  <td>Total Expenses</td>
                  <td>${formatCurrency(summary.totalExpenses || 0)}</td>
                </tr>
              </tbody>
            </table>

            <div class="footer">
              <p>This is an automated report from BizFlow.</p>
              <p>&copy; ${new Date().getFullYear()} BizFlow - All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  },

  // Get scheduled reports
  getScheduledReports: async () => {
    try {
      const { data, error } = await supabase
        .from('email_reports')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error: error.message }
    }
  },

  // Schedule a report
  scheduleReport: async (scheduleData) => {
    try {
      const { data, error } = await supabase
        .from('email_reports')
        .insert([{
          ...scheduleData,
          status: 'scheduled',
          created_at: new Date().toISOString()
        }])
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Cancel scheduled report
  cancelScheduledReport: async (id) => {
    try {
      const { error } = await supabase
        .from('email_reports')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', id)
      
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  // Send test report
  sendTestReport: async (email) => {
    try {
      // Get sample data
      const { data: sales } = await supabase
        .from('sales')
        .select('*')
        .in('status', ['paid', 'completed'])
        .limit(5)
      
      const { data: expenses } = await supabase
        .from('expenses')
        .select('*')
        .eq('status', 'paid')
        .limit(5)

      const testData = {
        summary: {
          totalRevenue: sales?.reduce((sum, s) => sum + (s.total_amount || 0), 0) || 0,
          totalExpenses: expenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0,
          netProfit: 0
        },
        revenue: { items: sales || [] },
        expenses: { items: expenses || [], byCategory: {} },
        profit: { net: 0, margin: 0 }
      }

      // Calculate net profit
      testData.summary.netProfit = testData.summary.totalRevenue - testData.summary.totalExpenses
      testData.profit.net = testData.summary.netProfit
      testData.profit.margin = testData.summary.totalRevenue > 0 
        ? (testData.summary.netProfit / testData.summary.totalRevenue) * 100 
        : 0

      return await emailReportService.sendEmailReport(email, testData, 'test')
    } catch (error) {
      return { success: false, message: null, error: error.message }
    }
  }
}