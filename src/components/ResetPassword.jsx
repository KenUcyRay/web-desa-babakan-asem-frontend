import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import resetImage from "../assets/reset.png";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // ✅ Ambil token dari URL

  const handleReset = (e) => {
    e.preventDefault();

    if (!token) {
      alert("Token tidak valid atau sudah kedaluwarsa!");
      return;
    }

    // ✅ Kirim request ke backend:
    // axios.post('/reset-password', { token, passwordBaru })

    alert("Password berhasil diubah! Silakan login kembali.");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen font-poppins">
      
      {/* ✅ Bagian Kiri: Form Reset Password */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gradient-to-b from-[#B6F500] to-[#FFFCE2] px-8 py-12">
        <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl w-full max-w-md p-8">
          
          {/* Judul */}
          <h2 className="text-3xl text-gray-900 font-normal mb-2 text-center">
            Atur Ulang Password
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Masukkan password baru untuk akunmu
          </p>

          {!token && (
            <p className="text-red-500 text-center mb-4">
              ⚠️ Token reset tidak ditemukan. Pastikan buka link dari email.
            </p>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleReset}>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Password Baru
              </label>
              <input
                type="password"
                placeholder="Masukkan password baru"
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-300 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Konfirmasi Password
              </label>
              <input
                type="password"
                placeholder="Ulangi password baru"
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-300 outline-none"
                required
              />
            </div>

            {/* ✅ Tombol Gradien */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-green-400 to-[#B6F500] text-white font-semibold rounded-lg hover:opacity-90 transition duration-200"
              disabled={!token} // ✅ Token wajib ada
            >
              Simpan Password
            </button>
          </form>
        </div>
      </div>

      {/* ✅ Bagian Kanan: Ilustrasi Reset Password */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-b from-[#B6F500] to-[#FFFCE2] px-8 py-12">
        <img
          src={resetImage}
          alt="Reset Password"
          className="w-4/5 drop-shadow-xl"
        />
      </div>
    </div>
  );
}
