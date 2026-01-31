import { AppSettings, GenerationParams, VideoResponse } from "../types";

export const generateVideo = async (
  settings: AppSettings,
  params: GenerationParams
): Promise<VideoResponse> => {
  // Normalize Base URL (remove trailing slash)
  const baseUrl = settings.baseUrl.replace(/\/$/, "");
  
  // Standard OpenAI Video Generation Endpoint
  const endpoint = `${baseUrl}/videos/generations`; 
  
  // Fallback for DALL-E 3 image generation
  const isDalle = params.model.toLowerCase().includes("dall-e");
  const finalEndpoint = isDalle 
    ? `${baseUrl}/images/generations` 
    : endpoint;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${settings.apiKey}`,
  };

  // Construct payload based on model type
  const payload: any = {
    model: params.model,
    prompt: params.prompt,
    size: params.size,
    quality: params.quality,
    n: 1,
    response_format: "url",
  };

  // Add specific parameters only for Sora/Video models to strictly avoid 400 errors from DALL-E
  if (!isDalle) {
    if (params.style && params.style !== 'realistic') {
      payload.style = params.style;
    }
    // Pass duration if supported by custom proxy/endpoint
    // Some proxies prefer 'duration_seconds' or just 'duration'
    payload.duration = params.duration;
  }

  // Add seed if provided (supported by DALL-E 3 and likely Sora)
  if (params.seed !== undefined && params.seed !== null) {
    payload.seed = params.seed;
  }

  try {
    const response = await fetch(finalEndpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || `API Request Failed: ${response.status} ${response.statusText}`);
    }

    return data as VideoResponse;
  } catch (error: any) {
    console.error("Generation Error:", error);
    throw new Error(error.message || "Network error occurred");
  }
};