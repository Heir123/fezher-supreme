import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import LeadForm from "./LeadForm";
import { getLeads } from "@/services/crmService";

export default function LeadManagement() {
  const [open, setOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    try {
      setLoading(true);

      const data = await getLeads();

      console.log("CRM LEADS:", data);

      setLeads(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("LEAD LOAD ERROR:", error);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }

  const getStatusCount = (status) => {
    return leads.filter(
      (lead) =>
        String(lead.status || "").toLowerCase() ===
        status.toLowerCase()
    ).length;
  };

  const totalLeads = leads.length;
  const newLeads = getStatusCount("New");
  const qualifiedLeads = getStatusCount("Qualified");
  const convertedLeads = getStatusCount("Converted");

  function getStatusClass(status) {
    switch (String(status || "").toLowerCase()) {
      case "new":
        return "bg-blue-100 text-blue-700";

      case "contacted":
        return "bg-yellow-100 text-yellow-700";

      case "qualified":
        return "bg-purple-100 text-purple-700";

      case "converted":
        return "bg-green-100 text-green-700";

      case "lost":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Leads
            </h1>

            <p className="text-slate-500">
              Manage sales leads and prospects.
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            + New Lead
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-slate-500">
              Total Leads
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {loading ? "..." : totalLeads}
            </h2>

            <p className="text-xs text-slate-400 mt-2">
              All sales prospects
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-slate-500">
              New Leads
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {loading ? "..." : newLeads}
            </h2>

            <p className="text-xs text-slate-400 mt-2">
              Recently created leads
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-slate-500">
              Qualified Leads
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {loading ? "..." : qualifiedLeads}
            </h2>

            <p className="text-xs text-slate-400 mt-2">
              Leads ready for opportunities
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-slate-500">
              Converted Leads
            </p>

            <h2 className="text-3xl font-bold mt-2 text-green-600">
              {loading ? "..." : convertedLeads}
            </h2>

            <p className="text-xs text-slate-400 mt-2">
              Successfully converted
            </p>
          </div>

        </div>

        {/* Lead Pipeline */}
        <div className="bg-white rounded-xl shadow p-6">

          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">
                Lead Pipeline
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Current leads by status.
              </p>
            </div>

            <div className="text-sm text-slate-500">
              {loading
                ? "Loading..."
                : `${totalLeads} lead${totalLeads === 1 ? "" : "s"}`}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">

            {[
              "New",
              "Contacted",
              "Qualified",
              "Converted",
              "Lost",
            ].map((status) => {

              const count = getStatusCount(status);

              return (
                <div
                  key={status}
                  className="border rounded-lg p-4"
                >
                  <p className="text-sm text-slate-500">
                    {status}
                  </p>

                  <p className="text-2xl font-bold mt-1">
                    {loading ? "..." : count}
                  </p>
                </div>
              );
            })}

          </div>
        </div>

        {/* Lead Table */}
        <div className="bg-white rounded-xl shadow p-6">

          <div className="flex justify-between items-center mb-4">

            <div>
              <h2 className="text-xl font-semibold">
                Lead List
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                View and manage your sales prospects.
              </p>
            </div>

            <div className="text-sm text-slate-500">
              {loading
                ? "Loading..."
                : `${totalLeads} lead${totalLeads === 1 ? "" : "s"}`}
            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full border-collapse">

              <thead>
                <tr className="border-b bg-slate-50">

                  <th className="text-left p-3">
                    Customer
                  </th>

                  <th className="text-left p-3">
                    Email
                  </th>

                  <th className="text-left p-3">
                    Phone
                  </th>

                  <th className="text-left p-3">
                    Source
                  </th>

                  <th className="text-left p-3">
                    Status
                  </th>

                  <th className="text-left p-3">
                    Created
                  </th>

                </tr>
              </thead>

              <tbody>

                {loading ? (

                  <tr>
                    <td
                      colSpan="6"
                      className="text-center p-8 text-slate-500"
                    >
                      Loading leads...
                    </td>
                  </tr>

                ) : leads.length === 0 ? (

                  <tr>
                    <td
                      colSpan="6"
                      className="text-center p-8 text-slate-500"
                    >
                      No leads found. Click "New Lead" to create one.
                    </td>
                  </tr>

                ) : (

                  leads.map((lead) => (

                    <tr
                      key={lead.id}
                      className="border-b hover:bg-slate-50"
                    >

                      <td className="p-3 font-medium">
                        {lead.customer_name || "-"}
                      </td>

                      <td className="p-3">
                        {lead.email || "-"}
                      </td>

                      <td className="p-3">
                        {lead.phone || "-"}
                      </td>

                      <td className="p-3">
                        {lead.source || "-"}
                      </td>

                      <td className="p-3">

                        <span
                          className={`px-3 py-1 rounded-full text-sm ${getStatusClass(
                            lead.status
                          )}`}
                        >
                          {lead.status || "New"}
                        </span>

                      </td>

                      <td className="p-3">
                        {lead.created_at
                          ? new Date(
                              lead.created_at
                            ).toLocaleDateString("en-ZA")
                          : "-"}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>
        </div>

        {/* New Lead Modal */}
        {open && (

          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-xl p-6 w-full max-w-lg">

              <div className="flex justify-between items-center mb-4">

                <h2 className="text-xl font-bold">
                  Add Lead
                </h2>

                <button
                  onClick={() => setOpen(false)}
                  className="text-red-600 font-bold text-lg"
                >
                  ✕
                </button>

              </div>

              <LeadForm
                onLeadAdded={() => {
                  loadLeads();
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