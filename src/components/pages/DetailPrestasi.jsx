import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarInfo from "../layout/SidebarInfo";
import { Helper } from "../../utils/Helper";
import { HiArrowLeft } from "react-icons/hi";
import { UserApi } from "../../libs/api/UserApi";
import { useTranslation } from "react-i18next";

export default function DetailPrestasi() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [achievement, setAchievement] = useState({});

  const [user, setUser] = useState({});

  const fetchDetailPrestasi = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_NEW_BASE_URL}/village-achievements/${id}`
    );

    const resBody = await response.json();
    if (!response.ok) {
      await Helper.errorResponseHandler(resBody);
      navigate("/profil");
      return;
    }

    const data = resBody.data;

    setAchievement({
      id: data.id,
      title: data.title,
      description: data.description,
      year: new Date(data.date).getFullYear(),
      image: `${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
        data.featured_image
      }`,
      created_at: data.created_at,
      updated_at: data.updated_at,
    });

    fetchComment();
  };

  const fetchUser = async () => {
    const response = await UserApi.profile(i18n.language);
    const responseBody = await response.json();
    if (response.status === 200) {
      setUser(responseBody.user);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchDetailPrestasi();
  }, [id, i18n.language]);

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => navigate("/profil"), 300);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6 font-poppins">
      <div className="md:col-span-3">
        <button
          onClick={handleBack}
          className="mb-5 flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-gray-800 hover:bg-gray-900 hover:text-white hover:scale-105 transition-all duration-300"
        >
          <HiArrowLeft className="text-lg" />
          {t("detailAchievement.backToProfile")}
        </button>

        {/* Achievement Image */}
        <img
          src={achievement.image}
          alt={achievement.title}
          className="w-full h-96 object-cover rounded-lg mb-6 shadow-lg"
        />

        {/* Achievement Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-gradient-to-r from-[#9BEC00] to-[#D2FF72] text-gray-900 shadow">
              {t("detailAchievement.villageAchievement")}
            </span>
            <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
              {achievement.year}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            {achievement.title}
          </h1>
        </div>

        {/* Achievement Content */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {t("detailAchievement.achievementDetails")}
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>{achievement.description}</p>
          </div>
        </div>
      </div>

      <aside>
        <SidebarInfo />
      </aside>
    </div>
  );
}
