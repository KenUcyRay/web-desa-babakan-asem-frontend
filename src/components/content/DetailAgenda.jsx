import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarInfo from "../layout/SidebarInfo";
import { AgendaApi } from "../../libs/api/AgendaApi";
import { CommentApi } from "../../libs/api/CommentApi";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";
import { Helper } from "../../utils/Helper";
import { HiArrowLeft } from "react-icons/hi";

export default function DetailAgenda() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agenda, setAgenda] = useState({});
  const [comments, setComments] = useState([]);
  const [pesan, setPesan] = useState("");

  // ✅ State edit komentar
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

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
    fetchComments(); // refresh
  };

  const fetchDetailAgenda = async () => {
    const response = await AgendaApi.getDetailAgenda(id);
    const responseBody = await response.json();
    if (response.status === 200) {
      setAgenda(responseBody.agenda);
      setComments(responseBody.comments);
    } else {
      await alertError(
        `Gagal mengambil detail agenda. Silakan coba lagi nanti.`
      );
      navigate("/agenda");
    }
  };

  const fetchComments = async () => {
    const response = await CommentApi.getComments(id);
    const responseBody = await response.json();
    if (response.status === 200) {
      setComments(responseBody.comments);
    }
  };

  useEffect(() => {
    fetchDetailAgenda();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchComments();
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => navigate("/agenda"), 300);
  };

  // ✅ mulai edit
  const startEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  // ✅ simpan edit
  const handleUpdateComment = async (commentId) => {
    const response = await CommentApi.updateComment(commentId, editingContent);
    const resBody = await response.json();

    if (response.status === 200) {
      await alertSuccess("Komentar berhasil diupdate!");
      setEditingCommentId(null);
      fetchComments();
    } else {
      await alertError(`Gagal update komentar: ${resBody.error}`);
    }
  };

  // ✅ hapus komentar
  const handleDeleteComment = async (commentId) => {
    if (!(await alertConfirm("Yakin ingin menghapus komentar ini?"))) return;

    const response = await CommentApi.deleteComment(commentId);
    const resBody = await response.json();

    if (response.status === 200) {
      await alertSuccess("Komentar berhasil dihapus!");
      fetchComments();
    } else {
      await alertError(`Gagal hapus komentar: ${resBody.error}`);
    }
  };

  // ✅ User login dari localStorage
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6 font-poppins">
      {/* Konten utama */}
      <div className="md:col-span-3">
        <button
          onClick={handleBack}
          className="mb-5 flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-gray-800 hover:bg-gray-900 hover:text-white hover:scale-105 transition-all duration-300"
        >
          <HiArrowLeft className="text-lg" />
          Kembali
        </button>

        {/* Gambar */}
        <img
          src={`${import.meta.env.VITE_BASE_URL}/agenda/images/${
            agenda.featured_image
          }`}
          alt="Detail Agenda"
          className="w-full h-96 object-cover rounded-lg mb-6"
        />

        {/* Judul & info */}
        <h1 className="text-2xl font-bold mb-3">{agenda.title}</h1>
        <p className="text-sm text-gray-500 mb-6">
          📅 {Helper.formatTanggal(agenda.start_time)} -{" "}
          {Helper.formatTanggal(agenda.end_time)} | 📍 {agenda.location} | 👁{" "}
          {agenda.view_count} Dilihat
        </p>

        <div className="space-y-4 text-gray-800 leading-relaxed">
          <p>{agenda.content}</p>
        </div>

        {/* Komentar */}
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

          {/* List Komentar */}
          <div className="mt-6 space-y-4">
            {comments.map((c, i) => (
              <div key={i} className="p-4 bg-white rounded-lg shadow">
                {/* Kalau sedang edit */}
                {editingCommentId === c.id ? (
                  <div className="space-y-2">
                    <textarea
                      className="w-full p-2 border rounded"
                      rows="3"
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateComment(c.id)}
                        className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Simpan
                      </button>
                      <button
                        onClick={() => setEditingCommentId(null)}
                        className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-700">{c.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      ✍ {c.user.name} • {Helper.formatTanggal(c.updated_at)}
                    </p>

                    {loggedInUser && (
                      <div className="flex gap-3 mt-2">
                        {/* Edit hanya bisa dilakukan oleh pemilik komentar */}
                        {loggedInUser.id === c.user.id && (
                          <button
                            onClick={() => startEditComment(c)}
                            className="text-blue-500 text-sm hover:underline"
                          >
                            Edit
                          </button>
                        )}

                        {/* Hapus bisa dilakukan oleh pemilik komentar atau admin */}
                        {(loggedInUser.id === c.user.id ||
                          loggedInUser.role === "ADMIN") && (
                          <button
                            onClick={() => handleDeleteComment(c.id)}
                            className="text-red-500 text-sm hover:underline"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-center text-gray-400">Belum ada komentar</p>
            )}
          </div>
        </div>
      </div>

      <aside>
        <SidebarInfo />
      </aside>
    </div>
  );
}
