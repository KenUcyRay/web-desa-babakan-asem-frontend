import React, { useEffect } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaTiktok,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import kumpul from "../../assets/kumpul.jpg";

export default function ProfilDesa() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="font-poppins bg-gray-50">
      {/* ✅ HERO SECTION */}
      <section
        className="relative bg-[#FFFDF6]"
        data-aos="fade-up"
      >
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
          {/* Text */}
          <div data-aos="fade-right">
            <span className="inline-block px-4 py-1 text-sm font-medium rounded-full bg-gradient-to-r from-[#9BEC00] to-[#D2FF72] text-gray-900 mb-4 shadow">
              Tentang Desa
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Profil Desa <span className="text-green-600">Babakan Asem</span>
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed">
              Desa Babakan Asem adalah desa yang kaya akan sejarah, budaya, dan potensi masyarakatnya. Dengan semangat kebersamaan dan gotong royong, desa ini terus berkembang menuju masa depan yang lebih baik, tetap menjaga nilai-nilai tradisi namun beradaptasi dengan perkembangan zaman.
            </p>
          </div>

          {/* Image */}
          <div className="relative flex justify-center" data-aos="zoom-in">
            <div className="rounded-2xl overflow-hidden shadow-xl w-full md:w-4/5">
              <img
                src={kumpul}
                alt="Warga Desa Berkumpul"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ✅ SEJARAH */}
      <section className="bg-white py-14" data-aos="fade-up">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Sejarah Desa</h2>
          <p className="text-gray-700 leading-relaxed text-justify">
            Menurut sejarahnya, Desa Babakan Asem pada awalnya termasuk wilayah Desa Bongkok dan Desa Conggeang. Nama Desa Babakan Asem sendiri berasal dari satu kampung atau babakan dan ada pohon asem yang besar, maka diberi nama Desa Babakan Asem. Babakan Asem juga merupakan singkatan dari <strong>Bareng Bakti Negara Anu Sempurna</strong>. Sementara moto Desa Babakan Asem adalah <strong>"Ayem Tengrtrem Kerta Raharja"</strong>.
          </p>
        </div>
      </section>

      {/* ✅ VISI & MISI */}
      <section
        className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8"
        data-aos="fade-up"
      >
        <div className="bg-gradient-to-br from-[#f7ffe5] to-white shadow-md rounded-2xl p-8" data-aos="fade-right">
          <h3 className="text-2xl font-bold text-green-700 mb-4">Visi</h3>
          <p className="text-gray-700 leading-relaxed">
            “Mewujudkan Desa Babakan Asem yang mandiri, maju, dan berdaya saing dengan tetap menjaga nilai-nilai budaya dan gotong royong masyarakat.”
          </p>
        </div>
        <div className="bg-gradient-to-br from-[#f7ffe5] to-white shadow-md rounded-2xl p-8" data-aos="fade-left">
          <h3 className="text-2xl font-bold text-green-700 mb-4">Misi</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Meningkatkan kesejahteraan masyarakat melalui pembangunan berkelanjutan.</li>
            <li>Memberdayakan potensi desa untuk mendukung ekonomi kreatif.</li>
            <li>Meningkatkan kualitas pendidikan & kesehatan masyarakat.</li>
            <li>Menjaga kelestarian lingkungan & budaya lokal.</li>
          </ul>
        </div>
      </section>

      {/* ✅ STRUKTUR ORGANISASI */}
      <section className="bg-green-50 py-14" data-aos="fade-up">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-green-700 mb-10">Struktur Organisasi Desa</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/pemerintah" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition" data-aos="zoom-in">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Kepala Desa</h3>
              <p className="text-gray-500">Memimpin & mengatur kebijakan desa</p>
            </Link>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition" data-aos="zoom-in">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Perangkat Desa</h3>
              <p className="text-gray-500">Pelayanan administrasi & pembangunan</p>
            </div>
            <Link to="/bpd" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition" data-aos="zoom-in">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">BPD & Lembaga Desa</h3>
              <p className="text-gray-500">Mengawasi & menyalurkan aspirasi warga</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ✅ KONTAK & SOSMED ala versi awal */}
      <section className="bg-white py-16" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-green-700 mb-10">🌐 Hubungi & Ikuti Kami</h2>
          <div className="flex flex-col gap-6 max-w-3xl mx-auto">
            {/* Alamat */}
            <div className="p-6 rounded-xl shadow-lg bg-white flex items-start gap-4 hover:shadow-xl transition" data-aos="fade-right">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#9BEC00] to-[#D2FF72] shadow text-gray-900">
                <FaMapMarkerAlt size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Desa Babakan Asem</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Jalan Babakan Asem No. 142 Desa Babakan Asem, Kecamatan Conggeang, Kabupaten Sumedang, Jawa Barat 45391
                </p>
              </div>
            </div>

            {/* Telepon & WA sejajar */}
            <div className="grid grid-cols-2 gap-4" data-aos="fade-up">
              <a
                href="tel:085330192025"
                className="p-5 rounded-xl shadow-md bg-white flex flex-col items-start gap-2 hover:shadow-xl transition"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#9BEC00] to-[#D2FF72] shadow text-gray-900">
                  <FaPhoneAlt />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Telepon</h4>
                  <p className="text-xs text-gray-700">0853-3019-2025</p>
                </div>
              </a>

              <a
                href="https://wa.me/6285330192025"
                className="p-5 rounded-xl shadow-md bg-white flex flex-col items-start gap-2 hover:shadow-xl transition"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#9BEC00] to-[#D2FF72] shadow text-gray-900">
                  <FaWhatsapp />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">WhatsApp</h4>
                  <p className="text-xs text-gray-700">+62 853‑3019‑2025</p>
                </div>
              </a>
            </div>

            {/* Email */}
            <a
              href="mailto:babakanasem@gmail.com"
              className="p-5 rounded-xl shadow-md bg-white flex items-center gap-4 hover:shadow-xl transition"
              data-aos="fade-left"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#9BEC00] to-[#D2FF72] shadow text-gray-900">
                <FaEnvelope />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Email Kami</h4>
                <p className="text-sm text-gray-700">babakanasem@gmail.com</p>
              </div>
            </a>

            {/* Sosmed */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4" data-aos="fade-up">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-white shadow hover:shadow-lg transition">
                <FaFacebook className="text-blue-600 text-3xl" />
                <span className="font-semibold text-gray-800">Facebook</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-white shadow hover:shadow-lg transition">
                <FaInstagram className="text-pink-500 text-3xl" />
                <span className="font-semibold text-gray-800">Instagram</span>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-white shadow hover:shadow-lg transition">
                <FaTiktok className="text-black text-3xl" />
                <span className="font-semibold text-gray-800">TikTok</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ MAP SIGMA */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center" data-aos="fade-up">
        <div className="bg-gradient-to-br from-[#9BEC00]/10 to-[#D2FF72]/20 shadow-lg rounded-2xl p-10" data-aos="fade-right">
          <h3 className="text-3xl font-bold text-green-700 mb-6">Batas Wilayah Desa</h3>
          <ul className="space-y-4 text-gray-800 text-lg">
            <li><strong>Utara:</strong> Desa Ungkal</li>
            <li><strong>Selatan:</strong> Desa Bugel</li>
            <li><strong>Barat:</strong> Desa Cacaban & Desa Prasih</li>
            <li><strong>Timur:</strong> Desa Cipelang & kawasan BPM Taman</li>
          </ul>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-xl border border-green-100" data-aos="zoom-in">
          <iframe
            title="Lokasi Desa Babakan Asem"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7934.664371412895!2d106.65160769694418!3d-6.085869757207361!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6a03b93c27479f%3A0xd8f1dcf4227df064!2sBabakan%20Asem%2C%20Kec.%20Teluknaga%2C%20Kabupaten%20Tangerang%2C%20Banten!5e0!3m2!1sid!2sid!4v1752824632488!5m2!1sid!2sid"
            width="100%"
            height="380"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </div>
  );
}
