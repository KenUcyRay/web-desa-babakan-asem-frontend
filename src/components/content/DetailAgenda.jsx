import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarInfo from "../layout/SidebarInfo";
import { AgendaApi } from "../../libs/api/AgendaApi";
import { CommentApi } from "../../libs/api/CommentApi";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";
import { Helper } from "../../utils/Helper";
import { HiArrowLeft } from "react-icons/hi";
import { UserApi } from "../../libs/api/UserApi";
import { useTranslation, Trans } from "react-i18next";

export default function DetailAgenda() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [agenda, setAgenda] = useState({});
  const [comments, setComments] = useState([]);
  const [pesan, setPesan] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [user, setUser] = useState({});

  const handleKomentar = async (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      alert(
        <Trans i18nKey="detailAgenda.alert.mustLogin">
          ⚠ Please <strong>login</strong> first to post a comment!
        </Trans>
      );
      navigate("/login");
      return;
    }

    const response = await CommentApi.createComment(id, "AGENDA", pesan);
    const responseBody = await response.json();
    if (response.status !== 201) {
      await alertError(
        t("detailAgenda.alert.sendFailed", { error: responseBody.error })
      );
      return;
    }

    await alertSuccess(t("detailAgenda.alert.sendSuccess"));
    setPesan("");
    fetchComments();
  };

  const fetchDetailAgenda = async () => {
    const response = await AgendaApi.getDetailAgenda(id);
    const responseBody = await response.json();
    if (response.status === 200) {
      setAgenda(responseBody.agenda);
      setComments(responseBody.comments);
    } else {
      await alertError(t("detailAgenda.alert.loadFailed"));
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

  const fetchUser = async () => {
    const response = await UserApi.getUserProfile();
    const responseBody = await response.json();
    if (response.status === 200) {
      setUser(responseBody.user);
    }
  };

  useEffect(() => {
    fetchDetailAgenda();
    fetchUser();

    const interval = setInterval(() => {
      fetchComments();
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => navigate("/agenda"), 300);
  };

  const startEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const handleUpdateComment = async (commentId) => {
    const response = await CommentApi.updateComment(commentId, editingContent);
    const resBody = await response.json();

    if (response.status === 200) {
      await alertSuccess(t("detailAgenda.alert.updateSuccess"));
      setEditingCommentId(null);
      fetchComments();
    } else {
      await alertError(
        t("detailAgenda.alert.updateFailed", { error: resBody.error })
      );
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirm = await alertConfirm(t("detailAgenda.alert.deleteConfirm"));
    if (!confirm) return;

    const response = await CommentApi.deleteComment(commentId);
    const resBody = await response.json();

    if (response.status === 200) {
      await alertSuccess(t("detailAgenda.alert.deleteSuccess"));
      fetchComments();
    } else {
      await alertError(
        t("detailAgenda.alert.deleteFailed", { error: resBody.error })
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
          {t("detailAgenda.back")}
        </button>

        <img
          src={`${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
            agenda.featured_image
          }`}
          alt="Detail Agenda"
          className="w-full h-96 object-cover rounded-lg mb-6"
        />

        <h1 className="text-2xl font-bold mb-3">{agenda.title}</h1>
        <p className="text-sm text-gray-500 mb-6">
          📅 {Helper.formatTanggal(agenda.start_time)} -{" "}
          {Helper.formatTanggal(agenda.end_time)} | 📍 {agenda.location} | 👁{" "}
          {agenda.view_count} {t("detailAgenda.viewed")}
        </p>

        <div className="space-y-4 text-gray-800 leading-relaxed">
          <p>{agenda.content}</p>
        </div>

        <div className="mt-10 p-6 bg-gray-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            {t("detailAgenda.leaveComment")}
          </h2>

          <form className="space-y-4" onSubmit={handleKomentar}>
            <textarea
              placeholder={t("detailAgenda.placeholder")}
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
              {t("detailAgenda.sendComment")}
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
                        {t("detailAgenda.save")}
                      </button>
                      <button
                        onClick={() => setEditingCommentId(null)}
                        className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
                      >
                        {t("detailAgenda.cancel")}
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
                            {t("detailAgenda.edit")}
                          </button>
                        )}
                        {(user.id === c.user.id || user.role === "ADMIN") && (
                          <button
                            onClick={() => handleDeleteComment(c.id)}
                            className="text-red-500 text-sm hover:underline"
                          >
                            {t("detailAgenda.delete")}
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
                {t("detailAgenda.noComment")}
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
