import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import LeadForm from "./LeadForm";
import { getLeads } from "@/services/crmService";
export default function LeadManagement() {
  const [open, setOpen] = useState(false);
const [leads, setLeads] = useState([]);

useEffect(() => {
  loadLeads();
}, []);

async function loadLeads() {
  try {
    const data = await getLeads();
    setLeads(data);
  } catch (error) {
    console.error(error);
  }
}
  return (
    <DashboardLayout>
      <div className="space-y-6">

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
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + New Lead
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Lead List
          </h2>

         <table className="w-full border-collapse">

  <thead>
    <tr className="border-b">

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

    </tr>
  </thead>

  <tbody>

    {leads.map((lead) => (

      <tr
        key={lead.id}
        className="border-b hover:bg-gray-50"
      >

        <td className="p-3">
          {lead.customer_name}
        </td>

        <td className="p-3">
          {lead.email}
        </td>

        <td className="p-3">
          {lead.phone}
        </td>

        <td className="p-3">
          {lead.source}
        </td>

        <td className="p-3">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            {lead.status}
          </span>
        </td>

      </tr>

    ))}

  </tbody>

</table>
        </div>

        {open && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg">

              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">
                  Add Lead
                </h2>

                <button
                  onClick={() => setOpen(false)}
                  className="text-red-600 font-bold"
                >
                  X
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