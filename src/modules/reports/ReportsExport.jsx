// src/modules/reports/ReportsExport.jsx
import React from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  Divider,
  Alert
} from '@mui/material';
import { 
  PictureAsPdf as PdfIcon, 
  TableChart as ExcelIcon, 
  FilePresent as CsvIcon,
  Slideshow as PowerPointIcon,
  Email as EmailIcon,
  Download as DownloadIcon,
  Print as PrintIcon
} from '@mui/icons-material';

const ReportsExport = ({ dashboard, showNotification, onExportPDF, onExportExcel }) => {
  
  // Handle PDF Export
  const handleExportPDF = async () => {
    try {
      if (showNotification) {
        showNotification('Generating PDF report...', 'info');
      }
      
      if (onExportPDF) {
        await onExportPDF();
      } else {
        // Fallback: use the imported function directly
        const { exportDashboardPDF } = await import('@/services/export/pdfExport');
        await exportDashboardPDF();
      }
      
      if (showNotification) {
        showNotification('PDF exported successfully!', 'success');
      }
    } catch (error) {
      console.error('PDF export error:', error);
      if (showNotification) {
        showNotification('Failed to export PDF', 'error');
      }
    }
  };

  // Handle Excel Export
  const handleExportExcel = async () => {
    try {
      if (showNotification) {
        showNotification('Generating Excel report...', 'info');
      }
      
      if (onExportExcel) {
        await onExportExcel();
      } else {
        // Fallback: use the imported function directly
        const { exportDashboardExcel } = await import('@/services/export/excelExport');
        await exportDashboardExcel(dashboard);
      }
      
      if (showNotification) {
        showNotification('Excel exported successfully!', 'success');
      }
    } catch (error) {
      console.error('Excel export error:', error);
      if (showNotification) {
        showNotification('Failed to export Excel', 'error');
      }
    }
  };

  // Handle CSV Export
  const handleExportCSV = () => {
    try {
      if (showNotification) {
        showNotification('Generating CSV report...', 'info');
      }
      
      // Generate CSV data
      const rows = [
        ['Metric', 'Value'],
        ['Revenue', dashboard?.revenue || 0],
        ['Expenses', dashboard?.expenses || 0],
        ['Profit', dashboard?.profit || 0],
        ['Total Sales', dashboard?.totalSales || 0],
        ['Total Products', dashboard?.totalProducts || 0],
        ['Total Customers', dashboard?.totalCustomers || 0],
        ['Total Employees', dashboard?.totalEmployees || 0],
        ['Health Score', dashboard?.health?.overall || 0],
      ];
      
      const csvContent = rows.map(row => row.join(',')).join('\n');
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `ExecutiveReport_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      if (showNotification) {
        showNotification('CSV exported successfully!', 'success');
      }
    } catch (error) {
      console.error('CSV export error:', error);
      if (showNotification) {
        showNotification('Failed to export CSV', 'error');
      }
    }
  };

  // Handle PowerPoint Export
  const handleExportPowerPoint = () => {
    try {
      if (showNotification) {
        showNotification('Generating PowerPoint report...', 'info');
      }
      
      // Simple PowerPoint content
      const content = `
        Fezher Supreme Executive Report
        ==============================
        Generated: ${new Date().toLocaleString()}
        
        Financial Summary:
        Revenue: R ${dashboard?.revenue || 0}
        Expenses: R ${dashboard?.expenses || 0}
        Profit: R ${dashboard?.profit || 0}
        
        Business Metrics:
        Sales: ${dashboard?.totalSales || 0}
        Products: ${dashboard?.totalProducts || 0}
        Customers: ${dashboard?.totalCustomers || 0}
        Employees: ${dashboard?.totalEmployees || 0}
        Health Score: ${dashboard?.health?.overall || 0}%
      `;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `ExecutiveReport_${new Date().toISOString().split('T')[0]}.pptx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      if (showNotification) {
        showNotification('PowerPoint exported successfully!', 'success');
      }
    } catch (error) {
      console.error('PowerPoint export error:', error);
      if (showNotification) {
        showNotification('Failed to export PowerPoint', 'error');
      }
    }
  };

  // Handle Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          📄 Export Reports
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Export your executive dashboard data in various formats.
        </Typography>
      </Box>

      {/* Export Options */}
      <Grid container spacing={3}>
        {/* PDF */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <PdfIcon sx={{ fontSize: 48, color: '#d32f2f', mb: 1 }} />
              <Typography variant="h6">PDF Report</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Professional formatted report
              </Typography>
              <Button
                variant="contained"
                color="error"
                fullWidth
                startIcon={<DownloadIcon />}
                onClick={handleExportPDF}
              >
                Export PDF
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Excel */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <ExcelIcon sx={{ fontSize: 48, color: '#2e7d32', mb: 1 }} />
              <Typography variant="h6">Excel Report</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Data tables and charts
              </Typography>
              <Button
                variant="contained"
                color="success"
                fullWidth
                startIcon={<DownloadIcon />}
                onClick={handleExportExcel}
              >
                Export Excel
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* CSV */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <CsvIcon sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
              <Typography variant="h6">CSV Report</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Raw data for spreadsheets
              </Typography>
              <Button
                variant="contained"
                color="info"
                fullWidth
                startIcon={<DownloadIcon />}
                onClick={handleExportCSV}
              >
                Export CSV
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* PowerPoint */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <PowerPointIcon sx={{ fontSize: 48, color: '#ed6c02', mb: 1 }} />
              <Typography variant="h6">Presentation</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Management presentation slides
              </Typography>
              <Button
                variant="contained"
                color="warning"
                fullWidth
                startIcon={<DownloadIcon />}
                onClick={handleExportPowerPoint}
              >
                Export PPT
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Print */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <PrintIcon sx={{ fontSize: 48, color: '#424242', mb: 1 }} />
              <Typography variant="h6">Print Report</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Print dashboard overview
              </Typography>
              <Button
                variant="contained"
                color="inherit"
                fullWidth
                startIcon={<PrintIcon />}
                onClick={handlePrint}
              >
                Print
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Info Alert */}
      <Box sx={{ mt: 4 }}>
        <Alert severity="info" variant="outlined">
          <Typography variant="body2">
            <strong>Note:</strong> All exports include data for the selected period. 
            Use the period selector at the top to change the date range.
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
};

export default ReportsExport;