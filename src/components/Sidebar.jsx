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
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-5">

      <h1 className="text-2xl font-bold mb-8">
        Fezher Supreme
      </h1>

      <nav className="space-y-2">

        <Link
          to="/dashboard"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        <Link
          to="/companies"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
        >
          <Building2 size={20} />
          Companies
        </Link>

        <Link
          to="/products"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
        >
          <Package size={20} />
          Products
        </Link>

        <Link
          to="/categories"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
        >
          <Tags size={20} />
          Categories
        </Link>

        <Link
          to="/customers"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
        >
          <Users size={20} />
          Customers
        </Link>

        <Link
          to="/suppliers"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
        >
          <Truck size={20} />
          Suppliers
        </Link>

        <Link
          to="/purchases"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
        >
          <ShoppingCart size={20} />
          Purchases
        </Link>

        <Link
          to="/sales"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
        >
          <ShoppingCart size={20} />
          Sales
        </Link>

        <Link
          to="/finance"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
        >
          <DollarSign size={20} />
          Finance
        </Link>

        <Link
          to="/crm"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
        >
          <Briefcase size={20} />
          CRM
        </Link>

        <Link
          to="/crm/leads"
          className="flex items-center gap-3 pl-10 p-2 rounded hover:bg-slate-700 text-sm"
        >
          Leads
        </Link>

        <Link
          to="/inventory-movements"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
        >
          <ArrowLeftRight size={20} />
          Inventory Movements
        </Link>

<Link
  to="/crm/opportunities"
  className="flex items-center gap-3 pl-10 p-2 rounded hover:bg-slate-700 text-sm"
>
  Opportunities
</Link>
<Link
  to="/crm/follow-ups"
  className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
>
  Follow-ups
</Link>

<Link
  to="/hr"
  className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
>
  <Users size={20} />
  HR
</Link>

<Link
  to="/hr/employees"
  className="flex items-center gap-3 pl-10 p-2 rounded hover:bg-slate-700 text-sm"
>
  Employees
</Link>

<Link
  to="/departments"
  className="flex items-center gap-3 pl-10 p-2 rounded hover:bg-slate-700 text-sm"
>
  Departments
</Link>

<Link
  to="/positions"
  className="flex items-center gap-3 pl-10 p-2 rounded hover:bg-slate-700 text-sm"
>
  Positions
</Link>

<Link
  to="/attendance"
  className="flex items-center gap-3 pl-10 p-2 rounded hover:bg-slate-700 text-sm"
>
  Attendance
</Link>

<Link
  to="/payroll"
  className="flex items-center gap-3 pl-10 p-2 rounded hover:bg-slate-700 text-sm"
>
  Payroll
</Link>
      </nav>

    </aside>
  );
}