import DashboardDateFilter from "./DashboardDateFilter";

export default function DashboardHeader2({
  period,
  onPeriodChange,
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-1">
          Welcome to Fezher Supreme ERP V2
        </p>
      </div>

      <DashboardDateFilter
        period={period}
        onChange={onPeriodChange}
      />

    </div>
  );
}