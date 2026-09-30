import React, { useState } from 'react';
import { MagazinePage, MagazineEdition } from '../types/magazine';
import { X, Sparkles, AlertCircle, Check } from 'lucide-react';

interface RefinePageModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageNumber: number;
  edition: MagazineEdition;
  onPageRefined: (pageNumber: number, refinedPage: MagazinePage) => void;
}

export const RefinePageModal: React.FC<RefinePageModalProps> = ({
  isOpen,
  onClose,
  pageNumber,
  edition,
  onPageRefined,
}) => {
  const page = edition.pages.find((p) => p.pageNumber === pageNumber) || edition.pages[0];
  const [instruction, setInstruction] = useState<string>('');
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  if (!isOpen) return null;

  const quickInstructions = [
    'Aumentar a profundidade analítica e o rigor intelectual da prosa',
    'Tornar a manchete e os subtítulos mais marcantes e sintéticos',
    'Reforçar o foco nas implicações corporativas e de negócios',
    'Tornar a linguagem mais literária e curatorial, estilo The New Yorker',
  ];

  const handleRefine = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsRefining(true);

    try {
      const response = await fetch('/api/refine-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page,
          directionPrompt: instruction || 'Aumentar a sofisticação editorial e a precisão do texto',
          magazineContext: edition.editorialSummary,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Falha ao refinar página.');
      }

      const data = await response.json();
      if (data.refinedPage) {
        onPageRefined(pageNumber, data.refinedPage);
        setSuccessMsg('Página refinada com sucesso pelo Editor-Chefe Gemini!');
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro ao refinar página.');
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#171513] border border-[#2b2723] rounded-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2b2723] bg-[#141210]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#c49b66]" />
            <h2 className="text-base font-serif-display font-bold uppercase tracking-wider text-[#f5f1e8]">
              Refinar Página {pageNumber.toString().padStart(2, '0')}: {page.title}
            </h2>
          </div>
          <button onClick={onClose} className="text-[#8a857b] hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-[#dedad1]">
          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-green-950/60 border border-green-800 text-green-200 text-xs rounded flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-green-400" />
              <span>{successMsg}</span>
            </div>
          )}

          <p className="text-xs font-sans-body text-[#9e998f] leading-relaxed">
            Utilize o Editor-Chefe com inteligência Gemini para calibrar o tom, afiar títulos, aumentar a densidade analítica ou reescrever trechos desta página mantendo a verdade dos fatos.
          </p>

          <div>
            <label className="text-xs font-sans-body uppercase tracking-wider font-semibold text-[#c49b66] block mb-1.5">
              Direcionamento Editorial:
            </label>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              disabled={isRefining}
              rows={3}
              placeholder="Ex: Torne o parágrafo de abertura mais impactante e aprofunde o questionamento sobre governança..."
              className="w-full bg-[#1e1c19] text-[#f5f1e8] text-xs font-sans-body p-3 rounded border border-[#3b3630] focus:outline-none focus:border-[#c49b66] resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider text-[#736f66] block">
              Sugestões Rápidas de Ajuste:
            </span>
            <div className="flex flex-col gap-1">
              {quickInstructions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInstruction(q)}
                  disabled={isRefining}
                  className="text-left text-xs font-sans-body bg-[#1e1c19] hover:bg-[#282521] text-[#b5b0a5] hover:text-white p-2 rounded border border-[#2b2723] transition-colors"
                >
                  • {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#2b2723] bg-[#141210]">
          <span className="text-[11px] font-mono text-[#736f66]">Gemini 3.5 Flash Editor</span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isRefining}
              className="px-3 py-1.5 text-xs font-sans-body uppercase tracking-wider text-[#8a857b] hover:text-white transition-colors"
            >
              Cancelar
            </button>

            <button
              onClick={handleRefine}
              disabled={isRefining}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-sans-body uppercase tracking-wider font-semibold text-black bg-[#c49b66] hover:bg-[#d6af7c] rounded transition-colors disabled:opacity-50"
            >
              {isRefining ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Refinando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Aplicar Refinamento</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
