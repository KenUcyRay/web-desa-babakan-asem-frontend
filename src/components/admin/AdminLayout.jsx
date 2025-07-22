import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { UserApi } from "../../libs/api/UserApi";
import AdminSidebar from "./AdminSidebar";
import { FaBars } from "react-icons/fa";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Cek Auth & Role
  const checkAuth = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      const response = await UserApi.getUserProfile();
      if (!response || response.status !== 200) {
        navigate("/login");
        return;
      }
      const data = await response.json();
      if (!data.user || data.user.role !== "ADMIN") {
        navigate("/");
        return;
      }
    } catch (err) {
      console.error("Auth error:", err);
      navigate("/login");
    }
  };

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ✅ SIDEBAR (desktop selalu tampil) */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
      >
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* ✅ OVERLAY untuk mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ✅ MAIN CONTENT */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen">
        {/* ✅ Topbar khusus mobile */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white shadow">
          <button
            className="text-gray-700 text-xl"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars />
          </button>
          <h1 className="font-semibold text-lg">Panel Admin</h1>
          <div className="w-6" /> {/* Spacer biar balance */}
        </div>

        {/* ✅ Outlet render halaman admin */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
