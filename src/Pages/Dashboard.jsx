import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardCards from "@/components/DashboardCards";
export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome to Fezher Supreme</h1>
          <p className="text-gray-600">
            Manage your entire business from one place.
          </p>
        </div>

        <DashboardCards />
      </div>
    </DashboardLayout>
  );
}