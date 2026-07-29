import React from 'react';
import { Sliders, Sun, Contrast, Droplet, Eye, RotateCcw, Download, Sparkles, Image as ImageIcon } from 'lucide-react';
import { FilterSettings, PhonePreset } from '../types';

interface StudioEditorProps {
  filterSettings: FilterSettings;
  setFilterSettings: React.Dispatch<React.SetStateAction<FilterSettings>>;
  onResetFilters: () => void;
  selectedPhone: PhonePreset;
  onDownload: () => void;
}

export const StudioEditor: React.FC<StudioEditorProps> = ({
  filterSettings,
  setFilterSettings,
  onResetFilters,
  selectedPhone,
  onDownload,
}) => {
  const handleChange = (key: keyof FilterSettings, value: any) => {
    setFilterSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyPreset = (presetName: string) => {
    switch (presetName) {
      case 'vivid':
        setFilterSettings({
          brightness: 110,
          contrast: 120,
          saturation: 140,
          blur: 0,
          grain: 0,
          vignette: 15,
          tintColor: '#6366f1',
          tintOpacity: 0,
        });
        break;
      case 'cyber':
        setFilterSettings({
          brightness: 105,
          contrast: 130,
          saturation: 160,
          blur: 0,
          grain: 0,
          vignette: 40,
          tintColor: '#ec4899',
          tintOpacity: 20,
        });
        break;
      case 'noir':
        setFilterSettings({
          brightness: 90,
          contrast: 140,
          saturation: 0,
          blur: 0,
          grain: 0,
          vignette: 50,
          tintColor: '#000000',
          tintOpacity: 0,
        });
        break;
      case 'soft':
        setFilterSettings({
          brightness: 105,
          contrast: 95,
          saturation: 110,
          blur: 2,
          grain: 0,
          vignette: 10,
          tintColor: '#f43f5e',
          tintOpacity: 10,
        });
        break;
      case 'reset':
      default:
        onResetFilters();
        break;
    }
  };

  return (
    <div className="w-full space-y-5 animate-fadeIn">
      {/* Header & Preset Pills */}
      <div className="p-4 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/15 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-purple-400" />
            <span>Studio Color & Filter Studio</span>
          </label>

          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>

        {/* Quick Filter Presets */}
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            { id: 'reset', label: 'Raw Original' },
            { id: 'vivid', label: 'Vivid Glow' },
            { id: 'cyber', label: 'Neon Cyber' },
            { id: 'noir', label: 'Noir Black & White' },
            { id: 'soft', label: 'Soft Dream Blur' },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 hover:text-white transition"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Sliders Panel */}
      <div className="p-5 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/15 space-y-4">
        {/* Brightness */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" /> Brightness
            </span>
            <span className="font-mono text-indigo-400">{filterSettings.brightness}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="150"
            value={filterSettings.brightness}
            onChange={(e) => handleChange('brightness', Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>

        {/* Contrast */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Contrast className="w-3.5 h-3.5 text-blue-400" /> Contrast
            </span>
            <span className="font-mono text-indigo-400">{filterSettings.contrast}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="150"
            value={filterSettings.contrast}
            onChange={(e) => handleChange('contrast', Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>

        {/* Saturation */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-pink-400" /> Saturation
            </span>
            <span className="font-mono text-indigo-400">{filterSettings.saturation}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            value={filterSettings.saturation}
            onChange={(e) => handleChange('saturation', Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>

        {/* Blur */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-purple-400" /> Soft Depth Blur
            </span>
            <span className="font-mono text-indigo-400">{filterSettings.blur}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            value={filterSettings.blur}
            onChange={(e) => handleChange('blur', Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>

        {/* Vignette */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" /> Edge Vignette
            </span>
            <span className="font-mono text-indigo-400">{filterSettings.vignette}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={filterSettings.vignette}
            onChange={(e) => handleChange('vignette', Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>

        {/* Tint Color Overlay */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={filterSettings.tintColor}
              onChange={(e) => handleChange('tintColor', e.target.value)}
              className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
            />
            <span className="text-xs font-semibold text-slate-300">Atmosphere Tint</span>
          </div>

          <div className="flex-1 max-w-[150px]">
            <input
              type="range"
              min="0"
              max="50"
              value={filterSettings.tintOpacity}
              onChange={(e) => handleChange('tintOpacity', Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Export Action Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-950/40 to-slate-900/60 border border-emerald-500/30 flex items-center justify-between gap-3">
        <div>
          <h4 className="font-bold text-sm text-emerald-300">Ready for High-Res Export</h4>
          <p className="text-xs text-slate-400 font-mono">
            {selectedPhone.modelName} ({selectedPhone.width} × {selectedPhone.height} px)
          </p>
        </div>

        <button
          onClick={onDownload}
          id="studio-download-btn"
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition hover:scale-105"
        >
          <Download className="w-4 h-4" />
          <span>Download Wallpaper</span>
        </button>
      </div>
    </div>
  );
};
