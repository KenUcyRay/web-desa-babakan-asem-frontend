import { Link, Outlet, useLocation } from "react-router-dom";

export default function KelolaInfografis() {
  const location = useLocation();

  const tabs = [
    { to: "/admin/manage-infografis/penduduk", label: "Penduduk" },
    { to: "/admin/manage-infografis/idm", label: "IDM" },
    { to: "/admin/manage-infografis/sdgs", label: "SDGs" },
    { to: "/admin/manage-infografis/bansos", label: "Bansos" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Kelola Infografis Desa</h1>

      {/* ✅ Tab Navigasi */}
      <div className="flex gap-4 mb-6 border-b">
        {tabs.map((tab) => {
          const active = location.pathname === tab.to;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`pb-2 ${
                active
                  ? "border-b-2 border-green-500 text-green-600 font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* ✅ Outlet untuk render halaman child */}
      <Outlet />
    </div>
  );
}
