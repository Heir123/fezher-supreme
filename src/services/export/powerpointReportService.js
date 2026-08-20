// src/services/export/powerpointReportService.js
import PptxGenJS from 'pptxgenjs';

export const generatePowerPointReport = async (dashboard) => {
  try {
    const pptx = new PptxGenJS();
    pptx.defineLayout({ name: 'WIDE', width: 13.33, height: 7.5 });
    pptx.layout = 'WIDE';
    
    // Slide 1: Title Slide
    const slide1 = pptx.addSlide();
    slide1.background = { color: '1A237E' };
    slide1.addText('Fezher Supreme', {
      x: 0.5,
      y: 1.5,
      w: 12.33,
      h: 1.2,
      fontSize: 36,
      color: 'FFFFFF',
      align: 'center',
      fontFace: 'Arial',
    });
    slide1.addText('Executive Report', {
      x: 0.5,
      y: 2.8,
      w: 12.33,
      h: 1,
      fontSize: 28,
      color: 'FFFFFF',
      align: 'center',
      fontFace: 'Arial',
    });
    slide1.addText(new Date().toLocaleDateString('en-ZA', { dateStyle: 'full' }), {
      x: 0.5,
      y: 4.5,
      w: 12.33,
      h: 0.8,
      fontSize: 18,
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
      fontSize: 24,
      color: '1A237E',
      align: 'left',
      fontFace: 'Arial',
    });
    
    const financialData = [
      ['Metric', 'Amount'],
      ['Revenue', `R ${(dashboard?.revenue || 0).toLocaleString()}`],
      ['Expenses', `R ${(dashboard?.expenses || 0).toLocaleString()}`],
      ['Profit', `R ${(dashboard?.profit || 0).toLocaleString()}`],
    ];
    
    let yPos = 1.5;
    financialData.forEach((row, index) => {
      const color = index === 0 ? '1A237E' : index === 3 ? (dashboard?.profit >= 0 ? '2E7D32' : 'C62828') : '333333';
      slide2.addText(row[0], {
        x: 1,
        y: yPos,
        w: 4,
        h: 0.7,
        fontSize: 16,
        color: color,
        fontFace: 'Arial',
      });
      slide2.addText(row[1], {
        x: 5,
        y: yPos,
        w: 4,
        h: 0.7,
        fontSize: 16,
        color: color,
        align: 'right',
        fontFace: 'Arial',
      });
      yPos += 0.8;
    });
    
    // Slide 3: Business Metrics
    const slide3 = pptx.addSlide();
    slide3.background = { color: 'F5F5F5' };
    slide3.addText('📊 Business Metrics', {
      x: 0.5,
      y: 0.3,
      w: 12.33,
      h: 0.8,
      fontSize: 24,
      color: '1A237E',
      align: 'left',
      fontFace: 'Arial',
    });
    
    const metricsData = [
      ['Metric', 'Value'],
      ['Total Sales', dashboard?.totalSales || 0],
      ['Total Products', dashboard?.totalProducts || 0],
      ['Total Customers', dashboard?.totalCustomers || 0],
      ['Total Employees', dashboard?.totalEmployees || 0],
      ['Health Score', `${dashboard?.health?.overall || 0}%`],
    ];
    
    let yPos2 = 1.5;
    metricsData.forEach((row, index) => {
      const color = index === 0 ? '1A237E' : '333333';
      slide3.addText(row[0], {
        x: 1,
        y: yPos2,
        w: 4,
        h: 0.7,
        fontSize: 16,
        color: color,
        fontFace: 'Arial',
      });
      slide3.addText(String(row[1]), {
        x: 5,
        y: yPos2,
        w: 4,
        h: 0.7,
        fontSize: 16,
        color: color,
        align: 'right',
        fontFace: 'Arial',
      });
      yPos2 += 0.8;
    });
    
    // Generate the file as base64
    const output = await pptx.write({ outputType: 'base64' });
    return output;
    
  } catch (error) {
    console.error('PowerPoint Generation Error:', error);
    throw error;
  }
};

export default generatePowerPointReport;