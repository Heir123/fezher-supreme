import { useEffect, useState } from "react";
import {
  addAttendance,
  updateAttendance,
} from "@/services/attendanceService";
import { getEmployees } from "@/services/employeeService";

export default function AttendanceForm({
  attendance,
  onAttendanceAdded,
}) {
  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    employee_id: "",
    attendance_date: new Date().toISOString().slice(0, 10),
    clock_in: "",
    clock_out: "",
    status: "Present",
  });

  useEffect(() => {
    loadEmployees();

    if (attendance) {
      setFormData({
        employee_id: attendance.employee_id || "",
        attendance_date: attendance.attendance_date || "",
        clock_in: attendance.clock_in
          ? attendance.clock_in.substring(11, 16)
          : "",
        clock_out: attendance.clock_out
          ? attendance.clock_out.substring(11, 16)
          : "",
        status: attendance.status || "Present",
      });
    } else {
      setFormData({
        employee_id: "",
        attendance_date: new Date().toISOString().slice(0, 10),
        clock_in: "",
        clock_out: "",
        status: "Present",
      });
    }
  }, [attendance]);

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

    try {
      let hoursWorked = null;

      if (formData.clock_in && formData.clock_out) {
        const start = new Date(
          `${formData.attendance_date}T${formData.clock_in}`
        );

        const end = new Date(
          `${formData.attendance_date}T${formData.clock_out}`
        );

        hoursWorked =
          (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      }

      const attendanceData = {
        employee_id: formData.employee_id,
        attendance_date: formData.attendance_date,
        clock_in: formData.clock_in
          ? `${formData.attendance_date}T${formData.clock_in}:00`
          : null,
        clock_out: formData.clock_out
          ? `${formData.attendance_date}T${formData.clock_out}:00`
          : null,
        status: formData.status,
        hours_worked: hoursWorked,
      };

      if (attendance) {
        await updateAttendance(attendance.id, attendanceData);
      } else {
        await addAttendance(attendanceData);
      }

      if (onAttendanceAdded) {
        onAttendanceAdded();
      }

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
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
        <option value="">
          Select Employee
        </option>

        {employees.map((employee) => (
          <option
            key={employee.id}
            value={employee.id}
          >
            {employee.employee_no} - {employee.first_name} {employee.last_name}
          </option>
        ))}
      </select>

      <input
        type="date"
        name="attendance_date"
        value={formData.attendance_date}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="time"
        name="clock_in"
        value={formData.clock_in}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="time"
        name="clock_out"
        value={formData.clock_out}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="w-full border rounded p-2"
      >
        <option value="Present">Present</option>
        <option value="Absent">Absent</option>
        <option value="Leave">Leave</option>
        <option value="Sick">Sick</option>
      </select>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg"
      >
        {attendance ? "Update Attendance" : "Save Attendance"}
      </button>

    </form>
  );
}