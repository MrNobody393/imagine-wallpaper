import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { PhoneFrame } from './components/PhoneFrame';
import { DeviceSelector } from './components/DeviceSelector';
import { GeneratorForm } from './components/GeneratorForm';
import { StudioEditor } from './components/StudioEditor';
import { SocialShareModal } from './components/SocialShareModal';
import { CommunityGallery } from './components/CommunityGallery';
import { PhonePreset, FilterSettings, PreviewTab, GeneratedWallpaper } from './types';
import { PHONE_PRESETS, STYLE_PRESETS, COLOR_PALETTES } from './data/presets';
import { Sparkles, Sliders, Wand2, Smartphone, Download, Share2, Layers, Grid } from 'lucide-react';

const DEFAULT_FILTERS: FilterSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  grain: 0,
  vignette: 0,
  tintColor: '#ffffff',
  tintOpacity: 0,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'create' | 'gallery' | 'studio'>('create');
  const [selectedPhone, setSelectedPhone] = useState<PhonePreset>(PHONE_PRESETS[0]); // iPhone 17 Pro Max
  const [previewTab, setPreviewTab] = useState<PreviewTab>('lock');

  const [currentWallpaperUrl, setCurrentWallpaperUrl] = useState<string>(
    'https://image.pollinations.ai/prompt/Spiderman%20standing%20on%20the%20roof%20of%20a%20building%20watching%20sunset%20phone%20wallpaper?width=768&height=1344&nologo=true'
  );
  const [rawWallpaperUrl, setRawWallpaperUrl] = useState<string>(
    'https://image.pollinations.ai/prompt/Spiderman%20standing%20on%20the%20roof%20of%20a%20building%20watching%20sunset%20phone%20wallpaper?width=768&height=1344&nologo=true'
  );
  const [currentPrompt, setCurrentPrompt] = useState<string>(
    'Spiderman standing on the roof of a building watching sunset'
  );

  const [filterSettings, setFilterSettings] = useState<FilterSettings>(DEFAULT_FILTERS);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const [isDeviceSelectorOpen, setIsDeviceSelectorOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  const [userPublishedWallpapers, setUserPublishedWallpapers] = useState<GeneratedWallpaper[]>([]);

  // 1. Generate AI Wallpaper Handler
  const handleGenerateWallpaper = async (
    promptText: string,
    styleId: string,
    colorPaletteId: string
  ) => {
    setIsGenerating(true);
    setCurrentPrompt(promptText);

    const colorObj = COLOR_PALETTES.find((c) => c.id === colorPaletteId);

    try {
      const res = await fetch('/api/gemini/generate-wallpaper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          styleId: styleId,
          aspectRatio: selectedPhone.aspectRatio,
          colorKeywords: colorObj?.keywords,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server endpoint unavailable (HTTP ${res.status})`);
      }

      const data = await res.json();
      if (data.imageUrl) {
        setCurrentWallpaperUrl(data.imageUrl);
        setRawWallpaperUrl(data.imageUrl);
      } else {
        throw new Error('No imageUrl returned from server');
      }
    } catch (e) {
      console.warn('Backend API unavailable (likely static GitHub Pages host), using direct high-res client fallback:', e);

      let fallbackModel = 'flux-realism';
      let stylePromptModifier = 'real life photograph shot on 85mm DSLR camera f/1.4, hyper-realistic 8k resolution photo, natural cinematic lighting, sharp detail';
      
      if (styleId === 'cartoon-anime') {
        fallbackModel = 'flux-anime';
        stylePromptModifier = 'vivid cartoon anime illustration, Studio Ghibli style, hand-painted digital artwork, crisp lines, 8k wallpaper';
      } else if (styleId === 'ai-art-3d') {
        fallbackModel = 'flux-3d';
        stylePromptModifier = 'hyperdetailed 3D AI artwork, translucent liquid glass ribbons, Octane Render 8k, raytraced reflection';
      } else if (styleId === 'cyberpunk-neon') {
        fallbackModel = 'flux';
        stylePromptModifier = 'cyberpunk synthwave aesthetic, glowing neon lights, rain soaked dark street, 8k wallpaper';
      } else if (styleId === 'deep-amoled-dark') {
        fallbackModel = 'flux';
        stylePromptModifier = 'deep dark OLED wallpaper, pitch black obsidian background (#000000) with electric luminous geometry, 8k';
      }

      const seed = Math.floor(Math.random() * 8999999) + 1000000;
      const colorKeywords = colorObj?.keywords ? ` Color scheme: ${colorObj.keywords}.` : '';
      const fullFallbackPrompt = `${promptText}. ${stylePromptModifier}.${colorKeywords} Masterpiece 8K mobile wallpaper.`;

      const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullFallbackPrompt)}?width=1080&height=1920&nologo=true&seed=${seed}&enhance=true&model=${fallbackModel}`;
      setCurrentWallpaperUrl(fallbackUrl);
      setRawWallpaperUrl(fallbackUrl);
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. Export High Resolution Image via Canvas
  const handleDownloadWallpaper = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = currentWallpaperUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = selectedPhone.width;
      canvas.height = selectedPhone.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Apply Filter Effects to Canvas Context
      ctx.filter = `
        brightness(${filterSettings.brightness}%)
        contrast(${filterSettings.contrast}%)
        saturate(${filterSettings.saturation}%)
        blur(${filterSettings.blur}px)
      `;

      // Draw image to fill full resolution
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Reset filter for overlays
      ctx.filter = 'none';

      // Draw Vignette if configured
      if (filterSettings.vignette > 0) {
        const gradient = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          (canvas.width / 2) * (1 - filterSettings.vignette / 100),
          canvas.width / 2,
          canvas.height / 2,
          Math.max(canvas.width, canvas.height) / 1.2
        );
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.85)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw Color Tint if configured
      if (filterSettings.tintOpacity > 0) {
        ctx.globalCompositeOperation = 'color';
        ctx.fillStyle = filterSettings.tintColor;
        ctx.globalAlpha = filterSettings.tintOpacity / 100;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Trigger Download
      const link = document.createElement('a');
      const sanitizedName = selectedPhone.modelName.replace(/[^a-zA-Z0-9]/g, '_');
      link.download = `Aether_Wallpaper_${sanitizedName}_${selectedPhone.width}x${selectedPhone.height}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    };
  };

  // 3. Remix Community Wallpaper
  const handleRemixWallpaper = (wallpaper: GeneratedWallpaper) => {
    setCurrentWallpaperUrl(wallpaper.imageUrl);
    setRawWallpaperUrl(wallpaper.imageUrl);
    setCurrentPrompt(wallpaper.prompt);

    const matchingPhone = PHONE_PRESETS.find((p) => p.id === wallpaper.deviceId);
    if (matchingPhone) {
      setSelectedPhone(matchingPhone);
    }

    setActiveTab('create');
  };

  const handlePublishToCommunity = (newWallpaper: Partial<GeneratedWallpaper>) => {
    const created: GeneratedWallpaper = {
      id: `published-${Date.now()}`,
      prompt: newWallpaper.prompt || currentPrompt,
      styleId: 'custom',
      deviceId: selectedPhone.id,
      deviceName: selectedPhone.modelName,
      width: selectedPhone.width,
      height: selectedPhone.height,
      imageUrl: newWallpaper.imageUrl || currentWallpaperUrl,
      createdAt: Date.now(),
      likes: 1,
      downloads: 0,
      authorName: 'You',
      tags: newWallpaper.tags || ['Custom AI'],
    };

    setUserPublishedWallpapers((prev) => [created, ...prev]);
  };

  const handleLikeWallpaper = (id: string) => {
    setUserPublishedWallpapers((prev) =>
      prev.map((w) => (w.id === id ? { ...w, likes: w.likes + 1 } : w))
    );
  };

  return (
    <div className="min-h-screen bg-[#070914] text-white font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden bg-grid-pattern">
      {/* Background Multi-Layer Ambient Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Top-left electric Indigo & Cyan Glow */}
        <div className="absolute top-[-15%] left-[-10%] w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-indigo-700/40 via-purple-600/30 to-cyan-400/20 blur-[140px] animate-float" />
        {/* Bottom-right Sunset Amber & Violet Glow */}
        <div className="absolute bottom-[-15%] right-[-10%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-purple-900/40 via-amber-600/25 to-rose-600/20 blur-[160px] animate-float" style={{ animationDelay: '-5s' }} />
        {/* Center Emerald & Cyan Flare */}
        <div className="absolute top-[35%] right-[15%] w-[400px] h-[400px] rounded-full bg-cyan-500/15 blur-[120px] animate-glow" />
        {/* Left Warm Indigo Flare */}
        <div className="absolute top-[60%] left-[5%] w-[450px] h-[450px] rounded-full bg-indigo-600/15 blur-[130px]" />
      </div>

      {/* Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedPhone={selectedPhone}
        onOpenDeviceSelector={() => setIsDeviceSelectorOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        hasCurrentWallpaper={!!currentWallpaperUrl}
        onDownloadCurrent={handleDownloadWallpaper}
      />

      {/* Main Workspace Body */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'gallery' ? (
          /* Explore Community Showcase View */
          <CommunityGallery
            wallpapers={userPublishedWallpapers}
            onSelectWallpaperToRemix={handleRemixWallpaper}
            onLikeWallpaper={handleLikeWallpaper}
          />
        ) : (
          /* Main Creation & Studio Workspace */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Creator Form OR Studio Filters (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Context Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Step {activeTab === 'create' ? '1' : '2'}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                    {activeTab === 'create' ? 'Craft AI Wallpaper' : 'Post-Processing Studio'}
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('create')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      activeTab === 'create'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    AI Generator
                  </button>
                  <button
                    onClick={() => setActiveTab('studio')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      activeTab === 'studio'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    Studio Filters
                  </button>
                </div>
              </div>

              {/* Creator Component View */}
              {activeTab === 'create' ? (
                <GeneratorForm
                  onGenerate={handleGenerateWallpaper}
                  selectedPhone={selectedPhone}
                  isGenerating={isGenerating}
                />
              ) : (
                <StudioEditor
                  filterSettings={filterSettings}
                  setFilterSettings={setFilterSettings}
                  onResetFilters={() => setFilterSettings(DEFAULT_FILTERS)}
                  selectedPhone={selectedPhone}
                  onDownload={handleDownloadWallpaper}
                />
              )}
            </div>

            {/* Right Column: Live Interactive Glass Phone Preview (5 cols) */}
            <div className="lg:col-span-5 sticky top-24 space-y-4 flex flex-col items-center">
              <PhoneFrame
                wallpaperUrl={currentWallpaperUrl}
                rawWallpaperUrl={rawWallpaperUrl}
                phonePreset={selectedPhone}
                filterSettings={filterSettings}
                previewTab={previewTab}
                setPreviewTab={setPreviewTab}
                isGenerating={isGenerating}
              />
            </div>
          </div>
        )}
      </main>

      {/* Device Selector Modal */}
      <DeviceSelector
        selectedPhone={selectedPhone}
        onSelectPhone={setSelectedPhone}
        isOpen={isDeviceSelectorOpen}
        onClose={() => setIsDeviceSelectorOpen(false)}
      />

      {/* Social Share Modal */}
      <SocialShareModal
        wallpaperUrl={currentWallpaperUrl}
        prompt={currentPrompt}
        phonePreset={selectedPhone}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onPublishToCommunity={handlePublishToCommunity}
      />
    </div>
  );
}
