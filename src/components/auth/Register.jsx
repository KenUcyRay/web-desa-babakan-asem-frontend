import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import registerImage from "../../assets/register.png";
import { UserApi } from "../../libs/api/UserApi";
import { useAuth } from "../../contexts/AuthContext";
import { alertError, alertSuccess } from "../../libs/alert";
import AOS from "aos";
import "aos/dist/aos.css";
import { AnimatePresence, motion } from "framer-motion";

export default function Register() {
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);

  const [loginMethod, setLoginMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [reCaptchaToken, setReCaptchaToken] = useState("");
  const { isLoggedIn, login } = useAuth();

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // sementara backend tetap pakai email
    const contactValue = email;

    const response = await UserApi.userRegister(
      name,
      contactValue,
      password,
      confirmPassword,
      rememberMe,
      reCaptchaToken
    );

    const responseBody = await response.json();
    if (response.status === 201) {
      login(responseBody.token);
      await alertSuccess("Registrasi berhasil!");
      navigate("/");
    } else {
      await alertError(
        responseBody.error || "Registrasi gagal, silakan coba lagi."
      );
    }

    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setconfirmPassword("");
    setRememberMe(false);
    setReCaptchaToken("");
    recaptchaRef.current?.reset();
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="flex min-h-screen font-poppins">
      {/* ✅ Bagian Kiri: Form Register */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gradient-to-b from-[#B6F500] to-[#FFFCE2] px-8 py-12">
        <div
          className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl w-full max-w-md p-8"
          data-aos="fade-up"
        >
          <h2 className="text-3xl text-gray-900 font-normal text-center mb-2">
            Hallo , Selamat Datang!
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Bergabung dengan Portal Desa Babakan Asem
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Nama Lengkap */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-300 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* ✅ Radio Email/HP */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-gray-700 font-medium">
                  {loginMethod === "email" ? "Email" : "No HP"}
                </label>
                <div className="flex gap-4">
                  <label
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => setLoginMethod("email")}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        loginMethod === "email"
                          ? "border-green-400"
                          : "border-gray-300"
                      }`}
                    >
                      {loginMethod === "email" && (
                        <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-green-400 to-[#B6F500]" />
                      )}
                    </span>
                    <span className="text-xs text-gray-700">Email</span>
                  </label>

                  <label
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => setLoginMethod("phone")}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        loginMethod === "phone"
                          ? "border-green-400"
                          : "border-gray-300"
                      }`}
                    >
                      {loginMethod === "phone" && (
                        <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-green-400 to-[#B6F500]" />
                      )}
                    </span>
                    <span className="text-xs text-gray-700">No Telp</span>
                  </label>
                </div>
              </div>

              {/* ✅ Input dinamis + animasi */}
              <AnimatePresence mode="wait">
                {loginMethod === "email" ? (
                  <motion.div
                    key="email"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <input
                      type="email"
                      placeholder="Masukkan email"
                      className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-300 outline-none"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      required
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="phone"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <input
                      type="tel"
                      placeholder="Masukkan nomor HP"
                      className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-300 outline-none"
                      onChange={(e) => setPhone(e.target.value)}
                      value={phone}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Buat password"
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-300 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Konfirmasi Password
              </label>
              <input
                type="password"
                placeholder="Ulangi password"
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-300 outline-none"
                value={confirmPassword}
                onChange={(e) => setconfirmPassword(e.target.value)}
                required
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 text-green-500"
              />
              Remember Me
            </label>

            {/* ✅ reCAPTCHA */}
            <div className="min-w-ful flex items-center justify-center my-8 ">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                size="normal"
                onChange={(token) => setReCaptchaToken(token)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-green-400 to-[#B6F500] text-white font-semibold rounded-lg hover:opacity-90 transition duration-200"
            >
              Daftar Sekarang
            </button>
          </form>

          <div className="flex items-center my-6">
            <span className="flex-1 h-px bg-gray-200"></span>
            <span className="px-4 text-sm text-gray-400">atau</span>
            <span className="flex-1 h-px bg-gray-200"></span>
          </div>

          <p className="text-center text-sm text-gray-700 mt-6">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="text-blue-500 hover:underline"
              data-aos="fade-right"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>

      {/* ✅ Bagian Kanan: Background tetap, hanya gambar animasi */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-b from-[#B6F500] to-[#FFFCE2] px-8 py-12">
        <motion.img
          src={registerImage}
          alt="Ilustrasi Register"
          className="w-4/5 drop-shadow-xl"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </div>
  );
}
