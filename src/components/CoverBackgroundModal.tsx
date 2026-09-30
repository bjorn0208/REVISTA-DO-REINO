import React, { useState } from 'react';
import {
  X,
  Upload,
  Sparkles,
  Image as ImageIcon,
  Check,
  Loader2,
  Sliders,
  Palette,
  Camera,
  Layers,
  SunMedium,
  CheckCircle2,
} from 'lucide-react';
import { MagazineEdition, PhotoFilterType } from '../types/magazine';

interface CoverBackgroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  edition: MagazineEdition;
  onApplyBackground: (newPhotoUrl: string, filter?: PhotoFilterType, scrimIntensity?: string, photoPosition?: string) => void;
}

export const CoverBackgroundModal: React.FC<CoverBackgroundModalProps> = ({
  isOpen,
  onClose,
  edition,
  onApplyBackground,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'ai' | 'gallery' | 'adjust'>('upload');
  
  // Selected background state
  const currentCoverPhoto =
    edition.pages.find((p) => p.pageNumber === 1)?.imageSlot?.customImageUrl || edition.primaryPhotoUrl;
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string>(currentCoverPhoto);
  const [selectedFilter, setSelectedFilter] = useState<PhotoFilterType>(edition.activePhotoFilter || 'natural');
  const [scrimIntensity, setScrimIntensity] = useState<string>('balanced');
  const [photoPosition, setPhotoPosition] = useState<string>('object-top');
  
  // Upload state
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // AI Generation state
  const [aiPrompt, setAiPrompt] = useState<string>('Retrato editorial executivo em auditório contemporâneo, iluminação suave lateral de estúdio, atmosfera de prestígio');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [aiGeneratedUrl, setAiGeneratedUrl] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string>('');

  if (!isOpen) return null;

  // Preset gallery images
  const presetGallery = [
    {
      title: 'Retrato Editorial de Marcos (Original)',
      desc: 'Fotografia de liderança e autoridade intelectual',
      url: '/src/assets/images/marcos_editorial_portrait_1790801393723.jpg',
      category: 'Retrato de Liderança',
    },
    {
      title: 'Skyline Corporativo Metropolitano',
      desc: 'Fachada arquitetônica com luzes crepusculares',
      url: '/src/assets/images/skyline_corporate_minimalist_1790803073547.jpg',
      category: 'Arquitetura & Negócios',
    },
    {
      title: 'Estúdio Executivo Contemporâneo',
      desc: 'Iluminação tungstênio quente e textura de concreto',
      url: '/src/assets/images/modern_executive_studio_1790803090854.jpg',
      category: 'Minimalismo & Design',
    },
    {
      title: 'Palco Arquitetônico Summit Stage',
      desc: 'Painéis acústicos em madeira e atmosfera de simpósio',
      url: '/src/assets/images/editorial_summit_hall_1790801404528.jpg',
      category: 'Fórum & Eventos',
    },
  ];

  // AI Prompt quick chips
  const promptChips = [
    'Retrato editorial executivo com iluminação suave e olhar confiante',
    'Auditório futurista com painéis de madeira e luz arquitetônica',
    'Edifício corporativo de alta tecnologia ao entardecer',
    'Conceito abstrato de dados e inteligência artificial em bronze escuro',
  ];

  // Handle local file upload
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (JPEG, PNG, WebP).');
      return;
    }
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const resultBase64 = e.target.result as string;
        setSelectedPhotoUrl(resultBase64);
        setIsUploading(false);
      }
    };
    reader.onerror = () => {
      setIsUploading(false);
      alert('Erro ao carregar imagem.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Generate image using Gemini AI
  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setAiError('');

    try {
      const response = await fetch('/api/generate-editorial-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${aiPrompt}, vertical magazine cover photography, 3:4 aspect ratio, high fashion editorial lighting, ultra high definition`,
          aspectRatio: '3:4',
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Falha ao gerar imagem com IA.');
      }

      const data = await response.json();
      if (data.imageUrl) {
        setAiGeneratedUrl(data.imageUrl);
        setSelectedPhotoUrl(data.imageUrl);
      } else {
        throw new Error('Nenhuma imagem foi retornada pelo modelo.');
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Erro ao conectar à API de geração.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    onApplyBackground(selectedPhotoUrl, selectedFilter, scrimIntensity, photoPosition);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-[#171513] border border-[#2b2723] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2b2723] bg-[#141210]">
          <div className="flex items-center gap-2.5">
            <Camera className="w-5 h-5 text-[#c49b66]" />
            <div>
              <h2 className="text-base font-serif-display font-bold uppercase tracking-wider text-[#f5f1e8]">
                Trocar Fundo da Capa
              </h2>
              <p className="text-[11px] font-sans-body text-[#8a857b]">
                Personalize a foto principal da revista <span className="text-[#c49b66]">{edition.name}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#8a857b] hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-[#24211d] bg-[#121110] px-6 text-xs uppercase tracking-wider font-sans-body">
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-3 px-3.5 border-b-2 font-medium flex items-center gap-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-[#c49b66] text-[#c49b66]'
                : 'border-transparent text-[#8a857b] hover:text-[#e8e5df]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Enviar Foto</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`py-3 px-3.5 border-b-2 font-medium flex items-center gap-2 transition-colors ${
              activeTab === 'ai'
                ? 'border-[#c49b66] text-[#c49b66]'
                : 'border-transparent text-[#8a857b] hover:text-[#e8e5df]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#c49b66]" />
            <span>Gerar com IA</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`py-3 px-3.5 border-b-2 font-medium flex items-center gap-2 transition-colors ${
              activeTab === 'gallery'
                ? 'border-[#c49b66] text-[#c49b66]'
                : 'border-transparent text-[#8a857b] hover:text-[#e8e5df]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Galeria de Fundos</span>
          </button>

          <button
            onClick={() => setActiveTab('adjust')}
            className={`py-3 px-3.5 border-b-2 font-medium flex items-center gap-2 transition-colors ${
              activeTab === 'adjust'
                ? 'border-[#c49b66] text-[#c49b66]'
                : 'border-transparent text-[#8a857b] hover:text-[#e8e5df]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Filtro & Luz</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: UPLOAD */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center transition-colors ${
                  dragActive
                    ? 'border-[#c49b66] bg-[#c49b66]/10'
                    : 'border-[#332f2a] hover:border-[#c49b66]/60 bg-[#121110]'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-[#1e1c19] border border-[#332f2a] flex items-center justify-center mb-3 text-[#c49b66]">
                  {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                </div>

                <div className="space-y-1 mb-4">
                  <p className="text-sm font-serif-display font-medium text-white">
                    Arraste e solte sua foto aqui
                  </p>
                  <p className="text-xs font-sans-body text-[#8a857b]">
                    Formatos aceitos: JPG, PNG, WEBP (resolução vertical recomendada)
                  </p>
                </div>

                <label className="cursor-pointer px-4 py-2 bg-[#c49b66] hover:bg-[#d6af7c] text-black font-semibold text-xs uppercase tracking-wider font-sans-body rounded shadow-xs transition-colors">
                  <span>Selecionar do Dispositivo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>

              <div className="p-3 bg-[#1e1c19] rounded border border-[#2b2723] flex items-center justify-between text-xs text-[#a09b91]">
                <span>Dica: Fotos verticais com espaço livre na parte superior favorecem o nome da revista.</span>
              </div>
            </div>
          )}

          {/* TAB 2: AI GENERATION */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              {aiError && (
                <div className="p-3.5 bg-amber-950/60 border border-amber-800 text-amber-200 text-xs rounded space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-amber-100">{aiError}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab('gallery')}
                      className="px-2.5 py-1 bg-[#1e1c19] hover:bg-[#2b2723] text-[#c49b66] border border-[#c49b66]/50 rounded text-[11px] font-sans-body uppercase tracking-wider font-semibold"
                    >
                      Ver Galeria Editorial
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('upload')}
                      className="px-2.5 py-1 bg-[#1e1c19] hover:bg-[#2b2723] text-white border border-white/30 rounded text-[11px] font-sans-body uppercase tracking-wider"
                    >
                      Enviar Minha Foto
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-sans-body uppercase tracking-wider font-semibold text-[#c49b66] block">
                  Descreva o Fundo Fotográfico Desejado:
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={3}
                  className="w-full bg-[#121110] border border-[#332f2a] focus:border-[#c49b66] text-[#dedad1] text-xs p-3 rounded leading-relaxed focus:outline-none"
                  placeholder="Ex: Retrato de pessoa em palco de inovação tecnológica, luz de estúdio e profundidade de campo..."
                />
              </div>

              {/* Quick Prompt Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-sans-body text-[#78746c] block">Sugestões de Direção de Arte:</span>
                <div className="flex flex-wrap gap-1.5">
                  {promptChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => setAiPrompt(chip)}
                      className="text-[11px] font-sans-body px-2.5 py-1 bg-[#1e1c19] hover:bg-[#2b2723] text-[#b0aba0] hover:text-white rounded border border-[#332f2a] transition-colors text-left"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleGenerateAI}
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#c49b66] hover:bg-[#d6af7c] text-black font-semibold text-xs uppercase tracking-wider rounded transition-colors disabled:opacity-50 shadow-xs"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Gerando Imagem com IA...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Gerar Novo Fundo Editorial (3:4)</span>
                    </>
                  )}
                </button>
              </div>

              {aiGeneratedUrl && (
                <div className="p-3 bg-green-950/40 border border-green-800 text-green-200 text-xs rounded flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>Imagem gerada e aplicada com sucesso ao pré-visualizador abaixo!</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: GALLERY PRESETS */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <p className="text-xs font-sans-body text-[#8a857b]">
                Selecione um dos fundos fotográficos de alta fidelidade artística pré-selecionados para a capa:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {presetGallery.map((preset, idx) => {
                  const isSelected = selectedPhotoUrl === preset.url;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedPhotoUrl(preset.url)}
                      className={`group relative p-2.5 rounded-lg border cursor-pointer transition-all flex gap-3 ${
                        isSelected
                          ? 'border-[#c49b66] bg-[#1e1c19] ring-1 ring-[#c49b66]'
                          : 'border-[#2b2723] hover:border-[#403b34] bg-[#121110]'
                      }`}
                    >
                      <div className="w-20 h-24 rounded overflow-hidden shrink-0 bg-black relative">
                        <img
                          src={preset.url}
                          alt={preset.title}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-[#c49b66] rounded-full flex items-center justify-center text-black">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col justify-between py-0.5">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#c49b66]">
                            {preset.category}
                          </span>
                          <h4 className="text-xs font-serif-display font-bold text-white leading-snug">
                            {preset.title}
                          </h4>
                          <p className="text-[11px] font-sans-body text-[#8a857b] line-clamp-2 mt-0.5">
                            {preset.desc}
                          </p>
                        </div>

                        <span className="text-[10px] uppercase font-sans-body tracking-wider text-[#a09b91]">
                          {isSelected ? '✓ Selecionado' : 'Clique para usar'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: ADJUSTMENTS & FILTER */}
          {activeTab === 'adjust' && (
            <div className="space-y-5">
              {/* Photo Filter */}
              <div className="space-y-2">
                <label className="text-xs font-sans-body uppercase tracking-wider font-semibold text-[#c49b66] flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" />
                  <span>Tratamento Fotográfico Editorial:</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: 'Natural / Fidedigno', value: 'natural' },
                    { label: 'Monocromático Alta Densidade', value: 'monochrome' },
                    { label: 'Duotone Editorial', value: 'editorial-duotone' },
                    { label: 'Granulação Analógica', value: 'film-grain' },
                    { label: 'Sépia Curatorial', value: 'curatorial-sepia' },
                    { label: 'Bronze Dourado', value: 'bronze-glow' },
                  ].map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setSelectedFilter(f.value as PhotoFilterType)}
                      className={`px-3 py-2 text-xs font-sans-body text-left rounded border transition-colors ${
                        selectedFilter === f.value
                          ? 'border-[#c49b66] bg-[#24211e] text-[#c49b66] font-medium'
                          : 'border-[#2b2723] hover:border-[#3d372e] bg-[#121110] text-[#9e998f]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrim Contrast */}
              <div className="space-y-2">
                <label className="text-xs font-sans-body uppercase tracking-wider font-semibold text-[#c49b66] flex items-center gap-1.5">
                  <SunMedium className="w-3.5 h-3.5" />
                  <span>Intensidade da Máscara Escura (Legibilidade do Texto):</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'light', label: 'Suave (Mais foto)' },
                    { id: 'balanced', label: 'Equilibrada (Padrão)' },
                    { id: 'deep', label: 'Intensa (Mais contraste)' },
                    { id: 'dramatic', label: 'Dramática (Foco letras)' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setScrimIntensity(s.id)}
                      className={`px-3 py-2 text-xs font-sans-body text-center rounded border transition-colors ${
                        scrimIntensity === s.id
                          ? 'border-[#c49b66] bg-[#24211e] text-[#c49b66] font-medium'
                          : 'border-[#2b2723] hover:border-[#3d372e] bg-[#121110] text-[#9e998f]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Framing Alignment */}
              <div className="space-y-2">
                <label className="text-xs font-sans-body uppercase tracking-wider font-semibold text-[#c49b66] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Enquadramento Vertical:</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'object-top', label: 'Foco no Topo (Rosto)' },
                    { id: 'object-center', label: 'Foco Central' },
                    { id: 'object-bottom', label: 'Foco na Base' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPhotoPosition(p.id)}
                      className={`px-3 py-2 text-xs font-sans-body text-center rounded border transition-colors ${
                        photoPosition === p.id
                          ? 'border-[#c49b66] bg-[#24211e] text-[#c49b66] font-medium'
                          : 'border-[#2b2723] hover:border-[#3d372e] bg-[#121110] text-[#9e998f]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Current Selection Live Preview Bar */}
          <div className="p-3.5 bg-[#121110] border border-[#2b2723] rounded-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-16 rounded overflow-hidden bg-black border border-[#3b3630] shrink-0">
                <img
                  src={selectedPhotoUrl}
                  alt="Prévia do fundo"
                  className={`w-full h-full object-cover ${photoPosition}`}
                />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase text-[#c49b66] block">
                  Foto de Fundo Selecionada
                </span>
                <span className="text-xs font-sans-body text-white font-medium">
                  Pronta para aplicar na Capa
                </span>
              </div>
            </div>

            <button
              onClick={handleApply}
              className="px-5 py-2 bg-[#c49b66] hover:bg-[#d6af7c] text-black font-semibold text-xs uppercase tracking-wider font-sans-body rounded shadow-xs transition-colors shrink-0"
            >
              Aplicar na Capa
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#2b2723] bg-[#141210]">
          <span className="text-[11px] font-sans-body text-[#736f66]">
            A alteração é refletida em tempo real na capa e no leitor.
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-sans-body uppercase tracking-wider text-[#8a857b] hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-1.5 text-xs font-sans-body uppercase tracking-wider font-semibold text-black bg-[#c49b66] hover:bg-[#d6af7c] rounded transition-colors"
            >
              Salvar Fundo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
