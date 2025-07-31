import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarInfo from "../layout/SidebarInfo";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";
import { Helper } from "../../utils/Helper";
import { CommentApi } from "../../libs/api/CommentApi";
import { HiArrowLeft } from "react-icons/hi";
import { UserApi } from "../../libs/api/UserApi";
import { useTranslation } from "react-i18next";

export default function DetailPrestasi() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [achievement, setAchievement] = useState({});
  const [comments, setComments] = useState([]);
  const [pesan, setPesan] = useState("");

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const handleKomentar = async (e) => {
    e.preventDefault();

    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      alert(t("detailNews.alert.needLogin"));
      navigate("/login");
      return;
    }

    const response = await CommentApi.createComment(id, "ACHIEVEMENT", pesan);
    const responseBody = await response.json();
    if (response.status !== 201) {
      await alertError(
        t("detailNews.alert.commentFail", { error: responseBody.error })
      );
      return;
    }

    await alertSuccess(t("detailNews.alert.commentSuccess"));
    setPesan("");
    fetchComment();
  };

  const fetchDetailPrestasi = async () => {
    try {
      // Ambil data prestasi dari translation berdasarkan ID
      const achievements = t("profileVillage.achievements", { returnObjects: true });
      const selectedAchievement = achievements.find(item => item.id === id);
      
      if (selectedAchievement) {
        setAchievement(selectedAchievement);
        fetchComment();
      } else {
        await alertError("Prestasi tidak ditemukan");
        navigate("/profil-desa");
      }
    } catch (error) {
      await alertError("Gagal mengambil detail prestasi");
      navigate("/profil-desa");
    }
  };

  const fetchComment = async () => {
    const response = await CommentApi.getComments(id);
    const responseBody = await response.json();
    if (response.status === 200) {
      setComments(responseBody.comments);
    } else {
      await alertError(t("detailNews.alert.fetchCommentError"));
    }
  };

  useEffect(() => {
    fetchDetailPrestasi();
  }, [id]);

  const [user, setUser] = useState({});

  const fetchUser = async () => {
    const response = await UserApi.getUserProfile();
    const responseBody = await response.json();
    if (response.status === 200) {
      setUser(responseBody.user);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchComment();
    }, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => navigate("/profil-desa"), 300);
  };

  const startEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const handleUpdateComment = async (commentId) => {
    const response = await CommentApi.updateComment(commentId, editingContent);
    const resBody = await response.json();

    if (response.status === 200) {
      await alertSuccess(t("detailNews.alert.commentUpdateSuccess"));
      setEditingCommentId(null);
      fetchComment();
    } else {
      await alertError(
        t("detailNews.alert.commentUpdateFail", { error: resBody.error })
      );
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!(await alertConfirm(t("detailNews.alert.confirmDelete")))) return;

    const response = await CommentApi.deleteComment(commentId);
    const resBody = await response.json();

    if (response.status === 200) {
      await alertSuccess(t("detailNews.alert.commentDeleteSuccess"));
      fetchComment();
    } else {
      await alertError(
        t("detailNews.alert.commentDeleteFail", { error: resBody.error })
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6 font-poppins">
      <div className="md:col-span-3">
        <button
          onClick={handleBack}
          className="mb-5 flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-gray-800 hover:bg-gray-900 hover:text-white hover:scale-105 transition-all duration-300"
        >
          <HiArrowLeft className="text-lg" />
          Kembali ke Profil Desa
        </button>

        {/* Achievement Image */}
        <img
          src={achievement.image}
          alt={achievement.title}
          className="w-full h-96 object-cover rounded-lg mb-6 shadow-lg"
        />

        {/* Achievement Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-gradient-to-r from-[#9BEC00] to-[#D2FF72] text-gray-900 shadow">
              Prestasi Desa
            </span>
            <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
              {achievement.year}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            {achievement.title}
          </h1>
        </div>

        {/* Achievement Content */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Detail Prestasi</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>{achievement.description}</p>
            {achievement.details && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Informasi Tambahan:</h3>
                <p className="text-sm text-gray-600">{achievement.details}</p>
              </div>
            )}
          </div>
        </div>

        {/* Achievement Stats */}
        {achievement.stats && (
          <div className="bg-gradient-to-br from-[#f7ffe5] to-white p-6 rounded-xl shadow-md mb-8">
            <h3 className="text-lg font-bold text-green-700 mb-4">Statistik Prestasi</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {achievement.stats.map((stat, index) => (
                <div key={index} className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-green-600">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-10 p-6 bg-gray-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            {t("detailNews.leaveComment")}
          </h2>

          <form className="space-y-4" onSubmit={handleKomentar}>
            <textarea
              placeholder="Berikan komentar atau apresiasi Anda tentang prestasi ini..."
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
              {t("detailNews.sendComment")}
            </button>
          </form>

          <div className="mt-6 space-y-4">
            {comments.map((c, i) => (
              <div key={i} className="p-4 bg-white rounded-lg shadow">
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
                        {t("detailNews.save")}
                      </button>
                      <button
                        onClick={() => setEditingCommentId(null)}
                        className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
                      >
                        {t("detailNews.cancel")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-700">{c.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      ✍ {c.user.name} • {Helper.formatTanggal(c.updated_at)}
                    </p>

                    {user && (
                      <div className="flex gap-3 mt-2">
                        {user.id === c.user.id && (
                          <button
                            onClick={() => startEditComment(c)}
                            className="text-blue-500 text-sm hover:underline"
                          >
                            {t("detailNews.edit")}
                          </button>
                        )}

                        {(user.id === c.user.id || user.role === "ADMIN") && (
                          <button
                            onClick={() => handleDeleteComment(c.id)}
                            className="text-red-500 text-sm hover:underline"
                          >
                            {t("detailNews.delete")}
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-center text-gray-400">
                Belum ada komentar. Jadilah yang pertama memberikan apresiasi!
              </p>
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