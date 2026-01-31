import React, { useState, useEffect } from 'react';
import { Settings, Sparkles, Video, Command, Layers, Clock, Zap, Hash, RotateCcw } from 'lucide-react';
import { SettingsModal } from './components/SettingsModal';
import { VideoPlayer } from './components/VideoPlayer';
import { generateVideo } from './services/api';
import { 
  AppSettings, 
  GenerationParams, 
  GenerationStatus, 
  VideoResponse 
} from './types';
import { 
  DEFAULT_BASE_URL, 
  AVAILABLE_MODELS, 
  ASPECT_RATIOS, 
  QUALITIES,
  STYLES 
} from './constants';

const App: React.FC = () => {
  // --- State ---
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    baseUrl: DEFAULT_BASE_URL,
    apiKey: '',
  });

  // Load settings from local storage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('sora_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  const saveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('sora_settings', JSON.stringify(newSettings));
  };

  const [params, setParams] = useState<GenerationParams>({
    prompt: '',
    model: AVAILABLE_MODELS[0].value,
    size: ASPECT_RATIOS[0].value,
    quality: QUALITIES[0].value,
    duration: 5,
    style: STYLES[0].value,
    seed: undefined
  });

  const [customModel, setCustomModel] = useState('');

  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [revisedPrompt, setRevisedPrompt] = useState<string | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // --- Handlers ---
  
  const handleGenerate = async () => {
    if (!settings.apiKey) {
      setIsSettingsOpen(true);
      return;
    }
    if (!params.prompt.trim()) {
      alert("Please enter a prompt describing the video you want to generate.");
      return;
    }

    const finalParams = {
      ...params,
      model: params.model === 'custom' ? customModel.trim() || 'sora-2' : params.model
    };

    setStatus(GenerationStatus.LOADING);
    setVideoUrl(null);
    setRevisedPrompt(undefined);
    setErrorMsg('');

    try {
      const response: VideoResponse = await generateVideo(settings, finalParams);
      
      if (response.data && response.data.length > 0 && response.data[0].url) {
        setVideoUrl(response.data[0].url);
        setRevisedPrompt(response.data[0].revised_prompt);
        setStatus(GenerationStatus.SUCCESS);
      } else {
        throw new Error("No media URL received in the response.");
      }
    } catch (err: any) {
      setStatus(GenerationStatus.ERROR);
      setErrorMsg(err.message || "An unknown error occurred.");
    }
  };

  const randomizeSeed = () => {
    setParams({ ...params, seed: Math.floor(Math.random() * 1000000000) });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      
      {/* --- Navbar --- */}
      <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md fixed top-0 left-0 right-0 z-40 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Video size={18} className="text-white" />
          </div>
          <h1 className="font-bold text-xl tracking-tight text-white">
            Sora-2 <span className="text-indigo-400 font-light">Studio</span>
          </h1>
        </div>
        
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-medium ${
            settings.apiKey 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20" 
              : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500"
          }`}
        >
          <Settings size={14} />
          {settings.apiKey ? "Configured" : "Settings"}
        </button>
      </header>

      {/* --- Main Content --- */}
      <main className="pt-24 pb-12 px-6 max-w-[1600px] mx-auto h-[calc(100vh-1rem)] flex flex-col lg:flex-row gap-8">
        
        {/* Left Panel: Controls */}
        <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          
          {/* Prompt Section */}
          <section className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-white">
              <Command size={16} className="text-indigo-400" />
              Prompt
            </label>
            <textarea
              value={params.prompt}
              onChange={(e) => setParams({ ...params, prompt: e.target.value })}
              placeholder="Describe your video in detail (e.g., A cinematic drone shot of a futuristic Tokyo with neon lights reflecting in rain puddles...)"
              className="w-full h-40 bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-shadow placeholder-slate-600 leading-relaxed"
            />
          </section>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 gap-6">
            
            {/* Model Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Layers size={14} /> Model
              </label>
              <div className="space-y-2">
                <div className="relative">
                  <select
                    value={params.model}
                    onChange={(e) => setParams({...params, model: e.target.value})}
                    className="w-full appearance-none bg-slate-900 border border-slate-700 text-white py-3 px-4 rounded-lg focus:outline-none focus:border-indigo-500 cursor-pointer text-sm"
                  >
                    {AVAILABLE_MODELS.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>
                {params.model === 'custom' && (
                  <input
                    type="text"
                    value={customModel}
                    onChange={(e) => setCustomModel(e.target.value)}
                    placeholder="Enter custom model ID..."
                    className="w-full bg-slate-950 border border-indigo-500/50 text-indigo-200 py-2.5 px-4 rounded-lg focus:outline-none focus:border-indigo-500 text-sm animate-in fade-in slide-in-from-top-1 duration-200"
                  />
                )}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Aspect Ratio</label>
              <div className="grid grid-cols-2 gap-2">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio.value}
                    onClick={() => setParams({ ...params, size: ratio.value })}
                    className={`px-3 py-2.5 rounded-lg text-xs font-medium border transition-all ${
                      params.size === ratio.value
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {ratio.label.split('(')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality & Style */}
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Zap size={14} /> Quality
                  </label>
                  <select
                    value={params.quality}
                    onChange={(e) => setParams({...params, quality: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 text-white py-2.5 px-3 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                  >
                    {QUALITIES.map(q => <option key={q.value} value={q.value}>{q.label}</option>)}
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Style</label>
                  <select
                    value={params.style}
                    onChange={(e) => setParams({...params, style: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 text-white py-2.5 px-3 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                  >
                    {STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
               </div>
            </div>
            
            {/* Duration */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                 <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                   <Clock size={14} /> Duration
                 </label>
                 <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">{params.duration}s</span>
              </div>
              <input 
                type="range" 
                min="3" 
                max="30" 
                step="1" 
                value={params.duration}
                onChange={(e) => setParams({...params, duration: parseInt(e.target.value)})}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
              />
               <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                  <span>3s</span>
                  <span>15s</span>
                  <span>30s</span>
               </div>
            </div>

            {/* Seed */}
            <div className="space-y-2">
               <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                 <Hash size={14} /> Seed
               </label>
               <div className="flex gap-2">
                 <input 
                   type="number" 
                   value={params.seed === undefined ? '' : params.seed}
                   onChange={(e) => setParams({ ...params, seed: e.target.value ? parseInt(e.target.value) : undefined })}
                   placeholder="Random"
                   className="flex-1 bg-slate-900 border border-slate-700 text-white py-2.5 px-3 rounded-lg focus:outline-none focus:border-indigo-500 text-sm placeholder-slate-600"
                 />
                 <button 
                   onClick={randomizeSeed}
                   title="Randomize"
                   className="p-2.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700 hover:border-slate-600"
                 >
                   <RotateCcw size={16} />
                 </button>
               </div>
            </div>

          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={status === GenerationStatus.LOADING}
            className={`mt-auto w-full py-4 rounded-xl font-bold text-lg shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
              status === GenerationStatus.LOADING
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-500/25'
            }`}
          >
            {status === GenerationStatus.LOADING ? (
              <>Generating...</>
            ) : (
              <>
                <Sparkles size={20} className="fill-white/20" />
                Generate Video
              </>
            )}
          </button>
        </div>

        {/* Right Panel: Preview */}
        <div className="flex-1 min-h-[400px] lg:h-auto rounded-2xl p-1 border border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-2xl">
          <VideoPlayer 
            status={status} 
            videoUrl={videoUrl} 
            prompt={params.prompt}
            revisedPrompt={revisedPrompt}
            error={errorMsg}
          />
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentSettings={settings}
        onSave={saveSettings}
      />
    </div>
  );
};

export default App;