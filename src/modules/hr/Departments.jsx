import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import DepartmentForm from "./DepartmentForm";
import {
  getDepartments,
  deleteDepartment,
} from "@/services/departmentService";

export default function Departments() {
  const [open, setOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    loadDepartments();
  }, []);

  async function loadDepartments() {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this department?")) return;

    await deleteDepartment(id);
    loadDepartments();
  }

  return (
    <DashboardLayout>

      <div className="space-y-6">

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-3xl font-bold">
              Departments
            </h1>

            <p className="text-slate-500">
              Manage company departments.
            </p>

          </div>

          <button
            onClick={() => {
              setSelectedDepartment(null);
              setOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Department
          </button>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <table className="w-full">

            <thead>

              <tr className="border-b bg-gray-100">

                <th className="text-left p-3">Department</th>
                <th className="text-left p-3">Manager</th>
                <th className="text-left p-3">Description</th>
                <th className="text-left p-3">Actions</th>

              </tr>

            </thead>

            <tbody>

              {departments.length === 0 ? (

                <tr>

                  <td
                    colSpan="4"
                    className="text-center p-6 text-gray-500"
                  >
                    No departments found.
                  </td>

                </tr>

              ) : (

                departments.map((department) => (

                  <tr
                    key={department.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-3">
                      {department.name}
                    </td>

                    <td className="p-3">
                      {department.manager}
                    </td>

                    <td className="p-3">
                      {department.description}
                    </td>

                    <td className="p-3 flex gap-2">

                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                        onClick={() => {
                          setSelectedDepartment(department);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded"
                        onClick={() => handleDelete(department.id)}
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

                  {selectedDepartment
                    ? "Edit Department"
                    : "Add Department"}

                </h2>

                <button
                  onClick={() => setOpen(false)}
                  className="text-red-600"
                >
                  ✕
                </button>

              </div>

              <DepartmentForm
                department={selectedDepartment}
                onDepartmentAdded={() => {
                  loadDepartments();
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