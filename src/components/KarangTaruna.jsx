import { HiOutlineMail } from "react-icons/hi";
import { FaUsers, FaWpforms } from "react-icons/fa";

export default function KarangTaruna() {
  const kegiatanDummy = [
    {
      id: 1,
      title: "Pelatihan Kepemudaan",
      lokasi: "Balai Desa",
      tanggal: "7 Juni 2025",
      waktu: "10:00 - 12:00",
      img: "https://picsum.photos/400/250?random=1",
    },
    {
      id: 2,
      title: "Bakti Sosial Desa",
      lokasi: "Lapangan Utama",
      tanggal: "14 Juni 2025",
      waktu: "08:00 - 11:00",
      img: "https://picsum.photos/400/250?random=2",
    },
    {
      id: 3,
      title: "Lomba Olahraga Pemuda",
      lokasi: "Lapangan Bola",
      tanggal: "21 Juni 2025",
      waktu: "13:00 - 16:00",
      img: "https://picsum.photos/400/250?random=3",
    },
  ];

  return (
    <div className="bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Judul halaman */}
        <div className="grid md:grid-cols-2 gap-6 items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Karang Taruna Desa Babakan Asem
            </h1>
            <p className="text-gray-600 mt-2">
              Pemuda Berkarya, Desa Berjaya. <br />
              Karang Taruna Desa Babakan Asem adalah wadah pembinaan dan
              pengembangan generasi muda yang bergerak di bidang kesejahteraan
              sosial, kepemudaan, dan kemasyarakatan.
            </p>
          </div>
          <img
            src="https://picsum.photos/500/300?random=4"
            alt="Karang Taruna"
            className="rounded-lg shadow-md"
          />
        </div>

        {/* Visi Misi */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-[#B6F500] p-6 rounded-lg shadow text-black">
            <h2 className="text-xl font-semibold">Visi</h2>
            <p className="mt-2">
              Menjadi pemuda yang aktif, kreatif, dan peduli terhadap pembangunan
              desa.
            </p>
          </div>
          <div className="bg-orange-200 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold">Misi</h2>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Mengembangkan potensi generasi muda</li>
              <li>Mengadakan kegiatan sosial dan budaya</li>
              <li>Menjadi penggerak kegiatan desa</li>
            </ul>
          </div>
        </div>

        {/* Struktur Organisasi */}
        <div className="bg-white rounded-lg shadow p-6 mb-10">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Struktur Organisasi Karang Taruna Desa Babakan Asem
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  alt="Profil"
                  className="w-20 h-20 rounded-full border-2 border-[#B6F500]"
                />
                <p className="font-semibold mt-2">
                  {i === 1 ? "H. Daryanto Sasmita" : "Nama"}
                </p>
                <p className="text-sm text-gray-500">Jabatan</p>
                <p className="text-xs text-gray-400">2020 - 2026</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dokumentasi Kegiatan */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            Dokumentasi Kegiatan Karang Taruna
          </h2>
          <p className="text-gray-600 mb-6">
            Kegiatan terbaru Karang Taruna Desa Babakan Asem
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {kegiatanDummy.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-500">
                    Lokasi: {item.lokasi}
                    <br />
                    Tanggal: {item.tanggal}
                    <br />
                    Waktu: {item.waktu}
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Vitae ullam vel est non lorem.
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* dummy */}
          <div className="flex justify-center gap-2 mt-6">
            <button className="px-3 py-1 border rounded">1</button>
            <button className="px-3 py-1 border rounded bg-[#B6F500]">
              2
            </button>
            <button className="px-3 py-1 border rounded">3</button>
            <button className="px-3 py-1 border rounded">...</button>
            <button className="px-3 py-1 border rounded">8</button>
          </div>
        </div>
      </div>
    </div>
  );
}
