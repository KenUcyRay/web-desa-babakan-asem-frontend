import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const SOSWarningModal = ({ isOpen, onClose, cancellationCount }) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-full">
                    <FaExclamationTriangle size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Peringatan SOS</h2>
                    <p className="text-yellow-100 text-sm">Penggunaan tidak sesuai</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <FaTimes size={16} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <FaExclamationTriangle className="text-yellow-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Peringatan Penyalahgunaan SOS
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Anda telah membatalkan panggilan darurat sebanyak <strong>{cancellationCount} kali</strong>.
                </p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex items-start">
                  <FaExclamationTriangle className="text-yellow-400 mt-0.5 mr-3" size={16} />
                  <div>
                    <p className="text-sm text-yellow-800 font-medium">
                      Fitur SOS hanya untuk keadaan darurat sesungguhnya!
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Jika Anda membatalkan 1 kali lagi, akun akan diblokir sementara.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onClose}
                className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                Saya Mengerti
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SOSWarningModal;