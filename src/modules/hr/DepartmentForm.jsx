import { useState, useEffect } from "react";
import {
  addDepartment,
  updateDepartment,
} from "@/services/departmentService";

export default function DepartmentForm({
  department,
  onDepartmentAdded,
}) {
  const [formData, setFormData] = useState({
    name: "",
    manager: "",
    description: "",
  });

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || "",
        manager: department.manager || "",
        description: department.description || "",
      });
    } else {
      setFormData({
        name: "",
        manager: "",
        description: "",
      });
    }
  }, [department]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (department) {
        await updateDepartment(department.id, formData);
      } else {
        await addDepartment(formData);
      }

      if (onDepartmentAdded) {
        onDepartmentAdded();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save department");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <input
        name="name"
        placeholder="Department Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full border rounded p-2"
        required
      />

      <input
        name="manager"
        placeholder="Department Manager"
        value={formData.manager}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <textarea
        name="description"
        placeholder="Department Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full border rounded p-2"
        rows="4"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg"
      >
        {department ? "Update Department" : "Save Department"}
      </button>

    </form>
  );
}