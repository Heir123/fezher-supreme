import {
  ShoppingBag,
  Clock,
  FileCheck,
  Package,
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileSpreadsheet,
  AlertCircle,
  XCircle,
  Truck,
  Calendar,
  Building,
  BarChart3,
} from "lucide-react";
// Individual stat card component
const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  subtitle,
  trend,
  trendDirection,
  showSubtitle,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-xl font-semibold text-gray-900 mt-1">
            {value}
          </p>
          {showSubtitle && subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${
              trendDirection === 'up' ? 'text-green-600' : 
              trendDirection === 'down' ? 'text-red-600' : 'text-gray-500'
            }`}>
              {trendDirection === 'up' && <TrendingUp size={12} />}
              {trendDirection === 'down' && <TrendingDown size={12} />}
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
    </div>
  );
};

// Main PurchaseStats component
export default function PurchaseStats({ 
  data = {},
  loading = false,
  className = "",
  onStatClick,
  variant = "default", // "default", "compact", "detailed"
  showTrends = true,
  showSubtitle = true,
  columns = 4 // 2, 3, 4, 6
}) {
  // Default values for missing data
  const stats = {
    totalOrders: data.totalOrders || 0,
    pendingOrders: data.pendingOrders || 0,
    waitingApproval: data.waitingApproval || 0,
    goodsReceivedToday: data.goodsReceivedToday || 0,
    outstandingPayments: data.outstandingPayments || 0,
    purchasesThisMonth: data.purchasesThisMonth || 0,
    totalProcurementCost: data.totalProcurementCost || 0,
    averagePurchaseValue: data.averagePurchaseValue || 0,
    overdueOrders: data.overdueOrders || 0,
    cancelledOrders: data.cancelledOrders || 0,
    totalSuppliers: data.totalSuppliers || 0,
    totalItems: data.totalItems || 0,
    // Trends data
    trends: data.trends || {},
    // Additional metrics
    yearToDate: data.yearToDate || 0,
    budgetUtilization: data.budgetUtilization || 0,
  };

  const currencyFormatter = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
});

const formatCurrency = (amount) =>
  currencyFormatter.format(amount || 0);

  const getTrend = (metric) => {
  if (!showTrends) return null;

  return stats.trends?.[metric]
    ? {
        value: stats.trends[metric].value,
        direction: stats.trends[metric].direction,
      }
    : null;
};

  // Define stat configurations based on variant
  const getStatConfigs = () => {
    const baseConfigs = [
      {
        id: 'totalOrders',
        title: 'Total Purchase Orders',
        value: stats.totalOrders,
        icon: ShoppingBag,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        subtitle: showSubtitle ? 'All time orders' : undefined,
        trend: getTrend('totalOrders'),
      },
      {
        id: 'pendingOrders',
        title: 'Pending Orders',
        value: stats.pendingOrders,
        icon: Clock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        subtitle: showSubtitle ? 'Awaiting processing' : undefined,
        trend: getTrend('pendingOrders'),
      },
      {
        id: 'waitingApproval',
        title: 'Waiting Approval',
        value: stats.waitingApproval,
        icon: FileCheck,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        subtitle: showSubtitle ? 'Pending authorization' : undefined,
        trend: getTrend('waitingApproval'),
      },
      {
        id: 'goodsReceivedToday',
        title: 'Goods Received Today',
        value: stats.goodsReceivedToday,
        icon: Package,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        subtitle: showSubtitle ? 'Items delivered' : undefined,
        trend: getTrend('goodsReceivedToday'),
      },
      {
        id: 'outstandingPayments',
        title: 'Outstanding Payments',
        value: stats.outstandingPayments,
        icon: CreditCard,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        subtitle: showSubtitle ? 'Due to suppliers' : undefined,
        trend: getTrend('outstandingPayments'),
      },
      {
        id: 'purchasesThisMonth',
        title: 'Purchases This Month',
        value: stats.purchasesThisMonth,
        icon: TrendingUp,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        subtitle: showSubtitle ? 'Current month' : undefined,
        trend: getTrend('purchasesThisMonth'),
      },
      {
        id: 'totalProcurementCost',
        title: 'Total Procurement Cost',
        value: formatCurrency(stats.totalProcurementCost),
        icon: DollarSign,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        subtitle: showSubtitle ? 'Total spend' : undefined,
        trend: getTrend('totalProcurementCost'),
      },
      {
        id: 'averagePurchaseValue',
        title: 'Average Purchase Value',
        value: formatCurrency(stats.averagePurchaseValue),
        icon: FileSpreadsheet,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        subtitle: showSubtitle ? 'Per order average' : undefined,
        trend: getTrend('averagePurchaseValue'),
      },
    ];

    // Additional stats for detailed variant
    const detailedConfigs = [
      {
        id: 'overdueOrders',
        title: 'Overdue Orders',
        value: stats.overdueOrders,
        icon: AlertCircle,
        color: 'text-rose-600',
        bgColor: 'bg-rose-50',
        subtitle: 'Past delivery date',
      },
      {
        id: 'cancelledOrders',
        title: 'Cancelled Orders',
        value: stats.cancelledOrders,
        icon: XCircle,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        subtitle: 'Total cancelled',
      },
      {
        id: 'totalSuppliers',
        title: 'Active Suppliers',
        value: stats.totalSuppliers,
        icon: Building,
        color: 'text-cyan-600',
        bgColor: 'bg-cyan-50',
        subtitle: 'Total vendors',
      },
      {
        id: 'totalItems',
        title: 'Total Items',
        value: stats.totalItems,
        icon: Truck,
        color: 'text-teal-600',
        bgColor: 'bg-teal-50',
        subtitle: 'Items purchased',
      },
      {
        id: 'yearToDate',
        title: 'Year to Date',
        value: formatCurrency(stats.yearToDate),
        icon: Calendar,
        color: 'text-violet-600',
        bgColor: 'bg-violet-50',
        subtitle: 'Total YTD spend',
      },
      {
        id: 'budgetUtilization',
        title: 'Budget Utilization',
        value: `${stats.budgetUtilization}%`,
        icon: BarChart3,
        color: 'text-fuchsia-600',
        bgColor: 'bg-fuchsia-50',
        subtitle: 'Of annual budget',
      },
    ];

    if (variant === 'compact') {
      return baseConfigs.slice(0, 4);
    }

    if (variant === 'detailed') {
      return [...baseConfigs, ...detailedConfigs];
    }

    return baseConfigs;
  };

  const statConfigs = getStatConfigs();

  // Determine grid columns
  const getGridColumns = () => {
    if (columns === 2) return 'grid-cols-1 md:grid-cols-2';
    if (columns === 3) return 'grid-cols-1 md:grid-cols-3';
    if (columns === 6) return 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
  };

  // Loading state
  if (loading) {
    return (
      <div className={`grid ${getGridColumns()} gap-4 ${className}`}>
        {Array.from({
  length:
    variant === "detailed"
      ? 14
      : variant === "compact"
      ? 4
      : 8,
}).map((_, index) => (
  <div
    key={index}
    className="bg-white rounded-lg shadow p-4 border border-gray-100 animate-pulse"
  >
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
))}
      </div>
    );
  }

  // Empty state
  if (!statConfigs.length || stats.totalOrders === 0) {
    return (
      <div className={`bg-white rounded-lg shadow p-8 text-center ${className}`}>
        <div className="flex flex-col items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No purchase data available</p>
          <p className="text-sm text-gray-400 mt-1">Start creating purchase orders to see statistics</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid ${getGridColumns()} gap-4 ${className}`}>
      {statConfigs.map((stat) => (
        <div
          key={stat.id}
          onClick={() => onStatClick?.(stat.id)}
          className={onStatClick ? 'cursor-pointer' : ''}
        >
          <StatCard
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            bgColor={stat.bgColor}
            subtitle={stat.subtitle}
            trend={stat.trend?.value}
            trendDirection={stat.trend?.direction}
            showSubtitle={showSubtitle}
          />
        </div>
      ))}
    </div>
  );
}
