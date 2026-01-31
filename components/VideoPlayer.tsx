import React from 'react';
import { GenerationStatus } from '../types';
import { Loader2, Play, Download, AlertTriangle, Sparkles } from 'lucide-react';

interface VideoPlayerProps {
  status: GenerationStatus;
  videoUrl: string | null;
  prompt: string;
  revisedPrompt?: string;
  error?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  status, 
  videoUrl, 
  prompt, 
  revisedPrompt,
  error 
}) => {
  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 relative bg-black/40 rounded-xl border border-slate-800 overflow-hidden group min-h-[300px] flex items-center justify-center">
        
        {/* IDLE STATE */}
        {status === GenerationStatus.IDLE && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
            <div className="w-20 h-20 mb-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
               <Play size={32} className="ml-1 opacity-50 group-hover:text-indigo-400 group-hover:opacity-100 transition-all" />
            </div>
            <h3 className="text-xl font-medium text-slate-300 mb-2">Ready to Generate</h3>
            <p className="max-w-md text-sm">
              Configure your parameters on the left and hit generate to create stunning videos with Sora-2.
            </p>
          </div>
        )}

        {/* LOADING STATE */}
        {status === GenerationStatus.LOADING && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-slate-950/80 backdrop-blur-sm">
            <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mb-6" />
            <h3 className="text-xl font-medium text-white animate-pulse">Generating Content...</h3>
            <p className="text-slate-400 mt-2 text-sm">This may take a minute or two.</p>
          </div>
        )}

        {/* ERROR STATE */}
        {status === GenerationStatus.ERROR && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-8 text-center">
             <div className="w-16 h-16 mb-4 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                <AlertTriangle size={32} />
             </div>
            <h3 className="text-xl font-medium text-red-400 mb-2">Generation Failed</h3>
            <p className="text-slate-400 max-w-lg text-sm">{error}</p>
          </div>
        )}

        {/* SUCCESS STATE */}
        {status === GenerationStatus.SUCCESS && videoUrl && (
          <div className="w-full h-full flex items-center justify-center bg-black relative">
            {/* Handle both Video and Image (fallback) output types visually */}
            {videoUrl.match(/\.(jpeg|jpg|png|webp)$/i) ? (
              <img 
                src={videoUrl} 
                alt={prompt}
                className="max-w-full max-h-full object-contain shadow-2xl"
              />
            ) : (
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                loop
                className="max-w-full max-h-full object-contain shadow-2xl"
              />
            )}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"></div>
          </div>
        )}
      </div>

      {/* Action & Info Bar */}
      {status === GenerationStatus.SUCCESS && videoUrl && (
        <div className="mt-4 flex flex-col gap-3 p-4 bg-slate-900 border border-slate-800 rounded-xl">
           <div className="flex items-start justify-between gap-4">
             <div className="flex-1 space-y-2">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1">
                    Your Prompt
                  </p>
                  <p className="text-sm text-slate-200 line-clamp-2">{prompt}</p>
                </div>
                {revisedPrompt && revisedPrompt !== prompt && (
                  <div>
                    <p className="text-xs text-indigo-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1">
                      <Sparkles size={10} /> Revised Prompt
                    </p>
                    <p className="text-sm text-slate-400 line-clamp-2 italic">{revisedPrompt}</p>
                  </div>
                )}
             </div>
             <a 
               href={videoUrl} 
               download={`sora-gen-${Date.now()}.mp4`} 
               target="_blank"
               rel="noreferrer"
               className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all text-sm font-medium border border-slate-700 hover:border-slate-600"
             >
               <Download size={16} />
               Download
             </a>
           </div>
        </div>
      )}
    </div>
  );
};