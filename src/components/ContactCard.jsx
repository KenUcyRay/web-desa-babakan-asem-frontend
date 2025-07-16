import React from "react";

export default function ContactCard({ icon, title, text, link }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 p-4 rounded-xl shadow-md 
                 bg-gradient-to-r from-[#B6F500] to-white 
                 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
    >
      {/* Ikon lingkaran */}
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow text-[#B6F500] text-xl">
        {icon}
      </div>

      {/* Teks */}
      <div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-gray-700 text-sm">{text}</p>
      </div>
    </a>
  );
}
