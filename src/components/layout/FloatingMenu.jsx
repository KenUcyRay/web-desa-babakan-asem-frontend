import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaComments, FaWhatsapp, FaPhone, FaChevronDown, FaTimes } from "react-icons/fa";
import { useTranslation, Trans } from "react-i18next";
import { CallCenterApi } from "../../libs/api/CallcenterApi";

export default function FloatingMenu() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const [showCallCenterDropdown, setShowCallCenterDropdown] = useState(false);
  const [showWhatsAppDropdown, setShowWhatsAppDropdown] = useState(false);
  const [showCallCenterModal, setShowCallCenterModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [bottomPosition, setBottomPosition] = useState(24);
  const [callCenters, setCallCenters] = useState([]);
  const [whatsAppContacts, setWhatsAppContacts] = useState([]);

  useEffect(() => {
    CallCenterApi.getPublic().then((res) => {
      if (res && res.data) {
        // Pisahkan berdasarkan tipe
        const callCenterData = res.data.filter(item => item.type === "CALL_CENTER");
        const whatsAppData = res.data.filter(item => item.type === "WHATSAPP");
        
        setCallCenters(callCenterData);
        setWhatsAppContacts(whatsAppData);
      }
    });
  }, []);

  const handleCallCenterClick = (e) => {
    e.preventDefault();
    setShowCallCenterDropdown(!showCallCenterDropdown);
    setShowWhatsAppDropdown(false); // Tutup dropdown WhatsApp
  };

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    setShowWhatsAppDropdown(!showWhatsAppDropdown);
    setShowCallCenterDropdown(false); // Tutup dropdown Call Center
  };

  const handleCallServiceSelect = (service) => {
    setSelectedService(service);
    setShowCallCenterModal(true);
    setShowCallCenterDropdown(false);
  };

  const handleWhatsAppServiceSelect = (service) => {
    setSelectedService(service);
    setShowWhatsAppModal(true);
    setShowWhatsAppDropdown(false);
  };

  const handleConfirmCall = () => {
    if (selectedService) {
      window.location.href = `tel:${selectedService.number}`;
    }
    setShowCallCenterModal(false);
    setSelectedService(null);
  };

  const handleConfirmWhatsApp = () => {
    if (selectedService) {
      // Format nomor untuk WhatsApp (hilangkan 0 di depan, tambah 62)
      let whatsappNumber = selectedService.number;
      if (whatsappNumber.startsWith('0')) {
        whatsappNumber = '62' + whatsappNumber.slice(1);
      }
      window.open(`https://wa.me/${whatsappNumber}`, '_blank');
    }
    setShowWhatsAppModal(false);
    setSelectedService(null);
  };

  const handleCancelCall = () => {
    setShowCallCenterModal(false);
    setSelectedService(null);
  };

  const handleCancelWhatsApp = () => {
    setShowWhatsAppModal(false);
    setSelectedService(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowGreeting(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector("footer");
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (footerRect.top < windowHeight) {
          const spaceAboveFooter = footerRect.top;
          const newBottomPosition = windowHeight - spaceAboveFooter + 20;
          if (newBottomPosition > 24) {
            setBottomPosition(newBottomPosition);
          } else {
            setBottomPosition(24);
          }
        } else {
          setBottomPosition(24);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
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
            style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-full">
                      <FaPhone size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">{t("floatingMenu.callModalTitle")}</h2>
                      <p className="text-blue-100 text-sm">{t("floatingMenu.callModalSubtitle")}</p>
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

              <div className="px-6 py-6">
                <div className="text-center mb-6">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <FaPhone className="text-blue-500" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedService.name}</h3>
                  <p className="text-gray-600 font-mono text-lg">{selectedService.number}</p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                  <div className="flex items-start">
                    <FaPhone className="text-blue-400 mt-0.5 mr-3" size={16} />
                    <div>
                      <p className="text-sm text-blue-800 font-medium">
                        {t("floatingMenu.callModalMessage")}
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        {t("floatingMenu.callModalDetail")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCancelCall}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                  >
                    {t("floatingMenu.callModalCancel")}
                  </button>
                  <button
                    onClick={handleConfirmCall}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <FaPhone size={14} />
                    {t("floatingMenu.callModalConfirm")}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Konfirmasi WhatsApp */}
      <AnimatePresence>
        {showWhatsAppModal && selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-full">
                      <FaWhatsapp size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">Hubungi WhatsApp</h2>
                      <p className="text-green-100 text-sm">Akan membuka WhatsApp</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCancelWhatsApp}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              </div>

              <div className="px-6 py-6">
                <div className="text-center mb-6">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <FaWhatsapp className="text-green-500" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedService.name}</h3>
                  <p className="text-gray-600 font-mono text-lg">{selectedService.number}</p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                  <div className="flex items-start">
                    <FaWhatsapp className="text-green-400 mt-0.5 mr-3" size={16} />
                    <div>
                      <p className="text-sm text-green-800 font-medium">
                        Anda akan diarahkan ke WhatsApp untuk mengirim pesan
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        Pastikan WhatsApp terinstall di perangkat Anda
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCancelWhatsApp}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleConfirmWhatsApp}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <FaWhatsapp size={14} />
                    Buka WhatsApp
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="fixed right-6 z-[30] flex flex-col items-end transition-all duration-300"
        style={{ bottom: `${bottomPosition}px` }}
      >
        {/* Sapaan */}
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

        {/* Menu keluar */}
        <AnimatePresence>
          {open && (
            <motion.div
              className="mb-3 flex flex-col gap-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {/* Dropdown Call Center */}
              {callCenters.length > 0 && (
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
                    <FaChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${
                        showCallCenterDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {showCallCenterDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -15, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -15, scale: 0.9 }}
                        transition={{
                          duration: 0.3,
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                        }}
                        className="absolute bottom-full mb-3 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 min-w-[220px] z-10 backdrop-blur-sm"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <div className="px-4 py-2 border-b border-gray-100 mb-2">
                          <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                            <FaPhone size={12} className="text-blue-500" />
                            {t("floatingMenu.callCenter")}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {t("floatingMenu.selectService")}
                          </p>
                        </div>

                        {callCenters.map((option, index) => (
                          <motion.button
                            key={option.id}
                            onClick={() => handleCallServiceSelect(option)}
                            className="w-full px-4 py-3 text-left flex items-center gap-3 text-gray-700 text-sm relative overflow-hidden group"
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <div className="relative z-10 p-2 rounded-full bg-white shadow-sm group-hover:shadow-md transition-all duration-300">
                              <FaPhone size={12} />
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
                          <p className="text-xs text-gray-400 text-center">
                            {t("floatingMenu.clickToCall")}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Dropdown WhatsApp */}
              {whatsAppContacts.length > 0 && (
                <div className="relative">
                  <button
                    onClick={handleWhatsAppClick}
                    className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md text-sm text-white 
                     bg-gradient-to-r from-[#25D366] to-[#128C7E] 
                     hover:from-[#128C7E] hover:to-[#25D366] 
                     transition-all duration-300 w-full justify-between"
                    title="Pilih kontak WhatsApp"
                  >
                    <div className="flex items-center gap-2">
                      <FaWhatsapp size={14} /> WhatsApp
                    </div>
                    <FaChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${
                        showWhatsAppDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {showWhatsAppDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -15, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -15, scale: 0.9 }}
                        transition={{
                          duration: 0.3,
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                        }}
                        className="absolute bottom-full mb-3 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 min-w-[220px] z-10 backdrop-blur-sm"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <div className="px-4 py-2 border-b border-gray-100 mb-2">
                          <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                            <FaWhatsapp size={12} className="text-green-500" />
                            WhatsApp
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            Pilih kontak WhatsApp
                          </p>
                        </div>

                        {whatsAppContacts.map((option, index) => (
                          <motion.button
                            key={option.id}
                            onClick={() => handleWhatsAppServiceSelect(option)}
                            className="w-full px-4 py-3 text-left flex items-center gap-3 text-gray-700 text-sm relative overflow-hidden group"
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <div className="relative z-10 p-2 rounded-full bg-white shadow-sm group-hover:shadow-md transition-all duration-300">
                              <FaWhatsapp size={12} className="text-green-500" />
                            </div>

                            <div className="relative z-10 flex-1">
                              <div className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors duration-300">
                                {option.name}
                              </div>
                              <div className="text-xs text-gray-500 group-hover:text-green-600 transition-colors duration-300 font-mono">
                                {option.number}
                              </div>
                            </div>

                            <div className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <FaWhatsapp size={10} className="text-green-500" />
                            </div>
                          </motion.button>
                        ))}

                        <div className="px-4 py-2 mt-2 border-t border-gray-100">
                          <p className="text-xs text-gray-400 text-center">
                            Klik untuk membuka WhatsApp
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tombol utama */}
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