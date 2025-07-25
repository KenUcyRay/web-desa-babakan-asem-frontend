import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarInfo from "../layout/SidebarInfo";
import { NewsApi } from "../../libs/api/NewsApi";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";
import { Helper } from "../../utils/Helper";
import { CommentApi } from "../../libs/api/CommentApi";
import { HiArrowLeft } from "react-icons/hi";
import { UserApi } from "../../libs/api/UserApi";
import { useTranslation } from "react-i18next";

export default function DetailBerita() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState({});
  const [userCreated, setUserCreated] = useState({});
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

    const response = await CommentApi.createComment(id, "NEWS", pesan);
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

  const fetchDetailBerita = async () => {
    const response = await NewsApi.getDetailNews(id);
    const responseBody = await response.json();
    if (response.status === 200) {
      setNews(responseBody.news);
      setUserCreated(responseBody.user_created);
      setComments(responseBody.comments);
    } else {
      await alertError(t("detailNews.alert.fetchError"));
      navigate("/berita");
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
    fetchDetailBerita();
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
    setTimeout(() => navigate("/berita"), 300);
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
          {t("detailNews.back")}
        </button>

        <img
          src={`${import.meta.env.VITE_BASE_URL}/news/images/${
            news.featured_image
          }`}
          alt="Detail Berita"
          className="w-full h-96 object-cover rounded-lg mb-6"
        />

        <h1 className="text-2xl font-bold mb-3">{news.title}</h1>
        <p className="text-sm text-gray-500 mb-6">
          {t("detailNews.postedBy", {
            name: userCreated.name,
            date: Helper.formatTanggal(news.published_at),
            views: news.view_count,
          })}
        </p>

        <div className="space-y-4 text-gray-800 leading-relaxed">
          <p>{news.content}</p>
        </div>

        <div className="mt-10 p-6 bg-gray-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            {t("detailNews.leaveComment")}
          </h2>

          <form className="space-y-4" onSubmit={handleKomentar}>
            <textarea
              placeholder={t("detailNews.writeComment")}
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
                {t("detailNews.noComment")}
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
