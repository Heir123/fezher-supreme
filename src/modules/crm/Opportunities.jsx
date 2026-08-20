import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import OpportunityForm from "./OpportunityForm";
import { getOpportunities } from "@/services/opportunityService";

export default function Opportunities() {
  const [open, setOpen] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOpportunities();
  }, []);

  async function loadOpportunities() {
    try {
      setLoading(true);
      const data = await getOpportunities();
      console.log("CRM OPPORTUNITIES:", data);
      setOpportunities(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("OPPORTUNITY LOAD ERROR:", error);
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  }

  const totalValue = opportunities.reduce(
    (total, opportunity) => total + Number(opportunity.value || 0),
    0
  );

  const wonOpportunities = opportunities.filter(
    (opportunity) => String(opportunity.stage || "").toLowerCase() === "won"
  );

  const openOpportunities = opportunities.filter((opportunity) => {
    const stage = String(opportunity.stage || "").toLowerCase();
    return stage !== "won" && stage !== "lost";
  });

  const wonValue = wonOpportunities.reduce(
    (total, opportunity) => total + Number(opportunity.value || 0),
    0
  );

  function getStageClass(stage) {
    switch (String(stage || "").toLowerCase()) {
      case "won":
        return "bg-green-100 text-green-700";
      case "lost":
        return "bg-red-100 text-red-700";
      case "negotiation":
        return "bg-purple-100 text-purple-700";
      case "proposal":
        return "bg-yellow-100 text-yellow-700";
      case "qualified":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  // Format currency helper
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Opportunities</h1>
            <p className="text-slate-500">Manage your sales pipeline and potential deals.</p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            + New Opportunity
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-slate-500">Total Opportunities</p>
            <h2 className="text-3xl font-bold mt-2">
              {loading ? "..." : opportunities.length}
            </h2>
            <p className="text-xs text-slate-400 mt-2">Deals in your pipeline</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-slate-500">Pipeline Value</p>
            <h2 className="text-3xl font-bold mt-2">
              {loading ? "..." : formatCurrency(totalValue)}
            </h2>
            <p className="text-xs text-slate-400 mt-2">Total opportunity value</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-slate-500">Won Value</p>
            <h2 className="text-3xl font-bold mt-2 text-green-600">
              {loading ? "..." : formatCurrency(wonValue)}
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              {wonOpportunities.length} won deal{wonOpportunities.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {/* Pipeline Summary */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">Sales Pipeline</h2>
              <p className="text-sm text-slate-500 mt-1">Current opportunities by stage.</p>
            </div>
            <div className="text-sm text-slate-500">
              {loading ? "Loading..." : `${openOpportunities.length} open`}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {["New", "Qualified", "Proposal", "Negotiation", "Won", "Lost"].map((stage) => {
              const count = opportunities.filter(
                (opportunity) =>
                  String(opportunity.stage || "").toLowerCase() === stage.toLowerCase()
              ).length;

              return (
                <div key={stage} className="border rounded-lg p-4">
                  <p className="text-sm text-slate-500">{stage}</p>
                  <p className="text-2xl font-bold mt-1">{loading ? "..." : count}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Opportunity Table */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">Opportunity List</h2>
              <p className="text-sm text-slate-500 mt-1">View and track your current deals.</p>
            </div>
            <div className="text-sm text-slate-500">
              {loading
                ? "Loading..."
                : `${opportunities.length} opportunit${opportunities.length === 1 ? "y" : "ies"}`}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left p-3">Opportunity</th>
                  <th className="text-left p-3">Value</th>
                  <th className="text-left p-3">Stage</th>
                  <th className="text-left p-3">Lead</th>
                  <th className="text-left p-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center p-8 text-slate-500">
                      Loading opportunities...
                    </td>
                  </tr>
                ) : opportunities.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-8 text-slate-500">
                      No opportunities found. Click "New Opportunity" to create one.
                    </td>
                  </tr>
                ) : (
                  opportunities.map((opportunity) => (
                    <tr key={opportunity.id} className="border-b hover:bg-slate-50">
                      <td className="p-3 font-medium">{opportunity.title || "-"}</td>
                      <td className="p-3">{formatCurrency(opportunity.value || 0)}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-sm ${getStageClass(opportunity.stage)}`}>
                          {opportunity.stage || "New"}
                        </span>
                      </td>
                      <td className="p-3">
                        {opportunity.leads?.customer_name || opportunity.lead_id || "-"}
                      </td>
                      <td className="p-3">
                        {opportunity.created_at
                          ? new Date(opportunity.created_at).toLocaleDateString('en-ZA')
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Opportunity Modal */}
        {open && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">New Opportunity</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-red-600 font-bold text-lg"
                >
                  ✕
                </button>
              </div>
              <OpportunityForm
                onOpportunityAdded={() => {
                  loadOpportunities();
                  setOpen(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}