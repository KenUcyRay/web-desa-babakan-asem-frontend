import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle, FaTimes, FaPhoneAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function SOSFloatingButton() {
  const { t } = useTranslation();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSOSClick = async (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirmSOS = async () => {
    setShowConfirmModal(false);

    // Request location permission first
    if (navigator.geolocation) {
      try {
        // Check if geolocation permission is granted
        const permission = await navigator.permissions.query({name: 'geolocation'});
        
        if (permission.state === 'denied') {
          alert(t('sosButton.locationDenied'));
          window.location.href = "tel:112";
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const locationMsg = `${t('sosButton.emergencyMessage')} ${t('sosButton.location')}: https://maps.google.com/maps?q=${latitude},${longitude}`;
            
            // Send location via WhatsApp to emergency contact
            const emergencyWhatsApp = `https://wa.me/6281234567890?text=${encodeURIComponent(locationMsg)}`;
            window.open(emergencyWhatsApp, '_blank');
            
            // Call emergency number
            setTimeout(() => {
              window.location.href = "tel:112";
            }, 1000);
          },
          (error) => {
            console.error('Geolocation error:', error);
            let errorMsg = t('sosButton.locationError');
            
            switch(error.code) {
              case error.PERMISSION_DENIED:
                errorMsg = t('sosButton.locationDenied');
                break;
              case error.POSITION_UNAVAILABLE:
                errorMsg = t('sosButton.locationUnavailable');
                break;
              case error.TIMEOUT:
                errorMsg = t('sosButton.locationTimeout');
                break;
            }
            
            alert(`${errorMsg} ${t('sosButton.callAnyway')}`);
            window.location.href = "tel:112";
          },
          { 
            enableHighAccuracy: true, 
            timeout: 15000, 
            maximumAge: 300000 
          }
        );
      } catch (error) {
        console.error('Permission error:', error);
        alert(t('sosButton.locationError'));
        window.location.href = "tel:112";
      }
    } else {
      alert(t('sosButton.noGeolocation'));
      window.location.href = "tel:112";
    }
  };

  const handleCancelSOS = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      {/* Modal Konfirmasi */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-full">
                      <FaExclamationTriangle size={20} className="animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">{t('sosButton.modalTitle')}</h2>
                      <p className="text-red-100 text-sm">{t('sosButton.modalSubtitle')}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCancelSOS}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                <div className="text-center mb-6">
                  <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <FaPhoneAlt size={24} className="text-red-500" />
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed">
                    {t('sosButton.modalMessage')}
                  </p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <div className="flex items-start">
                    <FaExclamationTriangle className="text-yellow-400 mt-0.5 mr-3" size={16} />
                    <div>
                      <p className="text-sm text-yellow-800 font-medium">{t('sosButton.modalWarning')}</p>
                      <p className="text-xs text-yellow-700 mt-1">{t('sosButton.modalWarningDetail')}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleCancelSOS}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                  >
                    {t('sosButton.modalCancel')}
                  </button>
                  <button
                    onClick={handleConfirmSOS}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <FaPhoneAlt size={14} />
                    {t('sosButton.modalConfirm')}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tombol SOS */}
      <motion.button
        onClick={handleSOSClick}
        className="fixed bottom-6 left-6 z-[999] w-16 h-16 rounded-full shadow-2xl text-white 
         bg-gradient-to-r from-[#DC2626] to-[#EF4444] 
         hover:from-[#B91C1C] hover:to-[#DC2626] 
         transition-all duration-300 animate-pulse border-4 border-red-200 ring-4 ring-red-300 ring-opacity-50
         flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={`🚨 ${t('sosButton.tooltip')}`}
      >
        <div className="flex flex-col items-center">
          <FaExclamationTriangle size={20} className="animate-pulse" />
          <span className="text-[10px] font-bold mt-0.5 leading-tight">{t('sosButton.label')}</span>
        </div>
      </motion.button>
    </>
  );
}