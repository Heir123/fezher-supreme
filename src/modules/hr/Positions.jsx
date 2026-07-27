import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PositionForm from "./PositionForm";
import {
  getPositions,
  deletePosition,
} from "@/services/positionService";

export default function Positions() {
  const [positions, setPositions] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    loadPositions();
  }, []);

  async function loadPositions() {
    try {
      const data = await getPositions();
      setPositions(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this position?")) return;

    await deletePosition(id);
    loadPositions();
  }

  return (
    <DashboardLayout>

      <div className="space-y-6">

        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold">
              Positions
            </h1>

            <p className="text-slate-500">
              Manage employee positions.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedPosition(null);
              setOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Position
          </button>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <table className="w-full">

            <thead>

              <tr className="border-b bg-gray-100">

                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Department</th>
                <th className="text-left p-3">Salary Grade</th>
                <th className="text-left p-3">Actions</th>

              </tr>

            </thead>

            <tbody>

              {positions.length === 0 ? (

                <tr>

                  <td
                    colSpan="4"
                    className="text-center p-6 text-gray-500"
                  >
                    No positions found.
                  </td>

                </tr>

              ) : (

                positions.map((position) => (

                  <tr
                    key={position.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-3">
                      {position.title}
                    </td>

                    <td className="p-3">
                      {position.department}
                    </td>

                    <td className="p-3">
                      {position.salary_grade}
                    </td>

                    <td className="p-3 flex gap-2">

                      <button
                        onClick={() => {
                          setSelectedPosition(position);
                          setOpen(true);
                        }}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(position.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        {open && (

          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

            <div className="bg-white rounded-xl p-6 w-full max-w-lg">

              <div className="flex justify-between mb-4">

                <h2 className="text-xl font-bold">
                  {selectedPosition
                    ? "Edit Position"
                    : "Add Position"}
                </h2>

                <button
                  onClick={() => setOpen(false)}
                  className="text-red-600"
                >
                  ✕
                </button>

              </div>

              <PositionForm
                position={selectedPosition}
                onPositionAdded={() => {
                  loadPositions();
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