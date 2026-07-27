import { useState, useEffect } from "react";
import FollowUpForm from "./FollowUpForm";
import { getFollowUps } from "@/services/followUpService";
import DashboardLayout from "@/layouts/DashboardLayout";
export default function FollowUps() {

  const [open, setOpen] = useState(false);
  const [followUps, setFollowUps] = useState([]);
  useEffect(() => {
  loadFollowUps();
}, []);

async function loadFollowUps() {
  try {
    const data = await getFollowUps();
    setFollowUps(data);
  } catch (error) {
    console.error(error);
  }
}
  return (
    <div>
      <div className="space-y-6">

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
  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
>
            + Schedule Follow-up
          </button>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Follow-up List
          </h2>

      <table className="w-full border-collapse">

  <thead>
    <tr className="border-b">

      <th className="text-left p-3">
        Opportunity ID
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

    {followUps.length === 0 ? (

      <tr>
        <td
          colSpan="3"
          className="text-center p-6 text-gray-500"
        >
          No follow-ups scheduled.
        </td>
      </tr>

    ) : (

      followUps.map((followUp) => (

        <tr
          key={followUp.id}
          className="border-b hover:bg-gray-50"
        >

          <td className="p-3">
            {followUp.opportunity_id}
          </td>

          <td className="p-3">
            {followUp.notes}
          </td>

          <td className="p-3">
            {new Date(followUp.follow_up_date).toLocaleDateString()}
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
          Schedule Follow-up
        </h2>

        <button
          onClick={() => setOpen(false)}
          className="text-red-600 font-bold"
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
    </div>
  );
}