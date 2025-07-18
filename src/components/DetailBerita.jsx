import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarInfo from "./SidebarInfo";
import { NewsApi } from "../libs/api/NewsApi";
import { alertError, alertSuccess } from "../libs/alert";
import { Helper } from "../utils/Helper";
import { CommentApi } from "../libs/api/CommentApi";

export default function DetailBerita() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState({});
  const [userCreated, setUserCreated] = useState({});
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

    const response = await CommentApi.createComment(id, "NEWS", pesan);
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

  const fetchDetailBerita = async () => {
    const response = await NewsApi.getDetailNews(id);
    const responseBody = await response.json();
    if (response.status === 200) {
      setNews(responseBody.news);
      setUserCreated(responseBody.user_created);
      setComments(responseBody.comments);
    } else {
      await alertError(
        `Gagal mengambil detail berita. Silakan coba lagi nanti.`
      );
      navigate("/berita");
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
    fetchDetailBerita();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchComment();
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* ✅ Konten utama */}
      <div className="md:col-span-3">
        <img
          src={`${import.meta.env.VITE_BASE_URL}/news/images/${
            news.featured_image
          }`}
          alt="Detail Berita"
          className="w-full h-96 object-cover rounded-lg mb-6"
        />
        <h1 className="text-2xl font-bold mb-3">{news.title}</h1>
        <p className="text-sm text-gray-500 mb-6">
          Oleh {userCreated.name} | Tanggal:{" "}
          {Helper.formatTanggal(news.published_at)} | 👁 {news.view_count}{" "}
          Dilihat
        </p>

        <div className="space-y-4 text-gray-800 leading-relaxed">
          <p>{news.content}</p>
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
