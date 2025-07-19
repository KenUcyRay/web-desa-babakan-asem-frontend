import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { FaPlus, FaTrash, FaEdit, FaFolderPlus } from "react-icons/fa";
import { ProductApi } from "../../libs/api/ProductApi";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";
import { Helper } from "../../utils/Helper";
import { CategoryApi } from "../../libs/api/CategoryApi";
import Pagination from "../ui/Pagination";
import { set } from "nprogress";

export default function ManageBumdes() {
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = async () => {
    if (!newCategory.trim())
      return await alertError("Nama kategori tidak boleh kosong!");

    const response = await CategoryApi.addCategory(newCategory.trim());
    const responseBody = await response.json();
    if (!response.ok) {
      let errorMessage = "Gagal menyimpan perubahan.";

      if (responseBody.error && Array.isArray(responseBody.error)) {
        const errorMessages = responseBody.error.map((err) => {
          if (err.path && err.path.length > 0) {
            return `${err.path[0]}: ${err.message}`;
          }
          return err.message;
        });
        errorMessage = errorMessages.join(", ");
      } else if (responseBody.error && typeof responseBody.error === "string") {
        errorMessage = responseBody.error;
      }
      await alertError(errorMessage);
      return;
    }
    await alertSuccess("Kategori berhasil ditambahkan!");
    setCategories((prev) => [responseBody.category, ...prev]);
    setNewCategory("");
  };

  const handleDeleteCategory = async (id) => {
    if (
      !(await alertConfirm(
        "Hapus kategori ini? Produk dengan kategori ini akan terhapus."
      ))
    ) {
      return;
    }
    const response = await CategoryApi.deleteCategory(id);
    if (!response.ok) {
      const responseBody = await response.json();

      let errorMessage = "Gagal menyimpan perubahan.";

      if (responseBody.error && Array.isArray(responseBody.error)) {
        const errorMessages = responseBody.error.map((err) => {
          if (err.path && err.path.length > 0) {
            return `${err.path[0]}: ${err.message}`;
          }
          return err.message;
        });
        errorMessage = errorMessages.join(", ");
      } else if (responseBody.error && typeof responseBody.error === "string") {
        errorMessage = responseBody.error;
      }
      await alertError(errorMessage);
      return;
    }
    await alertSuccess("Kategori berhasil dihapus.");
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [editingId, setEditingId] = useState(null);

  //form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [linkWhatsapp, setLinkWhatsapp] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice(0);
    setLinkWhatsapp("");
    setCategoryId("");
    setCategoryName("");
    setFeaturedImage(null);
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rawData = {
      title,
      description,
      price: parseFloat(price),
      link_whatsapp: linkWhatsapp,
      category_id: categoryId,
      featured_image: featuredImage, // Base64 string
    };

    if (editingId) {
      if (!(await alertConfirm("Yakin ingin mengedit produk ini?"))) {
        return;
      }

      const response = await ProductApi.updateProduct(editingId, rawData);
      const responseBody = await response.json();

      if (!response.ok) {
        let errorMessage = "Gagal menyimpan perubahan.";

        if (responseBody.error && Array.isArray(responseBody.error)) {
          const errorMessages = responseBody.error.map((err) => {
            if (err.path && err.path.length > 0) {
              return `${err.path[0]}: ${err.message}`;
            }
            return err.message;
          });
          errorMessage = errorMessages.join(", ");
        } else if (
          responseBody.error &&
          typeof responseBody.error === "string"
        ) {
          errorMessage = responseBody.error;
        }
        await alertError(errorMessage);
        return;
      }
      resetForm();
      await alertSuccess("Produk berhasil diperbarui!");
      return;
    }

    const response = await ProductApi.createProduct(rawData);
    const responseBody = await response.json();

    if (response.ok) {
      await alertSuccess("Produk berhasil ditambahkan!");
      setProducts([responseBody, ...products]);
    } else {
      let errorMessage = "Gagal menyimpan perubahan.";

      if (responseBody.error && Array.isArray(responseBody.error)) {
        const errorMessages = responseBody.error.map((err) => {
          if (err.path && err.path.length > 0) {
            return `${err.path[0]}: ${err.message}`;
          }
          return err.message;
        });
        errorMessage = errorMessages.join(", ");
      } else if (responseBody.error && typeof responseBody.error === "string") {
        errorMessage = responseBody.error;
      }

      alertError(errorMessage);
    }
    resetForm();
  };

  const handleEdit = (id) => {
    const product = products.find((b) => b.product.id === id);
    if (!product) return;

    setTitle(product.product.title);
    setDescription(product.product.description);
    setPrice(product.product.price);
    setLinkWhatsapp(product.product.link_whatsapp);
    setCategoryId(product.product.category_id);
    setEditingId(id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!(await alertConfirm("Hapus produk ini?"))) {
      return;
    }
    const response = await ProductApi.deleteProduct(id);
    if (!response.ok) {
      const responseBody = await response.json();
      let errorMessage = "Gagal menyimpan perubahan.";

      if (responseBody.error && Array.isArray(responseBody.error)) {
        const errorMessages = responseBody.error.map((err) => {
          if (err.path && err.path.length > 0) {
            return `${err.path[0]}: ${err.message}`;
          }
          return err.message;
        });
        errorMessage = errorMessages.join(", ");
      } else if (responseBody.error && typeof responseBody.error === "string") {
        errorMessage = responseBody.error;
      }

      await alertError(errorMessage);
      return;
    }
    await alertSuccess("Produk berhasil dihapus.");
    setProducts((prev) => prev.filter((p) => p.product.id !== id));
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    const response = await ProductApi.getOwnProducts(1, 10);
    if (!response.ok) {
      alertError("Gagal mengambil produk. Silakan coba lagi.");
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
      alertError("Gagal mengambil kategori. Silakan coba lagi.");
      return;
    }
    const responseBody = await response.json();
    setCategories(responseBody.categories);
  };

  const fetchData = async () => {
    await Promise.all([fetchProducts(), fetchCategories()]);
  };

  useEffect(() => {
    fetchData();
  }, [showForm]);

  useEffect(() => {
    const selectedCategory = categories.find(
      (c) => c.id === parseInt(categoryId)
    );
    if (selectedCategory) {
      setCategoryName(selectedCategory.name);
    } else {
      setCategoryName("");
    }
  }, [categoryId, categories]);

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Kelola Produk BUMDes</h1>

        {/* ✅ Manajemen Kategori */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FaFolderPlus /> Kelola Kategori Produk
          </h2>

          <div className="flex flex-wrap gap-2 mb-3">
            {categories.length === 0 ? (
              <p className="text-gray-500 italic">Belum ada kategori</p>
            ) : (
              categories.map((c) => (
                <div
                  key={c.id}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded flex items-center gap-2"
                >
                  {c.name}
                  <button
                    onClick={() => handleDeleteCategory(c.id)}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nama kategori baru..."
              className="border p-2 rounded flex-1"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              required
            />
            <button
              onClick={handleAddCategory}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Tambah
            </button>
          </div>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 mb-4"
          >
            <FaPlus /> Tambah Produk
          </button>
        )}

        {showForm && (
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-lg font-semibold mb-3">
              {editingId ? "Edit Produk" : "Tambah Produk"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm">Nama Produk</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm">Harga</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm">Deskripsi</label>
                <textarea
                  className="w-full border p-2 rounded"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm">Kategori</label>
                <select
                  className="w-full border p-2 rounded"
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
                {categoryName && (
                  <p className="text-sm text-gray-500 mt-1">
                    Nama Kategori:{" "}
                    <span className="font-medium">{categoryName}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm">Link WhatsApp</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={linkWhatsapp}
                  onChange={(e) => setLinkWhatsapp(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm">Foto Produk</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full border p-2 rounded"
                  onChange={(e) => setFeaturedImage(e.target.files[0])}
                />

                {(featuredImage ||
                  (editingId &&
                    products.find((b) => b.id === editingId)
                      ?.featuredImage)) && (
                  <img
                    src={
                      featuredImage
                        ? URL.createObjectURL(featuredImage)
                        : products.find((b) => b.id === editingId)
                            ?.featuredImage
                    }
                    alt="preview"
                    className="mt-2 h-32 object-cover rounded"
                  />
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSubmit}
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.length === 0 ? (
            <p className="text-gray-500 italic">Belum ada produk</p>
          ) : (
            products.map((product) => (
              <div
                key={product.product.id}
                className="bg-white p-4 rounded shadow flex flex-col justify-between"
              >
                {/* ✅ Tampilkan Foto Produk */}

                <img
                  src={`${import.meta.env.VITE_BASE_URL}/products/images/${
                    product.product.featured_image
                  }`}
                  alt={product.product.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <div>
                  <h3 className="font-bold text-lg">{product.product.title}</h3>
                  <p className="text-gray-500 text-sm">
                    {categories.find(
                      (c) => c.id === product.product.category_id
                    )?.name || "Kategori dihapus"}
                  </p>
                  <p className="text-green-600 font-semibold mt-1">
                    {Helper.formatRupiah(product.product.price)}
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    {product.product.description}
                  </p>
                </div>

                <div className="flex justify-between mt-3">
                  <button
                    onClick={() => handleEdit(product.product.id)}
                    className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.product.id)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <FaTrash /> Hapus
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ✅ Pagination */}
        {products.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
