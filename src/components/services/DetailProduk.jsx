import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation, Trans } from "react-i18next";
import { FaWhatsapp, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi";
import SidebarProduk from "../layout/SidebarProduk";
import { Helper } from "../../utils/Helper";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";
import { CommentApi } from "../../libs/api/CommentApi";
import { ProductApi } from "../../libs/api/ProductApi";
import { UserApi } from "../../libs/api/UserApi";

export default function DetailProduk() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({});
  const [comments, setComments] = useState([]);
  const [pesan, setPesan] = useState("");
  const [averageRating, setAverageRating] = useState(0);
  const [userTempRating, setUserTempRating] = useState(0);
  const [userRated, setUserRated] = useState(false);
  const [userRatingId, setUserRatingId] = useState(null);
  const [showSubmitRating, setShowSubmitRating] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [user, setUser] = useState({});
  const userToken = JSON.parse(localStorage.getItem("token"));
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const fetchDetailProduct = async () => {
    const res = await ProductApi.getDetailProduct(id);
    const body = await res.json();
    if (res.status === 200) {
      setProduct(body.product);
      setAverageRating(body.rating ?? 0);
      setComments(body.comments ?? []);
    } else {
      await alertError("Gagal mengambil detail product.");
      navigate("/bumdes");
    }
  };

  const fetchComment = async () => {
    const res = await CommentApi.getComments(id);
    const body = await res.json();
    if (res.status === 200) {
      setComments(body.comments);
    }
  };

  const checkUserRated = async () => {
    if (!userToken) return;
    const res = await ProductApi.alreadyRated(id);
    const body = await res.json();
    if (res.ok) {
      setUserRated(true);
      setUserTempRating(body.rating);
      setUserRatingId(body.id);
    }
  };

  useEffect(() => {
    fetchDetailProduct();
    checkUserRated();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(fetchComment, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchUser = async () => {
    const res = await UserApi.getUserProfile();
    const body = await res.json();
    if (res.status === 200) {
      setUser(body.user);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleKomentar = async (e) => {
    e.preventDefault();
    if (!userToken) {
      await alertError("⚠ Silakan login dulu.");
      return navigate("/login");
    }
    const res = await CommentApi.createComment(id, "PRODUCT", pesan);
    const body = await res.json();
    if (res.status !== 201) {
      return await alertError(`Gagal kirim: ${body.error}`);
    }
    await alertSuccess("Komentar berhasil dikirim!");
    setPesan("");
    fetchComment();
  };

  const handleSelectStar = (val) => {
    if (!userToken) {
      alertError("Silakan login dulu.");
      return navigate("/login");
    }
    setUserTempRating(val);
    setShowSubmitRating(true);
  };

  const handleSubmitRating = async () => {
    let res;
    if (!userRated) {
      res = await ProductApi.createRating(id, userTempRating);
      if (!res.ok) return alertError("Gagal kirim rating.");
      alertSuccess(`Terima kasih! ${userTempRating} ⭐`);
    } else {
      res = await ProductApi.updateRating(userRatingId, userTempRating);
      if (!res.ok) return alertError("Gagal update rating.");
      alertSuccess(`Rating diupdate jadi ${userTempRating} ⭐`);
    }
    setShowSubmitRating(false);
    fetchDetailProduct();
    checkUserRated();
  };

  const handleDeleteRating = async () => {
    if (!alertConfirm("Yakin hapus rating?")) return;
    const res = await ProductApi.deleteRating(userRatingId);
    if (!res.ok) return alertError("Gagal hapus rating.");
    alertSuccess("Rating dihapus.");
    setUserRated(false);
    setUserTempRating(0);
    setUserRatingId(null);
    fetchDetailProduct();
  };

  const handleCancelRating = () => {
    setUserTempRating(userRated ? userTempRating : 0);
    setShowSubmitRating(false);
  };

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => navigate(-1), 300);
  };

  const startEditComment = (c) => {
    setEditingCommentId(c.id);
    setEditingContent(c.content);
  };

  const handleUpdateComment = async (id) => {
    const res = await CommentApi.updateComment(id, editingContent);
    const body = await res.json();
    if (res.status === 200) {
      alertSuccess("Komentar diupdate.");
      setEditingCommentId(null);
      fetchComment();
    } else {
      alertError(`Gagal update: ${body.error}`);
    }
  };

  const handleDeleteComment = async (id) => {
    if (!(await alertConfirm("Yakin hapus komentar?"))) return;
    const res = await CommentApi.deleteComment(id);
    const body = await res.json();
    if (res.status === 200) {
      alertSuccess("Komentar dihapus!");
      fetchComment();
    } else {
      alertError(`Gagal hapus: ${body.error}`);
    }
  };

  const full = Math.floor(averageRating);
  const half = averageRating - full >= 0.5;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6 font-poppins">
      <div className="md:col-span-3">
        <button
          onClick={handleBack}
          className="mb-5 flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-gray-800 hover:bg-gray-900 hover:text-white hover:scale-105 transition-all duration-300"
        >
          <HiArrowLeft className="text-lg" />
          {t("detailProduct.back")}
        </button>

        <div className="w-full h-96 flex items-center justify-center bg-white rounded-lg mb-6">
          <img
            src={`${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
              product.featured_image
            }`}
            alt={product.title}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <h1 className="text-2xl font-bold mb-3">{product.title}</h1>
        <p className="text-sm text-gray-500 mb-2">
          {t("detailProduct.by")} | {t("detailProduct.price")} :{" "}
          <span className="font-semibold text-black">
            {Helper.formatRupiah(product.price)}
          </span>
        </p>

        <div className="flex items-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((star) => {
            let icon;
            if (star <= full) icon = <FaStar className="text-yellow-400" />;
            else if (star === full + 1 && half)
              icon = <FaStarHalfAlt className="text-yellow-400" />;
            else icon = <FaRegStar className="text-gray-300" />;
            return <span key={star}>{icon}</span>;
          })}
          <span className="text-sm text-gray-500 ml-2">
            ({averageRating?.toFixed(1) ?? "0.0"})
          </span>
        </div>

        <div className="space-y-4 text-gray-800 leading-relaxed mt-4">
          <p>{product.description}</p>
          <p>
            <Trans i18nKey="detailProduct.descriptionNote" />
          </p>
        </div>

        <div className="mt-6">
          <a
            href={product.link_whatsapp}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
          >
            <FaWhatsapp /> {t("detailProduct.orderWhatsapp")}
          </a>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">
            ⭐{" "}
            {userRated
              ? t("detailProduct.ratingTitleRated")
              : t("detailProduct.ratingTitleUnrated")}
          </h2>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleSelectStar(star)}
                className="cursor-pointer hover:scale-110 transition"
              >
                {star <= userTempRating ? (
                  <FaStar className="text-yellow-400" />
                ) : (
                  <FaRegStar className="text-gray-300" />
                )}
              </span>
            ))}
          </div>

          {showSubmitRating && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSubmitRating}
                className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
              >
                {userRated
                  ? t("detailProduct.updateRating")
                  : t("detailProduct.sendRating")}{" "}
                {userTempRating} ⭐
              </button>
              <button
                onClick={handleCancelRating}
                className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
              >
                {t("detailProduct.cancel")}
              </button>
            </div>
          )}

          {userRated && !showSubmitRating && (
            <div className="mt-2 flex gap-2">
              <button
                onClick={handleDeleteRating}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                ❌ {t("detailProduct.deleteRating")}
              </button>
            </div>
          )}
        </div>

        <div className="mt-10 p-6 bg-gray-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            💬 {t("detailProduct.leaveComment")}
          </h2>

          <form onSubmit={handleKomentar} className="space-y-4">
            <textarea
              placeholder={t("detailProduct.commentPlaceholder")}
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
              {t("detailProduct.sendComment")}
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
                        {t("detailProduct.editComment")}
                      </button>
                      <button
                        onClick={() => setEditingCommentId(null)}
                        className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
                      >
                        {t("detailProduct.cancelEdit")}
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
                            {t("detailProduct.edit")}
                          </button>
                        )}
                        {(user.id === c.user.id || user.role === "ADMIN") && (
                          <button
                            onClick={() => handleDeleteComment(c.id)}
                            className="text-red-500 text-sm hover:underline"
                          >
                            {t("detailProduct.delete")}
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
                {t("detailProduct.noComments")}
              </p>
            )}
          </div>
        </div>
      </div>
      <aside>
        <SidebarProduk />
      </aside>
    </div>
  );
}
