import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { UserApi } from "../../libs/api/UserApi";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const checkAuth = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    const response = await UserApi.getUserProfile();
    if (response.status !== 200) {
      navigate("/login");
      return;
    }
    const responseBody = await response.json();
    if (responseBody.user.role !== "ADMIN") {
      navigate("/");
      return;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ✅ Sidebar Admin */}
      <AdminSidebar />

      {/* ✅ Konten Admin */}
      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
