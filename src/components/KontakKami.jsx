  import React from "react";
  import { FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp, FaEnvelope } from "react-icons/fa";
  import "@fontsource/poppins";

  export default function KontakKami() {
    return (
      <div className="font-poppins">
        {/* ✅ Banner Hijau */}
        <div className="bg-[#B6F500] py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Jangan Ada Keraguan Diantara Hubungan Komunikasi
          </h1>
          <p className="mt-2 text-gray-800 text-lg">
            Selamat Datang di Kontak Desa Babakan Asem <br /> Kami siap mendengar keluhan & saran Anda
          </p>
        </div>

        {/* ✅ Konten utama */}
        <div className="max-w-6xl mx-auto mt-10 grid md:grid-cols-2 gap-10 px-4">
          
          {/* ✅ FORM PESAN */}
          <div className="rounded-xl shadow-lg overflow-hidden">
            {/* Judul form di dalam atas */}
            <div className="bg-white p-4 border-b">
              <h2 className="text-2xl font-semibold text-gray-900">
                Tinggalkan Pesan Anda disini...
              </h2>
            </div>

            {/* Bagian form hijau */}
            <div className="bg-[#B6F500] p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-900 font-medium mb-1">Nama</label>
                  <input
                    type="text"
                    placeholder="Nama anda..."
                    className="w-full rounded-md p-3 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A4E000]"
                  />
                </div>
                <div>
                  <label className="block text-gray-900 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Email anda..."
                    className="w-full rounded-md p-3 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A4E000]"
                  />
                </div>
                <div>
                  <label className="block text-gray-900 font-medium mb-1">Pesan</label>
                  <textarea
                    rows="4"
                    placeholder="Masukan pesan.."
                    className="w-full rounded-md p-3 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A4E000]"
                  ></textarea>
                </div>
                {/* ✅ Tombol hover efek scale */}
                <button
                  type="submit"
                  className="px-6 py-2 bg-gray-800 text-white font-semibold rounded-md hover:scale-105 hover:brightness-110 transition transform duration-200"
                >
                  Kirim
                </button>
              </form>
            </div>
          </div>

          {/* ✅ BAGIAN KANAN TANPA CONTAINER PUTIH */}
          <div>
            {/* ✅ ALAMAT DESA BESAR */}
            <div className="p-5 rounded-xl shadow-md bg-gradient-to-r from-[#B6F500] to-[#ffffff10] flex items-start gap-4 hover:shadow-lg transition">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow text-[#B6F500]">
                <FaMapMarkerAlt />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Desa Babakan Asem</h4>
                <p className="text-sm text-gray-800 leading-relaxed">
                  Jalan Babakan Asem No. 142 Desa Babakan Asem, Kecamatan Conggeang, Kabupaten Sumedang, Jawa Barat 45391
                </p>
              </div>
            </div>

            {/* ✅ Garis pemisah */}
            <div className="my-4 border-b border-gray-200"></div>

            {/* ✅ TELEPON & WHATSAPP sejajar */}
            <div className="grid grid-cols-2 gap-4">
              <a
                href="tel:085330192025"
                className="p-4 rounded-xl shadow-md bg-gradient-to-r from-[#B6F500] to-[#ffffff20] flex flex-col items-start gap-2 hover:scale-105 hover:shadow-lg transition"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow text-[#B6F500]">
                  <FaPhoneAlt />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Telepon</h4>
                  <p className="text-xs text-gray-800">0853-3019-2025</p>
                </div>
              </a>

              <a
                href="https://wa.me/6285330192025"
                className="p-4 rounded-xl shadow-md bg-gradient-to-r from-[#B6F500] to-[#ffffff20] flex flex-col items-start gap-2 hover:scale-105 hover:shadow-lg transition"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow text-[#B6F500]">
                  <FaWhatsapp />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">WhatsApp</h4>
                  <p className="text-xs text-gray-800">+62 853‑3019‑2025</p>
                </div>
              </a>
            </div>

            {/* ✅ Garis pemisah */}
            <div className="my-4 border-b border-gray-200"></div>

            {/* ✅ EMAIL BAWAH */}
            <a
              href="mailto:babakanasem@gmail.com"
              className="p-4 rounded-xl shadow-md bg-gradient-to-r from-[#B6F500] to-[#ffffff10] flex items-center gap-3 hover:scale-105 hover:shadow-lg transition"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow text-[#B6F500]">
                <FaEnvelope />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Email Kami</h4>
                <p className="text-sm text-gray-800">babakanasem@gmail.com</p>
              </div>
            </a>
          </div>
        </div>

        {/* Spacer */}
        <div className="h-20"></div>
      </div>
    );
  }
