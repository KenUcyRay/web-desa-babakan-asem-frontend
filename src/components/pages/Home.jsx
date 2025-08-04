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

  static async getApbData() {
    try {
      const response = await fetch(`${this.baseURL}/apb`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error("Error fetching APB data:", error);
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
    const response = await ProductApi.getProducts(1, 3);
    if (!response.ok) return;
    const responseBody = await response.json();
    setProducts(responseBody.products);
  };

  const fetchNews = async () => {
    const response = await NewsApi.getNews(1, 3);
    if (!response.ok) return;
    const responseBody = await response.json();
    setNews(responseBody.news);
  };

  const fetchVillageWorkPrograms = async () => {
    try {
      setIsLoadingWorkPrograms(true);
      const response = await VillageWorkProgramApi.getVillageWorkPrograms();

      if (response.status === 200) {
        const responseBody = await response.json();
        setWorkPrograms(responseBody.data || responseBody || []);
      } else {
        console.error(
          "Failed to fetch village work programs:",
          response.status
        );
        setWorkPrograms([]);
      }
    } catch (error) {
      console.error("Error fetching village work programs:", error);
      setWorkPrograms([]);
    } finally {
      setIsLoadingWorkPrograms(false);
    }
  };

  const fetchApbData = async () => {
    try {
      setIsLoadingApb(true);
      const response = await ApbApi.getApbData();

      if (response.status === 200) {
        const responseBody = await response.json();

        // Transform API data to chart format
        const transformedData =
          responseBody.data?.map((item) => ({
            bidang: item.bidang || "Unknown",
            anggaran: parseInt(item.anggaran) || 0,
            realisasi: parseInt(item.realisasi) || 0,
            id: item.id,
            tahun: item.tahun,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          })) || [];

        setApbData(transformedData);
      } else {
        console.error("Failed to fetch APB data:", response.status);
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
      console.error("Error fetching APB data:", error);
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
  }, []);

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
                src={`${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
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

      {/* Work Programs */}
      <div className="w-full px-[5%] py-10">
        <h2
          className="text-2xl font-bold text-center text-green-700 mb-8"
          data-aos="fade-up"
        >
          {t("home.workprograms.title")}
        </h2>

        {isLoadingWorkPrograms ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="text-4xl text-green-600 animate-spin" />
            <span className="ml-3 text-lg text-gray-600">
              {t("workprograms.loading")}
            </span>
          </div>
        ) : workPrograms.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">No</th>
                  <th className="py-3 px-4 text-left">
                    {t("home.workprograms.program")}
                  </th>
                  <th className="py-3 px-4 text-left">
                    {t("home.workprograms.dates")}
                  </th>
                  <th className="py-3 px-4 text-left">Budget</th>
                  <th className="py-3 px-4 text-left">
                    {t("home.workprograms.status")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {workPrograms.map((program, index) => (
                  <tr key={program.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4 font-medium">
                      {program.description ||
                        program.name ||
                        t("workprograms.nodesc")}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-green-500" />
                        <span>
                          {program.date
                            ? Helper.formatTanggal(program.date)
                            : program.created_at
                            ? Helper.formatTanggal(program.created_at)
                            : t("workprograms.nodate")}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-green-700">
                      {program.budget_amount
                        ? Helper.formatRupiahMillion(
                            program.budget_amount,
                            i18n.language
                          )
                        : t("workprograms.nobudget")}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(program.status)}
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                            program.status
                          )}`}
                        >
                          {program.status || "Unknown"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {t("workprograms.nodata")}
            </h3>
            <p className="text-gray-500">{t("workprograms.nodata")}</p>
          </div>
        )}
      </div>

      {/* APB Chart */}
      <div className="w-full px-[5%] py-10">
        <h2
          className="text-2xl font-bold text-center text-green-700 mb-8"
          data-aos="fade-up"
        >
          {t("home.apb.title")}
        </h2>

        {isLoadingApb ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="text-4xl text-green-600 animate-spin" />
            <span className="ml-3 text-lg text-gray-600">
              {t("apbchart.loading")}
            </span>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={transformedApbData}>
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="bidang" />
                <YAxis
                  tickFormatter={(value) => {
                    if (value >= 1000000) {
                      return `${(value / 1000000).toFixed(0)}`;
                    }
                    if (value >= 1000) {
                      return `${(value / 1000).toFixed(0)}K`;
                    }
                    return value.toString();
                  }}
                  width={60}
                  label={{
                    value: i18n.language === "en" ? "Million" : "Juta",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    style: { textAnchor: "middle" },
                  }}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `${Helper.formatRupiahMillion(value, i18n.language)}`,
                    name === "anggaran"
                      ? t("home.apb.budget")
                      : t("home.apb.realization"),
                  ]}
                  labelFormatter={(value) => t("home.apb.field") + ": " + value}
                />
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
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>

            {/* Budget Summary */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-700 font-bold">
                  {t("home.apb.totalbudget")}
                </p>
                <p className="text-xl font-bold">
                  {Helper.formatRupiahMillion(
                    apbSummary.totalBudget,
                    i18n.language
                  )}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-700 font-bold">
                  {t("home.apb.totalrealization")}
                </p>
                <p className="text-xl font-bold">
                  {Helper.formatRupiahMillion(
                    apbSummary.totalRealization,
                    i18n.language
                  )}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-yellow-700 font-bold">
                  {t("home.apb.remaining")}
                </p>
                <p className="text-xl font-bold">
                  {Helper.formatRupiahMillion(
                    apbSummary.remaining,
                    i18n.language
                  )}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-purple-700 font-bold">
                  {t("home.apb.absorption")}
                </p>
                <p className="text-xl font-bold">{apbSummary.absorption}%</p>
              </div>
            </div>
          </div>
        )}
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
