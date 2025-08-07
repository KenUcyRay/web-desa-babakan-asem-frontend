import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

const MAP_TYPES = [
  { value: "POLYGON", label: "Polygon" },
  { value: "MARKER", label: "Marker" },
];

const DialogMap = ({ onSubmit, onClose }) => {
  const { i18n } = useTranslation();
  const [formData, setFormData] = useState({
    type: "POLYGON",
    name: "",
    description: "",
    year: 2025,
    coordinates: "",
    icon: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [iconPreview, setIconPreview] = useState("");
  const fileInputRef = useRef();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (name === "icon") {
      if (files && files[0]) {
        // Fix: Remove the duplicate icon key
        setFormData((prev) => ({ ...prev, icon: files[0] }));
        setIconPreview(URL.createObjectURL(files[0]));
      } else {
        // Fix: Remove the duplicate icon key here too
        setFormData((prev) => ({ ...prev, icon: null }));
        setIconPreview("");
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (onSubmit) {
        await onSubmit({
          ...formData,
        });
      }
      if (onClose) onClose();
    } catch (error) {
      console.error("Error submitting map data:", error);
      setErrors({
        submission:
          i18n.language === "en"
            ? "Failed to save map data"
            : "Gagal menyimpan data peta",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cleanup function to revoke object URL when component unmounts or preview changes
    return () => {
      if (iconPreview) {
        URL.revokeObjectURL(iconPreview);
      }
    };
  }, [iconPreview]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-lg border border-green-200 rounded-2xl shadow-2xl p-8 w-full max-w-3xl relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold"
          onClick={onClose}
          type="button"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          {i18n.language === "en" ? "Add Map Data" : "Tambah Data Peta"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              {i18n.language === "en" ? "Type" : "Tipe"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 bg-white"
            >
              {MAP_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.type && (
              <span className="text-xs text-red-500">{errors.type}</span>
            )}
          </div>
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              {i18n.language === "en" ? "Name" : "Nama"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
              placeholder={
                i18n.language === "en"
                  ? "e.g. Babakan Asem"
                  : "Contoh: Babakan Asem"
              }
            />
            {errors.name && (
              <span className="text-xs text-red-500">{errors.name}</span>
            )}
          </div>
          {/* Description */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              {i18n.language === "en" ? "Description" : "Deskripsi"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
              placeholder={
                i18n.language === "en"
                  ? "e.g. Area description"
                  : "Contoh: Wilayah Desa Babakan Asem"
              }
            />
            {errors.description && (
              <span className="text-xs text-red-500">{errors.description}</span>
            )}
          </div>
          {/* Year */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              {i18n.language === "en" ? "Year" : "Tahun"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
              min={1900}
              placeholder={
                i18n.language === "en" ? "e.g. 2025" : "Contoh: 2025"
              }
            />
            {errors.year && (
              <span className="text-xs text-red-500">{errors.year}</span>
            )}
          </div>

          {/* Coordinates & Icon Upload Row */}
          <div className="flex flex-row gap-4">
            {/* Coordinates */}
            <div className="flex-1">
              <label className="block text-gray-700 font-semibold mb-1">
                {i18n.language === "en" ? "Coordinates" : "Koordinat"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="coordinates"
                value={formData.coordinates}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 font-mono text-xs"
                rows={6}
                placeholder={
                  i18n.language === "en"
                    ? "Paste array of coordinates here, e.g. [[lng,lat],[lng,lat],...]\nFor marker: [[lng,lat]]"
                    : "Tempel array koordinat di sini, contoh: [[lng,lat],[lng,lat],...]\nUntuk marker: [[lng,lat]]"
                }
              />
              <span className="text-xs text-gray-500 block mt-1">
                {i18n.language === "en"
                  ? "Format: JSON array, example: [[lng,lat],[lng,lat],...]. For marker: [[lng,lat]]"
                  : "Format: JSON array, contoh: [[lng,lat],[lng,lat],...]. Untuk marker: [[lng,lat]]"}
              </span>
              {errors.coordinates && (
                <span className="text-xs text-red-500">
                  {errors.coordinates}
                </span>
              )}
              {errors.marker && (
                <span className="text-xs text-red-500">{errors.marker}</span>
              )}
            </div>

            {/* Icon Upload - Always present in layout but invisible when POLYGON */}
            <div
              className="flex-1"
              style={{
                visibility: formData.type === "MARKER" ? "visible" : "hidden",
                opacity: formData.type === "MARKER" ? 1 : 0,
              }}
            >
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  {i18n.language === "en"
                    ? "Icon (Image Only)"
                    : "Icon (Hanya Gambar)"}
                  <span className="text-xs text-gray-400 ml-2">
                    (PNG/JPG/SVG)
                  </span>
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="file"
                    name="icon"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleChange}
                    className="block text-sm text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    disabled={formData.type !== "MARKER"}
                  />
                  {formData.icon && (
                    <button
                      type="button"
                      className="ml-1 text-xs text-red-500 hover:underline"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, icon: null }));
                        setIconPreview("");
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                    >
                      {i18n.language === "en" ? "Remove" : "Hapus"}
                    </button>
                  )}
                </div>
                {iconPreview && (
                  <img
                    src={iconPreview}
                    alt="icon preview"
                    className="mt-2 h-12 w-12 object-contain border rounded shadow"
                  />
                )}
                {errors.icon && (
                  <span className="text-xs text-red-500 block">
                    {errors.icon}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
              onClick={onClose}
            >
              {i18n.language === "en" ? "Cancel" : "Batal"}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 flex items-center gap-2"
              disabled={loading}
            >
              {loading && (
                <span className="loader border-white border-t-green-600 border-2 rounded-full w-4 h-4 animate-spin"></span>
              )}
              {loading
                ? i18n.language === "en"
                  ? "Saving..."
                  : "Menyimpan..."
                : i18n.language === "en"
                ? "Save"
                : "Simpan"}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        .loader {
          border-width: 2px;
          border-style: solid;
          border-color: #fff #16a34a #fff #fff;
          border-radius: 50%;
          display: inline-block;
        }
      `}</style>
    </div>
  );
  // ...existing code...
};

export default DialogMap;
