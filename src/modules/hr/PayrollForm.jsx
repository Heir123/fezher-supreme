import { useEffect, useState } from "react";
import { getEmployees } from "@/services/employeeService";
import {
  addPayroll,
  updatePayroll,
} from "@/services/payrollService";

export default function PayrollForm({
  payroll,
  onPayrollAdded,
}) {
  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    employee_id: "",
    payroll_month: "",
    basic_salary: 0,
    overtime: 0,
    bonus: 0,
    allowances: 0,
    tax: 0,
    pension: 0,
    medical: 0,
    other_deductions: 0,
  });

 useEffect(() => {
  loadEmployees();

  if (payroll) {
    setFormData({
      employee_id: payroll.employee_id || "",
      payroll_month: payroll.payroll_month || "",
      basic_salary: payroll.basic_salary || 0,
      overtime: payroll.overtime || 0,
      bonus: payroll.bonus || 0,
      allowances: payroll.allowances || 0,
      tax: payroll.tax || 0,
      pension: payroll.pension || 0,
      medical: payroll.medical || 0,
      other_deductions: payroll.other_deductions || 0,
    });
  } else {
    setFormData({
      employee_id: "",
      payroll_month: "",
      basic_salary: 0,
      overtime: 0,
      bonus: 0,
      allowances: 0,
      tax: 0,
      pension: 0,
      medical: 0,
      other_deductions: 0,
    });
  }
}, [payroll]);

async function loadEmployees() {
  try {
    const data = await getEmployees();
    setEmployees(data);
  } catch (error) {
    console.error(error);
  }
}

function handleChange(e) {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
}
 async function handleSubmit(e) {
  e.preventDefault();

  const gross =
    Number(formData.basic_salary) +
    Number(formData.overtime) +
    Number(formData.bonus) +
    Number(formData.allowances);

  const deductions =
    Number(formData.tax) +
    Number(formData.pension) +
    Number(formData.medical) +
    Number(formData.other_deductions);

  const net = gross - deductions;

  const payrollData = {
    ...formData,
    gross_salary: gross,
    net_salary: net,
  };

  if (payroll) {
    await updatePayroll(payroll.id, payrollData);
  } else {
    await addPayroll(payrollData);
  }

  onPayrollAdded();
}
  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <select
        name="employee_id"
        value={formData.employee_id}
        onChange={handleChange}
        className="w-full border rounded p-2"
        required
      >
        <option value="">Select Employee</option>

        {employees.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employee.employee_no} - {employee.first_name} {employee.last_name}
          </option>
        ))}

      </select>

      <input
        type="month"
        name="payroll_month"
        value={formData.payroll_month}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="number"
        name="basic_salary"
        placeholder="Basic Salary"
        value={formData.basic_salary}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="number"
        name="overtime"
        placeholder="Overtime"
        value={formData.overtime}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="number"
        name="bonus"
        placeholder="Bonus"
        value={formData.bonus}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="number"
        name="allowances"
        placeholder="Allowances"
        value={formData.allowances}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="number"
        name="tax"
        placeholder="Tax"
        value={formData.tax}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="number"
        name="pension"
        placeholder="Pension"
        value={formData.pension}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="number"
        name="medical"
        placeholder="Medical Aid"
        value={formData.medical}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="number"
        name="other_deductions"
        placeholder="Other Deductions"
        value={formData.other_deductions}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <button
  type="submit"
  className="w-full bg-blue-600 text-white py-2 rounded-lg"
>
  {payroll ? "Update Payroll" : "Save Payroll"}
</button>

    </form>
  );
}