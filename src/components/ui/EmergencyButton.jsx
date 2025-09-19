import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaExclamationTriangle,
  FaTimes,
  FaPhone,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaUser,
  FaLocationArrow,
  FaFire,
  FaWater,
  FaHeartbeat,
  FaCar,
  FaUserInjured,
  FaHome,
  FaBolt,
  FaTree,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { EmergencyApi } from "../../libs/api/EmergencyApi";

const EmergencyButton = () => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [cancelCount, setCancelCount] = useState(0);
  const [blockUntil, setBlockUntil] = useState(null);
  const [countdown, setCountdown] = useState(0);

  const [emergencyForm, setEmergencyForm] = useState({
    phone_number: "",
    emergency_type: "",
    additional_info: "",
    location: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [bottomPosition, setBottomPosition] = useState(24);

  const isLoggedIn = !!profile;
  const isRegularUser = !profile?.role || profile?.role === "REGULAR";

  // Daftar jenis darurat yang umum terjadi di desa
  const emergencyTypes = [
    {
      id: "kebakaran",
      label: t("emergencyform.types.fire"),
      icon: FaFire,
      color: "bg-red-500",
      description: t("emergencyform.types.fireDescription")
    },
    {
      id: "banjir",
      label: t("emergencyform.types.flood"),
      icon: FaWater,
      color: "bg-blue-500",
      description: t("emergencyform.types.floodDescription")
    },
    {
      id: "medis",
      label: t("emergencyform.types.medical"),
      icon: FaHeartbeat,
      color: "bg-pink-500",
      description: t("emergencyform.types.medicalDescription")
    },
    {
      id: "kecelakaan",
      label: t("emergencyform.types.accident"),
      icon: FaCar,
      color: "bg-yellow-600",
      description: t("emergencyform.types.accidentDescription")
    },
    {
      id: "kriminal",
      label: t("emergencyform.types.crime"),
      icon: FaUserInjured,
      color: "bg-purple-500",
      description: t("emergencyform.types.crimeDescription")
    },
    {
      id: "bangunan",
      label: t("emergencyform.types.collapse"),
      icon: FaHome,
      color: "bg-gray-600",
      description: t("emergencyform.types.collapseDescription")
    },
    {
      id: "listrik",
      label: t("emergencyform.types.electricity"),
      icon: FaBolt,
      color: "bg-orange-500",
      description: t("emergencyform.types.electricityDescription")
    },
    {
      id: "pohon",
      label: t("emergencyform.types.tree"),
      icon: FaTree,
      color: "bg-green-600",
      description: t("emergencyform.types.treeDescription")
    }
  ];

  // cek blokir dari localStorage
  useEffect(() => {
    const storedBlock = localStorage.getItem("emergency_block_until");
    if (storedBlock) {
      const until = parseInt(storedBlock);
      if (Date.now() < until) {
        setBlockUntil(until);
        setCountdown(Math.ceil((until - Date.now()) / 1000));
        setShowBlockedModal(true);
      }
    }
  }, []);

  // jalanin countdown
  useEffect(() => {
    if (!blockUntil) return;
    const interval = setInterval(() => {
      const remaining = Math.ceil((blockUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(interval);
        setBlockUntil(null);
        setCountdown(0);
        localStorage.removeItem("emergency_block_until");
        setShowBlockedModal(false);
      } else {
        setCountdown(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [blockUntil]);

  // posisi tombol biar ga ketimpa footer
  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector("footer");
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (footerRect.top < windowHeight) {
          const spaceAboveFooter = footerRect.top;
          const newBottomPosition = windowHeight - spaceAboveFooter + 20;
          setBottomPosition(newBottomPosition > 24 ? newBottomPosition : 24);
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

  const handleEmergencyClick = () => {
    if (!isLoggedIn) return;
    if (!isRegularUser) return;
    if (blockUntil && Date.now() < blockUntil) {
      setShowBlockedModal(true);
      return;
    }
    setShowEmergencyModal(true);
  };

  const handleConfirmEmergency = () => {
    setShowEmergencyModal(false);
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setEmergencyForm((prev) => ({
            ...prev,
            phone_number: profile?.phone_number || "",
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          }));
          setIsGettingLocation(false);
          setShowFormModal(true);
        },
        () => {
          setEmergencyForm((prev) => ({
            ...prev,
            phone_number: profile?.phone_number || "",
            location: null,
          }));
          setIsGettingLocation(false);
          setShowFormModal(true);
        }
      );
    } else {
      setEmergencyForm((prev) => ({
        ...prev,
        phone_number: profile?.phone_number || "",
        location: null,
      }));
      setIsGettingLocation(false);
      setShowFormModal(true);
    }
  };

  const handleGetLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setEmergencyForm((prev) => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          }));
          setIsGettingLocation(false);
        },
        () => {
          setIsGettingLocation(false);
        }
      );
    }
  };

  const handleEmergencyTypeSelect = (type) => {
    setEmergencyForm((prev) => ({
      ...prev,
      emergency_type: type.id,
    }));
  };

  const handleSubmitEmergency = async () => {
    if (!emergencyForm.emergency_type) return;

    setIsSubmitting(true);

    try {
      const selectedType = emergencyTypes.find(t => t.id === emergencyForm.emergency_type);
      const emergencyMessage = `[${selectedType.label}] ${selectedType.description}${emergencyForm.additional_info ? ` - ${emergencyForm.additional_info}` : ''}`;
      
      const emergencyData = {
        phone_number: emergencyForm.phone_number || profile?.phone_number || "",
        latitude: emergencyForm.location
          ? emergencyForm.location.latitude.toString()
          : "0",
        longitude: emergencyForm.location
          ? emergencyForm.location.longitude.toString()
          : "0",
        message: emergencyMessage,
      };

      await EmergencyApi.create(emergencyData);

      setEmergencyForm({ phone_number: "", emergency_type: "", additional_info: "", location: null });
      setShowFormModal(false);
      setShowSuccessModal(true);

      setTimeout(() => {
        window.location.href = "tel:+6281299990001";
      }, 1000);
    } catch (error) {
      console.error("Emergency submission error:", error);
      setShowFormModal(false);
      
      // Handle different error types
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        setErrorMessage(t("emergencyform.errorUnauthorized"));
      } else if (error.message.includes('Network')) {
        setErrorMessage(t("emergencyform.errorNetwork"));
      } else {
        setErrorMessage(t("emergencyform.errorGeneral"));
      }
      
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEmergency = () => {
    const newCount = cancelCount + 1;
    setCancelCount(newCount);

    if (newCount === 3) {
      setShowWarningModal(true);
    } else if (newCount >= 5) {
      const until = Date.now() + 60 * 1000; // 1 menit block
      localStorage.setItem("emergency_block_until", until.toString());
      setBlockUntil(until);
      setCountdown(60);
      setShowBlockedModal(true);
    }

    setShowEmergencyModal(false);
  };

  if (!isLoggedIn || !isRegularUser) return null;

  return (
    <>
      {/* Emergency Button */}
      <motion.button
        onClick={handleEmergencyClick}
        disabled={blockUntil && Date.now() < blockUntil}
        className={`fixed left-6 z-[30] w-14 h-14 rounded-full shadow-lg text-white flex items-center justify-center transition-all duration-300 ${
          blockUntil && Date.now() < blockUntil
            ? "bg-gray-400"
            : "bg-gradient-to-br from-red-500 to-red-600"
        }`}
        style={{ bottom: `${bottomPosition}px` }}
        whileTap={{ scale: 0.95 }}
        animate={
          !(blockUntil && Date.now() < blockUntil)
            ? {
                boxShadow: [
                  "0 0 0 0 rgba(239, 68, 68, 0.7)",
                  "0 0 0 10px rgba(239, 68, 68, 0)",
                  "0 0 0 20px rgba(239, 68, 68, 0)",
                ],
              }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
      >
        {blockUntil && Date.now() < blockUntil ? countdown : <FaExclamationTriangle size={24} />}
      </motion.button>

      {/* Loading Modal */}
      <AnimatePresence>
        {isGettingLocation && (
          <Modal
            title={t("emergencyform.gettingLocation")}
            hideCloseButton
          >
            <div className="flex flex-col items-center py-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
              <p className="text-gray-600">{t("emergencyform.gettingLocationMessage")}</p>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Modal Konfirmasi - FIXED */}
      <AnimatePresence>
        {showEmergencyModal && (
          <Modal
            title={t("emergencyform.sos")}
            onClose={handleCancelEmergency}
            footer={
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
                <button
                  onClick={handleCancelEmergency}
                  className="flex-1 px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm"
                >
                  {t("emergencyform.cancel")}
                </button>
                <button
                  onClick={handleConfirmEmergency}
                  className="flex-1 px-3 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors text-sm flex items-center justify-center"
                >
                  <span className="mr-1">🚨</span>
                  <span className="truncate">{t("emergencyform.emergency")}</span>
                </button>
              </div>
            }
          >
            <p className="text-gray-700 mb-4">{t("emergencyform.confirmMessage")}</p>
          </Modal>
        )}
      </AnimatePresence>

      {/* Form SOS - Mobile Optimized */}
      <AnimatePresence>
        {showFormModal && (
          <Modal
            title={t("emergencyform.selectEmergencyType")}
            onClose={() => setShowFormModal(false)}
            isLargeModal={true}
            footer={
              <button
                onClick={handleSubmitEmergency}
                disabled={isSubmitting || !emergencyForm.emergency_type}
                className={`w-full px-4 py-3 font-bold rounded-lg transition-all duration-200 ${
                  isSubmitting || !emergencyForm.emergency_type
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600 text-white hover:shadow-lg"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t("emergencyform.sending")}
                  </div>
                ) : (
                  <>{t("emergencyform.sendSOS")}</>
                )}
              </button>
            }
          >
            <div className="max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-6">
                {/* Left Column */}
                <div className="space-y-3 lg:space-y-4">
                  {/* User Info Header */}
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-2 lg:p-3 border border-red-100 lg:col-span-2">
                    <div className="flex items-center space-x-2 lg:space-x-3">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-red-600" size="12" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-xs lg:text-sm">{profile?.name || "User"}</h3>
                        <p className="text-xs lg:text-sm text-gray-600">{t("emergencyform.userReporting")}</p>
                      </div>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1 lg:space-y-2">
                    <label className="block text-xs lg:text-sm font-medium text-gray-700">
                      {t("emergencyform.phoneNumber")} *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2 lg:pl-3 flex items-center pointer-events-none">
                        <FaPhone className="h-3 w-3 lg:h-4 lg:w-4 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        placeholder={t("emergencyform.phonePlaceholder")}
                        value={emergencyForm.phone_number}
                        onChange={(e) =>
                          setEmergencyForm((prev) => ({
                            ...prev,
                            phone_number: e.target.value,
                          }))
                        }
                        className="block w-full pl-8 lg:pl-10 pr-3 py-2 lg:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-1 lg:space-y-2">
                    <label className="block text-xs lg:text-sm font-medium text-gray-700">
                      {t("emergencyform.location")}
                    </label>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 lg:p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 lg:space-x-2">
                          <FaMapMarkerAlt className="text-gray-500 text-xs lg:text-sm" />
                          <span className="text-xs lg:text-sm text-gray-600">
                            {emergencyForm.location ? t("emergencyform.locationRetrieved") : t("emergencyform.noLocation")}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleGetLocation}
                          disabled={isGettingLocation}
                          className="px-2 py-1 lg:px-3 lg:py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs lg:text-sm transition-colors"
                        >
                          {isGettingLocation ? "..." : t("emergencyform.getLocation")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Emergency Types */}
                <div className="space-y-1 lg:space-y-2">
                  <label className="block text-xs lg:text-sm font-medium text-gray-700">
                    {t("emergencyform.emergencyType")} *
                  </label>
                  <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2 lg:gap-3 max-h-48 lg:max-h-80 overflow-y-auto">
                    {emergencyTypes.map((type) => {
                      const IconComponent = type.icon;
                      const isSelected = emergencyForm.emergency_type === type.id;
                      
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => handleEmergencyTypeSelect(type)}
                          className={`p-2 lg:p-3 rounded-lg border transition-all duration-200 text-left ${
                            isSelected 
                              ? `${type.color} text-white border-transparent shadow-lg`
                              : `bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:shadow-md`
                          }`}
                        >
                          <div className="flex items-center space-x-2 lg:space-x-3">
                            <IconComponent size="14" className={isSelected ? "text-white" : "text-gray-500"} />
                            <span className="text-xs lg:text-sm font-medium">{type.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Info - Full Width on Mobile */}
                {emergencyForm.emergency_type && (
                  <div className="lg:col-span-2 space-y-1 lg:space-y-2">
                    <label className="block text-xs lg:text-sm font-medium text-gray-700">
                      {t("emergencyform.additionalInfo")}
                    </label>
                    <textarea
                      placeholder={t("emergencyform.additionalInfoPlaceholder")}
                      value={emergencyForm.additional_info}
                      onChange={(e) =>
                        setEmergencyForm((prev) => ({
                          ...prev,
                          additional_info: e.target.value,
                        }))
                      }
                      rows={2}
                      maxLength={100}
                      className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none transition-colors"
                    />
                  </div>
                )}
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Warning */}
      <AnimatePresence>
        {showWarningModal && (
          <Modal
            title={t("emergencyform.warningTitle")}
            onClose={() => setShowWarningModal(false)}
            footer={
              <button
                onClick={() => setShowWarningModal(false)}
                className="w-full px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-colors"
              >
                {t("emergencyform.understood")}
              </button>
            }
          >
            <div className="flex flex-col items-center py-4">
              <FaExclamationTriangle className="text-yellow-600 mb-4" size={32} />
              <p className="text-sm text-gray-600 text-center">
                {t("emergencyform.warningMessage", {
                  name: profile?.name || "User",
                  count: cancelCount,
                  remaining: 5 - cancelCount,
                })}
              </p>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Blocked */}
      <AnimatePresence>
        {showBlockedModal && (
          <Modal
            title={t("emergencyform.blockedTitle")}
            onClose={() => setShowBlockedModal(false)}
          >
            <div className="flex flex-col items-center py-4">
              <FaExclamationTriangle className="text-red-600 mb-4" size={32} />
              <p className="text-sm text-gray-600 text-center">
                {t("emergencyform.blockedFor")} {countdown} {t("emergencyform.seconds")}
              </p>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Success */}
      <AnimatePresence>
        {showSuccessModal && (
          <Modal
            title={t("emergencyform.successTitle")}
            onClose={() => setShowSuccessModal(false)}
          >
            <div className="flex flex-col items-center py-4">
              <FaCheckCircle className="text-green-600 mb-4" size={32} />
              <p className="text-sm text-gray-600 text-center">{t("emergencyform.sosSuccessSent")}</p>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Error Modal */}
      <AnimatePresence>
        {showErrorModal && (
          <Modal
            title="Failed to Send SOS"
            onClose={() => setShowErrorModal(false)}
            footer={
              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors"
              >
                Close
              </button>
            }
          >
            <div className="flex flex-col items-center py-4">
              <FaExclamationTriangle className="text-red-600 mb-4" size={32} />
              <p className="text-sm text-gray-600 text-center">{errorMessage}</p>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmergencyButton;

// Enhanced Modal component
const Modal = ({ title, children, footer, onClose, hideCloseButton = false, isLargeModal = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`bg-white rounded-xl shadow-2xl w-full mx-3 sm:mx-4 overflow-hidden ${
          isLargeModal ? "max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl" : "max-w-sm"
        }`}
      >
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-4 py-4 text-white flex justify-between items-center">
          <h2 className="font-bold text-lg">🚨 {title}</h2>
          {!hideCloseButton && (
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <FaTimes size={16} />
            </button>
          )}
        </div>
        <div className="p-4 sm:p-6">{children}</div>
        {footer && <div className="p-4 sm:p-6 pt-0">{footer}</div>}
      </motion.div>
    </motion.div>
  );
};