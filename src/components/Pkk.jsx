import { HiOutlineMail } from "react-icons/hi";
import { FaWpforms, FaUsers, FaGlobe } from "react-icons/fa";

export default function Pkk() {
  return (
    <div className="font-poppins text-gray-800">
      {/* ✅ HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center gap-8">
        {/* Text */}
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold">
            PKK DESA BABAKAN ASEM
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Pemberdayaan Keluarga Menuju Desa Sejahtera
          </p>
          <p className="mt-4">
            Pemberdayaan Kesejahteraan Keluarga adalah gerakan nasional dalam
            pembangunan masyarakat yang tumbuh dari bawah, dikelola oleh, untuk,
            dan bersama masyarakat menuju terwujudnya keluarga yang beriman,
            sejahtera, dan mandiri.
          </p>
        </div>

        {/* Gambar online */}
        <div className="flex-1">
          <img
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800"
            alt="PKK"
            className="rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* ✅ VISI & MISI */}
      <section className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-6 my-10">
        <div className="bg-yellow-100 p-6 rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold mb-4">Visi</h2>
          <p className="text-lg">
            Mewujudkan keluarga yang beriman, sejahtera, dan mandiri.
          </p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Misi</h2>
          <ul className="list-decimal list-inside space-y-2">
            <li>Meningkatkan Kualitas Hidup keluarga</li>
            <li>Mendorong Partisipasi Dalam Pembangunan Desa</li>
            <li>
              Mengembangkan ekonomi keluarga melalui UMKM & pemberdayaan
              masyarakat
            </li>
          </ul>
        </div>
      </section>

      {/* ✅ STRUKTUR ORGANISASI */}
      <section className="max-w-7xl mx-auto px-4 my-10">
        <h2 className="text-3xl font-bold text-center mb-6">
          Struktur Organisasi PKK Desa Babakan Asem
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {["Ketua PKK", "Sekretaris", "Bendahara", "Anggota"].map((role, i) => (
            <div
              key={i}
              className="p-4 border rounded-lg shadow hover:shadow-md transition"
            >
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200"
                alt="Profile"
                className="w-20 h-20 mx-auto rounded-full mb-3 object-cover"
              />
              <h3 className="font-bold">Nama Lengkap</h3>
              <p className="text-sm text-gray-600">{role}</p>
              <p className="text-xs text-gray-500">Masa Jabatan 2023-2028</p>
            </div>
          ))}
        </div>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-center">
          Struktur Organisasi PKK POKJA I-IV
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {["POKJA I", "POKJA II", "POKJA III", "POKJA IV"].map((pokja, i) => (
            <div
              key={i}
              className="p-4 border rounded-lg shadow hover:shadow-md transition"
            >
              <img
                src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=200"
                alt="Pokja"
                className="w-20 h-20 mx-auto rounded-full mb-3 object-cover"
              />
              <h3 className="font-bold">{pokja}</h3>
              <p className="text-sm text-gray-600">Ketua Pokja</p>
              <p className="text-xs text-gray-500">Masa Jabatan 2023-2028</p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ PROGRAM POKOK PKK */}
      <section className="max-w-7xl mx-auto px-4 my-10">
        <h2 className="text-3xl font-bold text-center mb-6">
          Program Pokok PKK
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="border rounded-lg shadow hover:shadow-md transition"
            >
              <img
                src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600"
                alt="Program PKK"
                className="rounded-t-lg h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold flex items-center gap-2">
                  <FaWpforms /> Nama Program
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Kegiatan PKK untuk meningkatkan kesejahteraan keluarga.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ KEGIATAN & AGENDA PKK */}
      <section className="max-w-7xl mx-auto px-4 my-10">
        <h2 className="text-3xl font-bold text-center mb-6">
          Kegiatan & Agenda PKK
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="border rounded-lg shadow hover:shadow-md transition"
            >
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600"
                alt="Kegiatan PKK"
                className="rounded-t-lg h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold flex items-center gap-2">
                  <FaUsers /> Judul Kegiatan
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Deskripsi singkat kegiatan PKK yang telah dilakukan.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ KELOMPOK POKJA */}
      <section className="max-w-7xl mx-auto px-4 my-10">
        <h2 className="text-3xl font-bold text-center mb-6">
          Kelompok POKJA
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            "Gotong Royong",
            "Pendidikan & Keterampilan",
            "Pangan, Sandang, Tata Rumah",
            "Kesehatan & Lingkungan",
          ].map((pokja, i) => (
            <div
              key={i}
              className="p-4 border rounded-lg shadow text-center hover:shadow-md transition"
            >
              <h3 className="font-bold flex items-center justify-center gap-2">
                <FaGlobe /> POKJA {i + 1}
              </h3>
              <p className="text-sm text-gray-600 mt-2">{pokja}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ GALERI PKK */}
      <section className="max-w-7xl mx-auto px-4 my-10">
        <h2 className="text-3xl font-bold text-center mb-6">Galeri PKK</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <img
              key={i}
              src="https://images.unsplash.com/photo-1493815793585-d94ccbc86df8?w=600"
              alt="Galeri PKK"
              className="rounded-lg shadow hover:scale-105 transition"
            />
          ))}
        </div>
        {/* Pagination */}
        <div className="flex justify-center mt-6 gap-2">
          <button className="px-3 py-1 border rounded">1</button>
          <button className="px-3 py-1 border rounded bg-[#B6F500] text-white">
            2
          </button>
          <button className="px-3 py-1 border rounded">3</button>
          <span className="px-3 py-1">...</span>
          <button className="px-3 py-1 border rounded">8</button>
        </div>
      </section>
    </div>
  );
}
