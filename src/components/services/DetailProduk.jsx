import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaWhatsapp, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import SidebarProduk from "../layout/SidebarProduk";
import { Helper } from "../../utils/Helper";
import { alertError, alertSuccess } from "../../libs/alert";
import { CommentApi } from "../../libs/api/CommentApi";
import { ProductApi } from "../../libs/api/ProductApi";

export default function DetailProduk() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [comments, setComments] = useState([]);
  const [pesan, setPesan] = useState("");

  const [averageRating, setAverageRating] = useState(0); // ✅ rata-rata untuk rekap
  const [userTempRating, setUserTempRating] = useState(0); // ✅ rating sementara user
  const [userRated, setUserRated] = useState(false);
  const [showSubmitRating, setShowSubmitRating] = useState(false);

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

  useEffect(() => {
    fetchDetailProduct();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(fetchComment, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const handleKomentar = async (e) => {
    e.preventDefault();
    if (!userToken) {
      alert("⚠ Silakan login dulu untuk memberikan komentar!");
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

  // ✅ Bagian klik bintang (untuk rating)
  const handleSelectStar = (value) => {
    if (!userToken) {
      alert("Silakan login dulu untuk memberi rating!");
      navigate("/login");
      return;
    }
    if (userRated) {
      alert("Anda sudah memberi rating untuk produk ini!");
      return;
    }
    setUserTempRating(value);
    setShowSubmitRating(true);
  };

  const handleSubmitRating = async () => {
    // Simulasi kirim ke backend & update rata-rata
    const newAverage = (averageRating + userTempRating) / 2; // contoh kalkulasi lokal
    setAverageRating(newAverage);

    setUserRated(true);
    setShowSubmitRating(false);

    await alertSuccess(
      `Terima kasih! Rating ${userTempRating} ⭐ telah dikirim.`
    );
  };

  const handleCancelRating = () => {
    setUserTempRating(0);
    setShowSubmitRating(false);
  };

  const full = Math.floor(averageRating);
  const half = averageRating - full >= 0.5;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* ✅ Konten utama */}
      <div className="md:col-span-3">
        <img
          src={`${import.meta.env.VITE_BASE_URL}/products/images/${
            product.featured_image
          }`}
          alt={product.title}
          className="w-full h-96 object-cover rounded-lg mb-6"
        />
        <h1 className="text-2xl font-bold mb-3">{product.title}</h1>
        <p className="text-sm text-gray-500 mb-2">
          Oleh BUMDes Babakan Asem | Harga :{" "}
          <span className="font-semibold text-black">
            {Helper.formatRupiah(product.price)}
          </span>
        </p>

        {/* ✅ Rekap Rating (read-only, rata-rata) */}
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

        {/* ✅ Deskripsi */}
        <div className="space-y-4 text-gray-800 leading-relaxed mt-4">
          <p>{product.description}</p>
          <p>Produk ini 100% hasil desa dan dikelola oleh masyarakat lokal.</p>
        </div>

        {/* ✅ Tombol WA Pesan */}
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

        {/* ✅ Bagian Rating User di bawah tombol WhatsApp */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">
            ⭐ Beri Penilaian Produk Ini
          </h2>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
              return (
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
              );
            })}
          </div>

          {showSubmitRating && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSubmitRating}
                className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
              >
                ✅ Kirim Rating {userTempRating} ⭐
              </button>
              <button
                onClick={handleCancelRating}
                className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
              >
                Batal
              </button>
            </div>
          )}
        </div>

        {/* ✅ Komentar */}
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

          {/* ✅ List Komentar */}
          <div className="mt-6 space-y-4">
            {comments.map((c, i) => (
              <div key={i} className="p-4 bg-white rounded-lg shadow">
                <p className="text-sm text-gray-700">{c.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  ✍ {c.user?.name ?? "Anonim"} •{" "}
                  {Helper.formatTanggal(c.updated_at)}
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
        <SidebarProduk />
      </aside>
    </div>
  );
}
