import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaClock, FaCalendarAlt, FaTag } from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi";
import SidebarInfo from "../layout/SidebarInfo";
import { AgendaApi } from "../../libs/api/AgendaApi";
import { CommentApi } from "../../libs/api/CommentApi";
import { Helper } from "../../utils/Helper";
import { alertError, alertSuccess } from "../../libs/alert";

export default function DetailAgenda() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agenda, setAgenda] = useState({});
  const [comments, setComments] = useState([]);
  const [pesan, setPesan] = useState("");

  const handleKomentar = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("token"));
    if (!user) {
      alert("⚠ Silakan login dulu untuk memberikan komentar!");
      navigate("/login");
      return;
    }

    const response = await CommentApi.createComment(id, "AGENDA", pesan);
    const responseBody = await response.json();
    if (response.status !== 201) {
      await alertError(
        `Gagal mengirim komentar. Silakan coba lagi nanti. ${responseBody.error}`
      );
      return;
    }

    await alertSuccess("Komentar berhasil dikirim!");
    setPesan("");
  };

  const fetchDetailAgenda = async () => {
    const response = await AgendaApi.getDetailAgenda(id);
    const responseBody = await response.json();
    if (response.status === 200) {
      setAgenda(responseBody.agenda);
      setComments(responseBody.comments);
    } else {
      await alertError(`Gagal mengambil detail agenda. Silakan coba lagi nanti.`);
      navigate("/agenda");
    }
  };

  const fetchComment = async () => {
    const response = await CommentApi.getComments(id);
    const responseBody = await response.json();
    if (response.status === 200) {
      setComments(responseBody.comments);
    } else {
      await alertError(`Gagal mengambil comment. Silakan coba lagi nanti.`);
    }
  };

  useEffect(() => {
    fetchDetailAgenda();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchComment();
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => navigate("/agenda"), 300);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6 font-poppins">
      {/* ✅ Konten utama */}
      <div className="md:col-span-3">
        {/* ✅ Tombol Back smooth */}
        <button
          onClick={handleBack}
          className="mb-5 flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-gray-800 hover:bg-gray-900 hover:text-white hover:scale-105 transition-all duration-300"
        >
          <HiArrowLeft className="text-lg" />
          Kembali
        </button>

        {/* ✅ Gambar Utama */}
        <img
          src={`${import.meta.env.VITE_BASE_URL}/agenda/images/${agenda.featured_image}`}
          alt={agenda.title}
          className="w-full h-96 object-cover rounded-lg mb-6"
        />

        {/* ✅ Info Penting */}
        <div className="bg-green-50 p-5 rounded-lg shadow mb-6 border-l-4 border-green-500">
          <h1 className="text-3xl font-bold mb-3">{agenda.title}</h1>

          <div className="flex flex-wrap gap-4 text-sm text-gray-700">
            {agenda?.start_time &&
              (() => {
                const { tanggal, waktu } = Helper.formatAgendaDateTime(
                  agenda.start_time,
                  agenda.end_time
                );
                return (
                  <>
                    <span className="flex items-center gap-2">
                      <FaCalendarAlt className="text-green-600" /> {tanggal}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaClock className="text-green-600" /> {waktu}
                    </span>
                  </>
                );
              })()}

            <span className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-green-600" /> {agenda.location}
            </span>
            <span className="flex items-center gap-2">
              <FaTag className="text-green-600" /> {agenda.type}
            </span>
          </div>
        </div>

        {/* ✅ Deskripsi Agenda */}
        <div className="space-y-4 text-gray-800 leading-relaxed bg-white p-6 rounded-lg shadow">
          <p>{agenda.content}</p>
        </div>

        {/* ✅ Komentar */}
        <div className="mt-10 p-6 bg-gray-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">💬 Tinggalkan Komentar</h2>

          <form className="space-y-4" onSubmit={handleKomentar}>
            <textarea
              placeholder="Tulis komentar kamu..."
              rows="4"
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-300"
              required
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Kirim Komentar
            </button>
          </form>

          {/* ✅ List Komentar */}
          <div className="mt-6 space-y-4">
            {comments.map((c, i) => (
              <div key={i} className="p-4 bg-white rounded-lg shadow">
                <p className="text-sm text-gray-700">{c.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  ✍ {c.user.name} • {Helper.formatTanggal(c.updated_at)}
                </p>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-center text-gray-400">Belum ada komentar</p>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Sidebar */}
      <aside>
        <SidebarInfo />
      </aside>
    </div>
  );
}
