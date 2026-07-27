import { useState, useEffect } from "react";
import {
  addPosition,
  updatePosition,
} from "@/services/positionService";
import { getDepartments } from "@/services/departmentService";

export default function PositionForm({
  position,
  onPositionAdded,
}) {
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    salary_grade: "",
    description: "",
  });

  useEffect(() => {
    loadDepartments();

    if (position) {
      setFormData({
        title: position.title || "",
        department: position.department || "",
        salary_grade: position.salary_grade || "",
        description: position.description || "",
      });
    } else {
      setFormData({
        title: "",
        department: "",
        salary_grade: "",
        description: "",
      });
    }
  }, [position]);

  async function loadDepartments() {
    try {
      const data = await getDepartments();
      setDepartments(data);
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
      if (position) {
        await updatePosition(position.id, formData);
      } else {
        await addPosition(formData);
      }

      if (onPositionAdded) {
        onPositionAdded();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to save position");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <input
        name="title"
        placeholder="Position Title"
        value={formData.title}
        onChange={handleChange}
        className="w-full border rounded p-2"
        required
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

      <input
        name="salary_grade"
        placeholder="Salary Grade"
        value={formData.salary_grade}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        rows="4"
        className="w-full border rounded p-2"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg"
      >
        {position ? "Update Position" : "Save Position"}
      </button>

    </form>
  );
}