import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaWhatsapp, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi";
import SidebarProduk from "../layout/SidebarProduk";
import { Helper } from "../../utils/Helper";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";
import { CommentApi } from "../../libs/api/CommentApi";
import { ProductApi } from "../../libs/api/ProductApi";

export default function DetailProduk() {
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

  const userToken = JSON.parse(localStorage.getItem("token"));

  const fetchDetailProduct = async () => {
    const response = await ProductApi.getDetailProduct(id);
    const responseBody = await response.json();
    if (response.status === 200) {
      setProduct(responseBody.product);
      setAverageRating(responseBody.rating ?? 0);
      setComments(responseBody.comments ?? []);
    } else {
      await alertError(
        "Gagal mengambil detail product. Silakan coba lagi nanti."
      );
      navigate("/bumdes");
    }
  };

  const fetchComment = async () => {
    const response = await CommentApi.getComments(id);
    const responseBody = await response.json();
    if (response.status === 200) {
      setComments(responseBody.comments);
    }
  };

  const checkUserRated = async () => {
    if (!userToken) return;
    const response = await ProductApi.alreadyRated(id);
    const responseBody = await response.json();

    if (response.ok) {
      setUserRated(true);
      setUserTempRating(responseBody.rating);
      setUserRatingId(responseBody.id);
    }
  };

  useEffect(() => {
    setProduct({});
    setUserTempRating(0);
    setUserRated(false);
    setUserRatingId(null);
    setShowSubmitRating(false);

    fetchDetailProduct();
    checkUserRated();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(fetchComment, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const handleKomentar = async (e) => {
    e.preventDefault();
    if (!userToken) {
      await alertError("⚠ Silakan login dulu untuk memberikan komentar!");
      navigate("/login");
      return;
    }

    const response = await CommentApi.createComment(id, "PRODUCT", pesan);
    const responseBody = await response.json();

    if (response.status !== 201) {
      await alertError(`Gagal mengirim komentar. ${responseBody.error}`);
      return;
    }

    await alertSuccess("Komentar berhasil dikirim!");
    setPesan("");
    fetchComment();
  };

  const handleSelectStar = async (value) => {
    if (!userToken) {
      await alertError("Silakan login dulu untuk memberi rating!");
      navigate("/login");
      return;
    }
    setUserTempRating(value);
    setShowSubmitRating(true);
  };

  const handleSubmitRating = async () => {
    if (!userRated) {
      const response = await ProductApi.createRating(id, userTempRating);
      if (!response.ok) {
        await alertError("Gagal mengirim rating. Silakan coba lagi.");
        return;
      }
      await alertSuccess(
        `Terima kasih! Rating ${userTempRating} ⭐ telah dikirim.`
      );
      setUserRated(true);
    } else {
      const response = await ProductApi.updateRating(
        userRatingId,
        userTempRating
      );
      if (!response.ok) {
        await alertError("Gagal mengupdate rating.");
        return;
      }
      await alertSuccess(`Rating berhasil diupdate jadi ${userTempRating} ⭐`);
    }

    setShowSubmitRating(false);
    fetchDetailProduct();
    checkUserRated();
  };

  const handleDeleteRating = async () => {
    if (!alertConfirm("Yakin ingin menghapus rating kamu?")) return;

    const response = await ProductApi.deleteRating(userRatingId);
    if (!response.ok) {
      await alertError("Gagal menghapus rating.");
      return;
    }

    await alertSuccess("Rating kamu berhasil dihapus.");
    setUserRated(false);
    setUserTempRating(0);
    setUserRatingId(null);
    fetchDetailProduct();
  };

  const handleCancelRating = () => {
    setUserTempRating(userRated ? userTempRating : 0);
    setShowSubmitRating(false);
  };

  const full = Math.floor(averageRating);
  const half = averageRating - full >= 0.5;

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => navigate(-1), 300);
  };

  // - mulai edit
  const startEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  // - simpan edit
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

  // - hapus komentar
  const handleDeleteComment = async (commentId) => {
    if (!(await alertConfirm("Yakin ingin menghapus komentar ini?"))) return;

    const response = await CommentApi.deleteComment(commentId);
    const resBody = await response.json();

    if (response.status === 200) {
      await alertSuccess("Komentar berhasil dihapus!");
      await fetchComment();
    } else {
      await alertError(`Gagal hapus komentar: ${resBody.error}`);
    }
  };

  // - User login dari localStorage
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6 font-poppins">
      <div className="md:col-span-3">
        {/* - Tombol Back */}
        <button
          onClick={handleBack}
          className="mb-5 flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-gray-800 hover:bg-gray-900 hover:text-white hover:scale-105 transition-all duration-300"
        >
          <HiArrowLeft className="text-lg" />
          Kembali
        </button>

        {/* - Gambar Produk pakai object-contain */}
        <div className="w-full h-96 flex items-center justify-center bg-white rounded-lg mb-6">
          <img
            src={`${import.meta.env.VITE_BASE_URL}/products/images/${
              product.featured_image
            }`}
            alt={product.title}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* - Info Produk */}
        <h1 className="text-2xl font-bold mb-3">{product.title}</h1>
        <p className="text-sm text-gray-500 mb-2">
          Oleh BUMDes Babakan Asem | Harga :{" "}
          <span className="font-semibold text-black">
            {Helper.formatRupiah(product.price)}
          </span>
        </p>

        {/* - Rating Produk */}
        <div className="flex items-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((star) => {
            let icon;
            if (star <= full) {
              icon = <FaStar className="text-yellow-400" />;
            } else if (star === full + 1 && half) {
              icon = <FaStarHalfAlt className="text-yellow-400" />;
            } else {
              icon = <FaRegStar className="text-gray-300" />;
            }
            return <span key={star}>{icon}</span>;
          })}
          <span className="text-sm text-gray-500 ml-2">
            ({averageRating?.toFixed(1) ?? "0.0"})
          </span>
        </div>

        {/* - Deskripsi Produk */}
        <div className="space-y-4 text-gray-800 leading-relaxed mt-4">
          <p>{product.description}</p>
          <p>Produk ini 100% hasil desa dan dikelola oleh masyarakat lokal.</p>
        </div>

        {/* - Tombol Pesan WA */}
        <div className="mt-6">
          <a
            href={product.link_whatsapp}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
          >
            <FaWhatsapp /> Pesan via WhatsApp
          </a>
        </div>

        {/* - Form Rating */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">
            ⭐ {userRated ? "Rating Kamu" : "Beri Penilaian Produk Ini"}
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
                - {userRated ? "Update" : "Kirim"} Rating {userTempRating} ⭐
              </button>
              <button
                onClick={handleCancelRating}
                className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
              >
                Batal
              </button>
            </div>
          )}

          {userRated && !showSubmitRating && (
            <div className="mt-2 flex gap-2">
              <button
                onClick={handleDeleteRating}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                ❌ Hapus Rating
              </button>
            </div>
          )}
        </div>

        {/* - Komentar */}
        <div className="mt-10 p-6 bg-gray-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">💬 Tinggalkan Komentar</h2>

          <form onSubmit={handleKomentar} className="space-y-4">
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
        <SidebarProduk />
      </aside>
    </div>
  );
}
