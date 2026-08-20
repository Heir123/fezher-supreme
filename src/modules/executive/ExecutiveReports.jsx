import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  IconButton,
  Tooltip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Slideshow as PowerPointIcon,
  Email as EmailIcon,
  GetApp as DownloadIcon,
  Description as ReportIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  Assessment as AssessmentIcon,
  Print as PrintIcon,
  CloudDownload as CloudDownloadIcon,
} from '@mui/icons-material';

const ExecutiveReports = ({ 
  dashboard, 
  reports = [], 
  onExport,
  onGeneratePowerPoint,
  onEmailReport,
  exportLoading 
}) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // Show notification helper
  const showNotification = (message, severity = 'info') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  // Handle PDF Report Generation
  const handleGeneratePDF = async () => {
    if (onExport) {
      await onExport('pdf');
    } else {
      showNotification('PDF export function not available', 'warning');
    }
  };

  // Handle Excel Report Generation
  const handleGenerateExcel = async () => {
    if (onExport) {
      await onExport('excel');
    } else {
      showNotification('Excel export function not available', 'warning');
    }
  };

  // Handle PowerPoint Report Generation
  const handleGeneratePowerPoint = async () => {
    if (onGeneratePowerPoint) {
      await onGeneratePowerPoint();
    } else {
      showNotification('PowerPoint generation function not available', 'warning');
    }
  };

  // Handle Email Report
  const handleEmailReport = () => {
    if (onEmailReport) {
      onEmailReport();
    } else {
      showNotification('Email function not available', 'warning');
    }
  };

  // Handle report item click
  const handleReportClick = (report) => {
    setSelectedReport(report);
  };

  // Get icon for report type
  const getReportIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'sales':
        return <MoneyIcon color="primary" />;
      case 'inventory':
        return <InventoryIcon color="warning" />;
      case 'customers':
        return <PeopleIcon color="success" />;
      case 'financial':
        return <AssessmentIcon color="info" />;
      default:
        return <ReportIcon />;
    }
  };

  // Get color for status chip
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'ready':
        return 'success';
      case 'generating':
        return 'warning';
      case 'pending':
        return 'info';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  // Report generation options
  const reportOptions = [
    {
      id: 'executive-pdf',
      title: 'Executive PDF Report',
      description: 'Generate a professional executive business report.',
      icon: <PdfIcon sx={{ fontSize: 40 }} color="error" />,
      action: 'Generate',
      onClick: handleGeneratePDF,
    },
    {
      id: 'excel-report',
      title: 'Excel Report',
      description: 'Export KPI and financial data to Excel.',
      icon: <ExcelIcon sx={{ fontSize: 40 }} color="success" />,
      action: 'Generate',
      onClick: handleGenerateExcel,
    },
    {
      id: 'powerpoint-report',
      title: 'PowerPoint Report',
      description: 'Generate presentation slides for management meetings.',
      icon: <PowerPointIcon sx={{ fontSize: 40 }} color="warning" />,
      action: 'Generate',
      onClick: handleGeneratePowerPoint,
    },
    {
      id: 'email-report',
      title: 'Email Report',
      description: 'Email the executive report to management.',
      icon: <EmailIcon sx={{ fontSize: 40 }} color="primary" />,
      action: 'Send',
      onClick: handleEmailReport,
    },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Executive Reports
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Generate and export comprehensive business reports for analysis and presentation.
      </Typography>

      {/* Report Generation Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {reportOptions.map((option) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={option.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>{option.icon}</Box>
                <Typography variant="h6" gutterBottom>
                  {option.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {option.description}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={option.onClick}
                  disabled={exportLoading}
                  startIcon={exportLoading ? <CircularProgress size={20} /> : <DownloadIcon />}
                >
                  {exportLoading ? 'Processing...' : option.action}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Available Reports List */}
      {reports && reports.length > 0 && (
        <Paper sx={{ mb: 3 }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">
              Available Reports
            </Typography>
          </Box>
          <List>
            {reports.map((report, index) => (
              <React.Fragment key={report.id || index}>
                <ListItem
                  component="div"
                  onClick={() => handleReportClick(report)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon>
                    {getReportIcon(report.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={report.title || `Report ${index + 1}`}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          {report.date || new Date().toLocaleDateString()}
                        </Typography>
                        {report.status && (
                          <Chip
                            label={report.status}
                            size="small"
                            color={getStatusColor(report.status)}
                            sx={{ height: 20 }}
                          />
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Download Report">
                      <IconButton edge="end" onClick={() => {}}>
                        <CloudDownloadIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Print Report">
                      <IconButton edge="end" onClick={() => {}}>
                        <PrintIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < reports.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {/* Quick Stats Cards */}
      {dashboard && (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={{ xs: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Revenue
                </Typography>
                <Typography variant="h5">
                  ${dashboard.revenue?.toLocaleString() || '0'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Sales
                </Typography>
                <Typography variant="h5">
                  {dashboard.totalSales || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Customers
                </Typography>
                <Typography variant="h5">
                  {dashboard.totalCustomers || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Health Score
                </Typography>
                <Typography variant="h5">
                  {dashboard.health?.overall || 0}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ExecutiveReports;