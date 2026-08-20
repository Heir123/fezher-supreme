import { printDashboard } from "@/services/export/printService";

// Add print handler
const handlePrint = useCallback(() => {
  try {
    showNotification('Preparing print...', 'info');
    printDashboard();
  } catch (error) {
    console.error('Print error:', error);
    showNotification('Failed to print', 'error');
  }
}, []);

// Add the print button
<Tooltip title="Print Dashboard">
  <IconButton color="primary" onClick={handlePrint}>
    <PrintIcon />
  </IconButton>
</Tooltip>