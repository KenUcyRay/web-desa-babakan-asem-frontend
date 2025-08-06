import { useState } from "react";
import { useTranslation } from "react-i18next";

const MAP_TYPES = [
  { value: "polygon", label: "Polygon" },
  { value: "marker", label: "Marker" },
];

const DialogMap = ({ onSubmit, onClose }) => {
  const { i18n } = useTranslation();
  const [formData, setFormData] = useState({
    type: "polygon",
    name: "",
    description: "",
    year: 2024,
    coordinates: "",
    icon: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.type) errs.type = "Type is required";
    if (!formData.name)
      errs.name =
        i18n.language === "en" ? "Name is required" : "Nama wajib diisi";
    if (!formData.description)
      errs.description =
        i18n.language === "en"
          ? "Description is required"
          : "Deskripsi wajib diisi";
    if (!formData.year || isNaN(formData.year) || formData.year < 1900)
      errs.year =
        i18n.language === "en" ? "Year must be >= 1900" : "Tahun minimal 1900";
    if (!formData.coordinates)
      errs.coordinates =
        i18n.language === "en"
          ? "Coordinates required"
          : "Koordinat wajib diisi";
    // icon is optional
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    let coordinatesParsed;
    try {
      coordinatesParsed = JSON.parse(formData.coordinates);
      if (
        !Array.isArray(coordinatesParsed) ||
        !coordinatesParsed.every((arr) =>
          Array.isArray(arr)
            ? arr.every((n) => typeof n === "number")
            : typeof arr === "number"
        )
      ) {
        throw new Error();
      }
    } catch {
      setErrors({
        coordinates:
          i18n.language === "en"
            ? "Invalid coordinates format!"
            : "Format koordinat tidak valid!",
      });
      return;
    }
    setLoading(true);
    // Submit ke parent atau API
    if (onSubmit) {
      await onSubmit({ ...formData, coordinates: coordinatesParsed });
    }
    setLoading(false);
    if (onClose) onClose();
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-lg border border-green-200 rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-6 text-center">
          {i18n.language === "en" ? "Add Map Data" : "Tambah Data Peta"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {i18n.language === "en" ? "Type" : "Tipe"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
              required
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
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {i18n.language === "en" ? "Name" : "Nama"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
              required
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
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {i18n.language === "en" ? "Description" : "Deskripsi"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
              required
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
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {i18n.language === "en" ? "Year" : "Tahun"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
              required
              min={1900}
              placeholder={
                i18n.language === "en" ? "e.g. 2024" : "Contoh: 2024"
              }
            />
            {errors.year && (
              <span className="text-xs text-red-500">{errors.year}</span>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {i18n.language === "en" ? "Coordinates" : "Koordinat"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              name="coordinates"
              value={formData.coordinates}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 font-mono text-xs"
              rows={6}
              required
              placeholder={
                i18n.language === "en"
                  ? "Paste array of coordinates here, e.g. [[lng,lat],[lng,lat],...] or [lng,lat]"
                  : "Tempel array koordinat di sini, contoh: [[lng,lat],[lng,lat],...] atau [lng,lat]"
              }
            />
            {errors.coordinates && (
              <span className="text-xs text-red-500">{errors.coordinates}</span>
            )}
            <span className="text-xs text-gray-500 block mt-1">
              {i18n.language === "en"
                ? "Format: JSON array, example: [[lng,lat],[lng,lat],...] or [lng,lat]"
                : "Format: JSON array, contoh: [[lng,lat],[lng,lat],...] atau [lng,lat]"}
            </span>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {i18n.language === "en" ? "Icon URL" : "URL Icon"}
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
              placeholder={
                i18n.language === "en"
                  ? "e.g. https://..."
                  : "Contoh: https://..."
              }
            />
          </div>
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
              className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700"
              disabled={loading}
            >
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
    </div>
  );
};

export default DialogMap;
