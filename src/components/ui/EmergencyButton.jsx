import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaTimes, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const EmergencyButton = () => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [location, setLocation] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [cancelCount, setCancelCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  // Check if user is logged in
  const isLoggedIn = !!profile;

  const handleEmergencyClick = () => {
    if (!isLoggedIn) {
      alert('Anda harus login terlebih dahulu untuk menggunakan fitur SOS!');
      return;
    }
    
    if (isBlocked) {
      alert('Akun Anda diblokir karena penyalahgunaan fitur SOS!');
      return;
    }
    
    setShowEmergencyModal(true);
    getCurrentLocation();
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsGettingLocation(false);
        }
      );
    } else {
      setIsGettingLocation(false);
    }
  };

  const handleConfirmEmergency = () => {
    // Demo emergency alert
    const emergencyData = {
      userId: profile?.id || 'demo-user',
      userName: profile?.name || 'Demo User',
      location: location,
      timestamp: new Date().toISOString(),
      type: 'EMERGENCY_SOS'
    };
    
    console.log('🚨 EMERGENCY ALERT SENT:', emergencyData);
    alert(`🚨 DARURAT! Sinyal SOS dari ${profile?.name || 'User'} telah dikirim ke tim respons!`);
    
    // Call emergency number
    window.location.href = 'tel:112';
    
    setShowEmergencyModal(false);
  };

  const handleCancelEmergency = () => {
    const newCount = cancelCount + 1;
    setCancelCount(newCount);
    
    if (newCount === 3) {
      // Peringatan pertama setelah 3x cancel
      setShowWarning(true);
    } else if (newCount >= 5) {
      // Blokir setelah 5x cancel
      setIsBlocked(true);
      alert('Akun Anda diblokir karena terlalu sering membatalkan SOS!');
    }
    
    setShowEmergencyModal(false);
  };

  // Don't show if not logged in
  if (!isLoggedIn) {
    return null;
  }

  // Show blocked state
  if (isBlocked) {
    return (
      <div className="fixed bottom-6 left-6 z-[998] w-14 h-14 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold">
        BLOCKED
      </div>
    );
  }

  return (
    <>
      {/* Emergency Button */}
      <motion.button
        onClick={handleEmergencyClick}
        className="fixed bottom-6 left-6 z-[998] w-14 h-14 rounded-full shadow-lg text-white bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center hover:scale-105 transition-transform"
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(239, 68, 68, 0.7)",
            "0 0 0 10px rgba(239, 68, 68, 0)",
            "0 0 0 20px rgba(239, 68, 68, 0)"
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop"
        }}
        title={t('emergency.buttonTitle')}
      >
        <FaExclamationTriangle size={24} />
      </motion.button>

      {/* Emergency Modal */}
      <AnimatePresence>
        {showEmergencyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-3 sm:mx-4 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-4 sm:px-6 py-3 sm:py-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-white/20 rounded-full animate-pulse">
                      <FaExclamationTriangle size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold">🚨 SOS</h2>
                      <p className="text-red-100 text-xs sm:text-sm">Darurat</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCancelEmergency}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-4 py-4">
                <div className="text-center mb-4">
                  <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3 animate-pulse">
                    <FaExclamationTriangle className="text-red-600" size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    🚨 {t('emergency.confirmTitle')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t('emergency.confirmMessage')}
                  </p>
                </div>

                {/* Location Info */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <FaMapMarkerAlt className="text-red-500 mt-0.5" size={14} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800 mb-1">{t('emergency.yourLocation')}:</p>
                      {isGettingLocation ? (
                        <p className="text-xs text-red-600">📍 {t('emergency.gettingLocation')}...</p>
                      ) : location ? (
                        <p className="text-xs text-red-600 font-mono">
                          📍 {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                        </p>
                      ) : (
                        <p className="text-xs text-red-600">📍 {t('emergency.locationNotAvailable')}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Warning */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
                  <div className="flex items-start">
                    <FaExclamationTriangle className="text-yellow-400 mt-0.5 mr-2" size={14} />
                    <div className="flex-1">
                      <p className="text-sm text-yellow-800 font-medium mb-2">⚠️ {t('emergency.systemWarning')}</p>
                      <div className="text-xs text-yellow-700 space-y-1">
                        <p>• <strong>{t('emergency.rule1')}</strong> = {t('emergency.rule1Description')}</p>
                        <p>• <strong>{t('emergency.rule2')}</strong> = {t('emergency.rule2Description')}</p>
                        <p>• {t('emergency.rule3')}</p>
                      </div>
                      {cancelCount > 0 && (
                        <div className="bg-red-100 border border-red-300 rounded p-2 mt-3">
                          <p className="text-xs text-red-800 font-medium">
                            ⚠️ {t('emergency.cancelledTimes', { count: cancelCount })}
                          </p>
                          {cancelCount >= 3 && cancelCount < 5 && (
                            <p className="text-xs text-red-900 font-bold mt-1">
                              {t('emergency.warningActive')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleCancelEmergency}
                    className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
                  >
                    {t('emergency.cancel')}
                  </button>
                  <button
                    onClick={handleConfirmEmergency}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 animate-pulse text-sm"
                  >
                    <FaPhone size={12} />
                    🚨 {t('emergency.emergency')}!
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Warning Modal */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-2 sm:mx-4 p-4 sm:p-6"
            >
              <div className="text-center">
                <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <FaExclamationTriangle className="text-yellow-600" size={20} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                  ⚠️ {t('emergency.warningTitle')}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                  {t('emergency.warningMessage', { name: profile?.name || 'User', count: cancelCount, remaining: 5 - cancelCount })}
                </p>
                <button
                  onClick={() => setShowWarning(false)}
                  className="w-full px-4 py-2.5 sm:py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg sm:rounded-xl text-sm sm:text-base"
                >
                  {t('emergency.understood')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmergencyButton;