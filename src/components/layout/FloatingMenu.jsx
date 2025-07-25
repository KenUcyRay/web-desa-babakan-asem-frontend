import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaComments, FaWhatsapp, FaPhone, FaEnvelope } from "react-icons/fa";

export default function FloatingMenu() {
  const [open, setOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);

  // Biar sapaan muncul hanya pertama kali
  useEffect(() => {
    const timer = setTimeout(() => setShowGreeting(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end">
      
      {/* ✅ Sapaan kecil di atas tombol */}
      <AnimatePresence>
        {showGreeting && !open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="mb-3 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg text-sm border border-gray-200 max-w-[180px] text-right"
          >
            👋 <b>Butuh bantuan?</b>  
            <div className="text-xs text-gray-500">Hubungi Admin Cukup Klik di sini</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Menu keluar smooth */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="mb-3 flex flex-col gap-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md text-sm text-white 
             bg-gradient-to-r from-[#9BEC00] to-[#a8e328] 
             hover:from-[#7FCC00] hover:to-[#B5FF50] 
             transition-all duration-300"
            >
              <FaWhatsapp /> WhatsApp
            </a>
            <a
              href="tel:+6281234567890"
              className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md text-sm text-white 
             bg-gradient-to-r from-[#60B5FF] to-[#AFDDFF] 
             hover:from-[#3FA4FF] hover:to-[#98D0FF] 
             transition-all duration-300"
            >
              <FaPhone /> Telepon
            </a>
           
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Tombol Utama */}
      <motion.button
        onClick={() => {
          setOpen(!open);
          setShowGreeting(false); // matikan sapaan kalau sudah diklik
        }}
        className="w-14 h-14 rounded-full shadow-lg text-white bg-gradient-to-br from-green-400 to-[#B6F500] flex items-center justify-center hover:scale-105 transition-transform"
        whileTap={{ scale: 0.95 }}
      >
        <FaComments size={24} />
      </motion.button>
    </div>
  );
}
    