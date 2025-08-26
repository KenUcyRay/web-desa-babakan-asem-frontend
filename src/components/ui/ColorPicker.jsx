import { useState } from "react";
import { FaPalette, FaCheck } from "react-icons/fa";

export default function ColorPicker({ value, onChange, presets = [] }) {
  const [showPicker, setShowPicker] = useState(false);

  const defaultPresets = [
    "#3B82F6", "#EF4444", "#10B981", "#F59E0B",
    "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16",
    "#6B7280", "#1F2937", "#DC2626", "#059669",
    "#7C3AED", "#DB2777", "#0891B2", "#65A30D"
  ];

  const colorPresets = presets.length > 0 ? presets : defaultPresets;

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        {/* Current Color Display */}
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:border-gray-400 transition"
        >
          <div
            className="w-6 h-6 rounded border-2 border-white shadow-sm"
            style={{ backgroundColor: value }}
          />
          <FaPalette className="text-gray-500" />
        </button>

        {/* Color Input */}
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
        />
      </div>

      {/* Color Picker Dropdown */}
      {showPicker && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[280px]">
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Warna Preset</h4>
            <div className="grid grid-cols-8 gap-2">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    onChange(color);
                    setShowPicker(false);
                  }}
                  className="relative w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition group"
                  style={{ backgroundColor: color }}
                >
                  {value === color && (
                    <FaCheck className="absolute inset-0 m-auto text-white text-xs drop-shadow-sm" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t pt-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Warna Kustom</h4>
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 cursor-pointer"
            />
          </div>

          <div className="mt-3 flex justify-end">
            <button
              onClick={() => setShowPicker(false)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}