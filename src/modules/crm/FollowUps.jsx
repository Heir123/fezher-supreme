import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import FollowUpForm from "./FollowUpForm";
import { getFollowUps } from "@/services/followUpService";

export default function FollowUps() {
  const [open, setOpen] = useState(false);
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFollowUps();
  }, []);

  async function loadFollowUps() {
    try {
      setLoading(true);

      const data = await getFollowUps();

      console.log("CRM FOLLOW-UPS:", data);

      setFollowUps(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("FOLLOW-UP LOAD ERROR:", error);
      setFollowUps([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold">
              Follow-ups
            </h1>

            <p className="text-slate-500">
              Manage customer follow-up activities.
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            + Schedule Follow-up
          </button>

        </div>

        {/* Follow-up Table */}
        <div className="bg-white rounded-xl shadow p-6">

          <div className="flex justify-between items-center mb-4">

            <div>
              <h2 className="text-xl font-semibold">
                Follow-up List
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Track scheduled customer activities.
              </p>
            </div>

            <div className="text-sm text-slate-500">
              {loading
                ? "Loading..."
                : `${followUps.length} follow-up${
                    followUps.length === 1 ? "" : "s"
                  }`}
            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full border-collapse">

              <thead>
                <tr className="border-b bg-slate-50">

                <th className="text-left p-3">
  Opportunity
</th>

<th className="text-left p-3">
  Customer
</th>

<th className="text-left p-3">
  Notes
</th>

                  <th className="text-left p-3">
                    Follow-up Date
                  </th>

                </tr>
              </thead>

              <tbody>

                {loading ? (

                  <tr>
                    <td
                      colSpan="4"
                      className="text-center p-8 text-slate-500"
                    >
                      Loading follow-ups...
                    </td>
                  </tr>

                ) : followUps.length === 0 ? (

                  <tr>
                    <td
                      colSpan="3"
                      className="text-center p-8 text-slate-500"
                    >
                      No follow-ups scheduled.
                    </td>
                  </tr>

                ) : (

                  followUps.map((followUp) => (

                    <tr
                      key={followUp.id}
                      className="border-b hover:bg-slate-50"
                    >

                      <td className="p-3">
  {followUp.opportunity_title || "-"}
</td>
<td className="p-3">
  {followUp.customer_name || "-"}
</td>
                      <td className="p-3">
                        {followUp.notes || "-"}
                      </td>

                      <td className="p-3">

                        {followUp.follow_up_date
                          ? new Date(
                              followUp.follow_up_date
                            ).toLocaleDateString()
                          : "-"}

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* Add Follow-up Modal */}
        {open && (

          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl p-6 w-full max-w-lg">

              <div className="flex justify-between items-center mb-4">

                <h2 className="text-xl font-bold">
                  Schedule Follow-up
                </h2>

                <button
                  onClick={() => setOpen(false)}
                  className="text-red-600 font-bold text-lg"
                >
                  X
                </button>

              </div>

              <FollowUpForm
                onFollowUpAdded={() => {
                  loadFollowUps();
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