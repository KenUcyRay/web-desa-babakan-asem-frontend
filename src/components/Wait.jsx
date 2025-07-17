import React from "react";
import verifyImage from "../assets/verifikasi.png";

export default function Wait() {
  return (
    <div className="flex min-h-screen items-center justify-center font-poppins bg-gradient-to-b from-[#B6F500] to-[#FFFCE2] px-6">
      <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl w-full max-w-md p-8 flex flex-col items-center text-center">
        <img
          src={verifyImage}
          alt="Verifikasi"
          className="w-48 h-48 mb-6 drop-shadow-lg"
        />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Silakan cek email kamu!
        </h2>
        <p className="text-gray-600">
          Kami telah mengirimkan link untuk mengatur ulang password. Buka email
          kamu lalu klik link yang diberikan.
        </p>
      </div>
    </div>
  );
}
