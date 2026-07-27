import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "@/services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await signIn(
        formData.email,
        formData.password
      );

      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4"
      >

        <h1 className="text-3xl font-bold text-center">
          Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded p-3"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border rounded p-3"
          required
        />

        <button
          className="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          Login
        </button>

        <p className="text-center">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600"
          >
            Create one
          </Link>
        </p>

      </form>

    </div>
  );
}