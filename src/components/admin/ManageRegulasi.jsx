// src/components/admin/ManageRegulasi.jsx
import { useState, useEffect, useRef } from "react";
import { FaPlus, FaEdit, FaTrash, FaFileAlt, FaDownload, FaUpload, FaTimes, FaSave, FaTimesCircle } from "react-icons/fa";
import { RegulationApi } from "../../libs/api/RegulationApi";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";

export default function ManageRegulasi() {
  const [regulations, setRegulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: "", year: new Date().getFullYear() });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    fetchRegulations();
  }, []);

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showForm]);

  const fetchRegulations = async () => {
    try {
      setLoading(true);
      const response = await RegulationApi.getAll();
      if (response.success) {
        setRegulations(response.data || []);
      } else {
        console.error("Failed to fetch regulations:", response.errors);
        await alertError("Gagal memuat data regulasi: " + response.errors);
      }
    } catch (error) {
      console.error("Error fetching regulations:", error);
      await alertError("Terjadi kesalahan saat memuat data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi input
    if (!formData.title?.trim()) {
      await alertError("Judul regulasi harus diisi");
      return;
    }
    if (!formData.year || formData.year < 1900 || formData.year > 2030) {
      await alertError("Tahun tidak valid");
      return;
    }
    if (!selectedFile) {
      await alertError("File PDF harus dipilih");
      return;
    }

    try {
      setUploading(true);
      const data = new FormData();
      data.append("title", formData.title.trim());
      data.append("year", String(formData.year));
      data.append("file", selectedFile);

      const response = await RegulationApi.create(data);

      if (response.success) {
        await fetchRegulations();
        resetForm();
        await alertSuccess("Regulasi berhasil ditambahkan");
      } else {
        console.error("Operation failed:", response.errors);
        await alertError("Operasi gagal: " + response.errors);
      }
    } catch (error) {
      console.error("Error:", error);
      await alertError("Terjadi kesalahan. Periksa koneksi internet Anda.");
    } finally {
      setUploading(false);
    }
  };



  const handleDelete = async (id, title) => {
    const confirmed = await alertConfirm(`Apakah Anda yakin ingin menghapus regulasi "${title}"?`);
    if (!confirmed) return;
    
    try {
      const response = await RegulationApi.delete(id);
      if (response.success) {
        await fetchRegulations();
        await alertSuccess("Regulasi berhasil dihapus");
      } else {
        await alertError("Gagal menghapus regulasi: " + response.errors);
      }
    } catch (error) {
      console.error("Error:", error);
      await alertError("Terjadi kesalahan saat menghapus");
    }
  };

  const handleDownload = (regulation) => {
    try {
      RegulationApi.downloadFile(regulation.id);
    } catch (error) {
      console.error("Download error:", error);
      alertError("Gagal mendownload file");
    }
  };

  const resetForm = () => {
    setFormData({ title: "", year: new Date().getFullYear() });
    setSelectedFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("Selected file:", file);
    
    // Validasi tipe file
    if (file.type !== "application/pdf") {
      alertError("Hanya file PDF yang diperbolehkan");
      e.target.value = "";
      return;
    }
    
    // Validasi ukuran file (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alertError("Ukuran file maksimal 10MB");
      e.target.value = "";
      return;
    }
    
    setSelectedFile(file);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return Math.round(bytes / 1024) + " KB";
    return Math.round(bytes / 1048576) + " MB";
  };

  return (
    <div className="bg-gray-50 min-h-screen p-3 sm:p-4 md:p-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6 md:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-800 flex items-center gap-2 md:gap-3">
              <FaFileAlt className="text-emerald-600" />
              Kelola Regulasi
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Kelola dokumen regulasi dan peraturan desa
            </p>
          </div>

          <button
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg shadow-md transition text-sm sm:text-base w-full sm:w-auto mt-2 sm:mt-0"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <FaPlus /> Tambah Regulasi
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div
            ref={formRef}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6 md:mb-8"
          >
            <div className="flex justify-between items-center mb-3 sm:mb-5">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Tambah Regulasi Baru
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 transition p-1 rounded-full hover:bg-gray-100"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Judul Regulasi *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                      placeholder="Masukkan judul regulasi"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Tahun *
                    </label>
                    <input
                      type="number"
                      min="1900"
                      max="2030"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      File PDF *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 sm:p-6 hover:border-emerald-400 transition-colors">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                        <FaUpload className="text-gray-400 text-2xl sm:text-3xl mb-2 sm:mb-3" />
                        <span className="text-sm sm:text-base text-gray-600 text-center">
                          {selectedFile ? selectedFile.name : "Klik untuk memilih file PDF"}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-400 mt-1">Maksimal 10MB</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-none"
                >
                  <FaSave />
                  {uploading ? "Memproses..." : "Simpan Regulasi"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl transition"
                >
                  <FaTimes /> Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Regulation List */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8 text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-10 w-10 md:h-12 md:w-12 bg-gray-200 rounded-full mb-3 md:mb-4"></div>
              <div className="h-3 md:h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 md:h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ) : regulations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8 text-center">
            <FaFileAlt className="text-3xl md:text-4xl text-gray-400 mx-auto mb-3 md:mb-4" />
            <h3 className="text-lg md:text-xl font-medium text-gray-700 mb-2">
              Belum Ada Regulasi
            </h3>
            <p className="text-sm md:text-base text-gray-500 mb-3 sm:mb-4">
              {showForm
                ? "Silakan lengkapi form di atas untuk menambahkan regulasi"
                : "Tidak ada regulasi yang tersedia saat ini."}
            </p>
            {!showForm && (
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg shadow-md transition w-full sm:w-auto"
              >
                <FaPlus /> Tambah Regulasi
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Judul
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tahun
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ukuran
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal Upload
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {regulations.map((regulation, index) => (
                    <tr key={regulation.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                          {regulation.title}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{regulation.year}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="text-sm text-gray-900 truncate max-w-xs">
                          {regulation.fileName}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatFileSize(regulation.fileSize)}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(regulation.createdAt).toLocaleDateString('id-ID')}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleDownload(regulation)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Download"
                          >
                            <FaDownload size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(regulation.id, regulation.title)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Hapus"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card view */}
            <div className="sm:hidden space-y-3 p-3">
              {regulations.map((regulation, index) => (
                <div
                  key={regulation.id}
                  className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-800 text-sm pr-2">
                      {regulation.title}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {regulation.year}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
                    <div>
                      <div className="text-gray-500 uppercase mb-1">File</div>
                      <div className="truncate">{regulation.fileName}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 uppercase mb-1">Ukuran</div>
                      <div>{formatFileSize(regulation.fileSize)}</div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-2">
                    Upload: {new Date(regulation.createdAt).toLocaleDateString('id-ID')}
                  </div>

                  <div className="border-t border-gray-100 pt-2 mt-2 flex justify-end gap-3">
                    <button
                      onClick={() => handleDownload(regulation)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition"
                      title="Download"
                    >
                      <FaDownload size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(regulation.id, regulation.title)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition"
                      title="Hapus"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}