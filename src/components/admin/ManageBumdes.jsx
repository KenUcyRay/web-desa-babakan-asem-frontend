import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ProductApi } from "../../libs/api/ProductApi";
import { CategoryApi } from "../../libs/api/CategoryApi";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";
import { Helper } from "../../utils/Helper";
import Pagination from "../ui/Pagination";
import {
  FaPlus,
  FaSave,
  FaTimes,
  FaEdit,
  FaTrash,
  FaBox,
  FaBoxes,
  FaWhatsapp,
} from "react-icons/fa";

export default function ManageBumdes() {
  const { i18n } = useTranslation();
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

  // Category form state
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  const fetchProducts = async () => {
    const response = await ProductApi.getOwnProducts(
      currentPage,
      6,
      i18n.language
    );
    if (!response.ok) return;

    const responseBody = await response.json();
    setTotalPages(responseBody.total_page);
    setCurrentPage(responseBody.page);
    setProducts(responseBody.products);
  };

  const fetchCategories = async () => {
    const response = await CategoryApi.getCategories(i18n.language);
    if (!response.ok) return;

    const responseBody = await response.json();
    setCategories(responseBody.categories);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage, i18n.language]);

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
      if (!(await alertConfirm("Yakin ingin mengupdate produk ini?"))) return;
      const response = await ProductApi.updateProduct(
        editingId,
        rawData,
        i18n.language
      );
      const body = await response.json();
      if (!response.ok) {
        await Helper.errorResponseHandler(body);
        return;
      }
      await alertSuccess("Produk berhasil diupdate");
      fetchProducts();
      resetForm();
      setShowForm(false);
      return;
    }

    const response = await ProductApi.createProduct(rawData, i18n.language);
    const responseBody = await response.json();
    if (!response.ok) {
      await Helper.errorResponseHandler(responseBody);
      return;
    }
    await alertSuccess("Produk berhasil ditambahkan");
    fetchProducts();
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
    if (await alertConfirm("Yakin ingin menghapus produk ini?")) {
      const response = await ProductApi.deleteProduct(id, i18n.language);
      if (!response.ok) {
        const body = await response.json();
        await Helper.errorResponseHandler(body);
        return;
      }
      setProducts(products.filter((p) => p.product.id !== id));
    }
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();

    const rawData = { name: categoryName };

    if (editingCategoryId) {
      if (!(await alertConfirm("Yakin ingin mengupdate kategori ini?"))) return;
      const response = await CategoryApi.updateCategory(
        editingCategoryId,
        rawData,
        i18n.language
      );
      const body = await response.json();
      if (!response.ok) {
        await Helper.errorResponseHandler(body);
        return;
      }
      await alertSuccess("Kategori berhasil diperbarui");
      fetchCategories();
      resetCategoryForm();
      setShowCategoryForm(false);
      return;
    }

    const response = await CategoryApi.addCategory(rawData, i18n.language);
    const body = await response.json();
    if (!response.ok) {
      await Helper.errorResponseHandler(body);
      return;
    }
    await alertSuccess("Kategori berhasil ditambahkan");
    fetchCategories();
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
    if (await alertConfirm("Yakin ingin menghapus kategori ini?")) {
      const response = await CategoryApi.deleteCategory(id, i18n.language);
      if (!response.ok) {
        await Helper.errorResponseHandler(await response.json());
        return;
      }
      await alertSuccess("Kategori berhasil dihapus");
      fetchCategories();
    }
  };

  return (
    <div className="font-[Poppins,sans-serif] bg-gray-50 min-h-screen p-4 md:p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-green-700 flex items-center gap-3 mb-2">
          <FaBoxes className="text-emerald-600" />
          Kelola BUMDes
        </h1>
        <p className="text-gray-600">Kelola produk dan kategori BUMDes</p>
      </div>

      {/* CATEGORY SECTION */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-8">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
            <FaBox className="text-emerald-500" />
            Kelola kategori produk
          </h2>
          {!showCategoryForm && (
            <button
              onClick={() => {
                resetCategoryForm();
                setShowCategoryForm(true);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-md transition"
            >
              <FaPlus /> Tambah kategori
            </button>
          )}
        </div>

        {showCategoryForm && (
          <form
            onSubmit={handleSubmitCategory}
            className="bg-gray-50 p-5 rounded-lg border border-gray-200 mb-6"
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama kategori
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Contoh: Makanan, Minuman, Kerajinan"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-5 py-2.5 rounded-lg shadow-md transition"
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
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2.5 rounded-lg transition"
              >
                <FaTimes /> Batal
              </button>
            </div>
          </form>
        )}

        {categories.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <FaBox className="text-4xl text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">
              Belum ada kategori produk. Silakan tambahkan kategori
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-4 rounded-lg border border-gray-200 transition"
              >
                <span className="font-medium text-gray-800">{cat.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditCategory(cat.id)}
                    className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition"
                    title="Edit"
                  >
                    <FaEdit size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition"
                    title="Hapus"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PRODUCT FORM */}
      {!showForm ? (
        <div className="flex justify-end mb-6">
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-5 py-2.5 rounded-lg shadow-md transition"
          >
            <FaPlus /> Tambah produk
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            {editingId ? (
              <>
                <FaEdit className="text-emerald-500" />
                Edit produk
              </>
            ) : (
              <>
                <FaPlus className="text-emerald-500" />
                Tambah produk baru
              </>
            )}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama produk
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Keripik Singkong, Minuman Herbal, Sabun Herbal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi produk
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl h-32 resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsikan produk secara detail..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harga produk (dalam Rupiah)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500">
                    Rp
                  </span>
                  <input
                    type="number"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori produk
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">-- Pilih Kategori --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaWhatsapp className="text-green-500" />
                  Link WhatsApp
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  value={linkWhatsapp}
                  onChange={(e) => setLinkWhatsapp(e.target.value)}
                  placeholder="Contoh: https://wa.me/6281234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gambar produk
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFeaturedImage(e.target.files[0])}
                    className="w-full mb-3"
                  />
                  {(featuredImage ||
                    (editingId &&
                      products.find((p) => p.product.id === editingId)?.product
                        ?.featured_image)) && (
                    <div className="mt-3 flex justify-center">
                      <img
                        src={
                          featuredImage
                            ? URL.createObjectURL(featuredImage)
                            : `${
                                import.meta.env.VITE_NEW_BASE_URL
                              }/public/images/${
                                products.find((p) => p.product.id === editingId)
                                  ?.product?.featured_image
                              }`
                        }
                        alt="preview"
                        className="max-w-full h-40 rounded-lg object-contain border"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8 pt-5 border-t border-gray-200">
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl shadow-md transition"
            >
              <FaSave /> {editingId ? "Update Produk" : "Simpan Produk"}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-3 rounded-xl transition"
            >
              <FaTimes /> Batal
            </button>
          </div>
        </form>
      )}

      {/* PRODUCT LIST */}
      {products.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <FaBox className="text-4xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            Belum ada produk
          </h3>
          <p className="text-gray-500 mb-4">
            {showForm
              ? "Silahkan lengkapi form di atas untuk menambahkan produk baru."
              : "Klik tombol 'Tambah produk' untuk mulai menambahkan."}
          </p>
          {!showForm && (
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-5 py-2.5 rounded-lg shadow-md transition"
            >
              <FaPlus /> Tambah produk
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 transition overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={`${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                      item.product.featured_image
                    }`}
                    alt={item.product.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-white/90 px-3 py-1 rounded-full text-xs font-medium text-emerald-700">
                    {categories.find((c) => c.id === item.product.category_id)
                      ?.name || "Tanpa kategori"}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-800 line-clamp-2">
                    {item.product.title}
                  </h3>
                  <p className="text-emerald-600 font-bold mt-2">
                    {Helper.formatRupiah(item.product.price)}
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-2 mt-2">
                    {item.product.description}
                  </p>

                  <div className="flex justify-between mt-5 pt-4 border-t border-gray-100">
                    <div>
                      <a
                        href={item.product.link_whatsapp || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-full transition inline-block"
                        title="WhatsApp"
                      >
                        <FaWhatsapp size={16} />
                      </a>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(item.product.id)}
                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition"
                        title="Edit"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.product.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition"
                        title="Hapus"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
