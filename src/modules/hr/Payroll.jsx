import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PayrollForm from "./PayrollForm";
import {
  getPayroll,
  deletePayroll,
} from "@/services/payrollService";
import PayrollDashboardCards from "./PayrollDashboardCards";
export default function Payroll() {
  const [payroll, setPayroll] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);

  useEffect(() => {
    loadPayroll();
  }, []);

  async function loadPayroll() {
    try {
      const data = await getPayroll();
      setPayroll(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete payroll record?")) return;

    await deletePayroll(id);
    loadPayroll();
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
<PayrollDashboardCards payroll={payroll} />
        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold">
              Payroll
            </h1>

            <p className="text-slate-500">
              Employee payroll management.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedPayroll(null);
              setOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + Generate Payroll
          </button>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Payroll Records
          </h2>

          <table className="w-full border-collapse">

            <thead>

              <tr className="bg-gray-100 border-b">

                <th className="text-left p-3">Employee</th>
                <th className="text-left p-3">Month</th>
                <th className="text-left p-3">Gross Salary</th>
                <th className="text-left p-3">Net Salary</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>

              </tr>

            </thead>

            <tbody>

              {payroll.length === 0 ? (

                <tr>
                  <td
                    colSpan="6"
                    className="text-center p-6 text-gray-500"
                  >
                    No payroll records.
                  </td>
                </tr>

              ) : (

                payroll.map((record) => (

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
                      {record.payroll_month}
                    </td>

                    <td className="p-3">
                      R {Number(record.gross_salary).toFixed(2)}
                    </td>

                    <td className="p-3 font-semibold text-green-700">
                      R {Number(record.net_salary).toFixed(2)}
                    </td>

                    <td className="p-3">
                      {record.payment_status}
                    </td>

                    <td className="p-3 flex gap-2">

                      <button
                        onClick={() => {
                          setSelectedPayroll(record);
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

          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white rounded-xl p-6 w-full max-w-xl">

              <div className="flex justify-between mb-4">

                <h2 className="text-xl font-bold">
                  {selectedPayroll ? "Edit Payroll" : "Generate Payroll"}
                </h2>

                <button
                  onClick={() => {
                    setSelectedPayroll(null);
                    setOpen(false);
                  }}
                  className="text-red-600 font-bold"
                >
                  ✕
                </button>

              </div>

              <PayrollForm
                payroll={selectedPayroll}
                onPayrollAdded={() => {
                  loadPayroll();
                  setSelectedPayroll(null);
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