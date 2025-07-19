import { Link, useNavigate } from "react-router-dom";
import registerImage from "../../assets/register.png";
import { useEffect, useRef, useState } from "react";
import { UserApi } from "../../libs/api/UserApi";
import { useAuth } from "../../contexts/AuthContext";
import ReCAPTCHA from "react-google-recaptcha";
import { alertError, alertSuccess } from "../../libs/alert";

export default function Register() {
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [reCaptchaToken, setReCaptchaToken] = useState("");
  const { isLoggedIn, login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await UserApi.userRegister(
      name,
      email,
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
  }, []);

  return (
    <div className="flex min-h-screen font-poppins">
      {/* ✅ Bagian Kiri: Form Register */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gradient-to-b from-[#B6F500] to-[#FFFCE2] px-8 py-12">
        <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl w-full max-w-md p-8">
          {/* Judul */}
          <h2 className="text-3xl text-gray-900 font-normal font-poppins mb-2 text-center">
            Hallo , Selamat Datang!
          </h2>

          <p className="text-gray-600 text-center mb-6">
            Bergabung dengan Portal Desa Babakan Asem
          </p>

          {/* Form Register */}
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

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Masukkan email"
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-300 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
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

            <div className="min-w-ful flex items-center justify-center my-8 ">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                size="normal"
                onChange={(token) => setReCaptchaToken(token)}
              />
            </div>

            {/* ✅ Tombol Register pakai gradient */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-green-400 to-[#B6F500] text-white font-semibold rounded-lg hover:opacity-90 transition duration-200"
            >
              Daftar Sekarang
            </button>
          </form>

          {/* Garis pemisah */}
          <div className="flex items-center my-6">
            <span className="flex-1 h-px bg-gray-200"></span>
            <span className="px-4 text-sm text-gray-400">atau</span>
            <span className="flex-1 h-px bg-gray-200"></span>
          </div>

          {/* ✅ Link ke Login */}
          <p className="text-center text-sm text-gray-700 mt-6">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>

      {/* ✅ Bagian Kanan: Ilustrasi Register */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-b from-[#B6F500] to-[#FFFCE2] px-8 py-12">
        <img
          src={registerImage}
          alt="Ilustrasi Register"
          className="w-4/5 drop-shadow-xl"
        />
      </div>
    </div>
  );
}
