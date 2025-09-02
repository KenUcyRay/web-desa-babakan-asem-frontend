import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaComments, FaWhatsapp, FaPhone, FaChevronDown, FaAmbulance, FaShieldAlt, FaTimes } from "react-icons/fa";
import { MdLocalHospital } from "react-icons/md";
import { useTranslation, Trans } from "react-i18next";

export default function FloatingMenu() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const [showCallCenterDropdown, setShowCallCenterDropdown] = useState(false);
  const [showCallCenterModal, setShowCallCenterModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleCallCenterClick = (e) => {
    e.preventDefault();
    setShowCallCenterDropdown(!showCallCenterDropdown);
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setShowCallCenterModal(true);
    setShowCallCenterDropdown(false);
  };

  const handleConfirmCall = () => {
    if (selectedService) {
      window.location.href = `tel:${selectedService.number}`;
    }
    setShowCallCenterModal(false);
    setSelectedService(null);
  };

  const handleCancelCall = () => {
    setShowCallCenterModal(false);
    setSelectedService(null);
  };

  const callCenterOptions = [
    {
      name: t('floatingMenu.puskesmas'),
      number: '+6281234567891',
      icon: <MdLocalHospital size={14} />,
      color: 'text-red-500'
    },
    {
      name: t('floatingMenu.police'),
      number: '110',
      icon: <FaShieldAlt size={14} />,
      color: 'text-blue-600'
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShowGreeting(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Modal Konfirmasi Call Center */}
      <AnimatePresence>
        {showCallCenterModal && selectedService && (
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
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-full">
                      <FaPhone size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">{t('floatingMenu.callModalTitle')}</h2>
                      <p className="text-blue-100 text-sm">{t('floatingMenu.callModalSubtitle')}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCancelCall}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                <div className="text-center mb-6">
                  <div className={`mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4`}>
                    <span className={selectedService.color}>
                      {selectedService.icon}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedService.name}</h3>
                  <p className="text-gray-600 font-mono text-lg">{selectedService.number}</p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                  <div className="flex items-start">
                    <FaPhone className="text-blue-400 mt-0.5 mr-3" size={16} />
                    <div>
                      <p className="text-sm text-blue-800 font-medium">{t('floatingMenu.callModalMessage')}</p>
                      <p className="text-xs text-blue-700 mt-1">{t('floatingMenu.callModalDetail')}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleCancelCall}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                  >
                    {t('floatingMenu.callModalCancel')}
                  </button>
                  <button
                    onClick={handleConfirmCall}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <FaPhone size={14} />
                    {t('floatingMenu.callModalConfirm')}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end">
      {/* ✅ Sapaan kecil */}
      <AnimatePresence>
        {showGreeting && !open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="mb-3 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg text-sm border border-gray-200 max-w-[180px] text-right"
          >
            <Trans i18nKey="floatingMenu.greeting" components={{ strong: <strong /> }} />
            <div className="text-xs text-gray-500">{t("floatingMenu.subGreeting")}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Menu keluar */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="mb-3 flex flex-col gap-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >

            <div className="relative">
              <button
                onClick={handleCallCenterClick}
                className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md text-sm text-white 
                 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] 
                 hover:from-[#1D4ED8] hover:to-[#2563EB] 
                 transition-all duration-300 w-full justify-between"
                title="Pilih layanan darurat"
              >
                <div className="flex items-center gap-2">
                  <FaPhone size={14} /> {t("floatingMenu.callCenter")}
                </div>
                <FaChevronDown size={12} className={`transition-transform duration-200 ${showCallCenterDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showCallCenterDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -15, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.9 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute bottom-full mb-3 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 min-w-[220px] z-10 backdrop-blur-sm"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <div className="px-4 py-2 border-b border-gray-100 mb-2">
                      <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                        <FaPhone size={12} className="text-blue-500" />
                        {t("floatingMenu.callCenter")}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">{t("floatingMenu.selectService")}</p>
                    </div>
                    
                    {callCenterOptions.map((option, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleServiceSelect(option)}
                        className="w-full px-4 py-3 text-left flex items-center gap-3 text-gray-700 text-sm relative overflow-hidden group"
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className={`relative z-10 p-2 rounded-full bg-white shadow-sm group-hover:shadow-md transition-all duration-300 ${option.color}`}>
                          {option.icon}
                        </div>
                        
                        <div className="relative z-10 flex-1">
                          <div className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                            {option.name}
                          </div>
                          <div className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors duration-300 font-mono">
                            {option.number}
                          </div>
                        </div>
                        
                        <div className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <FaPhone size={10} className="text-blue-500" />
                        </div>
                      </motion.button>
                    ))}
                    
                    <div className="px-4 py-2 mt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-400 text-center">{t("floatingMenu.clickToCall")}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md text-sm text-white 
               bg-gradient-to-r from-[#25D366] to-[#128C7E] 
               hover:from-[#20BA5A] hover:to-[#0F7A6B] 
               transition-all duration-300"
              title="Chat WhatsApp untuk pertanyaan umum"
            >
              <FaWhatsapp size={14} /> {t("floatingMenu.whatsapp")}
            </a>
          </motion.div>
        )}  
      </AnimatePresence>

      {/* ✅ Tombol utama */}
      <motion.button
        onClick={() => {
          setOpen(!open);
          setShowGreeting(false);
        }}
        className="w-14 h-14 rounded-full shadow-lg text-white bg-gradient-to-br from-green-400 to-[#B6F500] flex items-center justify-center hover:scale-105 transition-transform"
        whileTap={{ scale: 0.95 }}
      >
        <FaComments size={24} />
      </motion.button>
      </div>
    </>
  );
}
