```jsx
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  Wallet,
  PiggyBank,
  Landmark,
  ShoppingCart,
  Users,
  Package,
  Tags,
  Truck,
  ArrowLeftRight,
  Briefcase,
  UserRound,
  Building2,
  FileText,
  Mail,
  Settings,
  CircleHelp,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [openSections, setOpenSections] = useState({
    finance: true,
    sales: true,
    inventory: true,
    crm: false,
    hr: false,
    reporting: true,
    administration: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const navClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-slate-700 text-white shadow-sm"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  const subNavClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
      isActive
        ? "bg-slate-700/70 text-white"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`;

  const Section = ({ id, title, children }) => (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => toggleSection(id)}
        className="mb-2 flex w-full items-center justify-between px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-300"
      >
        <span>{title}</span>

        {openSections[id] ? (
          <ChevronDown size={14} />
        ) : (
          <ChevronRight size={14} />
        )}
      </button>

      {openSections[id] && (
        <div className="space-y-1">{children}</div>
      )}
    </div>
  );

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-slate-800 bg-slate-900 text-white">

      {/* BRAND */}
      <div className="border-b border-slate-800 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-700">
            <BarChart3 size={21} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight">
              Fezher Supreme
            </h1>

            <p className="text-xs text-slate-400">
              Management Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">

        {/* OVERVIEW */}
        <div>
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Overview
          </p>

          <div className="space-y-1">
            <NavLink to="/dashboard" className={navClass}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/analytics" className={navClass}>
              <TrendingUp size={18} />
              <span>Analytics</span>
            </NavLink>
          </div>
        </div>

        {/* FINANCE */}
        <Section id="finance" title="Finance">
          <NavLink to="/profit-loss" className={navClass}>
            <BarChart3 size={18} />
            <span>Profit & Loss</span>
          </NavLink>

          <NavLink to="/cash-flow" className={navClass}>
            <Wallet size={18} />
            <span>Cash Flow</span>
          </NavLink>

          <NavLink to="/budget" className={navClass}>
            <PiggyBank size={18} />
            <span>Budget</span>
          </NavLink>

          <NavLink to="/bank-reconciliation" className={navClass}>
            <Landmark size={18} />
            <span>Bank Reconciliation</span>
          </NavLink>

          {/* Existing Finance */}
          <NavLink to="/finance" className={subNavClass}>
            <Wallet size={17} />
            <span>Finance Dashboard</span>
          </NavLink>

          <NavLink to="/finance/transactions" className={subNavClass}>
            <ArrowLeftRight size={17} />
            <span>Transactions</span>
          </NavLink>
        </Section>

        {/* SALES */}
        <Section id="sales" title="Sales">
          <NavLink to="/sales" className={navClass}>
            <ShoppingCart size={18} />
            <span>Sales</span>
          </NavLink>

          <NavLink to="/customers" className={navClass}>
            <Users size={18} />
            <span>Customers</span>
          </NavLink>

          {/* Existing Purchasing */}
          <NavLink to="/purchases" className={subNavClass}>
            <ShoppingCart size={17} />
            <span>Purchases</span>
          </NavLink>

          <NavLink to="/suppliers" className={subNavClass}>
            <Truck size={17} />
            <span>Suppliers</span>
          </NavLink>
        </Section>

        {/* INVENTORY */}
        <Section id="inventory" title="Inventory">
          <NavLink to="/inventory" className={navClass}>
            <Package size={18} />
            <span>Inventory</span>
          </NavLink>

          <NavLink to="/products" className={navClass}>
            <Tags size={18} />
            <span>Products</span>
          </NavLink>

          <NavLink to="/categories" className={subNavClass}>
            <Tags size={17} />
            <span>Categories</span>
          </NavLink>

          <NavLink to="/inventory-dashboard" className={subNavClass}>
            <Package size={17} />
            <span>Inventory Dashboard</span>
          </NavLink>

          <NavLink to="/inventory-movements" className={subNavClass}>
            <ArrowLeftRight size={17} />
            <span>Stock Movements</span>
          </NavLink>
        </Section>

        {/* CRM */}
        <Section id="crm" title="CRM">
          <NavLink to="/crm" className={navClass}>
            <Briefcase size={18} />
            <span>CRM Dashboard</span>
          </NavLink>

          <NavLink to="/crm/leads" className={subNavClass}>
            <UserRound size={17} />
            <span>Leads</span>
          </NavLink>

          <NavLink to="/crm/opportunities" className={subNavClass}>
            <TrendingUp size={17} />
            <span>Opportunities</span>
          </NavLink>

          <NavLink to="/crm/follow-ups" className={subNavClass}>
            <Users size={17} />
            <span>Follow-ups</span>
          </NavLink>
        </Section>

        {/* HR */}
        <Section id="hr" title="Human Resources">
          <NavLink to="/hr" className={navClass}>
            <Users size={18} />
            <span>HR Dashboard</span>
          </NavLink>

          <NavLink to="/hr/employees" className={subNavClass}>
            <UserRound size={17} />
            <span>Employees</span>
          </NavLink>

          <NavLink to="/departments" className={subNavClass}>
            <Building2 size={17} />
            <span>Departments</span>
          </NavLink>

          <NavLink to="/positions" className={subNavClass}>
            <Briefcase size={17} />
            <span>Positions</span>
          </NavLink>

          <NavLink to="/attendance" className={subNavClass}>
            <Users size={17} />
            <span>Attendance</span>
          </NavLink>

          <NavLink to="/payroll" className={subNavClass}>
            <Wallet size={17} />
            <span>Payroll</span>
          </NavLink>
        </Section>

        {/* REPORTING */}
        <Section id="reporting" title="Reporting">
          <NavLink to="/reports" className={navClass}>
            <FileText size={18} />
            <span>Reports</span>
          </NavLink>

          <NavLink to="/email-reports" className={navClass}>
            <Mail size={18} />
            <span>Email Reports</span>
          </NavLink>

          <NavLink to="/executive" className={subNavClass}>
            <BarChart3 size={17} />
            <span>Executive Dashboard</span>
          </NavLink>
        </Section>

        {/* ADMINISTRATION */}
        <Section id="administration" title="Administration">
          <NavLink to="/companies" className={navClass}>
            <Building2 size={18} />
            <span>Companies</span>
          </NavLink>

          <NavLink to="/users" className={navClass}>
            <Users size={18} />
            <span>Users</span>
          </NavLink>
        </Section>
      </nav>

      {/* BOTTOM NAVIGATION */}
      <div className="border-t border-slate-800 p-3">
        <div className="space-y-1">
          <NavLink to="/settings" className={navClass}>
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>

          <NavLink to="/help" className={navClass}>
            <CircleHelp size={18} />
            <span>Help & Support</span>
          </NavLink>
        </div>

        <div className="mt-3 px-3 pb-1">
          <p className="text-[11px] text-slate-600">
            Fezher Supreme v1.0
          </p>
        </div>
      </div>
    </aside>
  );
}
```
