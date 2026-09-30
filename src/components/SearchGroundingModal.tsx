import React, { useState } from 'react';
import { X, Search, Globe, Check, Loader2, AlertCircle, ExternalLink } from 'lucide-react';

interface SearchGroundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyContext: (groundedText: string) => void;
}

export const SearchGroundingModal: React.FC<SearchGroundingModalProps> = ({
  isOpen,
  onClose,
  onApplyContext,
}) => {
  const [topic, setTopic] = useState<string>('Inteligência Artificial e Negócios Futuro do Trabalho 2026');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [resultText, setResultText] = useState<string>('');
  const [sources, setSources] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (!topic.trim()) return;
    setErrorMsg('');
    setIsSearching(true);
    setResultText('');
    setSources([]);

    try {
      const response = await fetch('/api/search-grounded-context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Erro na pesquisa');
      }

      const data = await response.json();
      setResultText(data.groundedText);
      setSources(data.sources || []);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro ao consultar Google Search.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleApply = () => {
    if (!resultText) return;
    onApplyContext(resultText);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#171513] border border-[#2b2723] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2b2723] bg-[#141210]">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#c49b66]" />
            <h2 className="text-base font-serif-display font-bold uppercase tracking-wider text-[#f5f1e8]">
              Pesquisa Factual com Google Search Grounding (Gemini 3.8 Flash)
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
            Obtenha informações factuais em tempo real via Google Search e Gemini 3.8 Flash para fundamentar matérias com dados verificados.
          </p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Digite um tema para pesquisar na web..."
              className="flex-1 bg-[#1e1c19] text-[#f5f1e8] text-xs font-sans-body px-3.5 py-2.5 rounded border border-[#3b3630] focus:outline-none focus:border-[#c49b66]"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-sans-body uppercase tracking-wider font-semibold text-black bg-[#c49b66] hover:bg-[#d6af7c] rounded transition-colors disabled:opacity-50"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Pesquisar</span>
            </button>
          </div>

          {resultText && (
            <div className="space-y-3 pt-2">
              <div className="p-4 bg-[#1e1c19] border border-[#2b2723] rounded text-xs font-sans-body leading-relaxed text-[#f0ede6] whitespace-pre-line">
                {resultText}
              </div>

              {sources.length > 0 && (
                <div className="text-[11px] font-sans-body text-[#888] space-y-1">
                  <span className="font-semibold text-[#a8a398] block">Fontes Verificadas:</span>
                  <div className="flex flex-wrap gap-2">
                    {sources.slice(0, 4).map((s, idx) => (
                      <span key={idx} className="text-[#c49b66] inline-flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        {s.web?.title || s.web?.uri || `Fonte ${idx + 1}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleApply}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-sans-body uppercase tracking-wider font-semibold text-black bg-[#c49b66] hover:bg-[#d6af7c] rounded transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-900" /> : <Globe className="w-4 h-4" />}
                <span>{copied ? 'Anexado ao Contexto!' : 'Usar Dados na Revista'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#2b2723] bg-[#141210]">
          <span className="text-[11px] font-mono text-[#736f66]">Search Grounding Active</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-sans-body uppercase tracking-wider text-[#8a857b] hover:text-white transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
