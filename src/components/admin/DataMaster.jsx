import React from "react";
import { FaEdit } from "react-icons/fa";

export default function DataMaster() {
  const masterData = [
    "Data Penduduk",
    "Data Kartu Keluarga",
    "Wilayah Dusun / RW / RT",
    "Agama",
    "Pekerjaan",
    "Pendidikan",
    "Status Perkawinan",
    "Golongan Darah",
    "Jenis Bantuan",
    "Kategori Lansia",
    "Jenis Disabilitas",
    "Jenis Rumah",
    "Aset Desa",
  ];

  return (
    <div className="p-6">
      <div className="bg-white shadow-md rounded-xl p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-3">
          📋 Data Master Desa
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">No</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Nama Data</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {masterData.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-blue-50 transition duration-150"
                >
                  <td className="px-6 py-4 border-t">{index + 1}</td>
                  <td className="px-6 py-4 border-t">{item}</td>
                  <td className="px-6 py-4 border-t">
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded shadow">
                      <FaEdit />
                      Lihat / Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
