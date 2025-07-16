import galeri1 from "../assets/galeri.jpg";
import SidebarInfo from "./SidebarInfo";

export default function Galery() {
  const dataGambar = [galeri1, galeri1, galeri1, galeri1, galeri1, galeri1];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Galeri utama */}
      <div className="md:col-span-3 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Galeri Kegiatan Desa
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {dataGambar.map((img, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={img}
                alt={`Galeri ${i + 1}`}
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <aside>
        <SidebarInfo />
      </aside>
    </div>
  );
}
