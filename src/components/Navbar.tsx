import React from 'react';
import { Sparkles, Smartphone, Share2, Grid, Wand2, Download, Layers } from 'lucide-react';
import { PhonePreset } from '../types';

interface NavbarProps {
  activeTab: 'create' | 'gallery' | 'studio';
  setActiveTab: (tab: 'create' | 'gallery' | 'studio') => void;
  selectedPhone: PhonePreset;
  onOpenDeviceSelector: () => void;
  onOpenShareModal: () => void;
  hasCurrentWallpaper: boolean;
  onDownloadCurrent: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedPhone,
  onOpenDeviceSelector,
  onOpenShareModal,
  hasCurrentWallpaper,
  onDownloadCurrent,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#080b18]/80 border-b border-indigo-500/20 text-white transition-all shadow-xl shadow-indigo-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('create')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[1px] shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300 tracking-tight">
                Aether Glass
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">AI Mobile Wallpapers</p>
          </div>
        </div>

        {/* Device Selection Quick Badge */}
        <button
          onClick={onOpenDeviceSelector}
          id="device-selector-btn"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-medium text-slate-200 transition-all hover:border-indigo-400/50 group"
          title="Change phone dimensions preset"
        >
          <Smartphone className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span className="max-w-[130px] sm:max-w-none truncate font-semibold">
            {selectedPhone.modelName}
          </span>
          <span className="text-[11px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
            {selectedPhone.width}×{selectedPhone.height}
          </span>
        </button>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('create')}
            id="tab-create-btn"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Wand2 className="w-4 h-4 text-indigo-300" />
            <span>Create</span>
          </button>

          <button
            onClick={() => setActiveTab('studio')}
            id="tab-studio-btn"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'studio'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-300" />
            <span>Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            id="tab-gallery-btn"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'gallery'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4 text-pink-300" />
            <span>Explore</span>
          </button>

          {/* Download & Share Controls */}
          <div className="h-5 w-[1px] bg-white/10 mx-1 hidden sm:block" />

          {hasCurrentWallpaper && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenShareModal}
                id="share-btn"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white transition-all"
                title="Share wallpaper"
              >
                <Share2 className="w-4 h-4 text-indigo-300" />
              </button>

              <button
                onClick={onDownloadCurrent}
                id="download-btn"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.02]"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Save HD</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
