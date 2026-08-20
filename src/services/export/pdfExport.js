// src/services/export/pdfExport.js
import jsPDF from "jspdf";
import domtoimage from 'dom-to-image';

export const exportDashboardPDF = async (dashboardData) => {
  try {
    console.log("========== PDF EXPORT ==========");
    console.log("Dashboard data received:", !!dashboardData);
    
    if (dashboardData) {
      console.log("Dashboard metrics:", {
        revenue: dashboardData.revenue,
        expenses: dashboardData.expenses,
        profit: dashboardData.profit,
        totalSales: dashboardData.totalSales,
        healthScore: dashboardData.health?.overall
      });
    }
    
    const input = document.getElementById("dashboard");
    
    if (!input) {
      throw new Error("Dashboard element not found. Please make sure the dashboard is visible.");
    }

    console.log("Capturing dashboard with dom-to-image...");

    // Use dom-to-image which handles modern CSS better
    const dataUrl = await domtoimage.toPng(input, {
      quality: 1,
      bgcolor: '#ffffff',
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
      },
      filter: (node) => {
        // Filter out any problematic elements if needed
        return true;
      },
      cacheBuster: true,
      skipAutoScale: false,
    });

    console.log("Dashboard captured successfully, creating PDF...");

    // Create PDF
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const margin = 10;
    const maxWidth = pdfWidth - (margin * 2);
    const maxHeight = pdfHeight - (margin * 2);
    
    // Load image to get dimensions
    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    
    const imgAspectRatio = img.width / img.height;
    const pageAspectRatio = maxWidth / maxHeight;
    
    let finalWidth, finalHeight;
    
    if (imgAspectRatio > pageAspectRatio) {
      finalWidth = maxWidth;
      finalHeight = maxWidth / imgAspectRatio;
    } else {
      finalHeight = maxHeight;
      finalWidth = maxHeight * imgAspectRatio;
    }
    
    const xOffset = (maxWidth - finalWidth) / 2 + margin;
    const yOffset = (maxHeight - finalHeight) / 2 + margin;

    // Add title with period info if available
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Executive Dashboard Report", 14, 20);
    
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    const dateStr = new Date().toLocaleString();
    const periodStr = dashboardData?.period ? ` - Period: ${dashboardData.period.toUpperCase()}` : '';
    pdf.text(`Generated: ${dateStr}${periodStr}`, 14, 28);

    // Add the image
    pdf.addImage(dataUrl, "PNG", xOffset, yOffset + 15, finalWidth, finalHeight);

    // Add footer with data summary
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    
    // Create a summary footer with key metrics
    let footerText = `© ${new Date().getFullYear()} Fezher Supreme - Confidential`;
    if (dashboardData) {
      footerText += ` | Revenue: R${(dashboardData.revenue || 0).toLocaleString()} | Profit: R${(dashboardData.profit || 0).toLocaleString()}`;
    }
    
    pdf.text(
      footerText,
      pdfWidth / 2,
      pdfHeight - 10,
      { align: "center" }
    );

    const filename = `ExecutiveDashboard_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
    
    // Clean up
    img.src = '';
    
    console.log(`✅ PDF exported successfully: ${filename}`);
    console.log(`📊 PDF includes: ${dashboardData ? 'Dashboard data in metadata' : 'Screenshot only'}`);
    return true;
    
  } catch (error) {
    console.error("❌ PDF Export Error:", error);
    throw new Error(`Failed to export PDF: ${error.message}`);
  }
};

export default exportDashboardPDF;