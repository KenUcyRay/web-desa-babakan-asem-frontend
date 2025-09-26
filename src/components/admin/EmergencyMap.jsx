import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { FaMapMarkerAlt, FaPhone, FaUser, FaClock, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { EmergencyApi } from "../../libs/api/EmergencyApi";
import { alertError, alertSuccess, alertConfirm } from "../../libs/alert";
import { initializeSocket, onNewEmergency, onEmergencyUpdated, onEmergencyDeleted, offEmergencyEvents, disconnectSocket, onConnect, onDisconnect, onConnectError } from "../../libs/socket";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom blinking marker icon
const createBlinkingIcon = () => {
  return L.divIcon({
    html: `
      <div class="emergency-marker">
        <div class="emergency-pulse"></div>
        <div class="emergency-icon">🚨</div>
      </div>
    `,
    className: 'custom-emergency-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

// Component to handle map updates
function MapUpdater({ emergencies, center, selectedEmergency, onMapReady }) {
  const map = useMap();
  
  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);
  
  useEffect(() => {
    if (selectedEmergency) {
      const lat = parseFloat(selectedEmergency.latitude);
      const lng = parseFloat(selectedEmergency.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        map.setView([lat, lng], 16);
      }
    } else if (emergencies.length > 0 && center) {
      map.setView(center, 13);
    }
  }, [map, emergencies, center, selectedEmergency]);
  
  return null;
}

export default function EmergencyMap({ isOpen, onClose }) {
  const [emergencies, setEmergencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const socketRef = useRef(null);
  const mapCenter = [-6.75, 108.05861]; // Default center for Babakan Asem

  // Load initial emergency data
  const loadEmergencies = async () => {
    try {
      setIsLoading(true);
      const response = await EmergencyApi.get(1, 100, false); // Get all active emergencies
      setEmergencies(response.data || []);
    } catch (error) {
      console.error("Error loading emergencies:", error);
      alertError("Gagal memuat data darurat");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize socket connection
  useEffect(() => {
    if (!isOpen) return;

    loadEmergencies();

    // Initialize socket connection
    try {
      socketRef.current = initializeSocket();
      
      // Connection events
      onConnect(() => {
        console.log("✅ Socket connected to backend");
      });

      onDisconnect((reason) => {
        console.log("❌ Socket disconnected:", reason);
      });

      onConnectError((error) => {
        console.error("🔥 Socket connection error:", error);
      });
      
      // Listen for new emergencies
      onNewEmergency((data) => {
        console.log("🚨 New emergency received:", data);
        setEmergencies(prev => [data, ...prev]);
      });

      // Listen for emergency updates
      onEmergencyUpdated((data) => {
        console.log("✅ Emergency updated:", data);
        setEmergencies(prev => 
          prev.map(emergency => 
            emergency.id === data.id ? data : emergency
          )
        );
      });

      // Listen for emergency deletions
      onEmergencyDeleted((data) => {
        console.log("🗑️ Emergency deleted:", data.id);
        setEmergencies(prev => 
          prev.filter(emergency => emergency.id !== data.id)
        );
      });
    } catch (error) {
      console.error("Socket connection error:", error);
    }

    return () => {
      offEmergencyEvents();
      disconnectSocket();
    };
  }, [isOpen]);

  // Update emergency status
  const updateEmergencyStatus = async (id, status) => {
    try {
      const confirm = await alertConfirm(
        `Apakah Anda yakin mengubah status menjadi ${status === 'IN_PROGRESS' ? 'Sedang Ditangani' : 'Selesai'}?`
      );
      if (!confirm) return;

      setUpdatingStatus(id);
      
      // Call API to update status
      await EmergencyApi.update(id);
      
      // Refresh data
      await loadEmergencies();
      
      alertSuccess("Status berhasil diperbarui");
    } catch (error) {
      console.error("Error updating status:", error);
      alertError("Gagal memperbarui status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Format time
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-2 md:p-4">
      <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-6xl h-[95vh] md:h-[90vh] flex flex-col border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b">
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-red-500 text-xl md:text-2xl mr-2 md:mr-3" />
            <div>
              <h2 className="text-lg md:text-2xl font-bold text-gray-800">Peta Darurat Real-time</h2>
              <p className="text-sm md:text-base text-gray-600 hidden sm:block">Pantau lokasi darurat secara langsung</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl md:text-2xl font-bold p-2"
          >
            ×
          </button>
        </div>

        {/* Map Content */}
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Map */}
          <div className="flex-1 relative h-64 md:h-auto">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <FaSpinner className="animate-spin text-4xl text-red-500 mx-auto mb-4" />
                  <p className="text-gray-600">Memuat peta darurat...</p>
                </div>
              </div>
            ) : (
              <MapContainer
                center={emergencies.length > 0 && emergencies[0].latitude && emergencies[0].longitude 
                  ? [parseFloat(emergencies[0].latitude), parseFloat(emergencies[0].longitude)] 
                  : mapCenter}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                <MapUpdater 
                  emergencies={emergencies}
                  center={emergencies.length > 0 && emergencies[0].latitude && emergencies[0].longitude 
                    ? [parseFloat(emergencies[0].latitude), parseFloat(emergencies[0].longitude)] 
                    : mapCenter}
                  selectedEmergency={selectedEmergency}
                  onMapReady={setMapRef}
                />

                {emergencies.map((emergency) => {
                  // Handle string coordinates from backend
                  const lat = parseFloat(emergency.latitude);
                  const lng = parseFloat(emergency.longitude);
                  
                  if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;
                  
                  return (
                    <Marker
                      key={emergency.id}
                      position={[lat, lng]}
                      icon={createBlinkingIcon()}
                    >
                      <Popup className="emergency-popup">
                        <div className="p-2 min-w-[250px]">
                          <div className="flex items-center mb-3">
                            <FaUser className="text-red-500 mr-2" />
                            <h3 className="font-bold text-gray-800">{emergency.user?.name || 'Pengguna'}</h3>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <FaPhone className="mr-2" />
                              <span>{emergency.phone_number}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <FaClock className="mr-2" />
                              <span>{formatDate(emergency.created_at)} - {formatTime(emergency.created_at)}</span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                              {emergency.message}
                            </p>
                          </div>

                          <button
                            onClick={() => updateEmergencyStatus(emergency.id, 'RESOLVED')}
                            disabled={updatingStatus === emergency.id}
                            className="w-full bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-2 rounded font-medium disabled:opacity-50"
                          >
                            {updatingStatus === emergency.id ? (
                              <FaSpinner className="animate-spin mx-auto" />
                            ) : (
                              'Selesai'
                            )}
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l bg-white bg-opacity-80 backdrop-blur-sm flex flex-col">
            <div className="p-3 md:p-4 border-b">
              <h3 className="font-bold text-gray-800 text-sm md:text-base">
                Daftar Darurat Aktif ({emergencies.length})
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 md:p-4">
              {emergencies.length === 0 ? (
                <div className="text-center py-4 md:py-8">
                  <FaCheckCircle className="text-green-400 text-2xl md:text-4xl mx-auto mb-2 md:mb-3" />
                  <p className="text-gray-600 text-sm md:text-base">Tidak ada darurat aktif</p>
                </div>
              ) : (
                <div className="space-y-2 md:space-y-3">
                  {emergencies.map((emergency) => {
                    const isSelected = selectedEmergency?.id === emergency.id;
                    return (
                      <div
                        key={emergency.id}
                        onClick={() => setSelectedEmergency(emergency)}
                        className={`rounded-lg p-2 md:p-3 border shadow-sm cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-red-100 border-red-400 shadow-md' 
                            : 'bg-white border-red-200 hover:bg-red-50 hover:border-red-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1 md:mb-2">
                          <h4 className="font-medium text-gray-800 text-sm md:text-base truncate">
                            {emergency.user?.name || 'Pengguna'}
                          </h4>
                          <span className="text-xs text-red-500 font-medium ml-2">
                            {formatTime(emergency.created_at)}
                          </span>
                        </div>
                        
                        <p className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2 line-clamp-2">
                          {emergency.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-gray-500">
                            <FaPhone className="mr-1" />
                            <span className="truncate">{emergency.phone_number}</span>
                          </div>
                          {isSelected && (
                            <span className="text-xs text-red-600 font-medium">
                              📍 Dipilih
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS for blinking animation */}
      <style jsx>{`
        .emergency-marker {
          position: relative;
          width: 40px;
          height: 40px;
        }
        
        .emergency-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          background: rgba(239, 68, 68, 0.3);
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }
        
        .emergency-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 20px;
          animation: blink 1s infinite;
        }
        
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
        
        @keyframes blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}