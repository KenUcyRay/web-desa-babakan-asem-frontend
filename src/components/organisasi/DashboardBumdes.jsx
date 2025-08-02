import { useEffect, useState } from "react";
import { ProductApi } from "../../libs/api/ProductApi";
import { CategoryApi } from "../../libs/api/CategoryApi";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";
import { Helper } from "../../utils/Helper";
import Pagination from "../ui/Pagination";
import { FaPlus, FaSave, FaTimes, FaEdit, FaTrash } from "react-icons/fa";

export default function ManageBumdes() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [linkWhatsapp, setLinkWhatsapp] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);

  // === STATE UNTUK FORM KATEGORI ===
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  const fetchProducts = async () => {
    const response = await ProductApi.getOwnProducts(currentPage, 6);
    if (!response.ok) {
      alertError("Gagal mengambil produk.");
      return;
    }
    const responseBody = await response.json();
    setTotalPages(responseBody.total_page);
    setCurrentPage(responseBody.page);
    setProducts(responseBody.products);
  };

  const fetchCategories = async () => {
    const response = await CategoryApi.getCategories();
    if (!response.ok) {
      alertError("Gagal mengambil kategori.");
      return;
    }
    const responseBody = await response.json();
    setCategories(responseBody.categories);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice(0);
    setCategoryId("");
    setLinkWhatsapp("");
    setFeaturedImage(null);
    setEditingId(null);
  };

  const resetCategoryForm = () => {
    setCategoryName("");
    setEditingCategoryId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rawData = {
      title,
      description,
      price: parseFloat(price),
      category_id: categoryId,
      link_whatsapp: linkWhatsapp,
      featured_image: featuredImage,
    };

    if (editingId) {
      if (!(await alertConfirm("Yakin ingin mengedit produk ini?"))) return;
      const response = await ProductApi.updateProduct(editingId, rawData);
      const body = await response.json();
      if (!response.ok) {
        alertError(Helper.parseError(body));
        return;
      }
      await alertSuccess("Produk berhasil diperbarui!");
      fetchProducts();
      resetForm();
      setShowForm(false);
      return;
    }

    const response = await ProductApi.createProduct(rawData);
    const body = await response.json();
    if (response.ok) {
      await alertSuccess("Produk berhasil ditambahkan!");
      fetchProducts();
    } else {
      alertError(Helper.parseError(body));
    }
    resetForm();
    setShowForm(false);
  };

  const handleEdit = (id) => {
    const item = products.find((p) => p.product.id === id);
    if (!item) return;
    setTitle(item.product.title);
    setDescription(item.product.description);
    setPrice(item.product.price);
    setCategoryId(item.product.category_id);
    setLinkWhatsapp(item.product.link_whatsapp);
    setEditingId(id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (await alertConfirm("Yakin hapus produk ini?")) {
      const response = await ProductApi.deleteProduct(id);
      if (!response.ok) {
        const body = await response.json();
        alertError(`Gagal menghapus produk. ${body.error}`);
        return;
      }
      setProducts(products.filter((p) => p.product.id !== id));
    }
  };

  // === HANDLE TAMBAH / EDIT KATEGORI ===
  const handleSubmitCategory = async (e) => {
    e.preventDefault();

    const rawData = { name: categoryName };

    if (editingCategoryId) {
      if (!(await alertConfirm("Yakin ingin mengedit kategori ini?"))) return;
      const response = await CategoryApi.updateCategory(
        editingCategoryId,
        rawData
      );
      const body = await response.json();
      if (!response.ok) {
        alertError(body);
        return;
      }
      await alertSuccess("Kategori berhasil diperbarui!");
      fetchCategories();
      resetCategoryForm();
      setShowCategoryForm(false);
      return;
    }

    const response = await CategoryApi.addCategory(rawData);
    const body = await response.json();
    if (response.ok) {
      await alertSuccess("Kategori berhasil ditambahkan!");
      fetchCategories();
    } else {
      alertError(body);
    }
    resetCategoryForm();
    setShowCategoryForm(false);
  };

  const handleEditCategory = (id) => {
    const category = categories.find((c) => c.id === id);
    if (!category) return;
    setCategoryName(category.name);
    setEditingCategoryId(id);
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (id) => {
    if (await alertConfirm("Yakin hapus kategori ini?")) {
      const response = await CategoryApi.deleteCategory(id);
      if (!response.ok) {
        const body = await response.json();
        alertError(`Gagal menghapus kategori. ${body.error}`);
        return;
      }
      await alertSuccess("Kategori dihapus!");
      fetchCategories();
    }
  };

  return (
    <div className="font-[Poppins,sans-serif]">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700">
          Kelola Produk BUMDes
        </h1>
      </div>

      {/* === BAGIAN KATEGORI === */}
      <div className="bg-white p-4 rounded-xl shadow-md border mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-green-600">
            Kelola Kategori
          </h2>
          {!showCategoryForm && (
            <button
              onClick={() => {
                resetCategoryForm();
                setShowCategoryForm(true);
              }}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
            >
              <FaPlus /> Tambah Kategori
            </button>
          )}
        </div>

        {showCategoryForm && (
          <form
            onSubmit={handleSubmitCategory}
            className="bg-gray-50 p-4 rounded-lg border mb-4 space-y-3"
          >
            <label className="block text-gray-700 font-medium">
              Nama Kategori
            </label>
            <input
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-300 outline-none"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Masukkan nama kategori"
              required
            />
            <div className="flex gap-3 mt-3">
              <button
                type="submit"
                className="flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-lg shadow hover:bg-green-600 transition"
              >
                <FaSave />{" "}
                {editingCategoryId ? "Update Kategori" : "Simpan Kategori"}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetCategoryForm();
                  setShowCategoryForm(false);
                }}
                className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                <FaTimes /> Batal
              </button>
            </div>
          </form>
        )}

        {/* LIST KATEGORI */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {categories.length === 0 && (
            <p className="text-gray-500 text-sm italic">Belum ada kategori</p>
          )}
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
            >
              <span className="font-medium">{cat.name}</span>
              <div className="flex gap-2 text-sm">
                <button
                  onClick={() => handleEditCategory(cat.id)}
                  className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700"
                >
                  <FaTrash /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* === FORM TAMBAH / EDIT PRODUK === */}
      {!showForm && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
          >
            <FaPlus /> Tambah Produk
          </button>
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md mb-6 space-y-4 max-w-2xl border"
        >
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Nama Produk
            </label>
            <input
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-300 outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan nama produk"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              className="w-full border rounded-lg p-3 h-28 resize-none focus:ring-2 focus:ring-green-300 outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tuliskan deskripsi produk..."
              required
            ></textarea>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Harga
              </label>
              <input
                type="number"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-300 outline-none"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <select
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-300 outline-none"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">-- Pilih Kategori --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Link WhatsApp
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-300 outline-none"
              value={linkWhatsapp}
              onChange={(e) => setLinkWhatsapp(e.target.value)}
              placeholder="https://wa.me/62xxxx"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Upload Gambar Produk
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFeaturedImage(e.target.files[0])}
              className="w-full border p-2 rounded"
            />
            {(featuredImage ||
              (editingId &&
                products.find((p) => p.product.id === editingId)?.product
                  ?.featured_image)) && (
              <img
                src={
                  featuredImage
                    ? URL.createObjectURL(featuredImage)
                    : `${import.meta.env.VITE_BASE_URL}/products/images/${
                        products.find((p) => p.product.id === editingId)
                          ?.product?.featured_image
                      }`
                }
                alt="preview"
                className="mt-3 w-40 rounded-lg shadow-sm"
              />
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-lg shadow hover:bg-green-600 transition"
            >
              <FaSave /> {editingId ? "Update Produk" : "Simpan Produk"}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
            >
              <FaTimes /> Batal
            </button>
          </div>
        </form>
      )}

      {/* LIST PRODUK */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((item) => (
          <div
            key={item.product.id}
            className="bg-white rounded-xl shadow-md border hover:shadow-lg transition"
          >
            <img
              src={`${import.meta.env.VITE_BASE_URL}/products/images/${
                item.product.featured_image
              }`}
              alt={item.product.title}
              className="rounded-t-xl w-full h-40 object-cover"
            />

            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                {item.product.title}
              </h2>
              <p className="text-green-600 font-bold mt-1">
                {Helper.formatRupiah(item.product.price)}
              </p>
              <p className="text-gray-600 text-sm line-clamp-3 mt-1">
                {item.product.description}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {categories.find((c) => c.id === item.product.category_id)
                  ?.name || "Tanpa Kategori"}
              </p>

              <div className="flex gap-4 mt-4 text-sm">
                <button
                  onClick={() => handleEdit(item.product.id)}
                  className="flex items-center gap-1 text-blue-500 hover:text-blue-700 transition"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item.product.id)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700 transition"
                >
                  <FaTrash /> Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="mt-6 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
