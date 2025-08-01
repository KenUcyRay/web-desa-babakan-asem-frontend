import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaImage, FaTasks, FaNewspaper, FaCalendarAlt } from "react-icons/fa";
import { ProgramApi } from "../../libs/api/ProgramApi";
import { NewsApi } from "../../libs/api/NewsApi";
import { AgendaApi } from "../../libs/api/AgendaApi";
import { GaleryApi } from "../../libs/api/GaleryApi";
import { alertError } from "../../libs/alert";
import { VillageWorkProgramApi } from "../../libs/api/VillageWorkProgramApi";

export default function DashboardDesa() {
  const navigate = useNavigate();

  const [newsCount, setNewsCount] = useState(0);
  const [agendaCount, setAgendaCount] = useState(0);
  const [programCount, setProgramCount] = useState(0);
  const [galeriPreview, setGaleriPreview] = useState([]);

  const fetchNews = async () => {
    const res = await NewsApi.getOwnNews();
    if (!res.ok) return alertError("Gagal ambil berita");
    const data = await res.json();
    setNewsCount(data.news?.length || 0);
  };

  const fetchAgenda = async () => {
    const res = await AgendaApi.getOwnAgenda();
    if (!res.ok) return alertError("Gagal ambil agenda");
    const data = await res.json();
    setAgendaCount(data.agenda?.length || 0);
  };

  const fetchProgram = async () => {
    const res = await VillageWorkProgramApi.getVillageWorkPrograms(1, 1);
    if (!res.ok) return alertError("Gagal ambil program");
    const data = await res.json();

    setProgramCount(data.length || 0);
  };

  const fetchGaleri = async () => {
    const res = await GaleryApi.getGaleri(1, 3);
    if (!res.ok) return alertError("Gagal ambil galeri");
    const data = await res.json();
    setGaleriPreview(data.galeri || []);
  };

  useEffect(() => {
    fetchNews();
    fetchAgenda();
    fetchProgram();
    fetchGaleri();
  }, []);

  return (
    <div className="w-full font-[Poppins,sans-serif]">
      <h1 className="text-2xl font-bold mb-6">Dashboard Desa</h1>

      {/* Kartu statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FaNewspaper />}
          title="Jumlah Berita"
          count={newsCount}
        />
        <StatCard
          icon={<FaCalendarAlt />}
          title="Jumlah Agenda"
          count={agendaCount}
        />
        <StatCard
          icon={<FaTasks />}
          title="Program Kerja"
          count={programCount}
        />
        <StatCard
          icon={<FaImage />}
          title="Galeri Desa"
          count={galeriPreview.length}
        />
      </div>

      {/* Galeri preview */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaImage /> Galeri Terbaru
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {galeriPreview.map((g, idx) => (
            <div key={idx} className="bg-gray-100 rounded overflow-hidden">
              <img
                src={`${import.meta.env.VITE_NEW_BASE_URL}/public/images/${
                  g.image
                }`}
                alt={g.title}
                className="w-full h-32 object-cover"
              />
              <p className="p-2 text-sm font-medium text-gray-700">{g.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, count }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow text-center">
      <div className="text-3xl mb-2 text-green-500 flex justify-center">
        {icon}
      </div>
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      <p className="text-2xl font-bold text-gray-900 mt-1">{count}</p>
    </div>
  );
}
