import { useState, useEffect } from "react";
import {
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaUser,
  FaClock,
  FaPhone,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Pagination from "../ui/Pagination";

export default function EmergencyPage() {
  const navigate = useNavigate();
  const [emergencies, setEmergencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active"); // "active" atau "resolved"
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    // TODO: Ganti dengan API call ke backend
    const fetchEmergencies = async () => {
      try {
        // const response = await fetch('/api/emergencies');
        // const data = await response.json();
        // setEmergencies(data);
        
        // Sementara kosongkan data
        setEmergencies([]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching emergencies:', error);
        setEmergencies([]);
        setIsLoading(false);
      }
    };

    fetchEmergencies();
  }, []);

  // Auto switch tab berdasarkan ada tidaknya emergency aktif
  useEffect(() => {
    const activeEmergencies = emergencies.filter(e => e.status === "active");
    if (activeEmergencies.length > 0) {
      setActiveTab("active");
    } else {
      setActiveTab("resolved");
    }
  }, [emergencies]);

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

  const handleResolve = async (id) => {
    try {
      // TODO: API call untuk update status
      // await fetch(`/api/emergencies/${id}/resolve`, { method: 'PUT' });
      
      setEmergencies(emergencies.map(emergency => 
        emergency.id === id ? {...emergency, status: "resolved"} : emergency
      ));
    } catch (error) {
      console.error('Error resolving emergency:', error);
    }
  };

  const filteredEmergencies = emergencies.filter(emergency => 
    activeTab === "active" ? emergency.status === "active" : emergency.status === "resolved"
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredEmergencies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmergencies = filteredEmergencies.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when switching tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

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

        {/* Tab Navigation */}
        <div className="flex mb-6 bg-white rounded-lg shadow p-1">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeTab === "active"
                ? "bg-red-500 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FaExclamationTriangle />
            <span>Butuh Bantuan</span>
            {emergencies.filter(e => e.status === "active").length > 0 && (
              <span className="bg-white text-red-500 text-xs font-bold px-2 py-1 rounded-full">
                {emergencies.filter(e => e.status === "active").length}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab("resolved")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeTab === "resolved"
                ? "bg-green-500 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FaCheckCircle />
            <span>Tertangani</span>
            {emergencies.filter(e => e.status === "resolved").length > 0 && (
              <span className="bg-white text-green-500 text-xs font-bold px-2 py-1 rounded-full">
                {emergencies.filter(e => e.status === "resolved").length}
              </span>
            )}
          </button>
        </div>

        {/* Daftar Emergency */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              {activeTab === "active" ? "Laporan Darurat - Butuh Bantuan" : "Laporan Darurat - Tertangani"}
            </h2>
          </div>
          
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
              <p className="mt-2 text-gray-600">Memuat data darurat...</p>
            </div>
          ) : filteredEmergencies.length === 0 ? (
            <div className="p-6 text-center">
              {activeTab === "active" ? (
                <>
                  <FaCheckCircle className="mx-auto text-green-400 text-4xl mb-3" />
                  <h3 className="text-lg font-medium text-gray-800">Tidak ada laporan darurat aktif</h3>
                  <p className="text-gray-600">Semua keadaan aman dan terkendali</p>
                </>
              ) : (
                <>
                  <FaExclamationTriangle className="mx-auto text-gray-400 text-4xl mb-3" />
                  <h3 className="text-lg font-medium text-gray-800">Belum ada laporan yang tertangani</h3>
                  <p className="text-gray-600">Riwayat laporan yang sudah diselesaikan akan muncul di sini</p>
                </>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {paginatedEmergencies.map(emergency => (
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
                    
                    {emergency.status === "active" && (
                      <div className="mt-4 md:mt-0 md:ml-4 flex flex-col items-end">
                        <button
                          onClick={() => handleResolve(emergency.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <FaCheckCircle />
                          Tandai Tertangani
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {filteredEmergencies.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}