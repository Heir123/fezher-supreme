import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import AttendanceForm from "./AttendanceForm";
import {
  getAttendance,
  deleteAttendance,
} from "@/services/attendanceService";

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
const [open, setOpen] = useState(false);
const [selectedAttendance, setSelectedAttendance] = useState(null);
  useEffect(() => {
    loadAttendance();
  }, []);

  async function loadAttendance() {
    try {
      const data = await getAttendance();
      setAttendance(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this attendance record?")) return;

    await deleteAttendance(id);

    loadAttendance();
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold">
              Attendance
            </h1>

            <p className="text-slate-500">
              Employee attendance management.
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Attendance
          </button>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Attendance Records
          </h2>

          <table className="w-full border-collapse">

            <thead>

              <tr className="border-b bg-gray-100">

                <th className="text-left p-3">Employee</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Clock In</th>
                <th className="text-left p-3">Clock Out</th>
                <th className="text-left p-3">Hours</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>

              </tr>

            </thead>

            <tbody>

              {attendance.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="text-center p-6 text-gray-500"
                  >
                    No attendance records found.
                  </td>

                </tr>

              ) : (

                attendance.map((record) => (

                  <tr
                    key={record.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-3">
                      {record.employees?.employee_no} -{" "}
                      {record.employees?.first_name}{" "}
                      {record.employees?.last_name}
                    </td>

                    <td className="p-3">
                      {record.attendance_date}
                    </td>

                    <td className="p-3">
                      {record.clock_in
                        ? new Date(record.clock_in).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>

                    <td className="p-3">
                      {record.clock_out
                        ? new Date(record.clock_out).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>

                    <td className="p-3">
                      {record.hours_worked ?? "-"}
                    </td>

                    <td className="p-3">
                      {record.status}
                    </td>

                    <td className="p-3 flex gap-2">

                      <button
  onClick={() => {
    setSelectedAttendance(record);
    setOpen(true);
  }}
  className="bg-yellow-500 text-white px-3 py-1 rounded"
>
  Edit
</button>

                      <button
                        onClick={() => handleDelete(record.id)}
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

          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl p-6 w-full max-w-lg">

              <div className="flex justify-between mb-4">

                <h2 className="text-xl font-bold">
                  Add Attendance
                </h2>

                <button
                  onClick={() => setOpen(false)}
                  className="text-red-600 font-bold"
                >
                  ✕
                </button>

              </div>

             <AttendanceForm
  attendance={selectedAttendance}
  onAttendanceAdded={() => {
    loadAttendance();
    setSelectedAttendance(null);
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