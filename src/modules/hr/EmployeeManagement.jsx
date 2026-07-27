import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import EmployeeForm from "./EmployeeForm";
import {
  getEmployees,
  deleteEmployee,
} from "@/services/employeeService";

export default function EmployeeManagement() {
  const [open, setOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
const [selectedEmployee, setSelectedEmployee] = useState(null);
  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this employee?")) return;

    try {
      await deleteEmployee(id);
      loadEmployees();
    } catch (error) {
      console.error(error);
      alert("Failed to delete employee");
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold">
              Employees
            </h1>

            <p className="text-slate-500">
              Manage company employees.
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Employee
          </button>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Employee List
          </h2>

          <table className="w-full border-collapse">

            <thead>

              <tr className="border-b bg-gray-100">

                <th className="text-left p-3">
                  Employee No
                </th>

                <th className="text-left p-3">
                  Name
                </th>

                <th className="text-left p-3">
                  Department
                </th>

                <th className="text-left p-3">
                  Position
                </th>

                <th className="text-left p-3">
                  Salary
                </th>

                <th className="text-left p-3">
                  Status
                </th>

                <th className="text-left p-3">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {employees.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="text-center p-6 text-gray-500"
                  >
                    No employees found.
                  </td>

                </tr>

              ) : (

                employees.map((employee) => (

                  <tr
                    key={employee.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-3">
                      {employee.employee_no}
                    </td>

                    <td className="p-3">
                      {employee.first_name} {employee.last_name}
                    </td>

                    <td className="p-3">
                      {employee.department}
                    </td>

                    <td className="p-3">
                      {employee.position}
                    </td>

                    <td className="p-3">
                      R {Number(employee.salary).toFixed(2)}
                    </td>

                    <td className="p-3">

                      <span
                        className={`px-3 py-1 rounded-full ${
                          employee.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {employee.status}
                      </span>

                    </td>

                    <td className="p-3 flex gap-2">

                     <button
  onClick={() => {
    setSelectedEmployee(employee);
    setOpen(true);
  }}
  className="bg-yellow-500 text-white px-3 py-1 rounded"
>
  Edit
</button>

                      <button
                        onClick={() => handleDelete(employee.id)}
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

              <div className="flex justify-between items-center mb-4">

                <h2 className="text-xl font-bold">
                  Add Employee
                </h2>

                <button
                  onClick={() => setOpen(false)}
                  className="text-red-600 font-bold"
                >
                  ✕
                </button>

              </div>

             <EmployeeForm
  employee={selectedEmployee}
  onEmployeeAdded={() => {
    loadEmployees();
    setSelectedEmployee(null);
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