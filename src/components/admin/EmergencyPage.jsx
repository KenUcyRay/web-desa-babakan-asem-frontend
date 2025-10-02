import { useState, useEffect } from "react";
import {
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaUser,
  FaClock,
  FaPhone,
  FaArrowLeft,
  FaCheckCircle,
  FaTrash,
  FaMap,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Pagination from "../ui/Pagination";
import { EmergencyApi } from "../../libs/api/EmergencyApi";
import { alertConfirm, alertError, alertSuccess } from "../../libs/alert";
import EmergencyMap from "./EmergencyMap";
import EmergencyNotification from "../ui/EmergencyNotification";
import { initializeSocket, onNewEmergency, onEmergencyUpdated, onEmergencyDeleted, offEmergencyEvents, disconnectSocket } from "../../libs/socket";
import warningSound from "../../assets/warning.mp3";

export default function EmergencyPage() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [emergencies, setEmergencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active"); // "active" atau "resolved"
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [newEmergencyNotification, setNewEmergencyNotification] = useState(null);
  const [audio] = useState(() => {
    const audioInstance = new Audio(warningSound);
    audioInstance.loop = true;
    audioInstance.volume = 0.7;
    return audioInstance;
  });

  const fetchEmergencies = async () => {
    try {
      const isHandled = activeTab === "resolved" ? true : false;
      const response = await EmergencyApi.get(
        currentPage,
        itemsPerPage,
        isHandled,
        i18n.language
      );

      const countResponse = await EmergencyApi.count(i18n.language);

      setEmergencies(response.data);
      setTotalPages(response.total_page);
      setCount(countResponse.data);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching emergencies:", error);
      setIsLoading(false);
    }
  };

  // Handle audio based on emergency count
  useEffect(() => {
    if (count.is_not_handled > 0) {
      audio.play().catch(error => {
        console.log("Audio play failed:", error);
      });
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [count.is_not_handled, audio]);

  useEffect(() => {
    fetchEmergencies();
  }, [currentPage, activeTab]);

  // Socket connection for real-time updates
  useEffect(() => {
    try {
      initializeSocket();
      
      // Listen for new emergencies
      onNewEmergency((emergency) => {
        console.log("🚨 New emergency notification:", emergency);
        setNewEmergencyNotification(emergency);
        
        // Update count immediately
        setCount(prev => ({
          ...prev,
          is_not_handled: prev.is_not_handled + 1
        }));
        
        // Refresh data
        fetchEmergencies();
      });

      // Listen for emergency updates
      onEmergencyUpdated((emergency) => {
        console.log("✅ Emergency updated:", emergency);
        
        // Update count immediately (emergency resolved)
        if (emergency.is_handled) {
          setCount(prev => ({
            ...prev,
            is_not_handled: Math.max(0, prev.is_not_handled - 1),
            is_handled: prev.is_handled + 1
          }));
        }
        
        fetchEmergencies();
      });

      // Listen for emergency deletions
      onEmergencyDeleted((data) => {
        console.log("🗑️ Emergency deleted:", data.id);
        
        // Update count immediately (emergency deleted)
        setCount(prev => ({
          ...prev,
          is_not_handled: Math.max(0, prev.is_not_handled - 1)
        }));
        
        fetchEmergencies();
      });
    } catch (error) {
      console.error("Socket setup error:", error);
    }

    return () => {
      offEmergencyEvents();
      disconnectSocket();
    };
  }, [activeTab]);

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
      const confirm = await alertConfirm(
        "Apakah Anda yakin menandai tertangani?"
      );
      if (!confirm) return;
      
      await EmergencyApi.update(id, i18n.language);
      await alertSuccess("Emergency berhasil ditandai tertangani");
      fetchEmergencies();
    } catch (error) {
      await alertError("Error resolving emergency:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirm = await alertConfirm("Apakah Anda yakin menghapus?");
      if (!confirm) return;
      // TODO: API call untuk update status
      await EmergencyApi.delete(id, i18n.language);

      fetchEmergencies();
      await alertSuccess("Emergency berhasil dihapus");
    } catch (error) {
      await alertError("Error deleting emergency:", error);
    }
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

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center mb-6 gap-4">
          <div className="flex bg-white rounded-lg shadow p-1 flex-1">
            <button
              onClick={() => {
                setActiveTab("active");
                setCurrentPage(1);
              }}
              className={`flex-1 flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-md transition-all text-sm md:text-base ${
                activeTab === "active"
                  ? "bg-red-500 text-white shadow-md cursor-pointer"
                  : "text-gray-600 hover:bg-gray-100 cursor-pointer"
              }`}
            >
              <FaExclamationTriangle className="text-sm md:text-base" />
              <span className="hidden sm:inline">Butuh Bantuan</span>
              <span className="sm:hidden">Aktif</span>
              <span className="bg-white text-red-500 text-xs font-bold px-1 md:px-2 py-1 rounded-full">
                {count.is_not_handled}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("resolved");
                setCurrentPage(1);
              }}
              className={`flex-1 flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-md transition-all text-sm md:text-base ${
                activeTab === "resolved"
                  ? "bg-green-500 text-white shadow-md cursor-pointer"
                  : "text-gray-600 hover:bg-gray-100 cursor-pointer"
              }`}
            >
              <FaCheckCircle className="text-sm md:text-base" />
              <span>Tertangani</span>
              <span className="bg-white text-green-500 text-xs font-bold px-1 md:px-2 py-1 rounded-full cursor">
                {count.is_handled}
              </span>
            </button>
          </div>
          
          <button
            onClick={() => setShowMap(true)}
            className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all font-medium text-sm md:text-base w-full md:w-auto cursor-pointer"
          >
            <FaMap className="text-sm md:text-base" />
            <span>Lihat Map</span>
          </button>
        </div>


        {/* Daftar Emergency */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              {activeTab === "active"
                ? "Laporan Darurat - Butuh Bantuan"
                : "Laporan Darurat - Tertangani"}
            </h2>
          </div>

          {isLoading ? (
            <div className="p-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
              <p className="mt-2 text-gray-600">Memuat data darurat...</p>
            </div>
          ) : emergencies.length === 0 ? (
            <div className="p-6 text-center">
              {activeTab === "active" ? (
                <>
                  <FaCheckCircle className="mx-auto text-green-400 text-4xl mb-3" />
                  <h3 className="text-lg font-medium text-gray-800">
                    Tidak ada laporan darurat aktif
                  </h3>
                  <p className="text-gray-600">
                    Semua keadaan aman dan terkendali
                  </p>
                </>
              ) : (
                <>
                  <FaExclamationTriangle className="mx-auto text-gray-400 text-4xl mb-3" />
                  <h3 className="text-lg font-medium text-gray-800">
                    Belum ada laporan yang tertangani
                  </h3>
                  <p className="text-gray-600">
                    Riwayat laporan yang sudah diselesaikan akan muncul di sini
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {emergencies.map((emergency) => (
                <div
                  key={emergency.id}
                  className={`rounded-2xl shadow-md p-6 border transition-all duration-300 ${
                    emergency.is_handled
                      ? "bg-green-50 border-green-200 hover:shadow-lg"
                      : "bg-red-50 border-red-200 hover:shadow-lg"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    {/* Left Content */}
                    <div className="flex-1">
                      {/* User Info */}
                      <div className="flex items-start mb-4">
                        <div
                          className={`p-3 rounded-full mr-4 shadow-inner ${
                            emergency.is_handled ? "bg-green-100" : "bg-red-100"
                          }`}
                        >
                          <FaUser
                            className={`text-xl ${
                              emergency.is_handled
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {emergency.user.name}
                          </h3>
                          <div className="flex items-center text-gray-600 mt-1">
                            <FaPhone className="text-sm mr-2" />
                            <span className="text-sm">
                              {emergency.phone_number}

                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="ml-12 mb-4">
                        <p className="text-gray-700 leading-relaxed">
                          {emergency.message}
                        </p>
                      </div>

                      {/* Location & Time */}
                      <div className="ml-12 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center text-gray-700">
                          <FaMapMarkerAlt className="text-red-500 mr-2" />
                          <span>
                            {emergency.latitude}, {emergency.longitude}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <FaClock className="text-gray-500 mr-2" />
                          <span>
                            {formatTime(emergency.created_at)} -{" "}
                            {formatDate(emergency.created_at)}
                          </span>
                          <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                            {getTimeAgo(emergency.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 items-end">
                      <a
                        href={`https://maps.google.com/?q=${emergency.latitude},${emergency.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <FaMapMarkerAlt className="mr-2" />
                        Lihat di Google Maps
                      </a>

                      {!emergency.is_handled && (
                        <button
                          onClick={() => handleResolve(emergency.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <FaCheckCircle />
                          Tandai Tertangani
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(emergency.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <FaTrash />
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
      
      {/* Emergency Map Modal */}
      <EmergencyMap 
        isOpen={showMap} 
        onClose={() => setShowMap(false)} 
      />
      
      {/* Emergency Notification */}
      {newEmergencyNotification && (
        <EmergencyNotification
          emergency={newEmergencyNotification}
          onClose={() => setNewEmergencyNotification(null)}
          onViewMap={() => setShowMap(true)}
        />
      )}
    </div>
  );
}
