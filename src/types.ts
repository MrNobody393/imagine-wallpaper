export type DeviceBrand = 'apple' | 'samsung' | 'google' | 'oneplus' | 'nothing' | 'custom';
export type NotchType = 'dynamic-island' | 'notch' | 'punch-hole-center' | 'punch-hole-left' | 'none';

export interface PhonePreset {
  id: string;
  brand: DeviceBrand;
  brandName: string;
  modelName: string;
  width: number;
  height: number;
  aspectRatio: string;
  notchType: NotchType;
  screenSize: string; // e.g. "6.9\""
}

export interface StylePreset {
  id: string;
  label: string;
  description: string;
  promptModifier: string;
  previewBg: string; // Tailwind gradient class
  category: '3d-glass' | 'cyber' | 'minimal' | 'nature' | 'abstract' | 'anime' | 'dark-oled';
}

export interface ColorPalette {
  id: string;
  label: string;
  colors: string[]; // e.g. ["#FF512F", "#DD2476"]
  keywords: string;
}

export interface FilterSettings {
  brightness: number; // 50 to 150 (default 100)
  contrast: number; // 50 to 150 (default 100)
  saturation: number; // 0 to 200 (default 100)
  blur: number; // 0 to 20 (default 0)
  grain: number; // 0 to 50 (default 0)
  vignette: number; // 0 to 100 (default 0)
  tintColor: string; // hex
  tintOpacity: number; // 0 to 100 (default 0)
}

export interface GeneratedWallpaper {
  id: string;
  prompt: string;
  enhancedPrompt?: string;
  styleId: string;
  deviceId: string;
  deviceName: string;
  width: number;
  height: number;
  imageUrl: string;
  createdAt: number;
  likes: number;
  downloads: number;
  authorName: string;
  authorAvatar?: string;
  tags: string[];
  filterSettings?: FilterSettings;
  isCustom?: boolean;
}

export type PreviewTab = 'lock' | 'home' | 'clean' | 'compare';
