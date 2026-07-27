import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import OpportunityForm from "./OpportunityForm";
import { getOpportunities } from "@/services/opportunityService";

export default function Opportunities() {

  const [open, setOpen] = useState(false);
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    loadOpportunities();
  }, []);

  async function loadOpportunities() {
    try {
      const data = await getOpportunities();
      setOpportunities(data);
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
              Opportunities
            </h1>

            <p className="text-slate-500">
              Manage your sales pipeline.
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + New Opportunity
          </button>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Opportunity List
          </h2>

         <table className="w-full border-collapse">

  <thead>
    <tr className="border-b">

      <th className="text-left p-3">
        Title
      </th>

      <th className="text-left p-3">
        Value
      </th>

      <th className="text-left p-3">
        Stage
      </th>

      <th className="text-left p-3">
        Created
      </th>

    </tr>
  </thead>

  <tbody>

    {opportunities.length === 0 ? (

      <tr>
        <td
          colSpan="4"
          className="text-center p-6 text-gray-500"
        >
          No opportunities found.
        </td>
      </tr>

    ) : (

      opportunities.map((opportunity) => (

        <tr
          key={opportunity.id}
          className="border-b hover:bg-gray-50"
        >

          <td className="p-3">
            {opportunity.title}
          </td>

          <td className="p-3">
            R {Number(opportunity.value).toFixed(2)}
          </td>

          <td className="p-3">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
              {opportunity.stage}
            </span>
          </td>

          <td className="p-3">
            {new Date(opportunity.created_at).toLocaleDateString()}
          </td>

        </tr>

      ))

    )}

  </tbody>

</table>
        

        </div>

        {open && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl p-6 w-full max-w-lg">

              <div className="flex justify-between mb-4">

                <h2 className="text-xl font-bold">
                  New Opportunity
                </h2>

                <button
                  onClick={() => setOpen(false)}
                  className="text-red-600 font-bold"
                >
                  X
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