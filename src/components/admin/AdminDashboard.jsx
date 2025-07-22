import { FaNewspaper, FaCalendarAlt, FaComments, FaUsers } from "react-icons/fa";

export default function AdminDashboard() {
  return (
    <div className="w-full">
      {/* ✅ Judul */}
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Dashboard Admin
      </h1>

      {/* ✅ Card Statistik (responsive grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Berita */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center text-center">
          <FaNewspaper className="text-4xl text-green-500 mb-3" />
          <h2 className="text-lg font-semibold text-gray-700">Total Berita</h2>
          <p className="text-3xl font-bold text-green-500 mt-2">25</p>
        </div>

        {/* Agenda */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center text-center">
          <FaCalendarAlt className="text-4xl text-blue-500 mb-3" />
          <h2 className="text-lg font-semibold text-gray-700">Agenda</h2>
          <p className="text-3xl font-bold text-blue-500 mt-2">12</p>
        </div>

        {/* Pesan Masuk */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center text-center">
          <FaComments className="text-4xl text-orange-500 mb-3" />
          <h2 className="text-lg font-semibold text-gray-700">Pesan Masuk</h2>
          <p className="text-3xl font-bold text-orange-500 mt-2">8</p>
        </div>

        {/* User */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center text-center">
          <FaUsers className="text-4xl text-purple-500 mb-3" />
          <h2 className="text-lg font-semibold text-gray-700">User</h2>
          <p className="text-3xl font-bold text-purple-500 mt-2">5</p>
        </div>
      </div>
    </div>
  );
}
