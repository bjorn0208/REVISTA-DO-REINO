import React, { useState } from 'react';
import { X, Sparkles, Video, Play, Loader2, AlertCircle, Film, RefreshCw } from 'lucide-react';

interface VeoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryPhotoUrl: string;
}

export const VeoVideoModal: React.FC<VeoVideoModalProps> = ({
  isOpen,
  onClose,
  primaryPhotoUrl,
}) => {
  const [prompt, setPrompt] = useState<string>(
    'Cinematic slow zoom-in on the executive speaker in the auditorium, warm cinematic rim lighting, Leica documentary film tone'
  );
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [usePhoto, setUsePhoto] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleGenerateVideo = async () => {
    setErrorMsg('');
    setVideoUrl('');
    setIsGenerating(true);
    setStatusMessage('Iniciando geração de vídeo com Veo 3 (veo-3.1-fast-generate-preview)...');

    try {
      // Step 1: Start operation
      const startRes = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          imageBase64: usePhoto ? primaryPhotoUrl : null,
          aspectRatio,
        }),
      });

      if (!startRes.ok) {
        const err = await startRes.json();
        throw new Error(err.error || 'Falha ao iniciar vídeo Veo.');
      }

      const { operationName } = await startRes.json();
      if (!operationName) {
        throw new Error('Operação de vídeo não retornada.');
      }

      // Step 2: Poll operation
      setStatusMessage('Renderizando quadros de vídeo e física de movimento...');
      let isDone = false;
      let attempts = 0;
      const maxAttempts = 60; // Up to ~3 minutes

      while (!isDone && attempts < maxAttempts) {
        attempts++;
        await new Promise((r) => setTimeout(r, 4000));
        setStatusMessage(
          `Processando renderização Veo 3 (${Math.min(95, Math.round((attempts / 15) * 100))}%)`
        );

        const statusRes = await fetch('/api/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName }),
        });

        if (statusRes.ok) {
          const statusData = await statusRes.json();
          if (statusData.done) {
            isDone = true;
            break;
          }
        }
      }

      if (!isDone) {
        throw new Error('A geração do vídeo excedeu o tempo limite. Tente novamente.');
      }

      // Step 3: Download video stream
      setStatusMessage('Finalizando e decodificando arquivo MP4...');
      const downloadRes = await fetch('/api/video-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operationName }),
      });

      if (!downloadRes.ok) {
        throw new Error('Falha ao baixar vídeo gerado.');
      }

      const blob = await downloadRes.blob();
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setStatusMessage('Vídeo gerado com sucesso!');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro ao gerar vídeo Veo.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#171513] border border-[#2b2723] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2b2723] bg-[#141210]">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-[#c49b66]" />
            <h2 className="text-base font-serif-display font-bold uppercase tracking-wider text-[#f5f1e8]">
              Gerador de Teaser Veo 3 (veo-3.1-fast-generate-preview)
            </h2>
          </div>
          <button onClick={onClose} className="text-[#8a857b] hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-[#dedad1]">
          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <p className="text-xs font-sans-body text-[#9e998f] leading-relaxed">
            Gere um vídeo documental cinematográfico para a capa ou matéria da revista usando o modelo{' '}
            <strong className="text-[#c49b66]">veo-3.1-fast-generate-preview</strong>. Anime a foto fornecida ou crie a partir de um prompt descritivo.
          </p>

          {/* Photo Animation Toggle */}
          <div className="flex items-center gap-3 p-3 bg-[#1e1c19] border border-[#2b2723] rounded">
            <input
              type="checkbox"
              id="usePhotoToggle"
              checked={usePhoto}
              onChange={(e) => setUsePhoto(e.target.checked)}
              className="accent-[#c49b66] w-4 h-4 rounded cursor-pointer"
            />
            <label htmlFor="usePhotoToggle" className="text-xs font-sans-body text-white cursor-pointer select-none">
              Animar a fotografia de capa fornecida pelo usuário (Image-to-Video)
            </label>
          </div>

          {/* Aspect Ratio Selection (16:9 vs 9:16 as specified) */}
          <div>
            <label className="text-xs font-sans-body uppercase tracking-wider font-semibold text-[#c49b66] block mb-1.5">
              Proporção do Vídeo:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                className={`p-2.5 rounded border text-xs font-sans-body transition-colors text-center ${
                  aspectRatio === '16:9'
                    ? 'bg-[#2b2721] text-[#c49b66] border-[#c49b66] font-bold'
                    : 'bg-[#1b1917] text-[#999] border-[#292622] hover:text-white'
                }`}
              >
                <span className="block font-mono">16:9 Landscape</span>
                <span className="block text-[10px] text-[#736f66] mt-0.5">Horizontal Cinema</span>
              </button>

              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                className={`p-2.5 rounded border text-xs font-sans-body transition-colors text-center ${
                  aspectRatio === '9:16'
                    ? 'bg-[#2b2721] text-[#c49b66] border-[#c49b66] font-bold'
                    : 'bg-[#1b1917] text-[#999] border-[#292622] hover:text-white'
                }`}
              >
                <span className="block font-mono">9:16 Portrait</span>
                <span className="block text-[10px] text-[#736f66] mt-0.5">Vertical Editorial</span>
              </button>
            </div>
          </div>

          {/* Prompt */}
          <div>
            <label className="text-xs font-sans-body uppercase tracking-wider font-semibold text-[#c49b66] block mb-1.5">
              Direção de Cena & Movimento de Câmera:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              rows={3}
              className="w-full bg-[#1e1c19] text-[#f5f1e8] text-xs font-sans-body p-3 rounded border border-[#3b3630] focus:outline-none focus:border-[#c49b66] resize-none"
            />
          </div>

          {/* Video Player Display */}
          {videoUrl && (
            <div className="mt-4 rounded-md overflow-hidden border border-[#c49b66]/40 bg-black aspect-video flex items-center justify-center">
              <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain" />
            </div>
          )}

          {isGenerating && (
            <div className="p-4 bg-[#1b1917] border border-[#c49b66]/40 rounded flex items-center gap-3 text-xs font-sans-body text-[#c49b66]">
              <Loader2 className="w-5 h-5 animate-spin text-[#c49b66] shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#2b2723] bg-[#141210]">
          <span className="text-[11px] font-mono text-[#736f66]">Veo 3 Engine · 720p HD</span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isGenerating}
              className="px-3 py-1.5 text-xs font-sans-body uppercase tracking-wider text-[#8a857b] hover:text-white transition-colors"
            >
              Fechar
            </button>

            <button
              onClick={handleGenerateVideo}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-1.5 text-xs font-sans-body uppercase tracking-wider font-semibold text-black bg-[#c49b66] hover:bg-[#d6af7c] rounded transition-colors disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Gerando Vídeo...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gerar Vídeo com Veo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
