import { useEffect, useState } from "react";
import cuate from "../../assets/cuate.png";
import {
  FaLeaf,
  FaWater,
  FaLightbulb,
  FaHeartbeat,
  FaBook,
  FaDollarSign,
  FaIndustry,
  FaCity,
  FaBalanceScale,
  FaGlobeAmericas,
  FaHandshake,
  FaUniversity,
  FaRecycle,
  FaSeedling,
  FaUsers,
} from "react-icons/fa";
import { InfografisApi } from "../../libs/api/InfografisApi";
import { alertError } from "../../libs/alert";
import { useTranslation } from "react-i18next";
import { Helper } from "../../utils/Helper";

export default function SDGs() {
  const { t, i18n } = useTranslation();

  // Function to translate dynamic SDGs data
  const translateSDGsData = (name) => {
    const translations = {
      'tanpa kemiskinan': t('sdgs.goals.no_poverty'),
      'tanpa kelaparan': t('sdgs.goals.zero_hunger'),
      'kehidupan sehat dan sejahtera': t('sdgs.goals.good_health'),
      'pendidikan berkualitas': t('sdgs.goals.quality_education'),
      'kesetaraan gender': t('sdgs.goals.gender_equality'),
      'air bersih dan sanitasi layak': t('sdgs.goals.clean_water'),
      'energi bersih dan terjangkau': t('sdgs.goals.affordable_energy'),
      'pekerjaan layak dan pertumbuhan ekonomi': t('sdgs.goals.decent_work'),
      'industri, inovasi dan infrastruktur': t('sdgs.goals.industry_innovation'),
      'berkurangnya kesenjangan': t('sdgs.goals.reduced_inequalities'),
      'kota dan komunitas berkelanjutan': t('sdgs.goals.sustainable_cities'),
      'konsumsi dan produksi yang bertanggung jawab': t('sdgs.goals.responsible_consumption'),
      'penanganan perubahan iklim': t('sdgs.goals.climate_action'),
      'ekosistem lautan': t('sdgs.goals.life_below_water'),
      'ekosistem daratan': t('sdgs.goals.life_on_land'),
      'perdamaian, keadilan dan kelembagaan yang tangguh': t('sdgs.goals.peace_justice'),
      'kemitraan untuk mencapai tujuan': t('sdgs.goals.partnerships')
    };
    return translations[name?.toLowerCase()] || name;
  };
  const iconList = [
    <FaHeartbeat />, // 1. Tanpa Kemiskinan
    <FaLeaf />, // 2. Tanpa Kelaparan
    <FaHeartbeat />, // 3. Kesehatan & Kesejahteraan
    <FaBook />, // 4. Pendidikan Berkualitas
    <FaUsers />, // 5. Kesetaraan Gender
    <FaWater />, // 6. Air Bersih & Sanitasi
    <FaLightbulb />, // 7. Energi Bersih & Terjangkau
    <FaDollarSign />, // 8. Pekerjaan Layak & Ekonomi
    <FaIndustry />, // 9. Infrastruktur & Inovasi
    <FaBalanceScale />, // 10. Mengurangi Ketimpangan
    <FaCity />, // 11. Kota & Komunitas Berkelanjutan
    <FaRecycle />, // 12. Konsumsi Bertanggung Jawab
    <FaGlobeAmericas />, // 13. Aksi Iklim
    <FaWater />, // 14. Ekosistem Lautan
    <FaSeedling />, // 15. Ekosistem Daratan
    <FaHandshake />, // 16. Perdamaian & Keadilan
    <FaUniversity />, // 17. Kemitraan untuk Tujuan
  ];

  const [sdg, setSdg] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchSdg = async () => {
    const response = await InfografisApi.getSdg(i18n.language);
    const responseBody = await response.json();
    if (!response.ok) {
      return;
    }
    setSdg(responseBody.sdgs);

    // Set tanggal update terakhir
    if (responseBody.lastUpdated) {
      setLastUpdated(responseBody.lastUpdated);
    } else if (responseBody.sdgs && responseBody.sdgs.length > 0) {
      // Jika API tidak mengembalikan lastUpdated, ambil dari data terakhir yang diupdate
      const latestData = responseBody.sdgs.reduce((latest, current) => {
        if (!latest.updated_at) return current;
        if (!current.updated_at) return latest;
        return new Date(current.updated_at) > new Date(latest.updated_at)
          ? current
          : latest;
      });
      if (latestData.updated_at) {
        setLastUpdated(latestData.updated_at);
      }
    }
  };

  useEffect(() => {
    fetchSdg();
  }, [i18n.language]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 font-poppins">
      {/* Judul + Gambar */}
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            {t("sdgs.title")}
          </h2>
          <p className="mt-2 text-gray-600">{t("sdgs.description")}</p>
          {lastUpdated && (
            <div className="mt-3">
              <p className="text-sm text-gray-500">
                {t("sdgs.lastUpdated")}: {Helper.formatTanggal(lastUpdated)}
              </p>
            </div>
          )}
        </div>
        <img src={cuate} alt="SDGs" className="w-full max-w-md mx-auto" />
      </div>

      {/* Grid 17 Tujuan */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {sdg.length > 0 ? (
          sdg.map((item, idx) => (
            <div
              key={item.id}
              className="flex flex-col items-center bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition-all"
            >
              <div className="text-3xl text-[#B6F500]">
                {iconList[idx] || <FaHeartbeat />}
              </div>
              <p className="text-gray-600 mt-2 text-center">
                {`${idx + 1}. ${translateSDGsData(item.name)}`}
              </p>
              <p className="text-xl font-bold text-gray-800">{item.progress}%</p>
              {item.updated_at && (
                <p className="mt-1 text-xs text-gray-400">
                  {t("sdgs.updatedAt")}: {Helper.formatTanggal(item.updated_at)}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white p-8 rounded-xl shadow border border-gray-200 text-center">
            <p className="text-gray-500 text-lg">
              {t("sdgs.noData")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
