import { CalendarDays } from "lucide-react";

export default function DashboardDateFilter({
  period,
  onChange,
}) {
  return (
    <div className="flex items-center gap-3">

      <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-600">

        <CalendarDays size={20} />

      </div>

      <select
        value={period}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="
          h-10
          rounded-xl
          border
          border-slate-200
          bg-white
          px-4
          text-sm
          font-medium
          text-slate-700
          shadow-sm
          outline-none
          transition
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-100
        "
      >

        <option value="today">
          Today
        </option>

        <option value="week">
          This Week
        </option>

        <option value="month">
          This Month
        </option>

        <option value="year">
          This Year
        </option>

        <option value="all">
          All Time
        </option>

      </select>

    </div>
  );
}