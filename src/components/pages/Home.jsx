import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaMapMarkerAlt,
  FaNewspaper,
  FaHandsHelping,
  FaChartBar,
  FaRegStar,
  FaStar,
  FaStarHalfAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import LogoDesa from "../../assets/logo.png";
import HeroVideo from "../../assets/new.mp4";
import { NewsApi } from "../../libs/api/NewsApi";
import { Helper } from "../../utils/Helper";
import { alertError } from "../../libs/alert";
import { ProductApi } from "../../libs/api/ProductApi";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [news, setNews] = useState([]);

  const apbData = [
    { name: t("home.apb.budget"), anggaran: 350, realisasi: 300 },
    { name: t("home.apb.realization"), anggaran: 280, realisasi: 250 },
    { name: "Sisa", anggaran: 70, realisasi: 50 },
  ];

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    AOS.refresh();

    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    document.body.style.fontFamily = "'Poppins', sans-serif";
  }, []);

  const quickMenu = [
    {
      title: t("home.quickmenu.profile.title"),
      desc: t("home.quickmenu.profile.desc"),
      icon: <FaMapMarkerAlt className="text-green-600 text-4xl" />,
      link: "/profil",
    },
    {
      title: t("home.quickmenu.news.title"),
      desc: t("home.quickmenu.news.desc"),
      icon: <FaNewspaper className="text-blue-600 text-4xl" />,
      link: "/berita",
    },
    {
      title: t("home.quickmenu.service.title"),
      desc: t("home.quickmenu.service.desc"),
      icon: <FaHandsHelping className="text-yellow-600 text-4xl" />,
      link: "/administrasi",
    },
    {
      title: t("home.quickmenu.infografis.title"),
      desc: t("home.quickmenu.infografis.desc"),
      icon: <FaChartBar className="text-purple-600 text-4xl" />,
      link: "/infografis/penduduk",
    },
  ];

  const fetchProduct = async () => {
    const response = await ProductApi.getProducts(1, 3);
    if (response.status === 200) {
      const responseBody = await response.json();
      setProducts(responseBody.products);
    } else {
      await alertError(
        "Gagal mengambil data product. Silakan coba lagi nanti."
      );
    }
  };

  const fetchNews = async () => {
    const response = await NewsApi.getNews(1, 3);
    if (response.status === 200) {
      const responseBody = await response.json();
      setNews(responseBody.news);
    } else {
      alertError("Gagal mengambil data berita. Silakan coba lagi nanti.");
    }
  };

  useEffect(() => {
    fetchNews();
    fetchProduct();
  }, []);

  return (
    <div className="font-[Poppins] w-full">
      {/* HERO */}
      <div className="relative h-screen w-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src={HeroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
          <h1 className="text-4xl font-bold" data-aos="fade-down">
            {t("home.hero.title")}
          </h1>
          <p className="mt-3 text-lg" data-aos="fade-up">
            {t("home.hero.description")}
          </p>
          <p className="mt-1 text-sm opacity-90" data-aos="fade-up">
            {t("home.hero.location")}
          </p>
        </div>
      </div>

      {/* QUICK MENU */}
      <div className="w-full px-[5%] py-10 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
        {quickMenu.map((item, idx) => (
          <Link
            key={idx}
            to={item.link}
            className="bg-white shadow rounded-xl p-6 hover:shadow-2xl hover:scale-105 transition-transform"
            data-aos="fade-up"
          >
            <div>{item.icon}</div>
            <h3 className="font-bold mt-3">{item.title}</h3>
            <p className="text-gray-600 mt-1">{item.desc}</p>
          </Link>
        ))}
      </div>

      {/* ABOUT */}
      <div className="bg-green-50 py-10 px-[5%]" data-aos="fade-up">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              {t("home.about.title")}
            </h2>
            <p className="text-gray-700 mb-3">{t("home.about.desc1")}</p>
            <p className="text-gray-700">{t("home.about.desc2")}</p>
          </div>
          <div className="flex justify-center">
            <img
              src={LogoDesa}
              alt="Logo Desa"
              className="w-[20vw] min-w-[100px] max-w-[180px]"
            />
          </div>
        </div>
      </div>

      {/* BERITA */}
      <div className="w-full px-[5%] py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{t("home.latestnews.title")}</h2>
          <Link to="/berita" className="text-green-600 hover:underline">
            {t("home.latestnews.seeall")}
          </Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-6">
          {news.map((item) => (
            <Link
              key={item.news.id}
              to={`/berita/${item.news.id}`}
              className="bg-white shadow rounded-xl overflow-hidden"
              data-aos="zoom-in"
            >
              <img
                src={`${import.meta.env.VITE_BASE_URL}/news/images/${
                  item.news.featured_image
                }`}
                alt={item.news.title}
                className="w-full h-[18vh] object-cover"
              />
              <div className="p-4">
                <p className="text-xs text-gray-500">
                  {Helper.formatTanggal(item.news.created_at)}
                </p>
                <h3 className="font-semibold mt-1">{item.news.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* BUMDES */}
      <div className="bg-green-50 py-10 px-[5%]" data-aos="fade-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{t("home.bumdes.title")}</h2>
          <Link to="/bumdes" className="text-green-600 hover:underline">
            {t("home.bumdes.seeall")}
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((item) => {
            const full = Math.floor(item.average_rating);
            const half = item.average_rating - full >= 0.5;

            return (
              <div
                key={item.product.id}
                className="bg-white rounded-xl shadow hover:shadow-xl"
                data-aos="fade-up"
              >
                <Link to={`/bumdes/${item.product.id}`}>
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/products/images/${
                      item.product.featured_image
                    }`}
                    alt={item.product.title}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                </Link>
                <div className="p-4 flex flex-col">
                  <Link to={`/bumdes/${item.product.id}`}>
                    <h3 className="font-semibold text-gray-800 hover:text-green-700">
                      {item.product.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      if (star <= full)
                        return (
                          <FaStar key={star} className="text-yellow-400" />
                        );
                      if (star === full + 1 && half)
                        return (
                          <FaStarHalfAlt
                            key={star}
                            className="text-yellow-400"
                          />
                        );
                      return <FaRegStar key={star} className="text-gray-300" />;
                    })}
                    <span className="text-xs text-gray-500 ml-1">
                      ({item.average_rating?.toFixed(1) ?? "0.0"})
                    </span>
                  </div>
                  <div className="mt-auto flex justify-between items-center pt-4">
                    <p className="text-lg font-bold text-green-700">
                      {Helper.formatRupiah(item.product.price)}
                    </p>
                    <a
                      href={item.product.link_whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-white bg-green-500 px-3 py-1.5 rounded-lg shadow text-sm"
                    >
                      <FaWhatsapp />
                      {t("home.bumdes.order")}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* APB Chart */}
      <div className="w-full px-[5%] py-10">
        <h2
          className="text-2xl font-bold text-center text-green-700 mb-8"
          data-aos="fade-up"
        >
          {t("home.apb.title")}
        </h2>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={apbData}>
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="anggaran"
                barSize={30}
                fill="#4ade80"
                name={t("home.apb.budget")}
              />
              <Line
                type="monotone"
                dataKey="realisasi"
                stroke="#3b82f6"
                name={t("home.apb.realization")}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Map */}
      <div className="relative h-[30vh] md:h-[40vh] w-full">
        <iframe
          title={t("home.map.title")}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50846.83215472047!2d108.04488070198364!3d-6.7568080545342095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f2aaf583cd373%3A0x997e0a8c838d37df!2sBabakan%20Asem%2C%20Kec.%20Conggeang%2C%20Kabupaten%20Sumedang%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1753327873604!5m2!1sid!2sid"
          className="absolute top-0 left-0 w-full h-full border-0"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}
