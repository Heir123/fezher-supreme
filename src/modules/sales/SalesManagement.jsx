import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { getSales } from "@/services/salesService";
import SaleDialog from "./SaleDialog";
import { supabase } from "@/services/supabase";
import { 
  Printer, 
  Download, 
  Mail, 
  Edit, 
  Trash2, 
  Eye,
  FileSpreadsheet,
  FileText,
  Calendar,
  Users,
  Package,
  ChevronLeft,
  ChevronRight,
  Filter
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import QRCode from "qrcode";

export default function SalesManagement() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editSale, setEditSale] = useState(null);
  const [viewSale, setViewSale] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Filters
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");
  
  // Sorting
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");

  // Statistics
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    totalCustomers: 0,
    todayRevenue: 0,
    todaySales: 0
  });

  useEffect(() => {
    loadSales();
  }, []);

  useEffect(() => {
    if (sales.length > 0) {
      calculateStats();
    }
  }, [sales]);

  async function loadSales() {
    try {
      setLoading(true);
      const data = await getSales();
      setSales(data || []);
    } catch (error) {
      console.error("Failed to load sales:", error);
    } finally {
      setLoading(false);
    }
  }

  function calculateStats() {
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
    const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
    const uniqueCustomers = new Set(sales.map(s => s.customer_id)).size;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySales = sales.filter(s => new Date(s.created_at) >= today);
    const todayRevenue = todaySales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);

    setStats({
      totalSales,
      totalRevenue,
      averageOrderValue,
      totalCustomers: uniqueCustomers,
      todayRevenue,
      todaySales: todaySales.length
    });
  }

  const filteredAndSortedSales = useMemo(() => {
    let filtered = [...sales];

    // Search filter
    if (search) {
      filtered = filtered.filter(sale =>
        (sale.invoice_number || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (sale.customers?.name || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(sale => sale.status === statusFilter);
    }

    // Date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filterDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(sale => {
        const saleDate = new Date(sale.created_at);
        saleDate.setHours(0, 0, 0, 0);
        return saleDate.getTime() === filterDate.getTime();
      });
    }

    // Customer filter
    if (customerFilter) {
      filtered = filtered.filter(sale =>
        (sale.customers?.name || "")
          .toLowerCase()
          .includes(customerFilter.toLowerCase())
      );
    }

    // Product filter
    if (productFilter) {
      // This would need to filter by product name - requires joining with sale_items
      // For now, we'll just filter by invoice number as a placeholder
      filtered = filtered.filter(sale =>
        (sale.invoice_number || "")
          .toLowerCase()
          .includes(productFilter.toLowerCase())
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortField === "customers") {
        aVal = a.customers?.name || "";
        bVal = b.customers?.name || "";
      }
      
      if (sortField === "total_amount") {
        aVal = Number(aVal || 0);
        bVal = Number(bVal || 0);
      }
      
      if (sortField === "created_at") {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [sales, search, statusFilter, dateFilter, customerFilter, productFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedSales.length / itemsPerPage);
  const paginatedSales = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredAndSortedSales.slice(start, end);
  }, [filteredAndSortedSales, currentPage, itemsPerPage]);

  const getStatusColor = (status) => {
    const colors = {
      "Paid": "bg-green-100 text-green-800",
      "Pending": "bg-yellow-100 text-yellow-800",
      "Cancelled": "bg-red-100 text-red-800",
      "Refunded": "bg-purple-100 text-purple-800",
      "Partially Paid": "bg-blue-100 text-blue-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  async function printInvoice(sale) {
    const { data: items } = await supabase
      .from("sale_items")
      .select(`
        *,
        products (
          name
        )
      `)
      .eq("sale_id", sale.id);

    const printWindow = window.open("", "_blank");
    
    // Generate QR Code
    const qrData = JSON.stringify({
      invoice: sale.invoice_number,
      amount: sale.total_amount,
      customer: sale.customers?.name || "Walk-in Customer",
      date: sale.created_at
    });
    const qrCodeDataUrl = await QRCode.toDataURL(qrData);

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${sale.invoice_number}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            
            body {
              font-family: 'Inter', Arial, sans-serif;
              padding: 30px;
              max-width: 900px;
              margin: auto;
              color: #1e293b;
              background: #f8fafc;
            }
            
            .invoice-container {
              background: white;
              border-radius: 16px;
              padding: 40px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              border: 1px solid #e2e8f0;
            }
            
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #e2e8f0;
            }
            
            .company-section {
              display: flex;
              align-items: center;
              gap: 20px;
            }
            
            .company-logo {
              width: 80px;
              height: 80px;
              background: #1e3a8a;
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 32px;
              font-weight: bold;
            }
            
            .company-name {
              font-size: 28px;
              font-weight: 700;
              color: #1e3a8a;
              margin-bottom: 4px;
            }
            
            .company-details {
              color: #64748b;
              font-size: 13px;
              line-height: 1.6;
            }
            
            .invoice-title-section {
              text-align: right;
            }
            
            .invoice-title {
              font-size: 24px;
              font-weight: 700;
              color: #1e3a8a;
              margin-bottom: 8px;
            }
            
            .invoice-number {
              color: #64748b;
              font-size: 14px;
            }
            
            .invoice-info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin: 25px 0;
              padding: 20px;
              background: #f8fafc;
              border-radius: 12px;
            }
            
            .info-item {
              display: flex;
              flex-direction: column;
            }
            
            .info-label {
              font-size: 12px;
              font-weight: 600;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
            }
            
            .info-value {
              font-size: 15px;
              font-weight: 500;
              color: #1e293b;
            }
            
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 9999px;
              font-size: 12px;
              font-weight: 600;
              background: #dcfce7;
              color: #166534;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              border-radius: 12px;
              overflow: hidden;
            }
            
            th {
              background: #f1f5f9;
              padding: 14px 16px;
              text-align: left;
              font-size: 13px;
              font-weight: 600;
              color: #475569;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            td {
              padding: 14px 16px;
              border-bottom: 1px solid #e2e8f0;
              font-size: 14px;
            }
            
            .totals-section {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 2px solid #e2e8f0;
              display: flex;
              justify-content: flex-end;
            }
            
            .totals-table {
              width: 350px;
            }
            
            .totals-table td {
              padding: 8px 0;
              border: none;
            }
            
            .total-row {
              font-size: 20px;
              font-weight: 700;
              color: #1e3a8a;
            }
            
            .signature-section {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e2e8f0;
              display: flex;
              justify-content: space-between;
            }
            
            .signature-box {
              width: 200px;
            }
            
            .signature-line {
              border-bottom: 1px solid #94a3b8;
              margin-top: 30px;
              margin-bottom: 6px;
            }
            
            .signature-label {
              font-size: 12px;
              color: #94a3b8;
            }
            
            .qr-section {
              display: flex;
              justify-content: center;
              margin: 30px 0 20px;
            }
            
            .qr-code {
              width: 120px;
              height: 120px;
            }
            
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              text-align: center;
              color: #94a3b8;
              font-size: 12px;
            }
            
            .thank-you {
              text-align: center;
              margin: 30px 0 10px;
              font-size: 18px;
              color: #1e293b;
              font-weight: 600;
            }
            
            .payment-terms {
              margin-top: 20px;
              padding: 16px;
              background: #f8fafc;
              border-radius: 8px;
              font-size: 13px;
              color: #475569;
            }
            
            @media print {
              body { background: white; padding: 0; }
              .invoice-container { box-shadow: none; border: none; padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <!-- Header -->
            <div class="header">
              <div class="company-section">
                <div class="company-logo">FS</div>
                <div>
                  <div class="company-name">Fezher Supreme</div>
                  <div class="company-details">
                    Johannesburg, South Africa<br>
                    +27 78 482 2311<br>
                    info@fezhersupreme.com<br>
                    www.fezhersupreme.com
                  </div>
                </div>
              </div>
              <div class="invoice-title-section">
                <div class="invoice-title">SALES INVOICE</div>
                <div class="invoice-number">#${sale.invoice_number}</div>
              </div>
            </div>

            <!-- Invoice Info -->
            <div class="invoice-info-grid">
              <div class="info-item">
                <span class="info-label">Customer</span>
                <span class="info-value">${sale.customers?.name || "Walk-in Customer"}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Date</span>
                <span class="info-value">${new Date(sale.created_at).toLocaleDateString('en-ZA', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Status</span>
                <span class="status-badge">${sale.status || "Paid"}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Payment Method</span>
                <span class="info-value">Cash</span>
              </div>
            </div>

            <!-- Items Table -->
            <table>
              <thead>
                <tr>
                  <th style="width: 40%;">Product</th>
                  <th style="text-align:center; width: 15%;">Qty</th>
                  <th style="text-align:right; width: 22%;">Unit Price</th>
                  <th style="text-align:right; width: 23%;">Line Total</th>
                </tr>
              </thead>
              <tbody>
                ${items
                  .map(
                    (item) => `
                      <tr>
                        <td>${item.products?.name ?? item.product_name ?? "Unknown Product"}</td>
                        <td style="text-align:center;">${item.quantity}</td>
                        <td style="text-align:right;">R ${Number(item.unit_price).toFixed(2)}</td>
                        <td style="text-align:right; font-weight: 500;">R ${Number(item.total_price).toFixed(2)}</td>
                      </tr>
                    `
                  )
                  .join("")}
              </tbody>
            </table>

            <!-- Totals -->
            <div class="totals-section">
              <table class="totals-table">
                <tr>
                  <td><strong>Subtotal</strong></td>
                  <td style="text-align:right;">R ${Number(sale.total_amount / 1.15).toFixed(2)}</td>
                </tr>
                <tr>
                  <td><strong>VAT (15%)</strong></td>
                  <td style="text-align:right;">R ${(Number(sale.total_amount) - Number(sale.total_amount / 1.15)).toFixed(2)}</td>
                </tr>
                <tr class="total-row">
                  <td><strong>Total</strong></td>
                  <td style="text-align:right;">R ${Number(sale.total_amount).toFixed(2)}</td>
                </tr>
              </table>
            </div>

            <!-- Payment Terms -->
            <div class="payment-terms">
              <strong>Payment Terms:</strong> Payment due upon receipt. E&OE.
            </div>

            <!-- QR Code -->
            <div class="qr-section">
              <img src="${qrCodeDataUrl}" alt="QR Code" class="qr-code" />
            </div>

            <!-- Thank You -->
            <div class="thank-you">
              Thank you for your business!
            </div>

            <!-- Signature Section -->
            <div class="signature-section">
              <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">Customer Signature</div>
              </div>
              <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">Authorized Signature</div>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p>Fezher Supreme ERP | VAT Registration: 0123456789</p>
              <p>Powered by Fezher Supreme ERP System</p>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  }

  async function downloadPDF(sale) {
    const { data: items } = await supabase
      .from("sale_items")
      .select(`
        *,
        products (
          name
        )
      `)
      .eq("sale_id", sale.id);

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(30, 58, 138);
    doc.text("Fezher Supreme", pageWidth / 2, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Johannesburg, South Africa", pageWidth / 2, 28, { align: "center" });
    doc.text("+27 78 482 2311 | info@fezhersupreme.com", pageWidth / 2, 33, { align: "center" });
    
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 40, pageWidth - 20, 40);

    // Invoice Title
    doc.setFontSize(18);
    doc.setTextColor(30, 58, 138);
    doc.text("SALES INVOICE", pageWidth / 2, 52, { align: "center" });

    // Invoice Info
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text(`Invoice: ${sale.invoice_number}`, 20, 65);
    doc.text(`Customer: ${sale.customers?.name || "Walk-in Customer"}`, 20, 72);
    doc.text(`Date: ${new Date(sale.created_at).toLocaleDateString()}`, 20, 79);
    doc.text(`Status: ${sale.status || "Paid"}`, 120, 65);
    doc.text(`Payment Method: Cash`, 120, 72);

    // Items Table
    const tableData = items.map(item => [
      item.products?.name ?? item.product_name ?? "Unknown Product",
      item.quantity,
      `R ${Number(item.unit_price).toFixed(2)}`,
      `R ${Number(item.total_price).toFixed(2)}`
    ]);

    doc.autoTable({
      startY: 90,
      head: [["Product", "Qty", "Unit Price", "Line Total"]],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [241, 245, 249],
        textColor: [71, 85, 105],
        fontSize: 10,
        fontStyle: "bold"
      },
      bodyStyles: {
        fontSize: 10
      },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: 20, halign: "center" },
        2: { cellWidth: 35, halign: "right" },
        3: { cellWidth: 35, halign: "right" }
      }
    });

    // Totals
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.text(`Subtotal: R ${Number(sale.total_amount / 1.15).toFixed(2)}`, 150, finalY);
    doc.text(`VAT (15%): R ${(Number(sale.total_amount) - Number(sale.total_amount / 1.15)).toFixed(2)}`, 150, finalY + 7);
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(`Total: R ${Number(sale.total_amount).toFixed(2)}`, 150, finalY + 17);
    doc.setFont(undefined, "normal");

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text("Thank you for your business!", pageWidth / 2, pageHeight - 20, { align: "center" });
    doc.text("Powered by Fezher Supreme ERP", pageWidth / 2, pageHeight - 12, { align: "center" });

    doc.save(`Invoice_${sale.invoice_number}.pdf`);
  }

  async function exportToExcel() {
    const exportData = filteredAndSortedSales.map(sale => ({
      "Invoice Number": sale.invoice_number,
      "Customer": sale.customers?.name || "Walk-in Customer",
      "Total Amount": sale.total_amount || 0,
      "Status": sale.status || "Paid",
      "Date": new Date(sale.created_at).toLocaleDateString(),
      "Payment Method": "Cash"
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, ws, "Sales");
    XLSX.writeFile(wb, `Sales_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  async function exportToPDF() {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(24);
    doc.setTextColor(30, 58, 138);
    doc.text("Sales Report", pageWidth / 2, 20, { align: "center" });
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 30, { align: "center" });

    // Summary
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text(`Total Sales: ${stats.totalSales}`, 20, 45);
    doc.text(`Total Revenue: R ${stats.totalRevenue.toFixed(2)}`, 20, 53);
    doc.text(`Average Order Value: R ${stats.averageOrderValue.toFixed(2)}`, 20, 61);
    doc.text(`Total Customers: ${stats.totalCustomers}`, 120, 45);
    doc.text(`Today's Revenue: R ${stats.todayRevenue.toFixed(2)}`, 120, 53);
    doc.text(`Today's Sales: ${stats.todaySales}`, 120, 61);

    // Table
    const tableData = filteredAndSortedSales.map(sale => [
      sale.invoice_number,
      sale.customers?.name || "Walk-in Customer",
      `R ${Number(sale.total_amount || 0).toFixed(2)}`,
      sale.status || "Paid",
      new Date(sale.created_at).toLocaleDateString()
    ]);

    doc.autoTable({
      startY: 75,
      head: [["Invoice", "Customer", "Amount", "Status", "Date"]],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [241, 245, 249],
        textColor: [71, 85, 105],
        fontSize: 9,
        fontStyle: "bold"
      },
      bodyStyles: {
        fontSize: 8
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 50 },
        2: { cellWidth: 30, halign: "right" },
        3: { cellWidth: 25, halign: "center" },
        4: { cellWidth: 30, halign: "center" }
      }
    });

    // Footer
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text("Generated by Fezher Supreme ERP", pageWidth / 2, finalY + 10, { align: "center" });

    doc.save(`Sales_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  async function emailInvoice(sale) {
    const subject = `Invoice ${sale.invoice_number} from Fezher Supreme`;
    const body = `Dear ${sale.customers?.name || "Customer"},

Please find attached your invoice ${sale.invoice_number} for the amount of R ${Number(sale.total_amount).toFixed(2)}.

Thank you for your business!

Regards,
Fezher Supreme ERP
+27 78 482 2311`;

    window.location.href = `mailto:${sale.customers?.email || ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  async function deleteSale(id) {
    try {
      const { error } = await supabase
        .from("sales")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setShowDeleteDialog(false);
      setSaleToDelete(null);
      await loadSales();
    } catch (error) {
      console.error("Failed to delete sale:", error);
    }
  }

  function handleSort(field) {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setDateFilter("");
    setCustomerFilter("");
    setProductFilter("");
    setCurrentPage(1);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Sales Management</h1>
            <p className="text-gray-500">Manage sales and invoices</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + New Sale
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Sales</p>
                <p className="text-2xl font-bold">{stats.totalSales}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">R {stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FileSpreadsheet className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Average Order</p>
                <p className="text-2xl font-bold">R {stats.averageOrderValue.toFixed(2)}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Today's Revenue</p>
                <p className="text-2xl font-bold">R {stats.todayRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-wrap gap-3 items-center">
            <input
              className="flex-1 min-w-[200px] border rounded-lg p-2"
              placeholder="Search invoice or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <input
              type="date"
              className="border rounded-lg p-2"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            <select
              className="border rounded-lg p-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Refunded">Refunded</option>
              <option value="Partially Paid">Partially Paid</option>
            </select>
            <input
              className="border rounded-lg p-2 min-w-[150px]"
              placeholder="Customer..."
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
            />
            <input
              className="border rounded-lg p-2 min-w-[150px]"
              placeholder="Product..."
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
            />
            <button
              onClick={clearFilters}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear
            </button>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={exportToExcel}
                className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                title="Export to Excel"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Excel
              </button>
              <button
                onClick={exportToPDF}
                className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1"
                title="Export to PDF"
              >
                <FileText className="h-4 w-4" />
                PDF
              </button>
            </div>
          </div>
        </div>

        {/* Sales Table */}
        {loading ? (
          <div className="text-center py-10">Loading sales...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th 
                      className="p-3 text-left cursor-pointer hover:bg-slate-200 transition-colors"
                      onClick={() => handleSort("invoice_number")}
                    >
                      Invoice {sortField === "invoice_number" && (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th 
                      className="p-3 text-left cursor-pointer hover:bg-slate-200 transition-colors"
                      onClick={() => handleSort("customers")}
                    >
                      Customer {sortField === "customers" && (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th 
                      className="p-3 text-right cursor-pointer hover:bg-slate-200 transition-colors"
                      onClick={() => handleSort("total_amount")}
                    >
                      Amount {sortField === "total_amount" && (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="p-3 text-center">Status</th>
                    <th 
                      className="p-3 text-center cursor-pointer hover:bg-slate-200 transition-colors"
                      onClick={() => handleSort("created_at")}
                    >
                      Date {sortField === "created_at" && (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSales.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-gray-500">
                        No sales found.
                      </td>
                    </tr>
                  ) : (
                    paginatedSales.map((sale) => (
                      <tr key={sale.id} className="border-t hover:bg-gray-50 transition-colors">
                        <td className="p-3 font-medium">{sale.invoice_number}</td>
                        <td className="p-3">{sale.customers?.name || "-"}</td>
                        <td className="p-3 text-right font-semibold">
                          R {Number(sale.total_amount || 0).toFixed(2)}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}>
                            {sale.status || "Paid"}
                          </span>
                        </td>
                        <td className="p-3 text-center text-sm">
                          {new Date(sale.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1 flex-wrap">
                            <button
                              onClick={() => setViewSale(sale)}
                              className="bg-blue-100 text-blue-600 p-1.5 rounded hover:bg-blue-200 transition-colors"
                              title="View Invoice"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditSale(sale)}
                              className="bg-yellow-100 text-yellow-600 p-1.5 rounded hover:bg-yellow-200 transition-colors"
                              title="Edit Sale"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => printInvoice(sale)}
                              className="bg-green-100 text-green-600 p-1.5 rounded hover:bg-green-200 transition-colors"
                              title="Print Invoice"
                            >
                              <Printer className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => downloadPDF(sale)}
                              className="bg-purple-100 text-purple-600 p-1.5 rounded hover:bg-purple-200 transition-colors"
                              title="Download PDF"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => emailInvoice(sale)}
                              className="bg-indigo-100 text-indigo-600 p-1.5 rounded hover:bg-indigo-200 transition-colors"
                              title="Email Invoice"
                            >
                              <Mail className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSaleToDelete(sale);
                                setShowDeleteDialog(true);
                              }}
                              className="bg-red-100 text-red-600 p-1.5 rounded hover:bg-red-200 transition-colors"
                              title="Delete Sale"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredAndSortedSales.length > 0 && (
              <div className="flex items-center justify-between p-4 border-t">
                <div className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedSales.length)} of {filteredAndSortedSales.length} sales
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="px-3 py-2 border rounded bg-blue-50 text-blue-600">
                    {currentPage} / {totalPages || 1}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sale Dialog */}
        <SaleDialog
          open={open}
          onClose={() => {
            setOpen(false);
            loadSales();
          }}
          editData={null}
        />

        {/* Edit Sale Dialog */}
        {editSale && (
          <SaleDialog
            open={!!editSale}
            editData={editSale}
            onClose={() => {
              setEditSale(null);
              loadSales();
            }}
          />
        )}

        {/* View Invoice Dialog */}
        {viewSale && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Invoice Details</h2>
                <button
                  onClick={() => setViewSale(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                {/* Invoice preview - you can reuse the printInvoice HTML here */}
                <div className="prose max-w-none">
                  <h3>Invoice #{viewSale.invoice_number}</h3>
                  <p><strong>Customer:</strong> {viewSale.customers?.name || "Walk-in Customer"}</p>
                  <p><strong>Date:</strong> {new Date(viewSale.created_at).toLocaleString()}</p>
                  <p><strong>Status:</strong> {viewSale.status}</p>
                  <p><strong>Total:</strong> R {Number(viewSale.total_amount).toFixed(2)}</p>
                </div>
                <button
                  onClick={() => {
                    printInvoice(viewSale);
                    setViewSale(null);
                  }}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Print Invoice
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete invoice #{saleToDelete?.invoice_number}? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteDialog(false);
                    setSaleToDelete(null);
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteSale(saleToDelete?.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}