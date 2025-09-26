import { useState, useEffect } from "react";
import { FaExclamationTriangle, FaTimes, FaMapMarkerAlt } from "react-icons/fa";

export default function EmergencyNotification({ emergency, onClose, onViewMap }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto close after 10 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!emergency) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-red-500 text-white rounded-lg shadow-2xl p-4 max-w-sm animate-pulse">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-yellow-300 text-xl mr-2 animate-bounce" />
            <h3 className="font-bold text-lg">DARURAT BARU!</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 ml-2"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="space-y-2 mb-4">
          <p className="font-medium">{emergency.user?.name || 'Pengguna'}</p>
          <p className="text-sm opacity-90">{emergency.message}</p>
          <p className="text-xs opacity-75">📞 {emergency.phone_number}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              onViewMap();
              handleClose();
            }}
            className="flex-1 bg-white text-red-500 px-3 py-2 rounded font-medium text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-1"
          >
            <FaMapMarkerAlt />
            Lihat di Peta
          </button>
        </div>
      </div>
    </div>
  );
}