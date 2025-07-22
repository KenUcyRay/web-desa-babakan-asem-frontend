import { useEffect, useState } from "react";
import {
  FaNewspaper,
  FaCalendarAlt,
  FaComments,
  FaUsers,
} from "react-icons/fa";

import { NewsApi } from "../../libs/api/NewsApi";
import { AgendaApi } from "../../libs/api/AgendaApi";
import { MessageApi } from "../../libs/api/MessageApi";
import { UserApi } from "../../libs/api/UserApi";
import { alertError } from "../../libs/alert";

export default function AdminDashboard() {
  const [totalNews, setTotalNews] = useState(0);
  const [totalAgenda, setTotalAgenda] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  // ✅ Ambil semua berita lalu hitung panjangnya
  const fetchNewsCount = async () => {
    try {
      const res = await NewsApi.getOwnNews(1, 1000); // ambil max 1000
      const data = await res.json();
      if (!res.ok) throw new Error("Gagal ambil total berita");
      setTotalNews(data.news?.length ?? 0);
    } catch (err) {
      alertError(err.message);
    }
  };

  // ✅ Ambil semua agenda
  const fetchAgendaCount = async () => {
    try {
      const res = await AgendaApi.getOwnAgenda(1, 1000);
      const data = await res.json();
      if (!res.ok) throw new Error("Gagal ambil total agenda");
      setTotalAgenda(data.agenda?.length ?? 0);
    } catch (err) {
      alertError(err.message);
    }
  };

  // ✅ Ambil semua pesan
  const fetchMessagesCount = async () => {
    try {
      const res = await MessageApi.getMessages("?page=1&limit=1000");
      const data = await res.json();
      if (!res.ok) throw new Error("Gagal ambil total pesan");
      setTotalMessages(data.messages?.length ?? 0);
    } catch (err) {
      alertError(err.message);
    }
  };

  // ✅ Ambil semua user
  const fetchUserCount = async () => {
    try {
      const res = await UserApi.getAllUsers(1, 1000);
      const data = await res.json();
      if (!res.ok) throw new Error("Gagal ambil total user");
      setTotalUsers(data.users?.length ?? 0);
    } catch (err) {
      alertError(err.message);
    }
  };

  useEffect(() => {
    fetchNewsCount();
    fetchAgendaCount();
    fetchMessagesCount();
    fetchUserCount();
  }, []);

  return (
    <div className="w-full font-[Poppins,sans-serif]">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Dashboard Admin
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Berita */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center text-center">
          <FaNewspaper className="text-4xl text-green-500 mb-3" />
          <h2 className="text-lg font-semibold text-gray-700">Total Berita</h2>
          <p className="text-3xl font-bold text-green-500 mt-2">
            {totalNews}
          </p>
        </div>

        {/* Agenda */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center text-center">
          <FaCalendarAlt className="text-4xl text-blue-500 mb-3" />
          <h2 className="text-lg font-semibold text-gray-700">Agenda</h2>
          <p className="text-3xl font-bold text-blue-500 mt-2">
            {totalAgenda}
          </p>
        </div>

        {/* Pesan Masuk */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center text-center">
          <FaComments className="text-4xl text-orange-500 mb-3" />
          <h2 className="text-lg font-semibold text-gray-700">Pesan Masuk</h2>
          <p className="text-3xl font-bold text-orange-500 mt-2">
            {totalMessages}
          </p>
        </div>

        {/* User */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center text-center">
          <FaUsers className="text-4xl text-purple-500 mb-3" />
          <h2 className="text-lg font-semibold text-gray-700">User</h2>
          <p className="text-3xl font-bold text-purple-500 mt-2">
            {totalUsers}
          </p>
        </div>
      </div>
    </div>
  );
}
