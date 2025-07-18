import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import loginImage from "../assets/login.png";
import { UserApi } from "../libs/api/UserApi";
import { useAuth } from "../contexts/AuthContext";
import { alertError, alertSuccess } from "../libs/alert";

export default function Login() {
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [reCaptchaToken, setReCaptchaToken] = useState("");
  const { isLoggedIn, login, setAdminStatus } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await UserApi.userLogin(
      email,
      password,
      rememberMe,
      reCaptchaToken
    );
    const responseBody = await response.json();
    if (response.status === 200) {
      login(responseBody.token);
      await alertSuccess("Login berhasil!");
      if (responseBody.user.role === "ADMIN") {
        await alertSuccess("Selamat datang, Admin!");
        setAdminStatus(true);
        navigate("/admin");
        return;
      }
      navigate("/");
    } else {
      await alertError(responseBody.error || "Login gagal, silakan coba lagi.");
    }

    setEmail("");
    setPassword("");
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
      {/* ✅ Bagian Kiri: Form Login */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gradient-to-b from-[#B6F500] to-[#FFFCE2] px-8 py-12">
        <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl w-full max-w-md p-8">
          {/* Judul */}
          <h2 className="text-3xl text-gray-900 font-normal font-poppins mb-2 text-center">
            Hallo, Senang Melihatmu Kembali!
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Masuk ke Portal Desa Babakan Asem
          </p>

          {/* ✅ Form Login */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Masukkan email"
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-300 outline-none"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Masukkan password"
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-300 outline-none"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </div>

            {/* ✅ Remember Me */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="w-4 h-4 text-green-500"
                />
                Remember Me
              </label>

              <Link
                to="/forgot-password"
                className="text-green-700 hover:underline"
              >
                Lupa password?
              </Link>
            </div>

            <div className="min-w-ful flex items-center justify-center my-8 ">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                size="normal"
                onChange={(token) => setReCaptchaToken(token)}
              />
            </div>

            {/* ✅ Tombol Login */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-green-400 to-[#B6F500] text-white font-semibold rounded-lg hover:opacity-90 transition duration-200"
            >
              Masuk
            </button>
          </form>

          {/* Garis pemisah */}
          <div className="flex items-center my-6">
            <span className="flex-1 h-px bg-gray-200"></span>
            <span className="px-4 text-sm text-gray-400">atau</span>
            <span className="flex-1 h-px bg-gray-200"></span>
          </div>

          <p className="text-center text-sm text-gray-700 mt-6">
            Belum punya akun?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>

      {/* ✅ Bagian Kanan: Ilustrasi Login */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-b from-[#B6F500] to-[#FFFCE2] px-8 py-12">
        <img
          src={loginImage}
          alt="Ilustrasi Login"
          className="w-4/5 drop-shadow-xl"
        />
      </div>
    </div>
  );
}
