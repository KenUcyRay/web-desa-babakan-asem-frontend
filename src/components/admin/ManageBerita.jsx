import { useState } from "react";
import AdminSidebar from "./AdminSidebar";

export default function ManageBerita() {
  const [beritaList, setBeritaList] = useState([
    {
      id: 1,
      title: "Perbaikan Jalan Desa Selesai",
      content: "Jalan desa sudah selesai diperbaiki demi kenyamanan warga.",
      featuredImage: "https://source.unsplash.com/400x250/?village",
      isPublished: true,
      date: "2025-07-15",
    },
    {
      id: 2,
      title: "Gotong Royong Bersama Warga",
      content: "Warga desa mengadakan gotong royong membersihkan lingkungan.",
      featuredImage: "https://source.unsplash.com/400x250/?community",
      isPublished: false,
      date: "2025-07-16",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  // form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [isPublished, setIsPublished] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newBerita = {
      id: Date.now(),
      title,
      content,
      featuredImage: featuredImage ? URL.createObjectURL(featuredImage) : null,
      isPublished,
      date: new Date().toISOString().split("T")[0], // ✅ auto tanggal hari ini
    };

    setBeritaList([...beritaList, newBerita]);

    // reset form
    setTitle("");
    setContent("");
    setFeaturedImage(null);
    setIsPublished(false);

    // sembunyikan form setelah simpan
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin hapus berita ini?")) {
      setBeritaList(beritaList.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Kelola Berita</h1>

          {/* ✅ Tombol hanya muncul kalau form belum dibuka */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              ➕ Tambah Berita
            </button>
          )}
        </div>

        {/* ✅ FORM MUNCUL SETELAH KLIK */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 rounded shadow mb-6 space-y-4 max-w-2xl"
          >
            <div>
              <label className="block font-medium">Judul</label>
              <input
                className="w-full border p-2 rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul berita"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Konten</label>
              <textarea
                className="w-full border p-2 rounded h-28"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tuliskan isi berita..."
                required
              ></textarea>
            </div>

            <div>
              <label className="block font-medium">Upload Gambar Utama</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFeaturedImage(e.target.files[0])}
                className="w-full border p-2 rounded"
              />
              {featuredImage && (
                <img
                  src={URL.createObjectURL(featuredImage)}
                  alt="preview"
                  className="mt-2 w-40 rounded"
                />
              )}
            </div>

            <div>
              <label className="block font-medium">Published?</label>
              <button
                type="button"
                onClick={() => setIsPublished(!isPublished)}
                className={`px-4 py-2 rounded ${
                  isPublished ? "bg-green-500 text-white" : "bg-gray-300"
                }`}
              >
                {isPublished ? "YES" : "NO"}
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
              >
                Simpan Berita
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Batal
              </button>
            </div>
          </form>
        )}

        {/* ✅ LIST BERITA */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {beritaList.map((b) => (
            <div key={b.id} className="bg-white rounded-xl shadow">
              {b.featuredImage && (
                <img
                  src={b.featuredImage}
                  alt={b.title}
                  className="rounded-t-xl w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold">{b.title}</h2>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {b.content}
                </p>
                <p className="text-xs text-gray-400 mt-1">📅 {b.date}</p>
                <p
                  className={`mt-2 text-sm ${
                    b.isPublished ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {b.isPublished ? "Published" : "Unpublished"}
                </p>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="mt-3 text-red-500 hover:text-red-700"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
