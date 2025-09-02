import { useState, useEffect } from "react";
import {
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaUser,
  FaClock,
  FaPhone,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function EmergencyPage() {
  const navigate = useNavigate();
  const [emergencies, setEmergencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Data dummy untuk simulasi
  const dummyEmergencies = [
    {
      id: 1,
      userName: "Ahmad Susanto",
      phone: "+62 812-3456-7890",
      location: {
        latitude: -6.2087634,
        longitude: 106.845599,
      },
      timestamp: new Date(Date.now() - 5 * 60000), // 5 menit yang lalu
      message: "Saya mengalami kecelakaan di jalan utama! Butuh bantuan medis segera!",
      status: "active",
    },
    {
      id: 2,
      userName: "Siti Rahayu",
      phone: "+62 813-9876-5432",
      location: {
        latitude: -6.2187634,
        longitude: 106.855599,
      },
      timestamp: new Date(Date.now() - 15 * 60000), // 15 menit yang lalu
      message: "Kebakaran di rumah saya! Tolong kirim pemadam kebakaran!",
      status: "active",
    },
    {
      id: 3,
      userName: "Budi Santoso",
      phone: "+62 817-5555-1234",
      location: {
        latitude: -6.1987634,
        longitude: 106.835599,
      },
      timestamp: new Date(Date.now() - 25 * 60000), // 25 menit yang lalu
      message: "Ada orang pingsan di taman, butuh pertolongan pertama!",
      status: "resolved",
    },
  ];

  useEffect(() => {
    // Simulasi pengambilan data
    const timer = setTimeout(() => {
      setEmergencies(dummyEmergencies);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - new Date(date)) / 60000);
    
    if (diffInMinutes < 1) return "Baru saja";
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} hari yang lalu`;
  };

  const handleResolve = (id) => {
    setEmergencies(emergencies.map(emergency => 
      emergency.id === id ? {...emergency, status: "resolved"} : emergency
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
          >
            <FaArrowLeft className="mr-2" /> Kembali
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              <span className="text-red-600">🚨 Pusat Darurat</span>
            </h1>
            <p className="text-gray-600">
              Pantau dan tanggapi pesan darurat dari warga
            </p>
          </div>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <FaExclamationTriangle className="text-red-500 text-xl" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Total Darurat</h3>
              <p className="text-2xl font-bold text-gray-800">{emergencies.length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <FaExclamationTriangle className="text-yellow-500 text-xl" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Aktif</h3>
              <p className="text-2xl font-bold text-gray-800">
                {emergencies.filter(e => e.status === "active").length}
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <FaExclamationTriangle className="text-green-500 text-xl" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Tertangani</h3>
              <p className="text-2xl font-bold text-gray-800">
                {emergencies.filter(e => e.status === "resolved").length}
              </p>
            </div>
          </div>
        </div>

        {/* Daftar Emergency */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Laporan Darurat Terkini</h2>
          </div>
          
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
              <p className="mt-2 text-gray-600">Memuat data darurat...</p>
            </div>
          ) : emergencies.length === 0 ? (
            <div className="p-6 text-center">
              <FaExclamationTriangle className="mx-auto text-yellow-400 text-4xl mb-3" />
              <h3 className="text-lg font-medium text-gray-800">Tidak ada laporan darurat</h3>
              <p className="text-gray-600">Semua keadaan aman dan terkendali</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {emergencies.map(emergency => (
                <div 
                  key={emergency.id} 
                  className={`p-6 transition-all ${emergency.status === "resolved" ? "bg-green-50" : "bg-red-50"} hover:bg-opacity-70`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start mb-3">
                        <div className={`p-2 rounded-full mr-4 ${emergency.status === "resolved" ? "bg-green-100" : "bg-red-100"}`}>
                          <FaUser className={emergency.status === "resolved" ? "text-green-500" : "text-red-500"} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{emergency.userName}</h3>
                          <div className="flex items-center text-gray-600 mt-1">
                            <FaPhone className="text-sm mr-2" />
                            <span className="text-sm">{emergency.phone}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-10 mb-4">
                        <p className="text-gray-800">{emergency.message}</p>
                      </div>
                      
                      <div className="ml-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="text-red-500 mr-2" />
                          <span className="text-sm text-gray-700">
                            {emergency.location.latitude.toFixed(6)}, {emergency.location.longitude.toFixed(6)}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <FaClock className="text-gray-500 mr-2" />
                          <span className="text-sm text-gray-700">
                            {formatTime(emergency.timestamp)} - {formatDate(emergency.timestamp)}
                            <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">
                              {getTimeAgo(emergency.timestamp)}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:ml-4 flex flex-col items-end">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${emergency.status === "resolved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {emergency.status === "resolved" ? "Tertangani" : "Memerlukan Bantuan"}
                      </span>
                      
                      {emergency.status === "active" && (
                        <button
                          onClick={() => handleResolve(emergency.id)}
                          className="mt-3 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                          Tandai Tertangani
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 ml-10">
                    <a
                      href={`https://maps.google.com/?q=${emergency.location.latitude},${emergency.location.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <FaMapMarkerAlt className="mr-2" />
                      Lihat di Google Maps
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Sistem Informasi Desa • Pusat Darurat</p>
        </div>
      </div>
    </div>
  );
}