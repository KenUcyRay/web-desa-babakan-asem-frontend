import { useState } from "react";
import { HiOutlineMail } from "react-icons/hi";
import { FaWpforms, FaUsers, FaPhotoVideo } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../ui/Pagination";
import { HiHome } from "react-icons/hi";

export default function Pkk() {
  const navigate = useNavigate();

  const allGaleri = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    img: `https://images.unsplash.com/photo-1493815793585-d94ccbc86df8?w=600&random=${i}`,
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const galeriPerPage = 4;
  const indexOfLast = currentPage * galeriPerPage;
  const indexOfFirst = indexOfLast - galeriPerPage;
  const currentGaleri = allGaleri.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(allGaleri.length / galeriPerPage);

  return (
    <div className="font-poppins text-gray-800">
      {/* ✅ HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-green-700">
            PKK DESA BABAKAN ASEM
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Pemberdayaan Keluarga Menuju Desa Sejahtera
          </p>
          <p className="mt-4 leading-relaxed">
            Pemberdayaan Kesejahteraan Keluarga adalah gerakan nasional dalam
            pembangunan masyarakat yang tumbuh dari bawah, dikelola oleh, untuk,
            dan bersama masyarakat menuju terwujudnya keluarga yang beriman,
            sejahtera, dan mandiri.
          </p>
        </div>

        <div className="flex-1">
          <img
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800"
            alt="PKK"
            className="rounded-xl shadow-xl w-full object-cover"
          />
        </div>
      </section>

      {/* ✅ VISI & MISI */}
      <section className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-6 my-10">
        <div className="bg-yellow-50 p-6 rounded-xl shadow-md text-center hover:shadow-lg transition">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">Visi</h2>
          <p className="text-lg leading-relaxed">
            Mewujudkan keluarga yang beriman, sejahtera, dan mandiri.
          </p>
        </div>
        <div className="bg-green-50 p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">
            Misi
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Meningkatkan kualitas hidup keluarga</li>
            <li>Mendorong partisipasi dalam pembangunan desa</li>
            <li>
              Mengembangkan ekonomi keluarga melalui UMKM & pemberdayaan
              masyarakat
            </li>
          </ul>
        </div>
      </section>

      {/* ✅ PROGRAM POKOK PKK */}
      <section className="max-w-7xl mx-auto px-4 my-10">
        <h2 className="text-3xl font-bold text-center mb-6">
          Program Pokok PKK
        </h2>
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="border rounded-xl shadow hover:shadow-lg transition"
            >
              <img
                src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600"
                alt="Program PKK"
                className="rounded-t-xl h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold flex items-center gap-2 text-green-700">
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

      {/* ✅ AGENDA PENTING */}
      <section className="max-w-7xl mx-auto px-4 my-10">
        <h2 className="text-3xl font-bold text-center mb-6">
          Agenda Penting PKK
        </h2>
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="border rounded-xl shadow hover:shadow-lg transition"
            >
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600"
                alt="Kegiatan PKK"
                className="rounded-t-xl h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold flex items-center gap-2 text-green-700">
                  <FaUsers /> Judul Agenda
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Deskripsi singkat agenda penting PKK.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ CTA UNTUK STRUKTUR & GALERI */}
      <section className="max-w-4xl mx-auto px-4 my-16 text-center">
        <div className="bg-green-50 p-10 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-green-800 mb-4">
            Ingin Melihat Galeri & Struktur PKK?
          </h2>
          <p className="text-gray-700 mb-6">
            Dokumentasi kegiatan PKK dan struktur organisasi lengkap tersedia
            untuk Anda.
          </p>
          <Link
            to="/pkk/struktur"
            className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold rounded-xl bg-green-600 text-white shadow hover:bg-green-700 hover:scale-105 transition transform"
          >
            <FaPhotoVideo className="text-2xl" />
            Lihat Galeri & Struktur PKK
          </Link>
        </div>
      </section>
    </div>
  );
}
