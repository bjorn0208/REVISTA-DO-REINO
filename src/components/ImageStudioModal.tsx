import React, { useState } from 'react';
import { X, Sparkles, Image as ImageIcon, Check, Download, Layers, Wand2, Upload } from 'lucide-react';

interface ImageStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyImageToPage: (pageNumber: number, imageUrl: string) => void;
}

export const ImageStudioModal: React.FC<ImageStudioModalProps> = ({
  isOpen,
  onClose,
  onApplyImageToPage,
}) => {
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [prompt, setPrompt] = useState<string>(
    'Minimalist architectural auditorium stage, warm acoustic wood panels, subtle atmospheric spotlighting, quiet luxury editorial'
  );
  const [editPrompt, setEditPrompt] = useState<string>(
    'Adicionar iluminação cinematográfica quente de recorte lateral e textura de filme analógico suave'
  );
  const [aspectRatio, setAspectRatio] = useState<string>('3:4');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [inputImageToEdit, setInputImageToEdit] = useState<string>('');
  const [selectedTargetPage, setSelectedTargetPage] = useState<number>(3);
  const [appliedSuccess, setAppliedSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  // Exact aspect ratio choices required by the prompt
  const aspectRatios = [
    { label: '1:1', desc: 'Quadrado / Ícone' },
    { label: '2:3', desc: 'Retrato Clássico 35mm' },
    { label: '3:2', desc: 'Paisagem Clássica' },
    { label: '3:4', desc: 'Revista / Livro Vertical' },
    { label: '4:3', desc: 'Editorial Standard' },
    { label: '9:16', desc: 'Vertical Story / Mobile' },
    { label: '16:9', desc: 'Cinemático / Cabeçalho' },
    { label: '21:9', desc: 'Ultra-Panorâmico' },
  ];

  const handleImageUploadToEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setInputImageToEdit(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAction = async () => {
    const activePrompt = mode === 'create' ? prompt : editPrompt;
    if (!activePrompt.trim()) {
      setErrorMsg('Por favor, informe uma descrição para a fotografia.');
      return;
    }

    setErrorMsg('');
    setIsGenerating(true);
    setAppliedSuccess(false);

    try {
      if (mode === 'create') {
        const response = await fetch('/api/generate-editorial-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: activePrompt,
            aspectRatio,
            imageSize: '1K',
          }),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Falha ao gerar imagem.');
        }

        const data = await response.json();
        if (data.imageUrl) {
          setGeneratedImage(data.imageUrl);
        }
      } else {
        // Edit mode using gemini-3.1-flash-image
        const response = await fetch('/api/edit-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: activePrompt,
            inputImageBase64: inputImageToEdit || generatedImage || null,
            aspectRatio,
          }),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Falha ao editar imagem.');
        }

        const data = await response.json();
        if (data.imageUrl) {
          setGeneratedImage(data.imageUrl);
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro ao processar fotografia editorial.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (!generatedImage) return;
    onApplyImageToPage(selectedTargetPage, generatedImage);
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-[#171513] border border-[#2b2723] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2b2723] bg-[#141210]">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#c49b66]" />
            <h2 className="text-base font-serif-display font-bold uppercase tracking-wider text-[#f5f1e8]">
              Estúdio de Imagens · Criar, Editar & Proporções (Aspect Ratio)
            </h2>
          </div>
          <button onClick={onClose} className="text-[#8a857b] hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#dedad1]">
          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded">
              {errorMsg}
            </div>
          )}

          {/* Mode Selector (Create vs Edit) */}
          <div className="flex items-center gap-2 p-1 bg-[#1e1c19] rounded-md border border-[#2b2723] w-fit">
            <button
              onClick={() => setMode('create')}
              className={`px-3 py-1.5 text-xs font-sans-body uppercase tracking-wider font-semibold rounded transition-colors ${
                mode === 'create'
                  ? 'bg-[#c49b66] text-black shadow-xs'
                  : 'text-[#8a857b] hover:text-white'
              }`}
            >
              Criar Nova Imagem
            </button>
            <button
              onClick={() => setMode('edit')}
              className={`px-3 py-1.5 text-xs font-sans-body uppercase tracking-wider font-semibold rounded transition-colors ${
                mode === 'edit'
                  ? 'bg-[#c49b66] text-black shadow-xs'
                  : 'text-[#8a857b] hover:text-white'
              }`}
            >
              Editar Imagem com Prompt (Gemini Flash Image)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left: Aspect Ratio Controls and Prompt (6 cols) */}
            <div className="md:col-span-6 flex flex-col gap-4">
              <div>
                <label className="text-xs font-sans-body uppercase tracking-wider font-semibold text-[#c49b66] block mb-1.5">
                  1. Seleção de Proporção (Aspect Ratio):
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {aspectRatios.map((ratio) => (
                    <button
                      key={ratio.label}
                      onClick={() => setAspectRatio(ratio.label)}
                      className={`p-2 rounded text-center transition-colors border ${
                        aspectRatio === ratio.label
                          ? 'bg-[#2b2721] text-[#c49b66] border-[#c49b66] font-bold shadow-xs'
                          : 'bg-[#1b1917] text-[#999] border-[#292622] hover:text-white hover:bg-[#24211e]'
                      }`}
                    >
                      <span className="block text-xs font-mono">{ratio.label}</span>
                      <span className="block text-[9px] text-[#736f66] truncate mt-0.5">
                        {ratio.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {mode === 'edit' && (
                <div>
                  <label className="text-xs font-sans-body uppercase tracking-wider font-semibold text-[#c49b66] block mb-1.5">
                    2. Imagem Base para Edição:
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans-body bg-[#1e1c19] hover:bg-[#292622] text-[#c0bcb3] border border-[#3b3630] rounded cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Carregar imagem para editar</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUploadToEdit}
                        className="hidden"
                      />
                    </label>
                    {inputImageToEdit && (
                      <span className="text-[11px] text-green-400 font-mono">Imagem carregada</span>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-sans-body uppercase tracking-wider font-semibold text-[#c49b66] block mb-1.5">
                  {mode === 'create' ? '2. Prompt de Fotografia Editorial:' : '3. Instrução de Edição / Modificação:'}
                </label>
                <textarea
                  value={mode === 'create' ? prompt : editPrompt}
                  onChange={(e) =>
                    mode === 'create' ? setPrompt(e.target.value) : setEditPrompt(e.target.value)
                  }
                  rows={4}
                  placeholder={
                    mode === 'create'
                      ? 'Descreva a fotografia editorial desejada...'
                      : 'Ex: Adicionar iluminação dramática de recorte e aumentar nitidez analógica...'
                  }
                  className="w-full bg-[#1e1c19] text-[#f5f1e8] text-xs font-sans-body p-3 rounded border border-[#3b3630] focus:outline-none focus:border-[#c49b66] resize-none"
                />
              </div>

              {mode === 'create' && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#736f66] block">
                    Sugestões Rápidas:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setPrompt(
                          'Minimalist architectural auditorium stage, warm acoustic wood panels, subtle atmospheric spotlighting, quiet luxury editorial'
                        )
                      }
                      className="text-[10px] font-sans-body bg-[#211f1c] hover:bg-[#2b2723] text-[#b0aba0] px-2 py-0.5 rounded border border-[#332f2a]"
                    >
                      Palco & Arquitetura
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPrompt(
                          'Close-up of sleek titanium notebook, fountain pen and modern conceptual glass model on travertine desk, Leica 35mm shallow depth of field'
                        )
                      }
                      className="text-[10px] font-sans-body bg-[#211f1c] hover:bg-[#2b2723] text-[#b0aba0] px-2 py-0.5 rounded border border-[#332f2a]"
                    >
                      Mesa de Trabalho Travertino
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPrompt(
                          'Atmospheric skyline of futuristic sustainable city at dusk, soft golden light reflections on organic glass towers, architectural monograph aesthetic'
                        )
                      }
                      className="text-[10px] font-sans-body bg-[#211f1c] hover:bg-[#2b2723] text-[#b0aba0] px-2 py-0.5 rounded border border-[#332f2a]"
                    >
                      Cidade Sustentável
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleAction}
                disabled={isGenerating}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-sans-body uppercase tracking-wider font-semibold text-black bg-[#c49b66] hover:bg-[#d6af7c] rounded transition-colors disabled:opacity-50 mt-1"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Processando Imagem com Gemini Flash Image...</span>
                  </>
                ) : (
                  <>
                    {mode === 'create' ? <Sparkles className="w-4 h-4" /> : <Wand2 className="w-4 h-4" />}
                    <span>
                      {mode === 'create'
                        ? `Gerar Fotografia em ${aspectRatio}`
                        : `Executar Edição em ${aspectRatio}`}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Right: Image Preview and Apply to Page (6 cols) */}
            <div className="md:col-span-6 flex flex-col gap-4">
              <label className="text-xs font-sans-body uppercase tracking-wider font-semibold text-[#c49b66]">
                Resultado da Geração / Edição:
              </label>

              <div className="relative aspect-[4/3] w-full bg-[#1b1917] border border-[#2b2723] rounded-md overflow-hidden flex items-center justify-center">
                {generatedImage ? (
                  <img
                    src={generatedImage}
                    alt="Fotografia Gerada"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-xs text-[#736f66] p-6 text-center">
                    <ImageIcon className="w-8 h-8 text-[#4a463f]" />
                    <span>Selecione a proporção e clique em executar</span>
                  </div>
                )}
              </div>

              {generatedImage && (
                <div className="p-4 bg-[#1e1c19] rounded border border-[#2b2723] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans-body uppercase tracking-wider text-[#c49b66] font-semibold flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Inserir na Revista:</span>
                    </span>

                    <span className="text-[10px] font-mono text-[#888]">
                      Proporção: {aspectRatio}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={selectedTargetPage}
                      onChange={(e) => setSelectedTargetPage(parseInt(e.target.value))}
                      className="bg-[#26231f] text-[#f5f1e8] text-xs font-sans-body px-3 py-1.5 rounded border border-[#3b3630] focus:outline-none flex-1"
                    >
                      <option value={1}>Página 01 · Capa da Revista</option>
                      <option value={3}>Página 03 · Matéria Principal (Foto de Destaque)</option>
                      <option value={5}>Página 05 · Perfil de Liderança</option>
                    </select>

                    <button
                      onClick={handleApply}
                      className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-sans-body uppercase tracking-wider font-semibold text-black bg-[#c49b66] hover:bg-[#d6af7c] rounded transition-colors whitespace-nowrap"
                    >
                      {appliedSuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-900" />
                          <span>Aplicado!</span>
                        </>
                      ) : (
                        <span>Aplicar à Página</span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 border-t border-[#2b2723] bg-[#141210]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-sans-body uppercase tracking-wider text-[#a8a39a] hover:text-white transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
