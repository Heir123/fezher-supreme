import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  Chip,
  IconButton,
  Tooltip,
  Snackbar,
  LinearProgress,
  Fade,
  Grow,
  Slide,
  FormControl,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Checkbox,
  TextField,
  InputLabel,
} from '@mui/material'
import {
  Refresh as RefreshIcon,
  Share as ShareIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  GetApp as GetAppIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';

// Import components
import ExecutiveCards from './ExecutiveCards';
import ExecutiveCharts from './ExecutiveCharts';
import ExecutiveInsights from './ExecutiveInsights';
import ExecutiveForecast from './ExecutiveForecast';
import ExecutiveReports from './ExecutiveReports';
import ExecutiveAIInsights from './ExecutiveAIInsights';
import { exportDashboardPDF } from "@/services/export/pdfExport";
import { exportDashboardExcel } from "@/services/export/excelExport";
import { exportDashboardPowerPoint } from "@/services/export/powerpointExport"
import { getExecutiveDashboard } from '@/services/executiveDashboardService';
import { sendEmailReport } from "@/services/emailReportService";
import { supabase } from "@/services/supabase";

// Constants
const REFRESH_INTERVALS = {
  OFF: 0,
  '30_SECONDS': 30000,
  '1_MINUTE': 60000,
  '5_MINUTES': 300000,
  '15_MINUTES': 900000,
  '30_MINUTES': 1800000,
  '1_HOUR': 3600000,
};

// Helper function to get date range based on period
const getDateRangeForPeriod = (period) => {
  const today = new Date();
  let start, end;

  switch (period) {
    case 'today':
      start = new Date(today);
      start.setHours(0, 0, 0, 0);
      end = new Date(today);
      end.setHours(23, 59, 59, 999);
      break;
      
    case 'week':
      start = startOfWeek(today, { weekStartsOn: 1 });
      start.setHours(0, 0, 0, 0);
      end = endOfWeek(today, { weekStartsOn: 1 });
      end.setHours(23, 59, 59, 999);
      break;
      
    case 'month':
      start = startOfMonth(today);
      start.setHours(0, 0, 0, 0);
      end = endOfMonth(today);
      end.setHours(23, 59, 59, 999);
      break;
      
    case 'quarter': {
      // Current calendar quarter
      const currentMonth = today.getMonth();
      const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
      
      start = new Date(today.getFullYear(), quarterStartMonth, 1);
      start.setHours(0, 0, 0, 0);
      
      end = new Date(today);
      end.setHours(23, 59, 59, 999);
      break;
    }
      
    case 'year':
      // Current calendar year
      start = new Date(today.getFullYear(), 0, 1);
      start.setHours(0, 0, 0, 0);
      
      end = new Date(today);
      end.setHours(23, 59, 59, 999);
      break;
      
    default:
      start = startOfMonth(today);
      start.setHours(0, 0, 0, 0);
      end = endOfMonth(today);
      end.setHours(23, 59, 59, 999);
  }

  return { start, end };
};

const ExecutiveDashboard = () => {
  // State management
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [refreshInterval, setRefreshInterval] = useState(REFRESH_INTERVALS['5_MINUTES']);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedDateRange, setSelectedDateRange] = useState(() => getDateRangeForPeriod('month'));
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info',
  });
  const [exportLoading, setExportLoading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Email dialog state
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    subject: 'Executive Report - Fezher Supreme',
    message: '',
    format: 'pdf',
  });
  
  // Settings state
  const [settings, setSettings] = useState({
    refreshInterval: REFRESH_INTERVALS['5_MINUTES'],
    autoRefresh: true,
    chartAnimations: true,
    compactView: false,
    darkMode: false,
    showAIInsights: true,
    showForecast: true,
    showReports: true,
    defaultPeriod: 'month',
    notificationsEnabled: true,
    emailNotifications: false,
    pushNotifications: true,
    exportFormat: 'pdf',
  });

  // Define visible tabs based on settings
  const visibleTabs = useMemo(() => {
    const tabs = [
      { key: 'overview', label: 'Overview' },
      { key: 'analytics', label: 'Analytics' },
      { key: 'insights', label: 'Insights' },
    ];
    
    if (settings.showForecast) {
      tabs.push({ key: 'forecast', label: 'Forecast' });
    }
    
    if (settings.showReports) {
      tabs.push({ key: 'reports', label: 'Reports' });
    }
    
    if (settings.showAIInsights) {
      tabs.push({ key: 'ai_insights', label: 'AI Insights' });
    }
    
    return tabs;
  }, [settings.showForecast, settings.showReports, settings.showAIInsights]);

  // Get the current tab key
  const activeTabKey = visibleTabs[activeTab]?.key;

  // Ensure activeTab is always valid when tabs change
  useEffect(() => {
    if (activeTab >= visibleTabs.length) {
      setActiveTab(Math.max(0, visibleTabs.length - 1));
    }
  }, [activeTab, visibleTabs.length]);

  // Load dashboard data
  const loadDashboard = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);

      console.log(`Loading dashboard for period: ${selectedPeriod}`, {
        start: selectedDateRange.start,
        end: selectedDateRange.end
      });

      const data = await getExecutiveDashboard({
        period: selectedPeriod,
        startDate: selectedDateRange.start,
        endDate: selectedDateRange.end,
      });

      setDashboard(data);
      setLastRefreshed(new Date());

      if (!showLoading) {
        showNotification('Dashboard refreshed successfully', 'success');
      }
    } catch (err) {
      console.error('Dashboard loading error:', err);
      setError(err.message || 'Failed to load executive dashboard');
      showNotification(
        err.message || 'Failed to load executive dashboard',
        'error'
      );
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedPeriod, selectedDateRange]);

  // Initial load
  useEffect(() => {
    loadDashboard(true);
  }, [loadDashboard]);

  // Auto-refresh setup
  useEffect(() => {
    if (!settings.autoRefresh || refreshInterval === REFRESH_INTERVALS.OFF) {
      return;
    }

    const timer = setInterval(() => {
      loadDashboard(false);
    }, refreshInterval);

    return () => clearInterval(timer);
  }, [settings.autoRefresh, refreshInterval, loadDashboard]);

  // Show notification helper
  const showNotification = (message, severity = 'info') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  // Handle manual refresh
  const handleRefresh = useCallback(() => {
    if (isRefreshing) return;
    loadDashboard(false);
  }, [loadDashboard, isRefreshing]);

  // Handle PowerPoint Report Generation
  const handleGeneratePowerPoint = useCallback(async () => {
    try {
      setExportLoading(true);
      showNotification('Generating PowerPoint presentation...', 'info');

      // Simulate PowerPoint generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showNotification('PowerPoint report generated successfully!', 'success');
    } catch (error) {
      console.error('PowerPoint generation error:', error);
      showNotification('Failed to generate PowerPoint report', 'error');
    } finally {
      setExportLoading(false);
    }
  }, []);

  // Handle Email Report
  const handleEmailReport = useCallback(async () => {
    try {
      // Validate recipient
      if (!emailData.to) {
        showNotification(
          'Please enter a recipient email address',
          'warning'
        );
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailData.to)) {
        showNotification(
          'Please enter a valid email address',
          'warning'
        );
        return;
      }

      // Check if dashboard data exists
      if (!dashboard) {
        showNotification(
          'Dashboard data is not available. Please refresh and try again.',
          'error'
        );
        return;
      }

      setExportLoading(true);
      showNotification(`Sending report to ${emailData.to}...`, 'info');

      console.log('========== SENDING EXECUTIVE REPORT ==========');
      console.log('To:', emailData.to);
      console.log('Subject:', emailData.subject);
      console.log('Format:', emailData.format);
      console.log("========== DASHBOARD BEING EMAILED ==========");
      console.log("REVENUE:", dashboard?.revenue);
      console.log("EXPENSES:", dashboard?.expenses);
      console.log("PROFIT:", dashboard?.profit);
      console.log("SALES:", dashboard?.totalSales);
      console.log("PRODUCTS:", dashboard?.totalProducts);
      console.log("CUSTOMERS:", dashboard?.totalCustomers);
      console.log("EMPLOYEES:", dashboard?.totalEmployees);
      console.log("HEALTH SCORE:", dashboard?.health?.overall);
      console.log("==============================================");

      // Prepare dashboard data with all values
      const dashboardData = {
        revenue: dashboard?.revenue || 0,
        expenses: dashboard?.expenses || 0,
        profit: dashboard?.profit || 0,
        totalSales: dashboard?.totalSales || 0,
        totalProducts: dashboard?.totalProducts || 0,
        totalCustomers: dashboard?.totalCustomers || 0,
        totalEmployees: dashboard?.totalEmployees || 0,
        health: {
          overall: dashboard?.health?.overall || 0,
          score: dashboard?.health?.overall || 0,
        },
        inventoryValue: dashboard?.inventoryValue || 0,
        lowStock: dashboard?.lowStock || 0,
        outOfStock: dashboard?.outOfStock || 0,
        inStock: dashboard?.inStock || 0,
        period: dashboard?.period || 'month',
        startDate: dashboard?.startDate || new Date().toISOString(),
        endDate: dashboard?.endDate || new Date().toISOString(),
        todaySales: dashboard?.todaySales || 0,
        activeEmployees: dashboard?.activeEmployees || 0,
        totalPurchases: dashboard?.totalPurchases || 0,
      };

      // Call the email service
      const result = await sendEmailReport({
        to: emailData.to,
        subject: emailData.subject,
        message: emailData.message,
        format: emailData.format,
        dashboard: dashboardData,
      });

      console.log('Email service result:', result);

      if (!result || !result.success) {
        throw new Error(result?.error || 'Email sending failed');
      }

      showNotification(
        `Report sent successfully to ${emailData.to}`,
        'success'
      );

      // Reset form
      setEmailDialogOpen(false);
      setEmailData({
        to: '',
        subject: 'Executive Report - Fezher Supreme',
        message: '',
        format: 'pdf',
      });

    } catch (error) {
      console.error('Email sending error:', error);
      showNotification(
        error?.message || 'Failed to send email report. Please try again.',
        'error'
      );
    } finally {
      setExportLoading(false);
    }
  }, [emailData, dashboard]);

  // Handle export (PDF and Excel)
  const handleExport = useCallback(async (format) => {
    try {
      setExportLoading(true);
      showNotification(`Exporting dashboard as ${format.toUpperCase()}...`, 'info');

      if (format === 'pdf') {
        await exportDashboardPDF();
        showNotification('Dashboard PDF exported successfully', 'success');
      } else if (format === 'excel') {
        await exportDashboardExcel(dashboard);
        showNotification('Dashboard Excel exported successfully', 'success');
      }
    } catch (err) {
      console.error('Export error:', err);
      showNotification(err.message || 'Failed to export dashboard', 'error');
    } finally {
      setExportLoading(false);
    }
  }, [dashboard]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle period change
  const handlePeriodChange = useCallback((period) => {
    console.log(`Changing period to: ${period}`);
    setSelectedPeriod(period);
    const range = getDateRangeForPeriod(period);
    setSelectedDateRange(range);
  }, []);

  // Handle share
  const handleShare = useCallback(() => {
    try {
      const url = window.location.href;
      
      if (navigator.share) {
        navigator.share({
          title: 'Executive Dashboard - Fezher Supreme',
          text: `Business Performance Dashboard - ${selectedPeriod.toUpperCase()} view`,
          url: url,
        }).then(() => {
          showNotification('Shared successfully', 'success');
        }).catch((err) => {
          if (err.name !== 'AbortError') {
            console.error('Share error:', err);
            fallbackShare(url);
          }
        });
      } else {
        fallbackShare(url);
      }
    } catch (err) {
      console.error('Share error:', err);
      showNotification('Failed to share dashboard', 'error');
    }
  }, [selectedPeriod]);

  // Fallback share method (copy to clipboard)
  const fallbackShare = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      showNotification('Dashboard link copied to clipboard', 'success');
    }).catch(() => {
      showNotification('Copy this URL to share: ' + url, 'info');
    });
  };

  // Handle help
  const handleHelp = useCallback(() => {
    showNotification(
      'Dashboard Help: View business metrics, analyze trends, and export reports. Period filters update all data.',
      'info'
    );
  }, []);

  // Handle settings save
  const handleSettingsSave = (newSettings) => {
    setSettings(newSettings);
    setRefreshInterval(newSettings.refreshInterval);
    
    if (newSettings.defaultPeriod !== selectedPeriod) {
      handlePeriodChange(newSettings.defaultPeriod);
    }
    
    showNotification('Settings saved successfully', 'success');
  };

  // Loading state
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
          Loading Executive Dashboard...
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          Fetching the latest business intelligence
        </Typography>
        <LinearProgress sx={{ width: '200px', mt: 2 }} />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          variant="filled"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => loadDashboard(true)}
              startIcon={<RefreshIcon />}
            >
              Retry
            </Button>
          }
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Unable to Load Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Please check your connection and try again.
          </Typography>
          <Button
            variant="contained"
            onClick={() => loadDashboard(true)}
            startIcon={<RefreshIcon />}
          >
            Refresh Dashboard
          </Button>
        </Paper>
      </Box>
    );
  }

  // No data state
  if (!dashboard) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="warning"
          action={
            <Button
              size="small"
              onClick={() => loadDashboard(true)}
              sx={{ ml: 2 }}
            >
              Load Data
            </Button>
          }
        >
          No dashboard data available
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            mb: 3,
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              Executive Dashboard
              <Chip
                label={selectedPeriod.toUpperCase()}
                size="small"
                color="primary"
                sx={{ ml: 1 }}
              />
              {dashboard?.unreadNotifications > 0 && (
                <Chip
                  label={`${dashboard.unreadNotifications} notifications`}
                  size="small"
                  color="error"
                  icon={<NotificationsIcon />}
                />
              )}
            </Typography>
            
            {lastRefreshed && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary" component="span">
                  Last updated: {format(lastRefreshed, "PPpp")}
                </Typography>
                <Chip
                  size="small"
                  label="Live"
                  color="success"
                  sx={{ height: 20 }}
                />
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {/* Period Selector */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {['today', 'week', 'month', 'quarter', 'year'].map((period) => (
                <Button
                  key={period}
                  size="small"
                  variant={selectedPeriod === period ? 'contained' : 'outlined'}
                  onClick={() => handlePeriodChange(period)}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {period}
                </Button>
              ))}
            </Box>

            <Tooltip title="Refresh Dashboard">
              <IconButton
                onClick={handleRefresh}
                disabled={isRefreshing}
                color="primary"
              >
                {isRefreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Export PDF">
              <IconButton
                onClick={() => handleExport("pdf")}
                disabled={exportLoading}
                color="primary"
              >
                {exportLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  <GetAppIcon />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title="Export Excel">
              <IconButton
                onClick={() => handleExport("excel")}
                disabled={exportLoading}
                color="success"
              >
                <GetAppIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Share Dashboard">
              <IconButton color="primary" onClick={handleShare}>
                <ShareIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Dashboard Settings">
              <IconButton
                color="primary"
                onClick={() => setSettingsOpen(true)}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Help">
              <IconButton color="primary" onClick={handleHelp}>
                <HelpIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Tabs Navigation - Using visibleTabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="dashboard sections"
          >
            {visibleTabs.map((tab) => (
              <Tab
                key={tab.key}
                label={tab.label}
              />
            ))}
          </Tabs>
        </Box>

        {/* Dashboard Content */}
        <Box id="dashboard" sx={{ position: 'relative' }}>
          {isRefreshing && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1,
              }}
            >
              <LinearProgress />
            </Box>
          )}

          <Fade in={!isRefreshing} timeout={300}>
            <Box>
              {/* Overview Section */}
              {activeTabKey === 'overview' && (
                <Grow in>
                  <Box>
                    <ExecutiveCards
                      dashboard={dashboard}
                      health={dashboard?.health}
                      onPeriodChange={handlePeriodChange}
                    />
                    <Box sx={{ mt: 3 }}>
                      <ExecutiveCharts
                        dashboard={dashboard}
                        period={selectedPeriod}
                      />
                    </Box>
                  </Box>
                </Grow>
              )}

              {/* Analytics Section */}
              {activeTabKey === 'analytics' && (
                <Slide in direction="left" mountOnEnter unmountOnExit>
                  <Box>
                    <ExecutiveCharts
                      dashboard={dashboard}
                      period={selectedPeriod}
                      detailed
                    />
                  </Box>
                </Slide>
              )}

              {/* Insights Section */}
              {activeTabKey === 'insights' && (
                <Slide in direction="left" mountOnEnter unmountOnExit>
                  <Box>
                    <ExecutiveInsights
                      dashboard={dashboard}
                      insights={dashboard.insights || []}
                    />
                  </Box>
                </Slide>
              )}

              {/* Forecast Section */}
              {activeTabKey === 'forecast' && settings.showForecast && (
                <Slide in direction="left" mountOnEnter unmountOnExit>
                  <Box>
                    <ExecutiveForecast
                      dashboard={dashboard}
                    />
                  </Box>
                </Slide>
              )}

              {/* Reports Section */}
              {activeTabKey === 'reports' && settings.showReports && (
                <Slide in direction="left" mountOnEnter unmountOnExit>
                  <Box>
                    <ExecutiveReports
                      dashboard={dashboard}
                      reports={dashboard.reports || []}
                      onExport={handleExport}
                      onGeneratePowerPoint={handleGeneratePowerPoint}
                      onEmailReport={() => setEmailDialogOpen(true)}
                      exportLoading={exportLoading}
                    />
                  </Box>
                </Slide>
              )}

              {/* AI Insights Section */}
              {activeTabKey === 'ai_insights' && settings.showAIInsights && (
                <Slide in direction="left" mountOnEnter unmountOnExit>
                  <Box>
                    <ExecutiveAIInsights
                      dashboard={dashboard}
                    />
                  </Box>
                </Slide>
              )}
            </Box>
          </Fade>
        </Box>

        {/* Email Report Dialog */}
        <Dialog
          open={emailDialogOpen}
          onClose={() => setEmailDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon color="primary" />
              <Typography variant="h6">Email Executive Report</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="To (Email Address)"
                value={emailData.to}
                onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                placeholder="management@company.com"
                sx={{ mb: 2 }}
                type="email"
                required
              />
              <TextField
                fullWidth
                label="Subject"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Report Format</InputLabel>
                <Select
                  value={emailData.format}
                  label="Report Format"
                  onChange={(e) => setEmailData({ ...emailData, format: e.target.value })}
                >
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="excel">Excel</MenuItem>
                  <MenuItem value="powerpoint">PowerPoint</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Message"
                value={emailData.message}
                onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                multiline
                rows={4}
                placeholder="Please find the executive report attached..."
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEmailDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleEmailReport}
              variant="contained"
              disabled={exportLoading}
              startIcon={exportLoading ? <CircularProgress size={20} /> : <EmailIcon />}
            >
              {exportLoading ? 'Sending...' : 'Send Report'}
            </Button>
          </DialogActions>
        </Dialog>

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

        {/* Settings Dialog */}
        <SettingsDialog
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          settings={settings}
          onSave={handleSettingsSave}
          refreshInterval={refreshInterval}
          onRefreshIntervalChange={setRefreshInterval}
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
          autoRefreshEnabled={settings.autoRefresh}
          onAutoRefreshToggle={() => setSettings({...settings, autoRefresh: !settings.autoRefresh})}
          chartAnimationsEnabled={settings.chartAnimations}
          onChartAnimationsToggle={() => setSettings({...settings, chartAnimations: !settings.chartAnimations})}
          compactView={settings.compactView}
          onCompactViewToggle={() => setSettings({...settings, compactView: !settings.compactView})}
          darkMode={settings.darkMode}
          onDarkModeToggle={() => setSettings({...settings, darkMode: !settings.darkMode})}
        />

        {/* Footer */}
        <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" align="center" display="block">
            © {new Date().getFullYear()} Fezher Supreme - Executive Dashboard
            {refreshInterval !== REFRESH_INTERVALS.OFF && (
              <>
                {' • '}
                Auto-refresh: {Object.keys(REFRESH_INTERVALS).find(
                  key => REFRESH_INTERVALS[key] === refreshInterval
                )?.replace('_', ' ').toLowerCase()}
              </>
            )}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

// Settings Dialog Component
const SettingsDialog = ({
  open,
  onClose,
  settings,
  onSave,
  refreshInterval,
  onRefreshIntervalChange,
  selectedPeriod,
  onPeriodChange,
  autoRefreshEnabled,
  onAutoRefreshToggle,
  chartAnimationsEnabled,
  onChartAnimationsToggle,
  compactView,
  onCompactViewToggle,
  darkMode,
  onDarkModeToggle,
}) => {
  const [activeSettingsTab, setActiveSettingsTab] = useState(0);
  const [tempSettings, setTempSettings] = useState(settings);

  useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  const handleSettingsChange = (key, value) => {
    setTempSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveSettings = () => {
    onSave(tempSettings);
    onClose();
  };

  const handleResetDefaults = () => {
    const defaults = {
      refreshInterval: REFRESH_INTERVALS['5_MINUTES'],
      autoRefresh: true,
      chartAnimations: true,
      compactView: false,
      darkMode: false,
      showAIInsights: true,
      showForecast: true,
      showReports: true,
      defaultPeriod: 'month',
      notificationsEnabled: true,
      emailNotifications: false,
      pushNotifications: true,
      exportFormat: 'pdf',
    };
    setTempSettings(defaults);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slots={{ transition: Slide }}
      slotProps={{
        transition: {
          direction: 'up',
        },
        paper: {
          sx: {
            minHeight: '60vh',
            maxHeight: '80vh',
          },
        },
      }}
    >
      <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsIcon color="primary" />
            <Typography variant="h6">Dashboard Settings</Typography>
          </Box>
          <Chip 
            label="v2.0" 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', height: '100%', minHeight: '400px' }}>
          {/* Settings Sidebar */}
          <Box
            sx={{
              width: 200,
              borderRight: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              flexShrink: 0,
            }}
          >
            <Tabs
              orientation="vertical"
              value={activeSettingsTab}
              onChange={(e, newValue) => setActiveSettingsTab(newValue)}
              sx={{ borderRight: 1, borderColor: 'divider' }}
            >
              <Tab label="General" />
              <Tab label="Display" />
              <Tab label="Notifications" />
              <Tab label="Data" />
              <Tab label="Export" />
            </Tabs>
          </Box>

          {/* Settings Content */}
          <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
            {activeSettingsTab === 0 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  General Settings
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Configure basic dashboard behavior and preferences.
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" fontWeight="medium" gutterBottom>
                    Default Time Period
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {['today', 'week', 'month', 'quarter', 'year'].map((period) => (
                      <Button
                        key={period}
                        size="small"
                        variant={tempSettings.defaultPeriod === period ? 'contained' : 'outlined'}
                        onClick={() => handleSettingsChange('defaultPeriod', period)}
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {period}
                      </Button>
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" fontWeight="medium" gutterBottom>
                    Auto-Refresh
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                      size="small"
                      variant={tempSettings.autoRefresh ? 'contained' : 'outlined'}
                      onClick={() => handleSettingsChange('autoRefresh', !tempSettings.autoRefresh)}
                      color={tempSettings.autoRefresh ? 'success' : 'primary'}
                    >
                      {tempSettings.autoRefresh ? 'Enabled' : 'Disabled'}
                    </Button>
                    {tempSettings.autoRefresh && (
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={tempSettings.refreshInterval || REFRESH_INTERVALS['5_MINUTES']}
                          onChange={(e) => handleSettingsChange('refreshInterval', Number(e.target.value))}
                        >
                          {Object.entries(REFRESH_INTERVALS).map(([key, value]) => (
                            <MenuItem key={key} value={value}>
                              {key.replace('_', ' ').toLowerCase()}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Box>
                </Box>
              </Box>
            )}

            {activeSettingsTab === 1 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Display Settings
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Customize the visual appearance of your dashboard.
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={tempSettings.chartAnimations}
                        onChange={(e) => handleSettingsChange('chartAnimations', e.target.checked)}
                      />
                    }
                    label="Enable Chart Animations"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={tempSettings.compactView}
                        onChange={(e) => handleSettingsChange('compactView', e.target.checked)}
                      />
                    }
                    label="Compact View Mode"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={tempSettings.darkMode}
                        onChange={(e) => handleSettingsChange('darkMode', e.target.checked)}
                      />
                    }
                    label="Dark Mode"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={tempSettings.showAIInsights}
                        onChange={(e) => handleSettingsChange('showAIInsights', e.target.checked)}
                      />
                    }
                    label="Show AI Insights Section"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={tempSettings.showForecast}
                        onChange={(e) => handleSettingsChange('showForecast', e.target.checked)}
                      />
                    }
                    label="Show Forecast Section"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={tempSettings.showReports}
                        onChange={(e) => handleSettingsChange('showReports', e.target.checked)}
                      />
                    }
                    label="Show Reports Section"
                  />
                </Box>
              </Box>
            )}

            {activeSettingsTab === 2 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Notification Settings
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Configure how you receive notifications from the dashboard.
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={tempSettings.notificationsEnabled}
                        onChange={(e) => handleSettingsChange('notificationsEnabled', e.target.checked)}
                      />
                    }
                    label="Enable Notifications"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={tempSettings.pushNotifications}
                        onChange={(e) => handleSettingsChange('pushNotifications', e.target.checked)}
                      />
                    }
                    label="Push Notifications"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={tempSettings.emailNotifications}
                        onChange={(e) => handleSettingsChange('emailNotifications', e.target.checked)}
                      />
                    }
                    label="Email Notifications"
                  />
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" fontWeight="medium" gutterBottom>
                    Notification Types
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2 }}>
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label="Data updates"
                    />
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label="System alerts"
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Performance warnings"
                    />
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label="Report generation"
                    />
                  </Box>
                </Box>
              </Box>
            )}

            {activeSettingsTab === 3 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Data Management
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Configure data sources, caching, and refresh settings.
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" fontWeight="medium" gutterBottom>
                    Data Refresh Rate
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={tempSettings.refreshInterval || REFRESH_INTERVALS['5_MINUTES']}
                      onChange={(e) => handleSettingsChange('refreshInterval', Number(e.target.value))}
                    >
                      {Object.entries(REFRESH_INTERVALS).map(([key, value]) => (
                        <MenuItem key={key} value={value}>
                          {key.replace('_', ' ').toLowerCase()}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Button variant="outlined" size="small" onClick={() => {}}>
                    <RefreshIcon sx={{ mr: 1 }} />
                    Refresh Data Now
                  </Button>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Button variant="outlined" size="small" color="warning">
                    <RefreshIcon sx={{ mr: 1 }} />
                    Clear Cache
                  </Button>
                </Box>

                <Alert severity="info" sx={{ mt: 2 }}>
                  Data is automatically refreshed every {tempSettings.refreshInterval / 60000} minutes.
                </Alert>
              </Box>
            )}

            {activeSettingsTab === 4 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Export Settings
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Configure default export preferences.
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" fontWeight="medium" gutterBottom>
                    Default Export Format
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={tempSettings.exportFormat || 'pdf'}
                      onChange={(e) => handleSettingsChange('exportFormat', e.target.value)}
                    >
                      <MenuItem value="pdf">PDF</MenuItem>
                      <MenuItem value="excel">Excel</MenuItem>
                      <MenuItem value="csv">CSV</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Include charts in export"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Include AI insights"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={<Switch />}
                    label="Include raw data tables"
                  />
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {}}
                    startIcon={<GetAppIcon />}
                  >
                    Test Export
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ borderTop: 1, borderColor: 'divider', p: 2 }}>
        <Button onClick={handleResetDefaults} color="warning" size="small">
          Reset to Defaults
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSaveSettings} variant="contained">
          Save Settings
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExecutiveDashboard;