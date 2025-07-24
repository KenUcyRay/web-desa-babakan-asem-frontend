import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaTiktok,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { HiHome } from "react-icons/hi";
import kumpul from "../../assets/kumpul.jpg";

export default function ProfilDesa() {
  const navigate = useNavigate();

  return (
    <div className="font-poppins bg-gray-50">
      {/* ✅ Bagian Judul + Deskripsi Singkat */}
      <section className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl font-bold text-green-700 mb-4">
            Profil Desa Babakan Asem
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            Desa Babakan Asem adalah desa yang kaya akan sejarah, budaya, dan
            potensi masyarakatnya. Dengan semangat kebersamaan dan gotong
            royong, desa ini terus berkembang menuju masa depan yang lebih baik,
            tetap menjaga nilai-nilai tradisi namun beradaptasi dengan
            perkembangan zaman.
          </p>
        </div>
        <div className="flex justify-center">
          <img
            src={kumpul}
            alt="Warga Desa Berkumpul"
            className="rounded-xl shadow-lg w-full md:w-4/5 object-cover"
          />
        </div>
      </section>

      {/* ✅ Sejarah Desa */}
      <section className="bg-white shadow-sm py-10">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
            Sejarah Desa
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify">
            Menurut sejarahnya, Desa Babakan Asem pada awalnya termasuk wilayah
            Desa Bongkok dan Desa Conggeang. Nama Desa Babakan Asem sendiri
            berasal dari satu kampung atau babakan dan ada pohon asem yang
            besar, maka diberi nama Desa Babakan Asem. Babakan Asem juga
            merupakan singkatan dari{" "}
            <strong>Bareng Bakti Negara Anu Sempurna</strong>. Sementara moto
            Desa Babakan Asem adalah{" "}
            <strong>"Ayem Tengrtrem Kerta Raharja"</strong>.
          </p>
        </div>
      </section>

      {/* ✅ Visi & Misi */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-green-50 to-white shadow-md rounded-xl p-6">
          <h3 className="text-2xl font-bold text-green-700 mb-4">Visi</h3>
          <p className="text-gray-700 leading-relaxed">
            “Mewujudkan Desa Babakan Asem yang mandiri, maju, dan berdaya saing
            dengan tetap menjaga nilai-nilai budaya dan gotong royong
            masyarakat.”
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-white shadow-md rounded-xl p-6">
          <h3 className="text-2xl font-bold text-green-700 mb-4">Misi</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>
              Meningkatkan kesejahteraan masyarakat melalui pembangunan
              berkelanjutan.
            </li>
            <li>Memberdayakan potensi desa untuk mendukung ekonomi kreatif.</li>
            <li>Meningkatkan kualitas pendidikan & kesehatan masyarakat.</li>
            <li>Menjaga kelestarian lingkungan & budaya lokal.</li>
          </ul>
        </div>
      </section>

      {/* ✅ Struktur Organisasi */}
      <section className="bg-green-50 py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-green-700 mb-8">
            Struktur Organisasi Desa
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Kepala Desa
              </h3>
              <p className="text-gray-500">
                Memimpin & mengatur kebijakan desa
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Perangkat Desa
              </h3>
              <p className="text-gray-500">
                Pelayanan administrasi & pembangunan
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                BPD & Lembaga Desa
              </h3>
              <p className="text-gray-500">
                Mengawasi & menyalurkan aspirasi warga
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Sosial Media */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-700 mb-10">
            🌐 Ikuti Kami di Sosial Media
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-6 p-6 rounded-xl bg-blue-50 hover:bg-blue-100 shadow-md hover:shadow-xl transition"
            >
              <FaFacebook className="text-blue-600 text-5xl" />
              <div>
                <h3 className="text-xl font-semibold text-blue-700">
                  Facebook
                </h3>
                <p className="text-gray-600 text-sm">
                  Dapatkan berita terbaru desa
                </p>
              </div>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-6 p-6 rounded-xl bg-pink-50 hover:bg-pink-100 shadow-md hover:shadow-xl transition"
            >
              <FaInstagram className="text-pink-500 text-5xl" />
              <div>
                <h3 className="text-xl font-semibold text-pink-600">
                  Instagram
                </h3>
                <p className="text-gray-600 text-sm">
                  Lihat momen & kegiatan desa
                </p>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-6 p-6 rounded-xl bg-green-50 hover:bg-green-100 shadow-md hover:shadow-xl transition"
            >
              <FaWhatsapp className="text-green-500 text-5xl" />
              <div>
                <h3 className="text-xl font-semibold text-green-600">
                  WhatsApp
                </h3>
                <p className="text-gray-600 text-sm">Hubungi kami langsung</p>
              </div>
            </a>

            {/* TikTok */}
            <SocialLink
              url="https://tiktok.com"
              icon={<FaTiktok className="text-black text-5xl" />}
              title="TikTok"
              desc="Konten singkat & seru"
              bg="bg-gray-100 hover:bg-gray-200"
            />
            {/* Gmail */}
            <a
              href="mailto:desababakanasem@gmail.com"
              className="flex items-center gap-6 p-6 rounded-xl bg-red-50 hover:bg-red-100 shadow-md hover:shadow-xl transition"
            >
              <FaEnvelope className="text-red-500 text-5xl" />
              <div>
                <h3 className="text-xl font-semibold text-red-600">Gmail</h3>
                <p className="text-gray-600 text-sm">
                  Kirimkan pertanyaan & masukan
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ✅ Batas Desa + Peta */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-green-50 to-white shadow-md rounded-xl p-6">
          <h3 className="text-2xl font-bold text-green-700 mb-4">
            Batas Wilayah Desa
          </h3>
          <ul className="space-y-2 text-gray-800">
            <li>
              <strong>Utara:</strong> Desa Ungkal
            </li>
            <li>
              <strong>Selatan:</strong> Desa Bugel
            </li>
            <li>
              <strong>Barat:</strong> Desa Cacaban & Desa Prasih
            </li>
            <li>
              <strong>Timur:</strong> Desa Cipelang & kawasan BPM Taman
            </li>
          </ul>
        </div>
        <div className="rounded-xl overflow-hidden shadow-md">
          <iframe
            title="Lokasi Desa Babakan Asem"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50846.83215472047!2d108.04488070198364!3d-6.7568080545342095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f2aaf583cd373%3A0x997e0a8c838d37df!2sBabakan%20Asem%2C%20Kec.%20Conggeang%2C%20Kabupaten%20Sumedang%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1753327873604!5m2!1sid!2sid"
            width="100%"
            height="350"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </div>
  );
}

// ✅ Komponen kecil buat sosial media
function SocialLink({ url, icon, title, desc, bg }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-6 p-6 rounded-xl ${bg} shadow-md hover:shadow-xl transition`}
    >
      {icon}
      <div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-600 text-sm">{desc}</p>
      </div>
    </a>
  );
}
