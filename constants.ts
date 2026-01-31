export const DEFAULT_BASE_URL = "https://api.openai.com/v1";

export const AVAILABLE_MODELS = [
  { value: "sora-2", label: "Sora 2.0 (Latest)" },
  { value: "sora-1.0-turbo", label: "Sora 1.0 Turbo" },
  { value: "dall-e-3", label: "DALL-E 3 (Image Fallback)" },
  { value: "custom", label: "Custom Model..." },
];

export const ASPECT_RATIOS = [
  { value: "1920x1080", label: "16:9 Landscape (1920x1080)" },
  { value: "1080x1920", label: "9:16 Portrait (1080x1920)" },
  { value: "1080x1080", label: "1:1 Square (1080x1080)" },
  { value: "2048x1080", label: "2:1 Cinematic (2048x1080)" },
];

export const QUALITIES = [
  { value: "standard", label: "Standard" },
  { value: "hd", label: "HD" },
];

export const STYLES = [
  { value: "realistic", label: "Realistic" },
  { value: "animation", label: "Animation" },
  { value: "cyberpunk", label: "Cyberpunk" },
  { value: "fantasy", label: "Fantasy" },
  { value: "minimalist", label: "Minimalist" },
];