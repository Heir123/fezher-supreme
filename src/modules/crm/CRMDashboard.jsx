import DashboardLayout from "@/layouts/DashboardLayout";

export default function CRMDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold">
            CRM Dashboard
          </h1>

          <p className="text-slate-500">
            Manage leads, opportunities and customer follow-ups.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4">

          <div className="bg-white p-6 rounded-xl shadow">
            <h3>Total Leads</h3>
            <p className="text-3xl font-bold">0</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3>Opportunities</h3>
            <p className="text-3xl font-bold">0</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3>Follow Ups</h3>
            <p className="text-3xl font-bold">0</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3>Won Deals</h3>
            <p className="text-3xl font-bold">0</p>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}