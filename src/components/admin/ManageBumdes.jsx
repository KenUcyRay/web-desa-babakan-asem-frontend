import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import AdminSidebar from "./AdminSidebar";

export default function ManageBumdes() {
  const [produkList, setProdukList] = useState([
    {
      id: 1,
      name: "Beras Organik Premium",
      description: "Beras organik berkualitas tinggi langsung dari petani desa.",
      price: 65000,
      image: "https://source.unsplash.com/400x250/?rice",
    },
    {
      id: 2,
      name: "Keripik Singkong Pedas",
      description: "Keripik singkong renyah dengan bumbu pedas khas desa.",
      price: 15000,
      image: "https://source.unsplash.com/400x250/?snack",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // ✅ Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setImage(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const imagePreview = image
      ? URL.createObjectURL(image)
      : editingId
      ? produkList.find((p) => p.id === editingId).image
      : "https://source.unsplash.com/400x250/?product";

    const newData = {
      id: editingId || Date.now(),
      name,
      description,
      price: parseFloat(price),
      image: imagePreview,
    };

    if (editingId) {
      setProdukList((prev) =>
        prev.map((p) => (p.id === editingId ? newData : p))
      );
    } else {
      setProdukList([...produkList, newData]);
    }

    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin hapus produk ini?")) {
      setProdukList(produkList.filter((p) => p.id !== id));
    }
  };

  const handleEdit = (id) => {
    const produk = produkList.find((p) => p.id === id);
    if (!produk) return;

    setName(produk.name);
    setDescription(produk.description);
    setPrice(produk.price);
    setImage(null);
    setEditingId(id);
    setShowForm(true);
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 p-6 w-full">
        {/* ✅ Header & Tombol */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Kelola Produk BUMDes</h1>

          {!showForm && (
            <button
              onClick={() => {
                setEditingId(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
            >
              <FiPlus /> Tambah Produk
            </button>
          )}
        </div>

        {/* ✅ FORM TAMBAH / EDIT */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow mb-6 space-y-4 max-w-2xl"
          >
            <div>
              <label className="block font-medium">Nama Produk</label>
              <input
                className="w-full border p-2 rounded focus:ring focus:ring-green-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama produk"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Deskripsi</label>
              <textarea
                className="w-full border p-2 rounded h-24 focus:ring focus:ring-green-200"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tuliskan deskripsi produk..."
                required
              ></textarea>
            </div>

            <div>
              <label className="block font-medium">Harga (Rp)</label>
              <input
                type="number"
                className="w-full border p-2 rounded focus:ring focus:ring-green-200"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Contoh: 50000"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Upload Gambar Produk</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full border p-2 rounded"
              />
              {(image ||
                (editingId &&
                  produkList.find((p) => p.id === editingId)?.image)) && (
                <img
                  src={
                    image
                      ? URL.createObjectURL(image)
                      : produkList.find((p) => p.id === editingId)?.image
                  }
                  alt="preview"
                  className="mt-2 w-40 rounded"
                />
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600"
              >
                {editingId ? "✅ Update Produk" : "💾 Simpan Produk"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-500"
              >
                Batal
              </button>
            </div>
          </form>
        )}

        {/* ✅ LIST PRODUK */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {produkList.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow">
              {p.image && (
                <img
                  src={p.image}
                  alt={p.name}
                  className="rounded-t-xl w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">{p.name}</h2>
                <p className="text-gray-600 text-sm">{p.description}</p>
                <p className="mt-2 font-medium text-green-600">
                  Rp {p.price.toLocaleString("id-ID")}
                </p>

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => handleEdit(p.id)}
                    className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
                  >
                    <FiEdit2 /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
