import { Link } from "react-router-dom";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <FaExclamationTriangle className="mx-auto text-6xl text-yellow-500 mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
          <h2 className="text-xl font-semibold text-gray-600 mb-4">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-gray-500 mb-8">
            Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
          </p>
        </div>
        
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <FaHome />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}