import { useEffect, useState, useMemo } from "react";
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
  FaCheckCircle,
  FaSpinner,
  FaCalendarAlt,
  FaTimesCircle,
  FaPhone,
  FaExclamationTriangle,
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
import { ProductApi } from "../../libs/api/ProductApi";
import { VillageWorkProgramApi } from "../../libs/api/VillageWorkProgramApi";
import { useTranslation } from "react-i18next";

// APB API Class
class ApbApi {
  static baseURL = import.meta.env.VITE_NEW_BASE_URL || "http://localhost:8000";

  static async getApbData(language = "id") {
    try {
      const response = await fetch(`${this.baseURL}/apb`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": language,
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [news, setNews] = useState([]);
  const [workPrograms, setWorkPrograms] = useState([]);
  const [apbData, setApbData] = useState([]);
  const [isLoadingWorkPrograms, setIsLoadingWorkPrograms] = useState(true);
  const [isLoadingApb, setIsLoadingApb] = useState(true);

  // Transform apbData based on current language
  const transformedApbData = useMemo(() => {
    return apbData.map((item) => ({
      ...item,
      bidang: item.bidang, // Keep original, as this is already translated
    }));
  }, [apbData, i18n.language]);

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
    try {
      const response = await ProductApi.getProducts(1, 3, i18n.language);
      if (!response.ok) return;
      const responseBody = await response.json();
      setProducts(responseBody.products);
    } catch (error) {
      setProducts([]);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await NewsApi.getNews(1, 3, i18n.language);
      if (!response.ok) return;
      const responseBody = await response.json();
      setNews(responseBody.news);
    } catch (error) {
      setNews([]);
    }
  };

  const fetchVillageWorkPrograms = async () => {
    try {
      setIsLoadingWorkPrograms(true);
      const response = await VillageWorkProgramApi.getVillageWorkPrograms(
        i18n.language
      );

      if (response.status === 200) {
        const responseBody = await response.json();
        setWorkPrograms(responseBody.data || responseBody || []);
      } else {
        setWorkPrograms([]);
      }
    } catch (error) {
      setWorkPrograms([]);
    } finally {
      setIsLoadingWorkPrograms(false);
    }
  };

  const fetchApbData = async () => {
    try {
      setIsLoadingApb(true);
      const response = await ApbApi.getApbData(i18n.language);

      if (response.status === 200) {
        const responseBody = await response.json();

        // Transform API data to chart format
        const transformedData =
          responseBody.data?.map((item) => ({
            bidang: item.bidang || "Unknown",
            anggaran: parseInt(item.anggaran) || 0, // Keep original value from API
            realisasi: parseInt(item.realisasi) || 0, // Keep original value from API
            id: item.id,
            tahun: item.tahun,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          })) || [];

        setApbData(transformedData);
      } else {
        // Fallback to default data if API fails
        setApbData([
          {
            bidang: t("home.apb.education"),
            anggaran: 120000000,
            realisasi: 100000000,
          },
          {
            bidang: t("home.apb.health"),
            anggaran: 80000000,
            realisasi: 75000000,
          },
          {
            bidang: t("home.apb.infrastructure"),
            anggaran: 100000000,
            realisasi: 85000000,
          },
          {
            bidang: t("home.apb.social"),
            anggaran: 50000000,
            realisasi: 40000000,
          },
        ]);
      }
    } catch (error) {
      // Fallback to default data if API fails
      setApbData([
        {
          bidang: t("home.apb.education"),
          anggaran: 120000000, // 120 juta
          realisasi: 100000000, // 100 juta
        },
        {
          bidang: t("home.apb.health"),
          anggaran: 80000000, // 80 juta
          realisasi: 75000000, // 75 juta
        },
        {
          bidang: t("home.apb.infrastructure"),
          anggaran: 100000000, // 100 juta
          realisasi: 85000000, // 85 juta
        },
        {
          bidang: t("home.apb.social"),
          anggaran: 50000000, // 50 juta
          realisasi: 40000000, // 40 juta
        },
      ]);
    } finally {
      setIsLoadingApb(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
      case "SELESAI":
        return <FaCheckCircle className="text-green-500" />;
      case "IN_PROGRESS":
      case "BERJALAN":
      case "PROGRESS":
        return <FaSpinner className="text-yellow-500 animate-spin" />;
      case "PLANNED":
      case "RENCANA":
        return <FaCalendarAlt className="text-blue-500" />;
      case "CANCELLED":
      case "DIBATALKAN":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaCalendarAlt className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
      case "SELESAI":
        return "bg-green-200 text-green-800";
      case "IN_PROGRESS":
      case "BERJALAN":
      case "PROGRESS":
        return "bg-yellow-200 text-yellow-800";
      case "PLANNED":
      case "RENCANA":
        return "bg-blue-200 text-blue-800";
      case "CANCELLED":
      case "DIBATALKAN":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PLANNED":
        return t("home.workprograms.status.planned");
      case "IN_PROGRESS":
        return t("home.workprograms.status.in_progress");
      case "COMPLETED":
        return t("home.workprograms.status.completed");
      case "CANCELLED":
        return t("home.workprograms.status.cancelled");
      default:
        return t("home.workprograms.status.planned");
    }
  };
  // Format currency for very large numbers (billions)
  const formatRupiahBillion = (angka, language = "id") => {
    if (angka >= 1000000000000) {
      // Triliun
      const trillion = angka / 1000000000000;
      const trillionText = language === "en" ? "trillion" : "triliun";
      return `${
        trillion % 1 === 0 ? trillion.toFixed(0) : trillion.toFixed(1)
      } ${trillionText}`;
    } else if (angka >= 1000000000) {
      // Miliar
      const billion = angka / 1000000000;
      const billionText = language === "en" ? "billion" : "miliar";
      return `${
        billion % 1 === 0 ? billion.toFixed(0) : billion.toFixed(1)
      } ${billionText}`;
    } else if (angka >= 1000000) {
      // Juta
      const million = angka / 1000000;
      const millionText = language === "en" ? "million" : "juta";
      return `${
        million % 1 === 0 ? million.toFixed(0) : million.toFixed(1)
      } ${millionText}`;
    }
    return Helper.formatRupiah(angka);
  };

  // Calculate APB summary
  const getApbSummary = () => {
    if (!apbData || apbData.length === 0) {
      return {
        totalBudget: 0,
        totalRealization: 0,
        remaining: 0,
        absorption: 0,
      };
    }

    const totalBudget = apbData.reduce(
      (sum, item) => sum + (item.anggaran || 0),
      0
    );
    const totalRealization = apbData.reduce(
      (sum, item) => sum + (item.realisasi || 0),
      0
    );
    const remaining = totalBudget - totalRealization;
    const absorption =
      totalBudget > 0 ? (totalRealization / totalBudget) * 100 : 0;

    return {
      totalBudget,
      totalRealization,
      remaining,
      absorption: absorption.toFixed(1),
    };
  };

  useEffect(() => {
    fetchNews();
    fetchProduct();
    fetchVillageWorkPrograms();
    fetchApbData();
  }, [i18n.language]);

  const apbSummary = getApbSummary();

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
            className="group bg-white shadow-lg rounded-xl p-6 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-green-100 hover:bg-green-50/30 cursor-pointer"
            data-aos="fade-up"
          >
            <div className="transform group-hover:scale-110 transition-all duration-300">{item.icon}</div>
            <h3 className="font-bold mt-3 group-hover:text-green-600 transition-colors duration-300">{item.title}</h3>
            <p className="text-gray-600 mt-1 group-hover:text-gray-700 transition-colors duration-300">{item.desc}</p>
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
      <div className="bg-green-50 py-10 px-[5%]" data-aos="fade-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{t("home.latestnews.title")}</h2>
          <Link to="/berita" className="text-green-600 hover:underline">
            {t("home.latestnews.seeall")}
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {news.map((item) => (
            <div
              key={item.news.id}
              className="group bg-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-2 transition-all duration-500 border border-transparent hover:border-blue-200 overflow-hidden"
              data-aos="fade-up"
            >
              <Link to={`/berita/${item.news.id}`}>
                <img
                  src={`${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                    item.news.featured_image
                  }`}
                  alt={item.news.title}
                  className="w-full h-48 object-cover rounded-t-xl group-hover:scale-110 transition-transform duration-500"
                />
              </Link>
              <div className="p-4 flex flex-col">
                <Link to={`/berita/${item.news.id}`}>
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                    {item.news.title}
                  </h3>
                </Link>
                <div className="flex items-center gap-1 mt-2">
                  <FaCalendarAlt className="text-green-500" />
                  <span className="text-xs text-gray-500 ml-1">
                    {Helper.formatTanggal(item.news.created_at)}
                  </span>
                </div>
              </div>
            </div>
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
                className="group bg-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-2 transition-all duration-500 border border-transparent hover:border-green-200 overflow-hidden"
                data-aos="fade-up"
              >
                <Link to={`/bumdes/${item.product.id}`}>
                  <img
                    src={`${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                      item.product.featured_image
                    }`}
                    alt={item.product.title}
                    className="w-full h-48 object-cover rounded-t-xl group-hover:scale-110 transition-transform duration-500"
                  />
                </Link>
                <div className="p-4 flex flex-col">
                  <Link to={`/bumdes/${item.product.id}`}>
                    <h3 className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors duration-300">
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
                      className="flex items-center gap-1 text-white bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-lg shadow hover:shadow-lg text-sm transition-all duration-300 group-hover:scale-105"
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

      {/* Work Programs */}
      <div className="bg-gray-50 py-16 px-[5%]">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-3xl font-bold text-center text-green-700 mb-12"
            data-aos="fade-up"
          >
            {t("home.workprograms.title")}
          </h2>

          {isLoadingWorkPrograms ? (
            <div className="flex justify-center items-center py-16">
              <FaSpinner className="text-4xl text-green-600 animate-spin" />
              <span className="ml-3 text-lg text-gray-600">
                {t("home.workprograms.loading")}
              </span>
            </div>
          ) : workPrograms.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                    <tr>
                      <th className="py-4 px-6 text-left font-semibold">No</th>
                      <th className="py-4 px-6 text-left font-semibold">
                        {t("home.workprograms.program")}
                      </th>
                      <th className="py-4 px-6 text-left font-semibold">
                        {t("home.workprograms.dates")}
                      </th>
                      <th className="py-4 px-6 text-left font-semibold">{t("home.apb.budget")}</th>
                      <th className="py-4 px-6 text-left font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {workPrograms.map((program, index) => (
                      <tr key={program.id} className="hover:bg-green-50 transition-colors">
                        <td className="py-4 px-6 text-gray-700 font-medium">{index + 1}</td>
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900">
                            {program.description ||
                              program.name ||
                              t("home.workprograms.nodesc")}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaCalendarAlt className="text-green-500" />
                            <span className="text-sm">
                              {program.date
                                ? Helper.formatTanggal(program.date)
                                : program.created_at
                                ? Helper.formatTanggal(program.created_at)
                                : t("home.workprograms.nodate")}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-semibold text-green-700">
                            {program.budget_amount
                              ? Helper.formatRupiahMillion(
                                  program.budget_amount,
                                  i18n.language
                                )
                              : t("home.workprograms.nobudget")}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(program.status)}
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                program.status
                              )}`}
                            >
                              {getStatusText(program.status)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-600 mb-3">
                {t("home.workprograms.nodata")}
              </h3>
              <p className="text-gray-500">{t("home.workprograms.nodata")}</p>
            </div>
          )}
        </div>
      </div>

      {/* APB Chart */}
      <div className="w-full px-[5%] py-16">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-3xl font-bold text-center text-green-700 mb-12"
            data-aos="fade-up"
          >
            {t("home.apb.title")}
          </h2>

          {isLoadingApb ? (
            <div className="flex justify-center items-center py-16">
              <FaSpinner className="text-4xl text-green-600 animate-spin" />
              <span className="ml-3 text-lg text-gray-600">
                {t("home.apbchart.loading")}
              </span>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="mb-8">
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={transformedApbData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                    <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="bidang" 
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                    />
                    <YAxis
                      tickFormatter={(value) => {
                        if (value >= 1000000000) {
                          return `${(value / 1000000000).toFixed(0)}B`;
                        }
                        if (value >= 1000000) {
                          return `${(value / 1000000).toFixed(0)}M`;
                        }
                        if (value >= 1000) {
                          return `${(value / 1000).toFixed(0)}K`;
                        }
                        return value.toString();
                      }}
                      width={80}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value, name) => [
                        `${formatRupiahBillion(value, i18n.language)}`,
                        name === "anggaran"
                          ? t("home.apb.budget")
                          : name === "realisasi"
                          ? t("home.apb.realization")
                          : name,
                      ]}
                      labelFormatter={(value) => `${t("home.apb.field")}: ${value}`}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px' }}
                    />
                    <Bar
                      dataKey="anggaran"
                      barSize={40}
                      fill="#10b981"
                      name={t("home.apb.budget")}
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      type="monotone"
                      dataKey="realisasi"
                      stroke="#3b82f6"
                      name={t("home.apb.realization")}
                      strokeWidth={3}
                      dot={{ r: 6, fill: '#3b82f6' }}
                      activeDot={{ r: 8, fill: '#1d4ed8' }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Budget Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <p className="text-green-700 font-semibold text-sm mb-2">
                    {t("home.apb.totalbudget")}
                  </p>
                  <p className="text-2xl font-bold text-green-800">
                    {formatRupiahBillion(apbSummary.totalBudget, i18n.language)}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <p className="text-blue-700 font-semibold text-sm mb-2">
                    {t("home.apb.totalrealization")}
                  </p>
                  <p className="text-2xl font-bold text-blue-800">
                    {formatRupiahBillion(
                      apbSummary.totalRealization,
                      i18n.language
                    )}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
                  <p className="text-yellow-700 font-semibold text-sm mb-2">
                    {t("home.apb.remaining")}
                  </p>
                  <p className="text-2xl font-bold text-yellow-800">
                    {formatRupiahBillion(apbSummary.remaining, i18n.language)}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                  <p className="text-purple-700 font-semibold text-sm mb-2">
                    {t("home.apb.absorption")}
                  </p>
                  <p className="text-2xl font-bold text-purple-800">{apbSummary.absorption}%</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Number */}
      <div className="bg-green-600 py-12 px-[5%]" data-aos="fade-up">
        <div className="max-w-4xl mx-auto text-white">
          <h2 className="text-3xl font-bold text-center mb-8">
            {t("home.emergency.title")}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Call Center Guide */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaPhone className="text-2xl" />
                <h3 className="text-xl font-bold">{t("home.emergency.callcenter.title")}</h3>
              </div>
              <p className="mb-4 opacity-90">{t("home.emergency.callcenter.description")}</p>
              <div className="space-y-2 text-sm">
                <p>• {t("home.emergency.callcenter.admin")}: (022) 123-4567</p>
                <p>• {t("home.emergency.callcenter.hours")}</p>
                <p>• {t("home.emergency.callcenter.services")}</p>
              </div>
            </div>

            {/* Emergency Number */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaExclamationTriangle className="text-2xl text-red-300" />
                <h3 className="text-xl font-bold">{t("home.emergency.emergencyNumbers.title")}</h3>
              </div>
              <p className="mb-4 opacity-90">{t("home.emergency.emergencyNumbers.description")}</p>
              <div className="space-y-2 text-sm">
                <p>• {t("home.emergency.emergencyNumbers.police")}</p>
                <p>• {t("home.emergency.emergencyNumbers.medical")}</p>
                <p>• {t("home.emergency.emergencyNumbers.fire")}</p>
                <p>• {t("home.emergency.emergencyNumbers.healthcenter")}</p>
                <p>• {t("home.emergency.emergencyNumbers.village")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
