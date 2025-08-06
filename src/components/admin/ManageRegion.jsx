import { useState } from "react";
import { useTranslation } from "react-i18next";
import { alertSuccess, alertError } from "../../libs/alert";
import { Helper } from "../../utils/Helper";
// import { RegionApi } from "../../libs/api/RegionApi"; // Uncomment and create this API if needed

export default function ManageRegion() {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "polygon",
    year: 2024,
    coordinates: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // For coordinates, expect a JSON string (array of arrays)
  const handleCoordinatesChange = (e) => {
    setFormData((prev) => ({ ...prev, coordinates: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Parse coordinates from textarea (JSON)
      let coordinatesParsed = [];
      let coordinatesObj = { type: formData.type, coordinates: [] };
      try {
        coordinatesParsed = JSON.parse(formData.coordinates);
        if (formData.type === "polygon") {
          // coordinatesParsed must be [[lng,lat], ...]
          if (
            !Array.isArray(coordinatesParsed) ||
            !coordinatesParsed.every(
              (arr) =>
                Array.isArray(arr) &&
                arr.length === 2 &&
                arr.every((n) => typeof n === "number")
            )
          ) {
            await alertError(
              i18n.language === "en"
                ? "Coordinates must be an array of [lng,lat] pairs!"
                : "Koordinat harus berupa array pasangan [lng,lat]!"
            );
            setLoading(false);
            return;
          }
          coordinatesObj.coordinates = [coordinatesParsed]; // [[[lng,lat], ...]]
        } else {
          coordinatesObj.coordinates = coordinatesParsed;
        }
      } catch (err) {
        // Fallback: always send coordinates as object
        coordinatesObj = { type: formData.type, coordinates: [] };
        await alertError("Format koordinat tidak valid! Harus array JSON.");
        setLoading(false);
        return;
      }
      const payload = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        year: Number(formData.year),
        coordinates: coordinatesObj,
      };
      const { MapApi } = await import("../../libs/api/MapApi");
      const response = await MapApi.createRegion(payload, i18n.language);
      const responseBody = await response.json();
      if (!response.ok) {
        console.log("Error creating region:", responseBody);
        await Helper.errorResponseHandler(responseBody);
        setLoading(false);
        return;
      }
      await alertSuccess(
        i18n.language === "en"
          ? "Region added successfully!"
          : "Region berhasil ditambahkan!"
      );
      setFormData({
        name: "",
        description: "",
        type: "polygon",
        year: 2024,
        coordinates: "",
      });
    } catch (err) {
      await alertError(
        i18n.language === "en"
          ? "Failed to add region!"
          : "Gagal menambah region!"
      );
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {i18n.language === "en"
            ? "Add Region (Area)"
            : "Tambah Region (Wilayah)"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {i18n.language === "en" ? "Region Name" : "Nama Region"}{" "}
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
              placeholder={
                i18n.language === "en"
                  ? "e.g. Area description"
                  : "Contoh: Wilayah Desa Babakan Asem"
              }
            />
          </div>
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
            >
              <option value="polygon">Polygon</option>
            </select>
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
              placeholder={
                i18n.language === "en" ? "e.g. 2024" : "Contoh: 2024"
              }
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {i18n.language === "en"
                ? "Coordinates (Polygon)"
                : "Koordinat (Polygon)"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              name="coordinates"
              value={formData.coordinates}
              onChange={handleCoordinatesChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 font-mono text-xs"
              rows={8}
              placeholder={
                i18n.language === "en"
                  ? "Paste array of coordinates here, e.g. [[lng,lat],[lng,lat],...]"
                  : "Tempel array koordinat di sini, contoh: [[lng,lat],[lng,lat],...]"
              }
            />
            <span className="text-xs text-gray-500">
              {i18n.language === "en"
                ? "Format: JSON array, example: [[lng,lat],[lng,lat],...]"
                : "Format: JSON array, contoh: [[lng,lat],[lng,lat],...]"}
            </span>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading
              ? i18n.language === "en"
                ? "Saving..."
                : "Menyimpan..."
              : i18n.language === "en"
              ? "Save Region"
              : "Simpan Region"}
          </button>
        </form>
      </div>
    </div>
  );
}
