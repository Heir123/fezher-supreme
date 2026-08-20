// src/services/export/pdfReportService.js
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generatePDFReport = async (dashboard) => {
  try {
    // Create a temporary container for the report
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '1200px';
    container.style.padding = '40px';
    container.style.backgroundColor = '#ffffff';
    container.style.fontFamily = 'Arial, sans-serif';
    
    // Build the HTML report
    container.innerHTML = `
      <div style="max-width: 100%;">
        <h1 style="color: #1a237e; text-align: center; font-size: 28px; margin-bottom: 5px;">
          📊 Fezher Supreme Executive Report
        </h1>
        <p style="text-align: center; color: #666; margin-top: 0; font-size: 14px;">
          ${new Date().toLocaleString('en-ZA', { dateStyle: 'full', timeStyle: 'medium' })}
        </p>
        
        <hr style="border: none; border-top: 2px solid #e0e0e0; margin: 20px 0;">
        
        <h2 style="color: #1a237e;">📈 Financial Summary</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 12px 16px; border: 1px solid #e0e0e0; background: #f8f9fa; font-weight: bold; width: 40%;">
              Total Revenue
            </td>
            <td style="padding: 12px 16px; border: 1px solid #e0e0e0; color: #2e7d32; font-weight: bold;">
              R ${(dashboard?.revenue || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; border: 1px solid #e0e0e0; background: #f8f9fa; font-weight: bold;">
              Total Expenses
            </td>
            <td style="padding: 12px 16px; border: 1px solid #e0e0e0; color: #c62828; font-weight: bold;">
              R ${(dashboard?.expenses || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; border: 1px solid #e0e0e0; background: #f8f9fa; font-weight: bold;">
              Net Profit
            </td>
            <td style="padding: 12px 16px; border: 1px solid #e0e0e0; font-weight: bold; color: ${(dashboard?.profit || 0) >= 0 ? '#2e7d32' : '#c62828'};">
              R ${(dashboard?.profit || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
          </tr>
        </table>
        
        <h2 style="color: #1a237e;">📊 Business Metrics</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 12px 16px; border: 1px solid #e0e0e0; background: #f8f9fa; font-weight: bold;">
              Total Sales
            </td>
            <td style="padding: 12px 16px; border: 1px solid #e0e0e0;">
              ${dashboard?.totalSales || 0}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; border: 1px solid #e0e0e0; background: #f8f9fa; font-weight: bold;">
              Total Products
            </td>
            <td style="padding: 12px 16px; border: 1px solid #e0e0e0;">
              ${dashboard?.totalProducts || 0}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; border: 1px solid #e0e0e0; background: #f8f9fa; font-weight: bold;">
              Total Customers
            </td>
            <td style="padding: 12px 16px; border: 1px solid #e0e0e0;">
              ${dashboard?.totalCustomers || 0}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; border: 1px solid #e0e0e0; background: #f8f9fa; font-weight: bold;">
              Total Employees
            </td>
            <td style="padding: 12px 16px; border: 1px solid #e0e0e0;">
              ${dashboard?.totalEmployees || 0}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; border: 1px solid #e0e0e0; background: #f8f9fa; font-weight: bold;">
              Business Health Score
            </td>
            <td style="padding: 12px 16px; border: 1px solid #e0e0e0;">
              <span style="display: inline-block; padding: 4px 12px; border-radius: 20px; background: #e8f5e9; color: #2e7d32; font-weight: bold;">
                ${dashboard?.health?.overall || 0}%
              </span>
            </td>
          </tr>
        </table>
        
        <div style="margin-top: 30px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
          <p style="margin: 5px 0; font-size: 12px; color: #1a237e;">
            <strong>📅 Period:</strong> ${dashboard?.period || 'Month'}
          </p>
          <p style="margin: 5px 0; font-size: 12px; color: #1a237e;">
            <strong>📎 Generated:</strong> ${new Date().toISOString().split('T')[0]}
          </p>
        </div>
        
        <div style="margin-top: 30px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px;">
          <p>© ${new Date().getFullYear()} Fezher Supreme - Confidential</p>
          <p>This report is generated automatically.</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(container);
    
    // Convert to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });
    
    // Remove the temporary container
    document.body.removeChild(container);
    
    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    // Return as base64
    return pdf.output('datauristring');
    
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  }
};

export default generatePDFReport;