import React, { useState } from 'react';
import { Sparkles, Heart, Download, Wand2, Search, Smartphone, Layers, Eye } from 'lucide-react';
import { GeneratedWallpaper, PhonePreset } from '../types';
import { DEMO_COMMUNITY_WALLPAPERS, STYLE_PRESETS, PHONE_PRESETS } from '../data/presets';

interface CommunityGalleryProps {
  wallpapers: GeneratedWallpaper[];
  onSelectWallpaperToRemix: (wallpaper: GeneratedWallpaper) => void;
  onLikeWallpaper: (id: string) => void;
}

export const CommunityGallery: React.FC<CommunityGalleryProps> = ({
  wallpapers,
  onSelectWallpaperToRemix,
  onLikeWallpaper,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPreview, setSelectedPreview] = useState<GeneratedWallpaper | null>(null);

  const allWallpapers = [...wallpapers, ...DEMO_COMMUNITY_WALLPAPERS];

  const filtered = allWallpapers.filter((w) => {
    const matchesSearch =
      w.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (activeCategory === 'all') return true;
    return w.styleId === activeCategory;
  });

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* Top Banner & Search Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-slate-900/80 border border-white/15 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" /> Community AI Wallpapers
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Explore wallpapers crafted by creators worldwide. One-click remix to apply prompt & phone dimensions.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts, devices..."
              className="w-full pl-9 pr-3 py-2 rounded-2xl bg-slate-950/80 border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 ${
              activeCategory === 'all'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            All Wallpapers
          </button>
          {STYLE_PRESETS.map((style) => (
            <button
              key={style.id}
              onClick={() => setActiveCategory(style.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 ${
                activeCategory === style.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((wallpaper) => (
          <div
            key={wallpaper.id}
            className="group relative rounded-3xl bg-slate-900/60 border border-white/15 overflow-hidden backdrop-blur-xl shadow-xl hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Image Thumbnail Container */}
            <div className="relative w-full aspect-[9/16] bg-slate-950 overflow-hidden cursor-pointer" onClick={() => setSelectedPreview(wallpaper)}>
              <img
                src={wallpaper.imageUrl}
                alt={wallpaper.prompt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30 opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Top Phone Model Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-white flex items-center gap-1.5 shadow">
                <Smartphone className="w-3 h-3 text-indigo-400" />
                <span>{wallpaper.deviceName}</span>
              </div>

              {/* Bottom Overlay Info */}
              <div className="absolute bottom-3 inset-x-3 space-y-2">
                <p className="text-xs text-white font-medium line-clamp-2 drop-shadow italic">
                  "{wallpaper.prompt}"
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-white/15 text-[11px] text-slate-300">
                  <span className="font-semibold text-slate-200">by {wallpaper.authorName}</span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-pink-400 fill-pink-400" /> {wallpaper.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3 text-emerald-400" /> {wallpaper.downloads}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Remix / Action Footer */}
            <div className="p-3 bg-slate-950/80 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                onClick={() => onLikeWallpaper(wallpaper.id)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-pink-400 hover:text-pink-300 transition flex items-center gap-1 text-xs"
                title="Like wallpaper"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>{wallpaper.likes}</span>
              </button>

              <button
                onClick={() => onSelectWallpaperToRemix(wallpaper)}
                className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md transition hover:scale-[1.02]"
              >
                <Wand2 className="w-3.5 h-3.5 text-indigo-200" />
                <span>Use Prompt & Size</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Fullscreen Preview Modal */}
      {selectedPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-xl bg-slate-900 border border-white/20 rounded-3xl p-6 shadow-2xl text-white flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-sm">{selectedPreview.deviceName}</h3>
                <span className="text-xs font-mono text-slate-400">
                  ({selectedPreview.width} × {selectedPreview.height})
                </span>
              </div>
              <button
                onClick={() => setSelectedPreview(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                ✕
              </button>
            </div>

            <div className="my-4 flex-1 overflow-hidden flex justify-center">
              <img
                src={selectedPreview.imageUrl}
                alt={selectedPreview.prompt}
                referrerPolicy="no-referrer"
                className="h-[60vh] rounded-2xl object-cover border border-white/20 shadow-2xl"
              />
            </div>

            <div className="space-y-3 pt-2 border-t border-white/10">
              <p className="text-xs text-slate-200 italic">"{selectedPreview.prompt}"</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Created by {selectedPreview.authorName}</span>
                <button
                  onClick={() => {
                    onSelectWallpaperToRemix(selectedPreview);
                    setSelectedPreview(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Remix in Studio</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
