import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslation } from "react-i18next";
import { FaMapMarkedAlt, FaInfoCircle } from "react-icons/fa";

const GisDesa = () => {
  const { t } = useTranslation();
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("/geojson/desa-babakan-asem.geojson")
      .then((res) => {
        if (!res.ok)
          throw new Error(
            t("gisDesa.errors.loadMapData") || "Failed to load map data"
          );
        return res.json();
      })
      .then((data) => {
        setGeoData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const style = {
    color: "#22c55e",
    weight: 3,
    fillColor: "#86efac",
    fillOpacity: 0.6,
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        const name =
          feature.properties?.name ||
          t("gisDesa.defaultVillageName") ||
          "Desa Babakan Asem";
        layer
          .bindPopup(
            `<div class="p-2"><b class="text-green-700">${name}</b></div>`
          )
          .openPopup();
      },
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 4,
          color: "#16a34a",
          fillOpacity: 0.8,
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle(style);
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-300 rounded w-1/2 mx-auto mb-8"></div>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            <span className="text-green-600">
              🗺️ {t("gisDesa.header.title") || "Sistem Informasi"}
            </span>{" "}
            {t("gisDesa.header.geografis") || "Geografis"}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {t("gisDesa.header.description") ||
              "Peta digital wilayah Desa Babakan Asem dengan informasi geografis dan administratif yang lengkap"}
          </p>
        </div>

        {/* Interactive Map */}
        <div className="bg-green rounded-x1 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-400 to-[#B6F500] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <FaMapMarkedAlt className="text-blue-700 text-xl" />
                </div>
                {t("gisDesa.interactiveMap.title") ||
                  "Peta Interaktif Desa Babakan Asem"}
              </h2>
              <div className="text-white text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                {t("gisDesa.interactiveMap.zoom") || "Zoom"}: 15x
              </div>
            </div>
          </div>

          <div className="p-6">
            {error ? (
              <div className="text-center py-12">
                <div className="bg-red-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                  <FaInfoCircle className="text-red-500 text-3xl" />
                </div>
                <h3 className="text-lg font-semibold text-red-600 mb-2">
                  {t("gisDesa.errors.failedToLoadMap") || "Gagal Memuat Peta"}
                </h3>
                <p className="text-red-500">{error}</p>
              </div>
            ) : (
              <div className="rounded-xl overflow-hidden shadow-md border-2 border-green-100">
                <MapContainer
                  center={[-6.75, 108.05]}
                  zoom={15}
                  scrollWheelZoom={true}
                  className="w-full h-[500px]"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {geoData && (
                    <GeoJSON
                      data={geoData}
                      style={style}
                      onEachFeature={onEachFeature}
                    />
                  )}
                </MapContainer>
              </div>
            )}
          </div>
        </div>

        {/* Map Legend */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaInfoCircle className="text-green-600" />
            {t("gisDesa.legend.title") || "Legenda Peta"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-4 h-4 bg-green-400 border-2 border-green-600 rounded"></div>
              <span className="text-sm font-medium text-gray-700">
                {t("gisDesa.legend.villageArea") || "Wilayah Desa"}
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-4 h-4 bg-blue-400 rounded"></div>
              <span className="text-sm font-medium text-gray-700">
                {t("gisDesa.legend.riverIrrigation") || "Sungai/Irigasi"}
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-4 h-1 bg-gray-600"></div>
              <span className="text-sm font-medium text-gray-700">
                {t("gisDesa.legend.mainRoad") || "Jalan Utama"}
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                {t("gisDesa.legend.publicFacilities") || "Fasilitas Umum"}
              </span>
            </div>
          </div>
        </div>

        {/* Geographic Information */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-400 to-[#B6F500] p-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <FaInfoCircle className="text-green-400 text-xl" />
              </div>
              {t("gisDesa.geoInfo.title") || "Informasi Geografis Wilayah"}
            </h3>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-green-700 mb-3">
                  {t("gisDesa.geoInfo.locationTitle") ||
                    "Lokasi dan Batas Wilayah"}
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {t("gisDesa.geoInfo.locationDescription1") ||
                    "Desa Babakan Asem terletak di wilayah Kecamatan"}{" "}
                  <span className="font-semibold text-green-600">
                    {t("gisDesa.geoInfo.subdistrict") || "[isi kecamatan]"}
                  </span>
                  , {t("gisDesa.geoInfo.regency") || "Kabupaten"}{" "}
                  <span className="font-semibold text-green-600">
                    {t("gisDesa.geoInfo.regencyName") || "[isi kabupaten]"}
                  </span>
                  , {t("gisDesa.geoInfo.province") || "Provinsi"}{" "}
                  <span className="font-semibold text-green-600">
                    {t("gisDesa.geoInfo.provinceName") || "[isi provinsi]"}
                  </span>
                  .
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {t("gisDesa.geoInfo.locationDescription2") ||
                    "Wilayah ini memiliki kontur datar hingga sedikit berbukit, serta dilalui oleh beberapa jalur irigasi dan akses jalan desa yang menghubungkan antar dusun."}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-green-700 mb-3">
                  {t("gisDesa.geoInfo.facilitiesTitle") ||
                    "Fasilitas dan Infrastruktur"}
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {t("gisDesa.geoInfo.facilitiesDescription") ||
                    "Secara administratif, desa ini terbagi menjadi beberapa dusun dan RT/RW, serta memiliki fasilitas umum seperti kantor desa, sekolah dasar, masjid, dan lapangan olahraga."}
                </p>
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                  <p className="text-sm text-green-800">
                    <strong>{t("gisDesa.geoInfo.tips") || "Tips"}:</strong>{" "}
                    {t("gisDesa.geoInfo.tipsDescription") ||
                      "Klik pada area peta interaktif di atas untuk melihat informasi detail wilayah."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>
            {t("gisDesa.footer.lastUpdated") || "Peta terakhir diperbarui"}:{" "}
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()}{" "}
            {t("gisDesa.footer.copyright") ||
              "Sistem Informasi Geografis Desa Babakan Asem"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GisDesa;
