export interface AppSettings {
  baseUrl: string;
  apiKey: string;
}

export interface GenerationParams {
  prompt: string;
  model: string;
  size: string;
  quality: string;
  duration: number; // in seconds
  style: string;
  seed?: number;
}

export interface VideoResponse {
  created: number;
  data: Array<{
    url?: string;
    b64_json?: string;
    revised_prompt?: string;
  }>;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface GenerationError {
  message: string;
  code?: string;
}