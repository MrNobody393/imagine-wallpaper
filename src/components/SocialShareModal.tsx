import React, { useState } from 'react';
import { Share2, Copy, Check, X, QrCode, Globe, Send, Sparkles, Heart, ExternalLink } from 'lucide-react';
import { GeneratedWallpaper, PhonePreset } from '../types';

interface SocialShareModalProps {
  wallpaperUrl: string;
  prompt: string;
  phonePreset: PhonePreset;
  isOpen: boolean;
  onClose: () => void;
  onPublishToCommunity?: (wallpaper: Partial<GeneratedWallpaper>) => void;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  wallpaperUrl,
  prompt,
  phonePreset,
  isOpen,
  onClose,
  onPublishToCommunity,
}) => {
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [published, setPublished] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href;
  const shareTitle = `Check out my AI generated ${phonePreset.modelName} wallpaper!`;
  const shareText = `I generated this wallpaper using Aether Glass AI for ${phonePreset.modelName}: "${prompt}"`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: currentUrl,
        });
      } catch (e) {
        console.warn('Share cancelled or unavailable', e);
      }
    } else {
      handleCopyLink();
    }
  };

  const handlePublish = () => {
    if (published) return;
    if (onPublishToCommunity) {
      onPublishToCommunity({
        prompt,
        deviceId: phonePreset.id,
        deviceName: phonePreset.modelName,
        width: phonePreset.width,
        height: phonePreset.height,
        imageUrl: wallpaperUrl,
        tags: ['AI Generated', phonePreset.brandName],
      });
    }
    setPublished(true);
  };

  const encodeText = encodeURIComponent(shareText);
  const encodeUrl = encodeURIComponent(currentUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900/90 border border-white/15 rounded-3xl p-6 shadow-2xl text-white space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Share AI Wallpaper</h3>
              <p className="text-xs text-slate-400">Calibrated for {phonePreset.modelName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thumbnail Preview Card */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-white/10 flex items-center gap-3">
          <img
            src={wallpaperUrl}
            alt="Wallpaper thumbnail"
            referrerPolicy="no-referrer"
            className="w-14 h-24 rounded-xl object-cover border border-white/20 shrink-0 shadow-md"
          />
          <div className="min-w-0 flex-1 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-indigo-400 tracking-wider">
              {phonePreset.modelName} ({phonePreset.width}×{phonePreset.height})
            </span>
            <p className="text-xs text-slate-200 line-clamp-2 italic">"{prompt}"</p>
          </div>
        </div>

        {/* Link Copy Bar */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Shareable Studio Link</label>
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950 border border-white/15">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="w-full bg-transparent px-2 text-xs text-slate-300 focus:outline-none font-mono truncate"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition shrink-0"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Share Directly</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeText}&url=${encodeUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col items-center gap-1.5 text-xs text-slate-200 transition"
            >
              <Globe className="w-4 h-4 text-sky-400" />
              <span>X / Twitter</span>
            </a>

            <a
              href={`https://pinterest.com/pin/create/button/?url=${encodeUrl}&media=${encodeURIComponent(
                wallpaperUrl
              )}&description=${encodeText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col items-center gap-1.5 text-xs text-slate-200 transition"
            >
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>Pinterest</span>
            </a>

            <a
              href={`https://api.whatsapp.com/send?text=${encodeText}%20${encodeUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col items-center gap-1.5 text-xs text-slate-200 transition"
            >
              <Send className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={handleNativeShare}
              className="p-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/40 border border-indigo-500/40 flex flex-col items-center gap-1.5 text-xs text-indigo-200 font-semibold transition"
            >
              <Share2 className="w-4 h-4 text-indigo-300" />
              <span>More Options</span>
            </button>
          </div>
        </div>

        {/* Publish to Community Feed Card */}
        <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/20" /> Publish to Community Gallery
            </h4>
            <p className="text-[11px] text-slate-400">Allow other wallpaper creators to view and remix</p>
          </div>

          <button
            onClick={handlePublish}
            disabled={published}
            className={`px-3 py-1.5 rounded-xl font-semibold text-xs transition ${
              published
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow'
            }`}
          >
            {published ? '✓ Published!' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
};
