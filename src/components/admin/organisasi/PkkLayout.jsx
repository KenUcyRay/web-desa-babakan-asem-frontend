import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaBars } from "react-icons/fa";

import { useAuth } from "../../../contexts/AuthContext";
import { UserApi } from "../../../libs/api/UserApi";
import PkkSidebar from "./PkkSidebar";

const PkkLayout = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile, setProfile } = useAuth();

  // - Cek Auth & Role
  const checkAuth = async () => {
    const response = await UserApi.profile(i18n.language);
    const responseBody = await response.json();
    if (!response.ok || responseBody.data.role !== "PKK") {
      navigate("/");
      return;
    }
    setProfile(responseBody.data);
  };

  useEffect(() => {
    checkAuth();
  }, [i18n.language]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* - SIDEBAR (desktop selalu tampil) */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
      >
        <PkkSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      {/* - OVERLAY untuk mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* - MAIN CONTENT */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen">
        {/* - Topbar khusus mobile */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white shadow">
          <button
            className="text-gray-700 text-xl"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars />
          </button>
          <h1 className="font-semibold text-lg">{t("adminLayout.title")}</h1>
          <div className="w-6" /> {/* Spacer biar balance */}
        </div>

        {/* - Outlet render halaman admin */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PkkLayout;
