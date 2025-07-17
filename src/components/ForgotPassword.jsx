import React from "react";
import { useNavigate } from "react-router-dom";
import forgotImage from "../assets/forgot.png";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const handleForgot = (e) => {
    e.preventDefault();
    // ✅ Kirim request ke backend untuk kirim email reset password
    // axios.post('/forgot-password', { email })

    navigate("/wait"); // setelah sukses kirim email → masuk ke halaman tunggu
  };

  return (
    <div className="flex min-h-screen font-poppins">
      {/* ✅ Bagian Kiri: Form Forgot Password */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gradient-to-b from-[#B6F500] to-[#FFFCE2] px-8 py-12">
        <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl w-full max-w-md p-8">
          {/* Judul */}
          <h2 className="text-3xl text-gray-900 font-normal text-center mb-2">
            Lupa Password?
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Masukkan email kamu, kami akan mengirimkan link untuk reset password
          </p>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleForgot}>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Masukkan email"
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-300 outline-none"
                required
              />
            </div>

            {/* ✅ Tombol Gradien */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-green-400 to-[#B6F500] text-white font-semibold rounded-lg hover:opacity-90 transition duration-200"
            >
              Kirim Link Reset
            </button>
          </form>
        </div>
      </div>

      {/* ✅ Bagian Kanan: Ilustrasi Forgot Password */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-b from-[#B6F500] to-[#FFFCE2] px-8 py-12">
        <img
          src={forgotImage}
          alt="Forgot Password"
          className="w-4/5 drop-shadow-xl"
        />
      </div>
    </div>
  );
}
