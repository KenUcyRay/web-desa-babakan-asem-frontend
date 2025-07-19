import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

export default function ManageBumdes() {
  // ✅ Dummy kategori
  const categories = [
    { id: 1, name: "Makanan & Minuman" },
    { id: 2, name: "Kerajinan" },
    { id: 3, name: "Jasa" },
    { id: 4, name: "Pertanian" },
  ];

  // ✅ Dummy produk
  const [products, setProducts] = useState([
    {
      id: 1,
      title: "Keripik Singkong",
      description: "Keripik singkong renyah dan gurih",
      price: 15000,
      category_id: 1,
      link_whatsapp: "https://wa.me/628123456789",
    },
    {
      id: 2,
      title: "Anyaman Bambu",
      description: "Kerajinan tangan dari bambu",
      price: 50000,
      category_id: 2,
      link_whatsapp: "https://wa.me/628987654321",
    },
  ]);

  // ✅ State Form
  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    price: "",
    category_id: "",
    link_whatsapp: "",
  });

  const [showForm, setShowForm] = useState(false);

  // ✅ Tambah/Edit Produk
  const handleSave = () => {
    if (!form.title || !form.price || !form.category_id) {
      alert("Lengkapi data dulu!");
      return;
    }

    if (form.id) {
      // Update
      setProducts((prev) =>
        prev.map((p) => (p.id === form.id ? { ...form } : p))
      );
    } else {
      // Tambah
      setProducts((prev) => [
        ...prev,
        { ...form, id: Date.now(), price: parseInt(form.price) },
      ]);
    }

    resetForm();
  };

  // ✅ Hapus produk
  const handleDelete = (id) => {
    if (confirm("Yakin hapus produk ini?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleEdit = (p) => {
    setForm(p);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({
      id: null,
      title: "",
      description: "",
      price: "",
      category_id: "",
      link_whatsapp: "",
    });
    setShowForm(false);
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Kelola Produk BUMDes</h1>

        {/* ✅ Tombol Tambah */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 mb-4"
          >
            <FaPlus /> Tambah Produk
          </button>
        )}

        {/* ✅ Form Tambah/Edit */}
        {showForm && (
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-lg font-semibold mb-3">
              {form.id ? "Edit Produk" : "Tambah Produk"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm">Nama Produk</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm">Harga</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm">Deskripsi</label>
                <textarea
                  className="w-full border p-2 rounded"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm">Kategori</label>
                <select
                  className="w-full border p-2 rounded"
                  value={form.category_id}
                  onChange={(e) =>
                    setForm({ ...form, category_id: e.target.value })
                  }
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm">Link WhatsApp</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={form.link_whatsapp}
                  onChange={(e) =>
                    setForm({ ...form, link_whatsapp: e.target.value })
                  }
                />
              </div>
            </div>

            {/* ✅ Tombol Simpan / Batal */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Simpan
              </button>
              <button
                onClick={resetForm}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {/* ✅ List Produk */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.length === 0 ? (
            <p className="text-gray-500 italic">Belum ada produk</p>
          ) : (
            products.map((p) => (
              <div
                key={p.id}
                className="bg-white p-4 rounded shadow flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-lg">{p.title}</h3>
                  <p className="text-gray-500 text-sm">
                    {categories.find((c) => c.id === p.category_id)?.name}
                  </p>
                  <p className="text-green-600 font-semibold mt-1">
                    Rp {p.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-700 mt-2">{p.description}</p>
                </div>

                <div className="flex justify-between mt-3">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <FaTrash /> Hapus
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
