import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Batas tampilan maksimal 5 halaman agar rapi
  const visiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (end - start < maxVisible - 1) {
      if (start === 1) end = Math.min(totalPages, start + maxVisible - 1);
      else if (end === totalPages) start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="flex justify-center mt-6">
      <div className="flex items-center gap-1 bg-white p-2 rounded-xl shadow-md">
        {/* Prev Button */}
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`w-10 h-10 flex items-center justify-center rounded-md transition ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          <HiChevronLeft className="text-lg" />
        </button>

        {/* Nomor Halaman */}
        {visiblePages().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition ${
              currentPage === page
                ? "bg-[#B6F500] text-black shadow"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() =>
            currentPage < totalPages && onPageChange(currentPage + 1)
          }
          disabled={currentPage === totalPages}
          className={`w-10 h-10 flex items-center justify-center rounded-md transition ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          <HiChevronRight className="text-lg" />
        </button>
      </div>
    </div>
  );
}
