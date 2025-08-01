import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import peta from "../../assets/peta.png";

const GisDesa = () => {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    fetch("/geojson/desa-babakan-asem.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data));
  }, []);

  const onEachFeature = (feature, layer) => {
    const { nama, kategori } = feature.properties;
    if (nama) {
      layer.bindPopup(`<b>${nama}</b><br/>Kategori: ${kategori}`);
    }

    if (feature.geometry.type === "Polygon") {
      layer.setStyle({
        color: kategori === "batas_desa" ? "red" :
               kategori === "olahraga" ? "green" : "blue",
        weight: 2,
        fillOpacity: 0.3,
      });
    }

    if (feature.geometry.type === "LineString") {
      layer.setStyle({
        color: "orange",
        weight: 3,
      });
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">GIS Desa Babakan Asem</h1>

      {/* Google Maps Embed */}
      <div className="w-full h-[400px] shadow-lg border rounded-xl overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50846.83215472047!2d108.04488070198364!3d-6.7568080545342095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f2aaf583cd373%3A0x997e0a8c838d37df!2sBabakan%20Asem%2C%20Kec.%20Conggeang%2C%20Kabupaten%20Sumedang%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1753327873604!5m2!1sid!2sid"
          width="100%"
          height="100%"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Peta Interaktif"
        ></iframe>
      </div>

      {/* Leaflet GeoJSON Map */}
      <div className="w-full h-[500px] shadow-lg border rounded-xl overflow-hidden">
        <MapContainer center={[-6.0758, 106.6605]} zoom={16} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {geoData && <GeoJSON data={geoData} onEachFeature={onEachFeature} />}
        </MapContainer>
      </div>

      {/* Gambar Peta Statis */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Peta Wilayah Desa</h2>
        <img src={peta} alt="Peta Desa Babakan Asem" className="w-full rounded-lg shadow-md border" />
      </div>

      {/* Deskripsi Geografis */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
        <h2 className="text-xl font-semibold mb-2">Deskripsi Geografis</h2>
        <p className="text-gray-700 leading-relaxed">
          Desa Babakan Asem merupakan salah satu desa yang terletak di Kecamatan Conggeang, Kabupaten Sumedang,
          Provinsi Jawa Barat. Secara geografis, desa ini dikelilingi oleh hamparan sawah, kebun, dan perbukitan kecil
          yang menjadikannya kaya akan potensi pertanian dan kehutanan. Desa ini memiliki akses jalan yang cukup baik
          dan berada tidak jauh dari pusat kecamatan, sehingga memudahkan mobilitas masyarakat. Iklim di wilayah ini
          adalah tropis basah dengan curah hujan tinggi dan suhu yang relatif sejuk.
        </p>
      </div>
    </div>
  );
};

export default GisDesa;
