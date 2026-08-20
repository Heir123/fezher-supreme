import { useState } from "react";
import { 
  Eye, Pencil, Trash2, 
  Package, Mail, Printer, 
  FileDown, FileSpreadsheet, 
  CreditCard, XCircle, 
  ChevronDown, ChevronRight,
  Building, Star, MapPin,
  CheckCircle, AlertCircle,
  Clock, TrendingUp, ShoppingBag,
  DollarSign, FileCheck, Truck
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-800", icon: "🟡", label: "Pending" },
    approved: { color: "bg-blue-100 text-blue-800", icon: "🔵", label: "Approved" },
    received: { color: "bg-green-100 text-green-800", icon: "🟢", label: "Received" },
    cancelled: { color: "bg-red-100 text-red-800", icon: "🔴", label: "Cancelled" },
    partially_received: { color: "bg-purple-100 text-purple-800", icon: "🟣", label: "Partially Received" },
    waiting_approval: { color: "bg-orange-100 text-orange-800", icon: "🟠", label: "Waiting Approval" },
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
      {config.icon} {config.label}
    </span>
  );
};

// Payment status badge
const PaymentStatusBadge = ({ status }) => {
  const statusConfig = {
    paid: { color: "bg-green-100 text-green-800", icon: "🟢", label: "Paid" },
    partial: { color: "bg-orange-100 text-orange-800", icon: "🟠", label: "Partial Payment" },
    unpaid: { color: "bg-red-100 text-red-800", icon: "🔴", label: "Unpaid" },
    refunded: { color: "bg-blue-100 text-blue-800", icon: "🔵", label: "Refunded" },
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.unpaid;
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
      {config.icon} {config.label}
    </span>
  );
};

// Progress bar component
const ProgressBar = ({ received, total }) => {
  const percentage = total > 0 ? Math.round((received / total) * 100) : 0;
  const filledWidth = Math.min(percentage, 100);

  return (
    <div className="flex items-center gap-2">
      <div className="w-24 bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${filledWidth}%` }}
        />
      </div>
      <span className="text-xs font-medium text-gray-600">{percentage}%</span>
    </div>
  );
};

// Supplier info component
const SupplierInfo = ({ supplier }) => {
  if (!supplier) return <span className="text-gray-400">-</span>;
  
  const initials = supplier.name
    ?.split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'SP';

  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
        {initials}
      </div>
      <div>
        <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <MapPin size={12} />
          <span>{supplier.city || 'Johannesburg'}</span>
          <div className="flex items-center text-yellow-500">
            <Star size={12} fill="currentColor" />
            <span className="ml-0.5">{(supplier.rating || 4.2).toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Action buttons component
const ActionButtons = ({ 
  order, 
  onView, 
  onEdit, 
  onDelete, 
  onReceive, 
  onEmail, 
  onPrint, 
  onDownloadPDF,
  onConvertGRN,
  onRecordPayment,
  onCancel 
}) => {
  const [showActions, setShowActions] = useState(false);

  const mainActions = [
    { icon: Eye, label: "View", onClick: () => onView?.(order), color: "text-blue-600 hover:bg-blue-50" },
    { icon: Pencil, label: "Edit", onClick: () => onEdit?.(order), color: "text-amber-600 hover:bg-amber-50" },
    { icon: Package, label: "Receive Stock", onClick: () => onReceive?.(order), color: "text-green-600 hover:bg-green-50" },
  ];

  const moreActions = [
    { icon: Mail, label: "Email PO", onClick: () => onEmail?.(order) },
    { icon: Printer, label: "Print PO", onClick: () => onPrint?.(order) },
    { icon: FileDown, label: "Download PDF", onClick: () => onDownloadPDF?.(order) },
    { icon: FileSpreadsheet, label: "Convert to GRN", onClick: () => onConvertGRN?.(order) },
    { icon: CreditCard, label: "Record Payment", onClick: () => onRecordPayment?.(order) },
    { icon: XCircle, label: "Cancel Order", onClick: () => onCancel?.(order), color: "text-red-600 hover:bg-red-50" },
  ];

  return (
    <div className="flex items-center justify-center gap-1">
      {mainActions.map((action, idx) => (
        <button
          key={idx}
          onClick={action.onClick}
          className={`p-1.5 rounded-lg transition-colors ${action.color || 'text-gray-600 hover:bg-gray-50'}`}
          title={action.label}
        >
          <action.icon size={16} />
        </button>
      ))}
      
      <div className="relative">
        <button
          onClick={() => setShowActions(!showActions)}
          className="p-1.5 rounded-lg transition-colors text-gray-600 hover:bg-gray-50"
          title="More actions"
        >
          <ChevronDown size={16} />
        </button>
        
        {showActions && (
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
            {moreActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  action.onClick();
                  setShowActions(false);
                }}
                className={`w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors ${action.color || 'text-gray-700'}`}
              >
                <action.icon size={14} />
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Expandable row component
const ExpandableRow = ({ order, children, isExpanded, onToggle }) => {
  return (
    <>
      <tr 
        className="hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={onToggle}
      >
        {children}
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan="100%" className="px-4 py-3 bg-gray-50">
            <div className="grid grid-cols-4 gap-4">
              {order.items?.map((item, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="font-medium text-sm">{item.product_name}</div>
                  <div className="text-xs text-gray-500 space-y-1 mt-1">
                    <div>Qty Ordered: {item.quantity}</div>
                    <div>Qty Received: {item.received_quantity || 0}</div>
                    <div>Remaining: {item.quantity - (item.received_quantity || 0)}</div>
                    <div>Unit Cost: R {Number(item.unit_cost || 0).toFixed(2)}</div>
                    <div>Warehouse: {item.warehouse || 'Main Warehouse'}</div>
                  </div>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

// KPI Cards component
const KPICards = ({ data }) => {
  const cards = [
    { 
      label: "Total Purchase Orders", 
      value: data.totalOrders || 0,
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      label: "Pending Orders", 
      value: data.pendingOrders || 0,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    { 
      label: "Waiting Approval", 
      value: data.waitingApproval || 0,
      icon: FileCheck,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    { 
      label: "Goods Received Today", 
      value: data.goodsReceivedToday || 0,
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    { 
      label: "Outstanding Payments", 
      value: data.outstandingPayments || 0,
      icon: CreditCard,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    { 
      label: "Purchases This Month", 
      value: data.purchasesThisMonth || 0,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    { 
      label: "Total Procurement Cost", 
      value: `R ${Number(data.totalProcurementCost || 0).toFixed(2)}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    { 
      label: "Average Purchase Value", 
      value: `R ${Number(data.averagePurchaseValue || 0).toFixed(2)}`,
      icon: FileSpreadsheet,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">{card.label}</p>
              <p className="text-xl font-semibold text-gray-900 mt-1">{card.value}</p>
            </div>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Search and Filters component
const SearchFilters = ({ onSearch, onFilter, filters }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filterOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'received', label: 'Received' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'paid', label: 'Paid' },
    { value: 'unpaid', label: 'Unpaid' },
  ];

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleFilterChange = (value) => {
    setSelectedFilter(value);
    onFilter?.(value);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by PO Number, Supplier, Product, or Invoice..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleFilterChange(filter.value)}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                selectedFilter === filter.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main PurchaseTable component
export default function PurchaseTable({
  orders = [],
  kpiData = {},
  onEdit,
  onDelete,
  onView,
  onReceive,
  onEmail,
  onPrint,
  onDownloadPDF,
  onConvertGRN,
  onRecordPayment,
  onCancel,
  onSearch,
  onFilter,
  filters,
}) {
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState({});

  const handleView = (order) => {
    if (onView) {
      onView(order);
    } else {
      navigate(`/purchases/${order.id}`);
    }
  };

  const toggleRow = (orderId) => {
    setExpandedRows(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `R ${Number(amount || 0).toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      {Object.keys(kpiData).length > 0 && <KPICards data={kpiData} />}

      {/* Search and Filters */}
      <SearchFilters onSearch={onSearch} onFilter={onFilter} filters={filters} />

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1">
                  {/* Expand column */}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PO Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ordered By
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expected Delivery
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Received
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="12" className="px-4 py-8 text-center text-gray-500">
                    No purchase orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const isExpanded = expandedRows[order.id] || false;
                  const totalItems = order.items?.length || 0;
                  const receivedItems = order.items?.filter(item => item.received_quantity > 0).length || 0;
                  const totalQuantity = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                  const receivedQuantity = order.items?.reduce((sum, item) => sum + (item.received_quantity || 0), 0) || 0;
                  const isOverdue = order.expected_delivery_date && new Date(order.expected_delivery_date) < new Date() && order.status !== 'received' && order.status !== 'cancelled';
                  const isHighValue = Number(order.total) > 10000;

                  let rowClassName = "hover:bg-gray-50 transition-colors";
                  if (isOverdue) rowClassName += " bg-red-50";
                  if (isHighValue) rowClassName += " border-l-4 border-l-yellow-500";
                  if (order.payment_status === 'unpaid') rowClassName += " border-l-4 border-l-red-500";
                  if (order.status === 'cancelled') rowClassName += " opacity-60";

                  return (
                    <ExpandableRow
                      key={order.id}
                      order={order}
                      isExpanded={isExpanded}
                      onToggle={() => toggleRow(order.id)}
                    >
                      <td className="px-4 py-3">
                        <button onClick={() => toggleRow(order.id)}>
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                        {order.order_number || `PO-${order.id}`}
                      </td>
                      <td className="px-4 py-3">
                        <SupplierInfo supplier={order.suppliers || order.supplier} />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {totalItems} items
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {order.ordered_by?.name || order.created_by?.name || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {formatDate(order.order_date || order.created_at)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {formatDate(order.expected_delivery_date)}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">{receivedQuantity} / {totalQuantity}</span>
                          </div>
                          <ProgressBar received={receivedQuantity} total={totalQuantity} />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <PaymentStatusBadge status={order.payment_status} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-4 py-3">
                        <ActionButtons
                          order={order}
                          onView={() => handleView(order)}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          onReceive={onReceive}
                          onEmail={onEmail}
                          onPrint={onPrint}
                          onDownloadPDF={onDownloadPDF}
                          onConvertGRN={onConvertGRN}
                          onRecordPayment={onRecordPayment}
                          onCancel={onCancel}
                        />
                      </td>
                    </ExpandableRow>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}