import React, { useState } from 'react';
import { Upload, Sparkles, X, Image as ImageIcon, CheckCircle2, AlertCircle, Globe, Loader2 } from 'lucide-react';
import { MagazineEdition } from '../types/magazine';

interface CreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMagazineCreated: (edition: MagazineEdition) => void;
}

export const CreationModal: React.FC<CreationModalProps> = ({
  isOpen,
  onClose,
  onMagazineCreated,
}) => {
  const [photoBase64, setPhotoBase64] = useState<string>('');
  const [photoPreview, setPhotoPreview] = useState<string>('/src/assets/images/marcos_editorial_portrait_1790801393723.jpg');
  const [contextText, setContextText] = useState<string>(
    'Marcos participou de um evento de empreendedorismo e falou sobre inteligência artificial, negócios e o futuro do trabalho.'
  );
  const [stylePreference, setStylePreference] = useState<string>('auto');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSearchingGrounding, setIsSearchingGrounding] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleEnrichWithGoogleSearch = async () => {
    if (!contextText.trim()) return;
    setIsSearchingGrounding(true);
    try {
      const res = await fetch('/api/search-grounded-context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: contextText }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.groundedText) {
          setContextText((prev) => `${prev}\n\n[DADOS VERIFICADOS GOOGLE SEARCH]:\n${data.groundedText}`);
        }
      }
    } catch (e) {
      console.warn('Could not ground context:', e);
    } finally {
      setIsSearchingGrounding(false);
    }
  };

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPhotoBase64(result);
      setPhotoPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleUseDemoPhoto = () => {
    setPhotoBase64('');
    setPhotoPreview('/src/assets/images/marcos_editorial_portrait_1790801393723.jpg');
    setContextText(
      'Marcos participou de um evento de empreendedorismo e falou sobre inteligência artificial, negócios e o futuro do trabalho.'
    );
  };

  const handlePresetSelection = (presetContext: string) => {
    setContextText(presetContext);
  };

  const handleCreateMagazine = async () => {
    if (!contextText.trim()) {
      setErrorMsg('Por favor, informe o contexto ou tema da revista.');
      return;
    }

    setErrorMsg('');
    setIsGenerating(true);
    setGenerationStep('Etapa 1: Análise visual profunda e preservação de identidade com Gemini 3.1 Pro...');

    try {
      // Simulate step progression messages for enhanced user feedback
      const stepTimer1 = setTimeout(() => {
        setGenerationStep('Etapa 2 a 5: Definindo identidade, paleta, masthead e direção de arte...');
      }, 1500);

      const stepTimer2 = setTimeout(() => {
        setGenerationStep('Etapa 6 a 12: Redigindo matéria em 12 páginas sem inventar aspas...');
      }, 3500);

      const stepTimer3 = setTimeout(() => {
        setGenerationStep('Etapa 13: Executando auditoria interna e conferência de diagramação...');
      }, 5500);

      const response = await fetch('/api/architect-magazine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: photoBase64 || null,
          contextText,
          stylePreference: stylePreference !== 'auto' ? stylePreference : undefined,
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Falha ao arquitetar revista.');
      }

      const data = await response.json();
      if (data.magazine) {
        // Guarantee photo url persistence
        const createdMagazine: MagazineEdition = {
          ...data.magazine,
          id: `edition-${Date.now()}`,
          primaryPhotoUrl: photoPreview,
          activePhotoFilter: data.magazine.photoAnalysis?.recommendedPhotoTreatment || 'natural',
        };
        onMagazineCreated(createdMagazine);
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Ocorreu um erro ao processar. Tente novamente.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-[#171513] border border-[#2b2723] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2b2723] bg-[#141210]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c49b66]" />
            <h2 className="text-base font-serif-display font-bold uppercase tracking-wider text-[#f5f1e8]">
              MAGAZINE ARCHITECT · Estúdio Autônomo
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="text-[#8a857b] hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#dedad1]">
          {/* Subtitle / Rules */}
          <div className="text-xs font-sans-body text-[#9e998f] leading-relaxed border-l-2 border-[#c49b66] pl-3">
            Forneça apenas uma <strong className="text-white">Foto</strong> e um{' '}
            <strong className="text-white">Contexto</strong>. O sistema toma sozinho todas as decisões de design, jornalismo, direção de arte, tipografia e diagramação em 12 páginas.
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Photo & Context Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left: Photo Upload & Preview (5 cols) */}
            <div className="md:col-span-5 flex flex-col gap-3">
              <label className="text-xs font-sans-body uppercase tracking-wider font-semibold text-[#c49b66]">
                1. Foto Fornecida [Obrigatório]
              </label>

              <div className="relative aspect-[3/4] w-full bg-[#1e1c19] border-2 border-dashed border-[#3a352e] hover:border-[#c49b66] rounded-md overflow-hidden transition-colors flex flex-col items-center justify-center p-3 text-center group cursor-pointer">
                {photoPreview ? (
                  <>
                    <img
                      src={photoPreview}
                      alt="Prévia da foto"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-xs text-white p-3 gap-2">
                      <Upload className="w-5 h-5 text-[#c49b66]" />
                      <span>Clique para substituir a foto</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-xs text-[#8a857b]">
                    <ImageIcon className="w-8 h-8 text-[#5c574e]" />
                    <span>Arraste ou clique para carregar a foto</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={isGenerating}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              <button
                type="button"
                onClick={handleUseDemoPhoto}
                disabled={isGenerating}
                className="text-[11px] font-sans-body uppercase tracking-wider text-[#c49b66] hover:underline self-start"
              >
                Usar foto de demonstração (Marcos no fórum)
              </button>
            </div>

            {/* Right: Context & Themes (7 cols) */}
            <div className="md:col-span-7 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-sans-body uppercase tracking-wider font-semibold text-[#c49b66]">
                  2. Contexto ou Tema [Obrigatório]
                </label>

                <button
                  type="button"
                  onClick={handleEnrichWithGoogleSearch}
                  disabled={isGenerating || isSearchingGrounding || !contextText.trim()}
                  className="flex items-center gap-1.5 text-[10px] font-sans-body uppercase tracking-wider text-[#c49b66] hover:text-[#d6af7c] disabled:opacity-40 transition-colors"
                  title="Consultar Google Search para obter dados factuais verificados"
                >
                  {isSearchingGrounding ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Globe className="w-3 h-3" />
                  )}
                  <span>{isSearchingGrounding ? 'Consultando Google...' : 'Enriquecer com Google Search'}</span>
                </button>
              </div>

              <textarea
                value={contextText}
                onChange={(e) => setContextText(e.target.value)}
                disabled={isGenerating}
                rows={5}
                placeholder="Exemplo: Marcos participou de um evento de empreendedorismo e falou sobre inteligência artificial, negócios e o futuro do trabalho."
                className="w-full bg-[#1e1c19] text-[#f5f1e8] text-xs font-sans-body p-3.5 rounded border border-[#3b3630] focus:outline-none focus:border-[#c49b66] leading-relaxed resize-none"
              />

              {/* Quick Inspiration Context Presets */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] uppercase tracking-wider text-[#736f66] block">
                  Exemplos de Contextos Rápidos:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      handlePresetSelection(
                        'Marcos participou de um evento de empreendedorismo e falou sobre inteligência artificial, negócios e o futuro do trabalho.'
                      )
                    }
                    className="text-[10px] font-sans-body bg-[#211f1c] hover:bg-[#2b2723] text-[#c0bcb3] px-2.5 py-1 rounded border border-[#332f2a] transition-colors"
                  >
                    Marcos · IA & Futuro do Trabalho
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handlePresetSelection(
                        'Dra. Helena apresentou no congresso internacional sua nova pesquisa sobre sustentabilidade marinha, descarbonização e inovação circular.'
                      )
                    }
                    className="text-[10px] font-sans-body bg-[#211f1c] hover:bg-[#2b2723] text-[#c0bcb3] px-2.5 py-1 rounded border border-[#332f2a] transition-colors"
                  >
                    Helena · Sustentabilidade & Inovação
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handlePresetSelection(
                        'Fundador discursou sobre criação de startups em mercados emergentes, liderança sob incerteza e cultura organizacional.'
                      )
                    }
                    className="text-[10px] font-sans-body bg-[#211f1c] hover:bg-[#2b2723] text-[#c0bcb3] px-2.5 py-1 rounded border border-[#332f2a] transition-colors"
                  >
                    Liderança em Startups & Cultura
                  </button>
                </div>
              </div>

              {/* Optional Style Direction */}
              <div className="pt-2">
                <label className="text-[11px] font-sans-body uppercase tracking-wider text-[#8c877e] block mb-1">
                  Estilo Editorial (Opcional):
                </label>
                <select
                  value={stylePreference}
                  onChange={(e) => setStylePreference(e.target.value)}
                  disabled={isGenerating}
                  className="w-full bg-[#1e1c19] text-[#f5f1e8] text-xs font-sans-body px-3 py-2 rounded border border-[#3b3630] focus:outline-none focus:border-[#c49b66]"
                >
                  <option value="auto">Automático (O Magazine Architect decide o melhor estilo)</option>
                  <option value="atlantic_journalistic">Jornalístico Atemporal (Estilo Atlantic / The New Yorker)</option>
                  <option value="wired_modern">Tecnologia & Vanguarda (Estilo Wired / Fast Company)</option>
                  <option value="forbes_business">Negócios & Estratégia (Estilo Forbes / Harvard Business)</option>
                  <option value="kinfolk_minimal">Minimalista & Curatorial (Estilo Kinfolk / Monocle)</option>
                  <option value="vogue_prestige">Alta Direção de Arte (Estilo Vogue / Vanity Fair)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Autonomous Status Bar when generating */}
          {isGenerating && (
            <div className="p-4 bg-[#1b1917] border border-[#c49b66]/40 rounded flex flex-col gap-2 animate-pulse">
              <div className="flex items-center gap-2 text-xs font-sans-body text-[#c49b66] font-semibold">
                <Sparkles className="w-4 h-4 animate-spin text-[#c49b66]" />
                <span>MAGAZINE ARCHITECT EM EXECUÇÃO AUTÔNOMA</span>
              </div>
              <p className="text-xs font-sans-body text-[#dfdacd]">{generationStep}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#2b2723] bg-[#141210]">
          <div className="text-[11px] font-sans-body text-[#736f66] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#c49b66]" />
            <span>Gemini 3.1 Pro com High Thinking ativo</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2 text-xs font-sans-body uppercase tracking-wider text-[#a8a39a] hover:text-white transition-colors"
            >
              Cancelar
            </button>

            <button
              onClick={handleCreateMagazine}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2 text-xs font-sans-body uppercase tracking-wider font-semibold text-[#0f0e0d] bg-[#c49b66] hover:bg-[#d6af7c] rounded transition-all shadow-md disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Arquitetando Revista...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Gerar Revista Autônoma</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
