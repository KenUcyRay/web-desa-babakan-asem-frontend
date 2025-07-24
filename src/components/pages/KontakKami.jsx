import React from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";
import "@fontsource/poppins";
import { MessageApi } from "../../libs/api/MessageApi";
import { alertSuccess, alertError } from "../../libs/alert";

export default function KontakKami() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await MessageApi.createMessage(name, email, message);
    const responseBody = await response.json();

    if (response.status === 201) {
      await alertSuccess("Pesan berhasil dikirim!");
    } else {
      await alertError("Gagal mengirim pesan: " + responseBody.error);
    }

    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="font-poppins">
      {/* - Banner dengan gradien hijau */}
      <div className="bg-gradient-to-r from-[#9BEC00] to-[#D2FF72] py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Jangan Ragu untuk Terhubung dengan Kami
        </h1>
        <p className="mt-2 text-gray-800 text-lg">
          Selamat datang di halaman Kontak Desa Babakan Asem. <br /> Kami siap
          mendengar keluhan & saran Anda.
        </p>
      </div>

      {/* - Konten utama */}
      <div className="max-w-6xl mx-auto mt-12 grid md:grid-cols-2 gap-10 px-4">
        {/* - FORM DALAM CARD SEPERTI CONTOH */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header form */}
          <div className="bg-gray-50 p-6 border-b text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Tinggalkan Pesan Anda
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Kami akan membalas secepat mungkin
            </p>
          </div>

          {/* Bagian form */}
          <div className="p-6 bg-gradient-to-br from-[#9BEC00] to-[#D2FF72]">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-900 font-medium mb-1">
                  Nama
                </label>
                <input
                  type="text"
                  placeholder="Nama anda..."
                  className="w-full rounded-lg p-3 bg-white placeholder-gray-500 shadow focus:outline-none focus:ring-2 focus:ring-[#A4E000]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-900 font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email anda..."
                  className="w-full rounded-lg p-3 bg-white placeholder-gray-500 shadow focus:outline-none focus:ring-2 focus:ring-[#A4E000]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-900 font-medium mb-1">
                  Pesan
                </label>
                <textarea
                  rows="4"
                  placeholder="Masukan pesan.."
                  className="w-full rounded-lg p-3 bg-white placeholder-gray-500 shadow focus:outline-none focus:ring-2 focus:ring-[#A4E000]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>
              {/* - Tombol lebih elegan */}
              <div className="text-center">
                <button
                  type="submit"
                  className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:scale-105 hover:brightness-110 transition duration-200"
                >
                  Kirim Pesan
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* - BAGIAN KANAN INFO KONTAK LEBIH CLEAN */}
        <div className="flex flex-col gap-6">
          {/* Alamat */}
          <div className="p-6 rounded-xl shadow-lg bg-white flex items-start gap-4 hover:shadow-xl transition">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#9BEC00] to-[#D2FF72] shadow text-gray-900">
              <FaMapMarkerAlt size={20} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">
                Desa Babakan Asem
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Jalan Babakan Asem No. 142 Desa Babakan Asem, Kecamatan
                Conggeang, Kabupaten Sumedang, Jawa Barat 45391
              </p>
            </div>
          </div>

          {/* Telepon & WA sejajar */}
          <div className="grid grid-cols-2 gap-4">
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
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#9BEC00] to-[#D2FF72] shadow text-gray-900">
              <FaEnvelope />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Email Kami</h4>
              <p className="text-sm text-gray-700">babakanasem@gmail.com</p>
            </div>
          </a>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-20"></div>
    </div>
  );
}
