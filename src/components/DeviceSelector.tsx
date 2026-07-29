import React, { useState } from 'react';
import { Smartphone, Check, X, Sliders, Monitor, Cpu } from 'lucide-react';
import { PhonePreset, DeviceBrand, NotchType } from '../types';
import { PHONE_PRESETS } from '../data/presets';

interface DeviceSelectorProps {
  selectedPhone: PhonePreset;
  onSelectPhone: (preset: PhonePreset) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  selectedPhone,
  onSelectPhone,
  isOpen,
  onClose,
}) => {
  const [activeBrand, setActiveBrand] = useState<DeviceBrand | 'all'>('all');
  const [customWidth, setCustomWidth] = useState<number>(1080);
  const [customHeight, setCustomHeight] = useState<number>(2400);
  const [customNotch, setCustomNotch] = useState<NotchType>('dynamic-island');
  const [customName, setCustomName] = useState<string>('Custom Display');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  if (!isOpen) return null;

  const filteredPresets = PHONE_PRESETS.filter(
    (p) => activeBrand === 'all' || p.brand === activeBrand
  );

  const handleApplyCustom = () => {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(customWidth, customHeight);
    const aspectW = (customWidth / divisor).toFixed(1);
    const aspectH = (customHeight / divisor).toFixed(1);
    const calculatedAspect = `${aspectW}:${aspectH}`;

    const customPreset: PhonePreset = {
      id: `custom-${Date.now()}`,
      brand: 'custom',
      brandName: 'Custom',
      modelName: customName || 'Custom Phone',
      width: customWidth,
      height: customHeight,
      aspectRatio: calculatedAspect,
      notchType: customNotch,
      screenSize: 'Custom',
    };

    onSelectPhone(customPreset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900/90 border border-white/15 rounded-3xl p-6 shadow-2xl text-white max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Select Phone Dimensions</h2>
              <p className="text-xs text-slate-400">Choose your model or specify custom pixel size</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (Presets vs Custom) */}
        <div className="flex items-center justify-between gap-2 my-4 pt-2">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/60 border border-white/10 text-xs font-semibold">
            <button
              onClick={() => setIsCustomMode(false)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                !isCustomMode ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Presets Gallery
            </button>
            <button
              onClick={() => setIsCustomMode(true)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                isCustomMode ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Custom Dimensions
            </button>
          </div>

          {!isCustomMode && (
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs font-medium">
              {[
                { id: 'all', label: 'All Brands' },
                { id: 'apple', label: 'iPhone' },
                { id: 'samsung', label: 'Samsung' },
                { id: 'google', label: 'Pixel' },
                { id: 'oneplus', label: 'OnePlus' },
                { id: 'nothing', label: 'Nothing' },
              ].map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => setActiveBrand(brand.id as any)}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    activeBrand === brand.id
                      ? 'bg-white/20 text-white'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  {brand.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-1">
          {!isCustomMode ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredPresets.map((preset) => {
                const isSelected = selectedPhone.id === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      onSelectPhone(preset);
                      onClose();
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-indigo-500/80 shadow-lg shadow-indigo-950/40'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${
                          preset.brand === 'apple'
                            ? 'bg-slate-800 text-slate-200'
                            : preset.brand === 'samsung'
                            ? 'bg-blue-950 text-blue-300'
                            : preset.brand === 'google'
                            ? 'bg-emerald-950 text-emerald-300'
                            : 'bg-purple-950 text-purple-300'
                        }`}
                      >
                        {preset.brandName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-white group-hover:text-indigo-300 transition">
                          {preset.modelName}
                        </h4>
                        <p className="text-xs text-slate-400 flex items-center gap-2 font-mono">
                          <span>
                            {preset.width} × {preset.height} px
                          </span>
                          <span>•</span>
                          <span>{preset.aspectRatio}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {preset.screenSize}
                      </span>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Custom Dimension Inputs Form */
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Device Name / Label
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-sm text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. My Phone"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Screen Cutout / Notch Type
                  </label>
                  <select
                    value={customNotch}
                    onChange={(e) => setCustomNotch(e.target.value as NotchType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="dynamic-island">Dynamic Island (iOS)</option>
                    <option value="notch">Classic Notch</option>
                    <option value="punch-hole-center">Center Punch-Hole (Android)</option>
                    <option value="punch-hole-left">Left Punch-Hole</option>
                    <option value="none">Clean (No Cutout)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Width (Pixels)
                  </label>
                  <input
                    type="number"
                    min="320"
                    max="4000"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Height (Pixels)
                  </label>
                  <input
                    type="number"
                    min="480"
                    max="8000"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Quick Dimension Presets */}
              <div>
                <span className="block text-xs font-semibold text-slate-400 mb-2">
                  Quick Standard Dimensions
                </span>
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  {[
                    { label: '4K Ultra (2160x3840)', w: 2160, h: 3840 },
                    { label: '2K Standard (1440x2560)', w: 1440, h: 2560 },
                    { label: 'FHD Standard (1080x1920)', w: 1080, h: 1920 },
                    { label: 'Tablet 3:4 (2064x2752)', w: 2064, h: 2752 },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        setCustomWidth(item.w);
                        setCustomHeight(item.h);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleApplyCustom}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-purple-900/40 hover:scale-[1.02] transition"
                >
                  Apply Custom Dimensions
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
