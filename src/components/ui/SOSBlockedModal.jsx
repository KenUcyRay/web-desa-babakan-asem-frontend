import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBan, FaSignOutAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const SOSBlockedModal = ({ isOpen, onLogout }) => {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (isOpen && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isOpen && countdown === 0) {
      onLogout();
    }
  }, [isOpen, countdown, onLogout]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
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
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <FaBan size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Akun Diblokir</h2>
                  <p className="text-red-100 text-sm">Penyalahgunaan fitur SOS</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6 text-center">
              <div className="mb-6">
                <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <FaBan className="text-red-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Akun Anda Telah Diblokir
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Anda telah membatalkan panggilan darurat terlalu sering. 
                  Akun Anda diblokir sementara untuk mencegah penyalahgunaan fitur SOS.
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center gap-2 text-red-700">
                  <FaSignOutAlt size={16} />
                  <span className="font-medium">
                    Logout otomatis dalam {countdown} detik
                  </span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-red-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                <p>Hubungi administrator untuk membuka blokir akun Anda.</p>
                <p className="mt-1 font-medium">Gunakan fitur SOS hanya untuk keadaan darurat!</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SOSBlockedModal;