import React from "react";
import { Link } from "react-router-dom";
import loginImage from "../assets/login.png";

export default function Login() {
  return (
    <div className="flex min-h-screen font-poppins">
      
      {/* ✅ Bagian Kiri: Form Login */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gradient-to-b from-[#B6F500] to-[#FFFCE2] px-8 py-12">
        <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl w-full max-w-md p-8">
          
          {/* Judul */}
        <h2 className="text-3xl text-gray-900 font-normal font-poppins mb-2 text-center">
  Selamat Datang!
</h2>
          <p className="text-gray-600 text-center mb-6">
            Masuk ke Portal Desa Babakan Asem
          </p>

          {/* Form */}
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Masukkan email"
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-300 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Masukkan password"
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-300 outline-none"
              />
            </div>

            {/* ✅ Tombol Login dengan gradient */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-green-400 to-[#B6F500] text-white font-semibold rounded-lg hover:opacity-90 transition duration-200"
            >
              Masuk
            </button>

            {/* Link tambahan */}
            <div className="text-center mt-4">
              <a href="#" className="text-green-700 hover:underline text-sm">
                Lupa password?
              </a>
            </div>
          </form>

          {/* Garis pemisah */}
          <div className="flex items-center my-6">
            <span className="flex-1 h-px bg-gray-200"></span>
            <span className="px-4 text-sm text-gray-400">atau</span>
            <span className="flex-1 h-px bg-gray-200"></span>
          </div>

          {/* ✅ Link ke Register */}
          <p className="text-center text-sm text-gray-700 mt-6">
            Belum punya akun?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
            Daftar di sini
            </Link>
          </p>
        </div>
      </div>

      {/* ✅ Bagian Kanan: Ilustrasi Login */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-b from-[#B6F500] to-[#FFFCE2] px-8 py-12">
        <img
          src={loginImage}
          alt="Ilustrasi Login"
          className="w-4/5 drop-shadow-xl"
        />
      </div>
    </div>
  );
}
