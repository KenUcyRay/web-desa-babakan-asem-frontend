export default function CardBerita({ data }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-gray-800">{data.judul}</h3>
        <p className="text-sm text-gray-500">{data.tanggal}</p>
      </div>
      <div className="flex gap-2">
        <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
          Edit
        </button>
        <button className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
          Delete
        </button>
      </div>
    </div>
  );
}
