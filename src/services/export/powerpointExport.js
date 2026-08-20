// src/services/export/powerpointExport.js
import PptxGenJS from 'pptxgenjs';

export const exportDashboardPowerPoint = async (dashboard) => {
  try {
    console.log("========== POWERPOINT EXPORT ==========");
    console.log("Dashboard data received:", !!dashboard);
    
    if (!dashboard) {
      throw new Error("No dashboard data available to export");
    }

    // Create a new PowerPoint presentation
    const pptx = new PptxGenJS();
    pptx.defineLayout({ name: 'WIDE', width: 13.33, height: 7.5 });
    pptx.layout = 'WIDE';
    pptx.author = 'Fezher Supreme';
    pptx.title = 'Executive Dashboard Report';
    pptx.subject = 'Business Performance';
    pptx.company = 'Fezher Supreme';

    // Slide 1: Title Slide
    const slide1 = pptx.addSlide();
    slide1.background = { color: '1A237E' };
    slide1.addText('Fezher Supreme', {
      x: 0.5,
      y: 1.2,
      w: 12.33,
      h: 1.2,
      fontSize: 40,
      color: 'FFFFFF',
      align: 'center',
      fontFace: 'Arial',
      bold: true,
    });
    slide1.addText('Executive Dashboard Report', {
      x: 0.5,
      y: 2.5,
      w: 12.33,
      h: 1,
      fontSize: 28,
      color: 'FFFFFF',
      align: 'center',
      fontFace: 'Arial',
    });
    slide1.addText(`Generated: ${new Date().toLocaleString('en-ZA', { dateStyle: 'full', timeStyle: 'medium' })}`, {
      x: 0.5,
      y: 4.2,
      w: 12.33,
      h: 0.8,
      fontSize: 16,
      color: 'B0BEC5',
      align: 'center',
      fontFace: 'Arial',
    });
    slide1.addText(`Period: ${dashboard.period || 'Month'}`, {
      x: 0.5,
      y: 5,
      w: 12.33,
      h: 0.8,
      fontSize: 16,
      color: 'B0BEC5',
      align: 'center',
      fontFace: 'Arial',
    });

    // Slide 2: Financial Summary
    const slide2 = pptx.addSlide();
    slide2.background = { color: 'F5F5F5' };
    slide2.addText('📈 Financial Summary', {
      x: 0.5,
      y: 0.3,
      w: 12.33,
      h: 0.8,
      fontSize: 28,
      color: '1A237E',
      align: 'left',
      fontFace: 'Arial',
      bold: true,
    });

    const financialData = [
      ['Revenue', `R ${(dashboard.revenue || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, '#2E7D32'],
      ['Expenses', `R ${(dashboard.expenses || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, '#C62828'],
      ['Profit', `R ${(dashboard.profit || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, (dashboard.profit || 0) >= 0 ? '#2E7D32' : '#C62828'],
    ];

    let yPos = 1.8;
    financialData.forEach((row) => {
      // Label
      slide2.addText(row[0], {
        x: 1,
        y: yPos,
        w: 4,
        h: 0.8,
        fontSize: 18,
        color: '333333',
        fontFace: 'Arial',
      });
      // Value with color
      slide2.addText(row[1], {
        x: 5,
        y: yPos,
        w: 4,
        h: 0.8,
        fontSize: 18,
        color: row[2],
        align: 'right',
        fontFace: 'Arial',
        bold: true,
      });
      yPos += 1;
    });

    // Slide 3: Business Metrics
    const slide3 = pptx.addSlide();
    slide3.background = { color: 'F5F5F5' };
    slide3.addText('📊 Business Metrics', {
      x: 0.5,
      y: 0.3,
      w: 12.33,
      h: 0.8,
      fontSize: 28,
      color: '1A237E',
      align: 'left',
      fontFace: 'Arial',
      bold: true,
    });

    const metricsData = [
      ['Total Sales', dashboard.totalSales || 0],
      ['Total Products', dashboard.totalProducts || 0],
      ['Total Customers', dashboard.totalCustomers || 0],
      ['Total Employees', dashboard.totalEmployees || 0],
      ['Active Employees', dashboard.activeEmployees || 0],
      ['Health Score', `${dashboard.health?.overall || 0}%`],
    ];

    let yPos2 = 1.5;
    let col1 = 1;
    let col2 = 6.5;
    let halfLength = Math.ceil(metricsData.length / 2);

    metricsData.forEach((row, index) => {
      const xPos = index < halfLength ? col1 : col2;
      const yPos3 = index < halfLength ? yPos2 : 1.5 + ((index - halfLength) * 0.8);
      
      slide3.addText(row[0], {
        x: xPos,
        y: yPos3,
        w: 3.5,
        h: 0.6,
        fontSize: 14,
        color: '555555',
        fontFace: 'Arial',
      });
      slide3.addText(String(row[1]), {
        x: xPos + 3.5,
        y: yPos3,
        w: 2,
        h: 0.6,
        fontSize: 16,
        color: '1A237E',
        align: 'right',
        fontFace: 'Arial',
        bold: true,
      });
    });

    // Slide 4: Inventory Status
    const slide4 = pptx.addSlide();
    slide4.background = { color: 'F5F5F5' };
    slide4.addText('📦 Inventory Status', {
      x: 0.5,
      y: 0.3,
      w: 12.33,
      h: 0.8,
      fontSize: 28,
      color: '1A237E',
      align: 'left',
      fontFace: 'Arial',
      bold: true,
    });

    const inventoryData = [
      ['In Stock', dashboard.inStock || 0, '#2E7D32'],
      ['Low Stock', dashboard.lowStock || 0, '#ED6C02'],
      ['Out of Stock', dashboard.outOfStock || 0, '#C62828'],
    ];

    let yPos4 = 1.8;
    inventoryData.forEach((row) => {
      slide4.addText(row[0], {
        x: 1,
        y: yPos4,
        w: 4,
        h: 0.8,
        fontSize: 18,
        color: '333333',
        fontFace: 'Arial',
      });
      slide4.addText(String(row[1]), {
        x: 5,
        y: yPos4,
        w: 4,
        h: 0.8,
        fontSize: 18,
        color: row[2],
        align: 'right',
        fontFace: 'Arial',
        bold: true,
      });
      yPos4 += 1;
    });

    // Slide 5: Sales by Category (if data exists)
    if (dashboard.salesByCategory && dashboard.salesByCategory.length > 0) {
      const slide5 = pptx.addSlide();
      slide5.background = { color: 'F5F5F5' };
      slide5.addText('📂 Sales by Category', {
        x: 0.5,
        y: 0.3,
        w: 12.33,
        h: 0.8,
        fontSize: 28,
        color: '1A237E',
        align: 'left',
        fontFace: 'Arial',
        bold: true,
      });

      let yPos5 = 1.8;
      const topCategories = dashboard.salesByCategory.slice(0, 8);
      
      topCategories.forEach((item) => {
        slide5.addText(item.name || 'Uncategorized', {
          x: 1,
          y: yPos5,
          w: 4,
          h: 0.7,
          fontSize: 16,
          color: '333333',
          fontFace: 'Arial',
        });
        slide5.addText(`R ${(item.value || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, {
          x: 5,
          y: yPos5,
          w: 4,
          h: 0.7,
          fontSize: 16,
          color: '1A237E',
          align: 'right',
          fontFace: 'Arial',
          bold: true,
        });
        yPos5 += 0.8;
      });
    }

    // Slide 6: Top Products (if data exists)
    if (dashboard.topProducts && dashboard.topProducts.length > 0) {
      const slide6 = pptx.addSlide();
      slide6.background = { color: 'F5F5F5' };
      slide6.addText('🏆 Top Products', {
        x: 0.5,
        y: 0.3,
        w: 12.33,
        h: 0.8,
        fontSize: 28,
        color: '1A237E',
        align: 'left',
        fontFace: 'Arial',
        bold: true,
      });

      // Header
      slide6.addText('Product', { x: 1, y: 1.4, w: 5, h: 0.6, fontSize: 14, color: '666666', fontFace: 'Arial', bold: true });
      slide6.addText('Revenue', { x: 6.5, y: 1.4, w: 2.5, h: 0.6, fontSize: 14, color: '666666', align: 'right', fontFace: 'Arial', bold: true });
      slide6.addText('Qty', { x: 9.5, y: 1.4, w: 2, h: 0.6, fontSize: 14, color: '666666', align: 'right', fontFace: 'Arial', bold: true });

      let yPos6 = 2.2;
      const topProducts = dashboard.topProducts.slice(0, 6);
      
      topProducts.forEach((item) => {
        slide6.addText(item.name || 'Unknown', {
          x: 1,
          y: yPos6,
          w: 5,
          h: 0.7,
          fontSize: 14,
          color: '333333',
          fontFace: 'Arial',
        });
        slide6.addText(`R ${(item.revenue || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, {
          x: 6.5,
          y: yPos6,
          w: 2.5,
          h: 0.7,
          fontSize: 14,
          color: '1A237E',
          align: 'right',
          fontFace: 'Arial',
          bold: true,
        });
        slide6.addText(String(item.quantity || 0), {
          x: 9.5,
          y: yPos6,
          w: 2,
          h: 0.7,
          fontSize: 14,
          color: '333333',
          align: 'right',
          fontFace: 'Arial',
        });
        yPos6 += 0.8;
      });
    }

    // Slide 7: Customer Trend (if data exists)
    if (dashboard.customerTrend && dashboard.customerTrend.length > 0) {
      const slide7 = pptx.addSlide();
      slide7.background = { color: 'F5F5F5' };
      slide7.addText('👥 Customer Trend', {
        x: 0.5,
        y: 0.3,
        w: 12.33,
        h: 0.8,
        fontSize: 28,
        color: '1A237E',
        align: 'left',
        fontFace: 'Arial',
        bold: true,
      });

      // Header
      slide7.addText('Period', { x: 1, y: 1.4, w: 3, h: 0.6, fontSize: 14, color: '666666', fontFace: 'Arial', bold: true });
      slide7.addText('New Customers', { x: 4.5, y: 1.4, w: 3, h: 0.6, fontSize: 14, color: '666666', align: 'right', fontFace: 'Arial', bold: true });
      slide7.addText('Returning', { x: 8, y: 1.4, w: 3, h: 0.6, fontSize: 14, color: '666666', align: 'right', fontFace: 'Arial', bold: true });

      let yPos7 = 2.2;
      const trends = dashboard.customerTrend.slice(0, 8);
      
      trends.forEach((item) => {
        slide7.addText(item.period || '', {
          x: 1,
          y: yPos7,
          w: 3,
          h: 0.7,
          fontSize: 14,
          color: '333333',
          fontFace: 'Arial',
        });
        slide7.addText(String(item.newCustomers || 0), {
          x: 4.5,
          y: yPos7,
          w: 3,
          h: 0.7,
          fontSize: 14,
          color: '2E7D32',
          align: 'right',
          fontFace: 'Arial',
          bold: true,
        });
        slide7.addText(String(item.returning || 0), {
          x: 8,
          y: yPos7,
          w: 3,
          h: 0.7,
          fontSize: 14,
          color: '1A237E',
          align: 'right',
          fontFace: 'Arial',
          bold: true,
        });
        yPos7 += 0.8;
      });
    }

    // Slide 8: Thank You / Conclusion
    const slide8 = pptx.addSlide();
    slide8.background = { color: '1A237E' };
    slide8.addText('Thank You', {
      x: 0.5,
      y: 2.5,
      w: 12.33,
      h: 1.2,
      fontSize: 44,
      color: 'FFFFFF',
      align: 'center',
      fontFace: 'Arial',
      bold: true,
    });
    slide8.addText('Fezher Supreme Executive Dashboard Report', {
      x: 0.5,
      y: 3.8,
      w: 12.33,
      h: 0.8,
      fontSize: 18,
      color: 'B0BEC5',
      align: 'center',
      fontFace: 'Arial',
    });
    slide8.addText(`© ${new Date().getFullYear()} Fezher Supreme - Confidential`, {
      x: 0.5,
      y: 5.5,
      w: 12.33,
      h: 0.6,
      fontSize: 14,
      color: '78909C',
      align: 'center',
      fontFace: 'Arial',
    });

    // Generate the file as base64
    const output = await pptx.write({ outputType: 'base64' });
    
    // Create download link
    const filename = `ExecutiveDashboard_${new Date().toISOString().split('T')[0]}.pptx`;
    const link = document.createElement('a');
    link.setAttribute('href', `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${output}`);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log(`✅ PowerPoint exported successfully: ${filename}`);
    return true;

  } catch (error) {
    console.error("❌ PowerPoint Export Error:", error);
    throw new Error(`Failed to export PowerPoint: ${error.message}`);
  }
};

export default exportDashboardPowerPoint;