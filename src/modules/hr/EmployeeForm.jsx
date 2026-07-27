import { useState, useEffect } from "react";
import {
  addEmployee,
  updateEmployee,
} from "@/services/employeeService";
import { getDepartments } from "@/services/departmentService";
import { getPositions } from "@/services/positionService";

export default function EmployeeForm({
  employee,
  onEmployeeAdded,
}) {
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  const [formData, setFormData] = useState({
    employee_no: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    salary: "",
    employment_date: "",
    status: "Active",
  });

  useEffect(() => {
    loadDepartments();
    loadPositions();

    if (employee) {
      setFormData({
        employee_no: employee.employee_no || "",
        first_name: employee.first_name || "",
        last_name: employee.last_name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        department: employee.department || "",
        position: employee.position || "",
        salary: employee.salary || "",
        employment_date: employee.employment_date || "",
        status: employee.status || "Active",
      });
    } else {
      setFormData({
        employee_no: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        department: "",
        position: "",
        salary: "",
        employment_date: "",
        status: "Active",
      });
    }
  }, [employee]);

  async function loadDepartments() {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadPositions() {
    try {
      const data = await getPositions();
      setPositions(data);
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

    try {
      if (employee) {
        await updateEmployee(employee.id, formData);
      } else {
        await addEmployee(formData);
      }

      if (onEmployeeAdded) {
        onEmployeeAdded();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to save employee");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <input
        name="employee_no"
        placeholder="Employee Number"
        value={formData.employee_no}
        onChange={handleChange}
        className="w-full border rounded p-2"
        required
      />

      <input
        name="first_name"
        placeholder="First Name"
        value={formData.first_name}
        onChange={handleChange}
        className="w-full border rounded p-2"
        required
      />

      <input
        name="last_name"
        placeholder="Last Name"
        value={formData.last_name}
        onChange={handleChange}
        className="w-full border rounded p-2"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <select
        name="department"
        value={formData.department}
        onChange={handleChange}
        className="w-full border rounded p-2"
        required
      >
        <option value="">
          Select Department
        </option>

        {departments.map((department) => (
          <option
            key={department.id}
            value={department.name}
          >
            {department.name}
          </option>
        ))}
      </select>

      <select
        name="position"
        value={formData.position}
        onChange={handleChange}
        className="w-full border rounded p-2"
        required
      >
        <option value="">
          Select Position
        </option>

        {positions.map((position) => (
          <option
            key={position.id}
            value={position.title}
          >
            {position.title}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="salary"
        placeholder="Salary"
        value={formData.salary}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="date"
        name="employment_date"
        value={formData.employment_date}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="w-full border rounded p-2"
      >
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg"
      >
        {employee ? "Update Employee" : "Save Employee"}
      </button>

    </form>
  );
}