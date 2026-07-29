import React, { useState, useEffect } from 'react';
import {
  Lock,
  Wifi,
  Battery,
  Flashlight,
  Camera,
  Search,
  MessageCircle,
  Music,
  Compass,
  Sparkles,
  Eye,
  Sliders,
  Check,
  Split,
  Maximize2,
} from 'lucide-react';
import { PhonePreset, FilterSettings, PreviewTab } from '../types';

interface PhoneFrameProps {
  wallpaperUrl: string;
  phonePreset: PhonePreset;
  filterSettings: FilterSettings;
  previewTab: PreviewTab;
  setPreviewTab: (tab: PreviewTab) => void;
  rawWallpaperUrl?: string;
  isGenerating?: boolean;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  wallpaperUrl,
  phonePreset,
  filterSettings,
  previewTab,
  setPreviewTab,
  rawWallpaperUrl,
  isGenerating = false,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('09:41');
  const [currentDate, setCurrentDate] = useState<string>('Wednesday, July 29');
  const [sliderPos, setSliderPos] = useState<number>(50); // For compare slider
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);

      const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
      setCurrentDate(now.toLocaleDateString('en-US', options));
    };

    updateClock();
    const interval = setInterval(updateClock, 10000);
    return () => clearInterval(interval);
  }, []);

  // Compute CSS filter string
  const filterCss = `
    brightness(${filterSettings.brightness}%)
    contrast(${filterSettings.contrast}%)
    saturate(${filterSettings.saturation}%)
    blur(${filterSettings.blur}px)
  `;

  // Aspect ratio styling
  const aspectRatioVal = phonePreset.width / phonePreset.height;

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto relative group">
      {/* Top Floating Control Pill */}
      <div className="flex items-center gap-1 p-1 mb-3 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-lg text-xs font-medium text-slate-300 z-20">
        <button
          onClick={() => setPreviewTab('lock')}
          id="preview-lock-btn"
          className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
            previewTab === 'lock'
              ? 'bg-indigo-600 text-white font-semibold shadow'
              : 'hover:text-white hover:bg-white/5'
          }`}
        >
          <Lock className="w-3 h-3" />
          <span>Lock Screen</span>
        </button>

        <button
          onClick={() => setPreviewTab('home')}
          id="preview-home-btn"
          className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
            previewTab === 'home'
              ? 'bg-indigo-600 text-white font-semibold shadow'
              : 'hover:text-white hover:bg-white/5'
          }`}
        >
          <Eye className="w-3 h-3" />
          <span>Home Dock</span>
        </button>

        <button
          onClick={() => setPreviewTab('clean')}
          id="preview-clean-btn"
          className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
            previewTab === 'clean'
              ? 'bg-indigo-600 text-white font-semibold shadow'
              : 'hover:text-white hover:bg-white/5'
          }`}
        >
          <Maximize2 className="w-3 h-3" />
          <span>Clean</span>
        </button>

        <button
          onClick={() => setPreviewTab('compare')}
          id="preview-compare-btn"
          className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
            previewTab === 'compare'
              ? 'bg-indigo-600 text-white font-semibold shadow'
              : 'hover:text-white hover:bg-white/5'
          }`}
          title="Compare raw vs edited filter"
        >
          <Split className="w-3 h-3" />
          <span className="hidden sm:inline">Compare</span>
        </button>
      </div>

      {/* Main Glassmorphic Phone Chassis Container */}
      <div
        className={`relative w-full max-w-[340px] transition-transform duration-300 ${
          isZoomed ? 'scale-110 z-30' : 'scale-100'
        }`}
        style={{
          aspectRatio: `${aspectRatioVal}`,
        }}
      >
        {/* Outer Phone Bezel with Glass Glow */}
        <div className="absolute -inset-1 rounded-[48px] bg-gradient-to-tr from-indigo-500/30 via-purple-500/20 to-pink-500/30 blur-md opacity-70 group-hover:opacity-100 transition-opacity" />

        <div className="relative w-full h-full rounded-[44px] p-3 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-[3px] border-slate-700/80 shadow-2xl shadow-indigo-950/60 overflow-hidden flex flex-col justify-between select-none">
          {/* Internal Screen Viewport */}
          <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-slate-950 flex flex-col justify-between">
            {/* Wallpaper Image Container */}
            <div className="absolute inset-0 w-full h-full bg-slate-950 overflow-hidden">
              {isGenerating ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950/90 p-6 text-center backdrop-blur-md">
                  <div className="relative w-16 h-16 mb-4">
                    <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                    <Sparkles className="w-8 h-8 text-indigo-400 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <p className="text-sm font-semibold text-white">Rendering AI Masterpiece...</p>
                  <p className="text-xs text-slate-400 mt-1">Applying pixel perfection for {phonePreset.modelName}</p>
                </div>
              ) : (
                <>
                  {/* Primary Rendered Image */}
                  <img
                    src={wallpaperUrl}
                    alt="AI Phone Wallpaper"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback to high resolution image if main fails
                      const img = e.currentTarget;
                      if (!img.src.includes('unsplash')) {
                        img.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop';
                      }
                    }}
                    className="w-full h-full object-cover transition-all duration-300"
                    style={{
                      filter: filterCss,
                    }}
                  />

                  {/* Vignette Overlay */}
                  {filterSettings.vignette > 0 && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle, transparent ${100 - filterSettings.vignette}%, rgba(0,0,0,0.85) 100%)`,
                      }}
                    />
                  )}

                  {/* Tint Overlay */}
                  {filterSettings.tintOpacity > 0 && (
                    <div
                      className="absolute inset-0 pointer-events-none mix-blend-color"
                      style={{
                        backgroundColor: filterSettings.tintColor,
                        opacity: filterSettings.tintOpacity / 100,
                      }}
                    />
                  )}

                  {/* Compare Split View Mode */}
                  {previewTab === 'compare' && rawWallpaperUrl && (
                    <div
                      className="absolute inset-0 overflow-hidden border-r-2 border-white shadow-2xl transition-all"
                      style={{ width: `${sliderPos}%` }}
                    >
                      <img
                        src={rawWallpaperUrl}
                        alt="Raw Wallpaper"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover max-w-none"
                        style={{ width: '316px', height: '100%' }}
                      />
                      <div className="absolute top-12 left-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] text-white font-mono uppercase">
                        Raw AI
                      </div>
                    </div>
                  )}

                  {previewTab === 'compare' && (
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderPos}
                      onChange={(e) => setSliderPos(Number(e.target.value))}
                      className="absolute inset-x-0 bottom-16 z-30 opacity-70 hover:opacity-100 cursor-ew-resize accent-indigo-500 mx-4"
                    />
                  )}
                </>
              )}
            </div>

            {/* Top Device Camera / Notch Integration */}
            <div className="relative z-20 w-full pt-3 px-6 flex items-center justify-between text-white text-[11px] font-semibold tracking-tight">
              {/* Left Clock in status bar */}
              <span className="drop-shadow">{currentTime}</span>

              {/* Center Hardware Notch / Dynamic Island */}
              <div className="absolute left-1/2 -translate-x-1/2 top-2 z-30">
                {phonePreset.notchType === 'dynamic-island' && (
                  <div className="w-24 h-6 rounded-full bg-black flex items-center justify-between px-2.5 shadow-md border border-white/10">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-900/60" />
                    </div>
                  </div>
                )}

                {phonePreset.notchType === 'notch' && (
                  <div className="w-28 h-5 rounded-b-2xl bg-black border-x border-b border-white/10 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700" />
                  </div>
                )}

                {phonePreset.notchType === 'punch-hole-center' && (
                  <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-800 shadow-inner" />
                )}

                {phonePreset.notchType === 'punch-hole-left' && (
                  <div className="absolute -left-16 top-0 w-3.5 h-3.5 rounded-full bg-black border border-slate-800" />
                )}
              </div>

              {/* Right Status Icons */}
              <div className="flex items-center gap-1.5 drop-shadow">
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Lock Screen UI Overlay */}
            {previewTab === 'lock' && (
              <div className="relative z-10 w-full h-full flex flex-col justify-between pt-10 pb-6 px-4 text-white">
                {/* Clock & Date Widget */}
                <div className="flex flex-col items-center mt-4 drop-shadow-lg">
                  <div className="text-[11px] font-medium tracking-wide text-slate-200 uppercase bg-black/20 backdrop-blur-md px-3 py-0.5 rounded-full border border-white/10 mb-1">
                    {currentDate}
                  </div>
                  <h1 className="text-6xl font-extrabold tracking-tighter drop-shadow-2xl text-white font-sans">
                    {currentTime}
                  </h1>

                  {/* Weather Glass Widget Pill */}
                  <div className="mt-3 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-medium flex items-center gap-2 shadow-lg">
                    <span>72° Sunny</span>
                    <span className="opacity-60">•</span>
                    <span>Air 24 AQI</span>
                  </div>
                </div>

                {/* Glass Lock Screen Notification Card */}
                <div className="w-full px-2 mb-4">
                  <div className="w-full p-3 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/20 shadow-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white truncate">Aether Glass AI</span>
                        <span className="text-[10px] text-slate-300">Just now</span>
                      </div>
                      <p className="text-xs text-slate-200 truncate mt-0.5">
                        Wallpaper calibrated for {phonePreset.modelName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Quick Controls (Flashlight & Camera) */}
                <div className="w-full flex items-center justify-between px-3">
                  <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
                    <Flashlight className="w-4 h-4" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
                    <Camera className="w-4 h-4" />
                  </div>
                </div>
              </div>
            )}

            {/* Home Screen UI Overlay */}
            {previewTab === 'home' && (
              <div className="relative z-10 w-full h-full flex flex-col justify-between pt-12 pb-6 px-4">
                {/* Search Bar Widget */}
                <div className="w-full px-2">
                  <div className="w-full py-2 px-3 rounded-full bg-black/30 backdrop-blur-xl border border-white/20 text-white/80 text-xs flex items-center gap-2 shadow-md">
                    <Search className="w-3.5 h-3.5 text-indigo-300" />
                    <span className="text-slate-300">Search apps & web...</span>
                  </div>
                </div>

                {/* Sample App Grid */}
                <div className="grid grid-cols-4 gap-3 px-2 my-auto">
                  {['Camera', 'Photos', 'Clock', 'Weather', 'Settings', 'Notes', 'Maps', 'Studio'].map((app, i) => (
                    <div key={app} className="flex flex-col items-center gap-1 group/app">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg flex items-center justify-center text-white transition-transform group-hover/app:scale-105">
                        <span className="font-bold text-xs">{app[0]}</span>
                      </div>
                      <span className="text-[10px] text-white font-medium drop-shadow-md tracking-tight">
                        {app}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom App Glass Dock */}
                <div className="w-full px-2">
                  <div className="w-full p-2.5 rounded-3xl bg-white/20 backdrop-blur-2xl border border-white/30 shadow-2xl flex items-center justify-around">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/80 backdrop-blur-md flex items-center justify-center text-white shadow-md">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-indigo-500/80 backdrop-blur-md flex items-center justify-center text-white shadow-md">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-pink-500/80 backdrop-blur-md flex items-center justify-center text-white shadow-md">
                      <Music className="w-5 h-5" />
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-white shadow-md">
                      <Sparkles className="w-5 h-5 text-indigo-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Home Indicator Bar */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-white/60 z-30" />
          </div>
        </div>
      </div>

      {/* Bottom Phone Spec Tag */}
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 font-medium">
        <span>{phonePreset.modelName}</span>
        <span>•</span>
        <span>{phonePreset.screenSize}</span>
        <span>•</span>
        <span className="font-mono">{phonePreset.aspectRatio}</span>
      </div>
    </div>
  );
};
