import React from "react";

const Map = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-green-400 to-[#B6F500] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <FaMapMarkedAlt className="text-blue-700 text-xl" />
            </div>
            {t("adminDashboard.gisMapTitle") || "Peta Digital Desa"}
          </h2>

          {/* Filter Tahun - dari Tes.jsx */}
          <div className="flex items-center gap-4">
            <label className="text-black font-medium text-md">
              Pilih Tahun:
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 rounded-md border"
            >
              {[2025, 2024].map((y) => (
                <option key={y} value={y} className="text-black">
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="p-6 relative">
        <div className="rounded-xl overflow-hidden shadow-md border-2 border-green-100 relative">
          <MapContainer
            center={[-6.75, 108.05861]}
            zoom={15}
            scrollWheelZoom={true}
            className="w-full h-[500px]"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Render POI dan Polygon dari API */}
            {filteredData.map((item) =>
              item.type === "polygon" ? (
                (() => {
                  const polygonIdx = polygonLegendData.findIndex(
                    (p) => p.id === item.id
                  );
                  const color =
                    polygonLegendData[polygonIdx]?.color || "#2563eb";
                  return (
                    <Polygon
                      key={item.id}
                      positions={item.coordinates}
                      pathOptions={{
                        color,
                        weight: 2,
                        dashArray: "4, 4",
                        fillColor: "transparent",
                        opacity: 0.9,
                      }}
                    >
                      <Tooltip permanent={false} direction="center">
                        {item.name}
                      </Tooltip>
                      <Popup>
                        <div className="text-center">
                          <strong className="text-base" style={{ color }}>
                            {item.name}
                          </strong>
                          <p className="text-sm my-2">{item.description}</p>
                          <p className="text-xs text-gray-600">
                            Kecamatan: Congeang
                          </p>
                        </div>
                      </Popup>
                    </Polygon>
                  );
                })()
              ) : (
                <Marker
                  key={item.id}
                  position={item.coordinates[0]}
                  icon={createIcon(
                    item.icon || (iconError ? fallbackIconUrl : defaultIconUrl)
                  )}
                >
                  <Tooltip permanent={false}>{item.name}</Tooltip>
                  <Popup>
                    <div className="text-center">
                      <strong className="text-base text-red-600">
                        {item.name}
                      </strong>
                      <p className="text-sm my-2">{item.description}</p>
                      <p className="text-xs text-gray-600">
                        Koordinat: {item.coordinates[0][0].toFixed(6)},{" "}
                        {item.coordinates[0][1].toFixed(6)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )
            )}
          </MapContainer>
        </div>
      </div>

      {/* LEGENDA PETA - Gabungan static dan dynamic */}
      <div className="px-6 pb-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Legenda:</h3>
        </div>

        {/* Dynamic legend dari data API */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-3">
            Points of Interest:
          </h4>
          <div className="flex flex-wrap gap-4 mb-4">
            {/* Polygon legend */}
            {polygonLegendData.map((poly) => (
              <div
                key={`legend-poly-${poly.id}`}
                className="flex items-center gap-2"
              >
                <div
                  className="w-8 h-0 border-t-2 border-dashed"
                  style={{ borderColor: poly.color }}
                ></div>
                <span className="text-sm text-gray-700">{poly.label}</span>
              </div>
            ))}

            {/* Marker legend */}
            {legendItems
              .filter((item) => item.type === "marker")
              .map((item, index) => (
                <div
                  key={`legend-marker-${index}`}
                  className="flex items-center gap-2"
                >
                  <div
                    className="w-5 h-5 bg-contain bg-no-repeat"
                    style={{ backgroundImage: `url('${item.icon}')` }}
                  ></div>
                  <span className="text-sm text-gray-700">
                    {item.label}
                    {item.items &&
                      item.items.length > 1 &&
                      ` (${item.items.length})`}
                  </span>
                </div>
              ))}

            {legendItems.length === 0 && polygonLegendData.length === 0 && (
              <span className="text-sm text-gray-500 italic">
                Tidak ada item untuk ditampilkan
              </span>
            )}
          </div>

          {/* Detail POI */}
          {legendItems
            .filter(
              (item) =>
                item.type === "marker" && item.items && item.items.length > 0
            )
            .map((category, idx) => (
              <div key={`category-${idx}`} className="mt-3">
                <strong className="text-sm text-gray-600">
                  {category.label}:
                </strong>
                <div className="flex flex-wrap gap-3 mt-2">
                  {category.items.map((itemName, i) => {
                    // Find the corresponding marker data for icon
                    const markerData = filteredData.find(
                      (d) =>
                        d.type === "marker" &&
                        d.name === itemName &&
                        d.category === category.category
                    );
                    const iconUrl = markerData
                      ? markerData.icon
                      : iconError
                      ? fallbackIconUrl
                      : defaultIconUrl;
                    return (
                      <div
                        key={`poi-icon-${i}`}
                        className="flex items-center gap-2"
                      >
                        <div
                          className="w-5 h-5 bg-contain bg-no-repeat"
                          style={{ backgroundImage: `url('${iconUrl}')` }}
                        ></div>
                        <span className="text-sm text-gray-700">
                          {itemName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

          <div className="mt-4 text-right">
            <span className="text-xs text-gray-500 italic">
              Desa Babakan Asem, Kecamatan Congeang
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
