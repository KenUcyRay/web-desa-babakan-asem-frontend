import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Peta from "../../assets/map.png";

const GisDesa = () => {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    fetch("/geojson/desa-babakan-asem.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data));
  }, []);

  const style = {
    color: "#28a745",
    weight: 2,
    fillColor: "#a0e7a0",
    fillOpacity: 0.5,
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        const name = feature.properties?.name || "Desa Babakan Asem";
        layer.bindPopup(`<b>${name}</b>`).openPopup();
      },
    });
  };

  return (
    <div className="p-6 space-y-6 bg-white">
      {/* JUDUL */}
      <h2 className="text-3xl font-bold text-center text-green-700">
        Peta Wilayah Desa Babakan Asem
      </h2>

      {/* PETA */}
      <div className="rounded-xl shadow-md overflow-hidden border border-gray-300">
        <MapContainer
          center={[-6.75, 108.05]}
          zoom={15}
          scrollWheelZoom={true}
          className="w-full h-[400px]"
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

      {/* GAMBAR PETA */}
      <div className="flex justify-center">
        <img
          src={Peta}
          alt="Peta Desa Babakan Asem"
          className="max-w-full h-auto rounded-xl shadow"
        />
      </div>

      {/* DESKRIPSI GEOGRAFI */}
      <div className="bg-gray-50 p-4 rounded-xl shadow text-gray-700 leading-relaxed">
        <h3 className="text-xl font-semibold mb-2 text-green-600">Keterangan Wilayah</h3>
        <p>
          Desa Babakan Asem terletak di wilayah Kecamatan <i>[isi kecamatan]</i>,
          Kabupaten <i>[isi kabupaten]</i>, Provinsi <i>[isi provinsi]</i>. Wilayah
          ini memiliki kontur datar hingga sedikit berbukit, serta dilalui oleh
          beberapa jalur irigasi dan akses jalan desa.
        </p>
        <p className="mt-2">
          Secara administratif, desa ini terbagi menjadi beberapa dusun dan RT/RW,
          serta memiliki fasilitas umum seperti kantor desa, sekolah dasar, masjid,
          dan lapangan olahraga.
        </p>
      </div>
    </div>
  );
};

export default GisDesa;
