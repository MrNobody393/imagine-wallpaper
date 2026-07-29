import React, { useState } from 'react';
import { Sparkles, Palette, Shuffle, RefreshCw, ArrowRight, Camera, Cpu, Film, Zap, Moon } from 'lucide-react';
import { PhonePreset } from '../types';
import { COLOR_PALETTES, PROMPT_IDEAS, STYLE_PRESETS } from '../data/presets';

interface GeneratorFormProps {
  onGenerate: (prompt: string, styleId: string, colorPaletteId: string) => Promise<void>;
  selectedPhone: PhonePreset;
  isGenerating: boolean;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  onGenerate,
  selectedPhone,
  isGenerating,
}) => {
  const [prompt, setPrompt] = useState<string>('Spiderman standing on the roof of a building watching sunset');
  const [selectedStyle, setSelectedStyle] = useState<string>('reality-8k');
  const [selectedPalette, setSelectedPalette] = useState<string>('sunset-glow');

  const handleSurpriseMe = () => {
    const random = PROMPT_IDEAS[Math.floor(Math.random() * PROMPT_IDEAS.length)];
    setPrompt(random);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    onGenerate(prompt, selectedStyle, selectedPalette);
  };

  const styleIcons: Record<string, React.ReactNode> = {
    'reality-8k': <Camera className="w-4 h-4 text-amber-400" />,
    'ai-art-3d': <Cpu className="w-4 h-4 text-cyan-400" />,
    'cartoon-anime': <Film className="w-4 h-4 text-emerald-400" />,
    'cyberpunk-neon': <Zap className="w-4 h-4 text-pink-400" />,
    'deep-amoled-dark': <Moon className="w-4 h-4 text-purple-400" />,
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5 animate-fadeIn">
      {/* 1. Prompt Input Card */}
      <div className="relative p-5.5 rounded-3xl bg-[#0c1026]/85 backdrop-blur-2xl border border-indigo-500/25 shadow-2xl space-y-3.5 hover:border-indigo-400/40 transition-all">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>1. Prompt & Subject</span>
          </label>

          <button
            type="button"
            onClick={handleSurpriseMe}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 hover:text-amber-200 transition border border-amber-400/20 text-xs font-semibold shadow-sm"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Random Idea</span>
          </button>
        </div>

        {/* Text Area */}
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              handleSubmit(e);
            }
          }}
          rows={3}
          placeholder="e.g. Spiderman standing on the roof of a building watching sunset..."
          className="w-full bg-[#060818]/90 rounded-2xl p-4 border border-indigo-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-400 transition resize-none leading-relaxed shadow-inner"
        />

        {/* Quick Example Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">Quick Ideas:</span>
          {[
            'Spiderman on building roof watching sunset',
            'Photorealistic lion in snow storm',
            'Cyberpunk neon Tokyo rainy street',
            'Studio Ghibli anime summer cloud hill',
            'OLED obsidian crystal pyramid',
          ].map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setPrompt(example)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/20 text-slate-300 hover:text-white transition"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Visual Style Selector (REALITY, AI ART, CARTOON, CYBERPUNK, AMOLED) */}
      <div className="p-5.5 rounded-3xl bg-[#0c1026]/85 backdrop-blur-2xl border border-indigo-500/25 shadow-2xl space-y-3.5 hover:border-indigo-400/40 transition-all">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-amber-400" />
            <span>2. Choose Visual Style</span>
          </label>

          <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-300 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            8K Ultra HD Output
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {STYLE_PRESETS.map((style) => {
            const isSelected = selectedStyle === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => setSelectedStyle(style.id)}
                className={`p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-900/90 to-purple-900/90 border-indigo-400 text-white shadow-lg ring-2 ring-indigo-400/50'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-white">
                    {styleIcons[style.id] || <Sparkles className="w-4 h-4 text-indigo-400" />}
                    <span>{style.label}</span>
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                  {style.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Color Atmosphere Card */}
      <div className="p-5.5 rounded-3xl bg-[#0c1026]/85 backdrop-blur-2xl border border-indigo-500/25 shadow-2xl space-y-3.5 hover:border-indigo-400/40 transition-all">
        <label className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-pink-400" />
          <span>3. Color Atmosphere</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {COLOR_PALETTES.map((palette) => {
            const isSelected = selectedPalette === palette.id;
            return (
              <button
                key={palette.id}
                type="button"
                onClick={() => setSelectedPalette(palette.id)}
                className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-medium transition-all text-left ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-900/80 to-purple-900/80 border-indigo-400 text-white shadow-lg ring-1 ring-indigo-400/50'
                    : 'bg-indigo-950/30 border-white/10 text-slate-300 hover:bg-indigo-900/40 hover:text-white hover:border-indigo-500/30'
                }`}
              >
                <div className="flex items-center -space-x-1.5 shrink-0">
                  {palette.colors.map((c, i) => (
                    <span
                      key={i}
                      className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <span className="truncate">{palette.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Generate Action Button */}
      <button
        type="submit"
        disabled={isGenerating || !prompt.trim()}
        id="generate-wallpaper-btn"
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold text-base shadow-2xl shadow-indigo-950/80 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin text-white" />
            <span>Generating 8K Wallpaper for {selectedPhone.modelName}...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span>Generate 8K Wallpaper for {selectedPhone.modelName}</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
};
