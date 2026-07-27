import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "@/services/authService";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    }

    loadUser();
  }, []);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">

      <div>
        <h1 className="text-xl font-bold">
          Fezher Supreme ERP
        </h1>
      </div>

      <div className="flex items-center gap-5">

        <span className="text-gray-700">
          {user?.user_metadata?.full_name}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>

    </header>
  );
}