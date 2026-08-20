import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Package,
  Tags,
  Users,
  Truck,
  ShoppingCart,
  ArrowLeftRight,
  DollarSign,
  Briefcase,
  Wallet,
  BarChart3,
  FileText,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-5">

      <h1 className="text-2xl font-bold mb-8">
        Fezher Supreme
      </h1>

      <nav className="space-y-2">

        {/* Dashboard */}
        <Link
          to="/dashboard"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        {/* Companies */}
        <Link
          to="/companies"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
        >
          <Building2 size={20} />
          Companies
        </Link>

        {/* Products */}
        <Link
          to="/products"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
        >
          <Package size={20} />
          Products
        </Link>

        {/* Inventory Dashboard */}
        <Link
          to="/inventory-dashboard"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
        >
          <Package size={20} />
          Inventory Dashboard
        </Link>

        {/* Categories */}
        <Link
          to="/categories"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
        >
          <Tags size={20} />
          Categories
        </Link>

        {/* Customers */}
        <Link
          to="/customers"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
        >
          <Users size={20} />
          Customers
        </Link>

        {/* Suppliers */}
        <Link
          to="/suppliers"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
        >
          <Truck size={20} />
          Suppliers
        </Link>

        {/* Purchases */}
        <Link
          to="/purchases"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
        >
          <ShoppingCart size={20} />
          Purchases
        </Link>

        {/* Sales */}
        <Link
          to="/sales"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
        >
          <ShoppingCart size={20} />
          Sales
        </Link>

        {/* Finance */}
        <Link
          to="/finance"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
        >
          <DollarSign size={20} />
          Finance
        </Link>

        {/* Finance Transactions */}
        <Link
          to="/finance/transactions"
          className="flex items-center gap-3 pl-10 p-2 rounded hover:bg-slate-700 text-sm"
        >
          <Wallet size={18} />
          Transactions
        </Link>

        {/* CRM */}
        <Link
          to="/crm"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
        >
          <Briefcase size={20} />
          CRM
        </Link>

        {/* CRM Leads */}
        <Link
          to="/crm/leads"
          className="flex items-center gap-3 pl-10 p-2 rounded hover:bg-slate-700 text-sm"
        >
          Leads
        </Link>

        {/* CRM Opportunities */}
        <Link
          to="/crm/opportunities"
          className="flex items-center gap-3 pl-10 p-2 rounded hover:bg-slate-700 text-sm"
        >
          Opportunities
        </Link>

        {/* CRM Follow-ups */}
        <Link
          to="/crm/follow-ups"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
        >
          Follow-ups
        </Link>

        {/* Inventory Movements */}
        <Link
          to="/inventory-movements"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
        >
          <ArrowLeftRight size={20} />
          Inventory Movements
        </Link>

        {/* HR */}
        <Link
          to="/hr"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
        >
          <Users size={20} />
          HR
        </Link>

        {/* Employees */}
        <Link
          to="/hr/employees"
          className="flex items-center gap-3 pl-10 p-2 rounded hover:bg-slate-700 text-sm"
        >
          Employees
        </Link>

        {/* Departments */}
        <Link
          to="/departments"
          className="flex items-center gap-3 pl-10 p-2 rounded hover:bg-slate-700 text-sm"
        >
          Departments
        </Link>

        {/* Positions */}
        <Link
          to="/positions"
          className="flex items-center gap-3 pl-10 p-2 rounded hover:bg-slate-700 text-sm"
        >
          Positions
        </Link>

        {/* Attendance */}
        <Link
          to="/attendance"
          className="flex items-center gap-3 pl-10 p-2 rounded hover:bg-slate-700 text-sm"
        >
          Attendance
        </Link>

        {/* Payroll */}
        <Link
          to="/payroll"
          className="flex items-center gap-3 pl-10 p-2 rounded hover:bg-slate-700 text-sm"
        >
          Payroll
        </Link>

        {/* Executive */}
        <Link
          to="/executive"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
        >
          <BarChart3 size={20} />
          Executive
        </Link>

        {/* Reports */}
        <Link
          to="/reports"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
        >
          <FileText size={20} />
          Reports
        </Link>

      </nav>
    </aside>
  );
}