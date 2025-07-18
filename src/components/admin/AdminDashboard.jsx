import { FaNewspaper, FaCalendarAlt, FaComments, FaUsers } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";

export default function AdminDashboard() {
  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 p-6 w-full">
        <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

        {/* Card Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center">
            <FaNewspaper className="text-4xl text-green-500 mb-2" />
            <h2 className="text-lg font-semibold text-gray-700">Total Berita</h2>
            <p className="text-3xl font-bold text-green-500 mt-2">25</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center">
            <FaCalendarAlt className="text-4xl text-blue-500 mb-2" />
            <h2 className="text-lg font-semibold text-gray-700">Agenda</h2>
            <p className="text-3xl font-bold text-blue-500 mt-2">12</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center">
            <FaComments className="text-4xl text-orange-500 mb-2" />
            <h2 className="text-lg font-semibold text-gray-700">Pesan Masuk</h2>
            <p className="text-3xl font-bold text-orange-500 mt-2">8</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center">
            <FaUsers className="text-4xl text-purple-500 mb-2" />
            <h2 className="text-lg font-semibold text-gray-700">User</h2>
            <p className="text-3xl font-bold text-purple-500 mt-2">5</p>
          </div>
        </div>
      </div>
    </div>
  );
}
