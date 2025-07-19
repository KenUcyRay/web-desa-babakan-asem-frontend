import { FaSeedling, FaHorse, FaTree } from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from "react-router-dom";
import { HiHome } from "react-icons/hi";

export default function PotensiDesa() {
  const navigate = useNavigate();

  const carouselImages = [
    {
      src: "https://picsum.photos/1000/400?random=1",
      caption: "Wisata Desa - Alam yang Asri",
    },
    {
      src: "https://picsum.photos/1000/400?random=2",
      caption: "Kerajinan Tangan Warga",
    },
    {
      src: "https://picsum.photos/1000/400?random=3",
      caption: "Hasil Panen Desa",
    },
  ];

  return (
    <div className="bg-gray-50 py-10 font-poppins">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Judul Halaman */}
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Potensi Desa
        </h1>
        <p className="text-center text-gray-600 mt-2 mb-10">
          Mata pencaharian utama penduduk Desa Babakan Asem adalah sebagai
          petani baik buruh tani maupun petani mandiri yang menggarap lahan
          milik sendiri.
        </p>

        {/* ✅ Potensi Utama */}
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(320px,1fr))] mb-10">
          {/* Pertanian */}
          <div className="bg-[#B6F500] p-6 rounded-lg shadow flex gap-4 items-center hover:shadow-xl transition">
            <img
              src="https://picsum.photos/200/150?random=4"
              alt="Pertanian"
              className="rounded-md w-40 h-28 object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaSeedling /> Pertanian
              </h2>
              <p className="text-sm mt-2 text-gray-800">
                Mayoritas penduduk bekerja di sektor pertanian seperti padi,
                jagung, ubi kayu, kacang tanah, dan sayuran.
              </p>
            </div>
          </div>

          {/* Peternakan */}
          <div className="bg-orange-200 p-6 rounded-lg shadow flex gap-4 items-center hover:shadow-xl transition">
            <img
              src="https://picsum.photos/200/150?random=5"
              alt="Peternakan"
              className="rounded-md w-40 h-28 object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaHorse /> Peternakan
              </h2>
              <p className="text-sm mt-2 text-gray-800">
                Peternakan sapi, kambing, ayam, & domba untuk konsumsi lokal
                serta penunjang ekonomi warga.
              </p>
            </div>
          </div>

          {/* Perkebunan */}
          <div className="bg-blue-100 p-6 rounded-lg shadow flex gap-4 items-center hover:shadow-xl transition md:col-span-2">
            <img
              src="https://picsum.photos/200/150?random=6"
              alt="Perkebunan"
              className="rounded-md w-40 h-28 object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaTree /> Perkebunan
              </h2>
              <p className="text-sm mt-2 text-gray-800">
                Perkebunan mangga, pisang, dan tanaman hortikultura untuk
                tambahan penghasilan warga.
              </p>
            </div>
          </div>
        </div>

        {/* ✅ Wisata Desa */}
        <h2 className="text-2xl font-bold text-center mb-4">Wisata Desa</h2>
        <p className="text-center text-gray-600 mb-6">
          Semua individu pasti butuh hiburan – Wisata Alam Khas Desa Babakan
          Asem
        </p>

        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          interval={3000}
        >
          {carouselImages.map((item, index) => (
            <div key={index}>
              <img
                src={item.src}
                alt={item.caption}
                className="rounded-lg shadow-md"
              />
              <p className="legend">{item.caption}</p>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
