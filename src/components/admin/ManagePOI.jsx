import { useState } from "react";
import { useTranslation } from "react-i18next";
import { alertSuccess, alertError } from "../../libs/alert";
import { Helper } from "../../utils/Helper";
// import { POIApi } from "../../libs/api/POIApi"; // Uncomment and create this API if needed

export default function ManagePOI() {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "marker",
    year: 2025,
    latitude: "",
    longitude: "",
    icon: "",
    regionId: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Prepare payload for API
      const payload = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        year: Number(formData.year),
        coordinates: [[Number(formData.latitude), Number(formData.longitude)]],
        icon: formData.icon,
        regionId: formData.regionId,
      };
      const { MapApi } = await import("../../libs/api/MapApi");
      const response = await MapApi.createPoi(payload, i18n.language);
      const responseBody = await response.json();
      if (!response.ok) {
        await Helper.errorResponseHandler(responseBody);
        setLoading(false);
        return;
      }
      await alertSuccess(
        i18n.language === "en"
          ? "POI added successfully!"
          : "POI berhasil ditambahkan!"
      );
      setFormData({
        name: "",
        description: "",
        type: "marker",
        year: 2025,
        latitude: "",
        longitude: "",
        icon: "",
        regionId: "",
      });
    } catch (err) {
      await alertError(
        i18n.language === "en" ? "Failed to add POI!" : "Gagal menambah POI!"
      );
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Tambah POI (Point of Interest)
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Nama POI
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Deskripsi
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Tipe</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            >
              <option value="marker">Marker</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Tahun
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Latitude
              </label>
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
                step="any"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Longitude
              </label>
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
                step="any"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              URL Icon
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Region ID
            </label>
            <input
              type="text"
              name="regionId"
              value={formData.regionId}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan POI"}
          </button>
        </form>
      </div>
    </div>
  );
}
