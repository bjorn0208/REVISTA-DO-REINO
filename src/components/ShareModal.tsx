import React, { useState, useEffect } from 'react';
import { X, Share2, Copy, Check, Clock, Globe, Eye, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { MagazineEdition } from '../types/magazine';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  edition: MagazineEdition;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, edition }) => {
  const [expiresInHours, setExpiresInHours] = useState<number>(168); // 7 days default
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [expiresAtDate, setExpiresAtDate] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (isOpen && !shareUrl) {
      handleCreateShareLink();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreateShareLink = async () => {
    setErrorMsg('');
    setIsGenerating(true);

    try {
      const response = await fetch('/api/share/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          edition,
          expiresInHours,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Falha ao criar link compartilhável.');
      }

      const data = await response.json();
      if (data.shareId) {
        const fullUrl = `${window.location.origin}${window.location.pathname}?share=${data.shareId}`;
        setShareUrl(fullUrl);
        const expDate = new Date(data.expiresAt);
        setExpiresAtDate(
          expDate.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        );
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro ao gerar link.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = () => {
    if (navigator.share && shareUrl) {
      navigator.share({
        title: `${edition.name} - Edição Digital`,
        text: `Confira a revista "${edition.headline}" criada no Magazine Architect.`,
        url: shareUrl,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#171513] border border-[#2b2723] rounded-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2b2723] bg-[#141210]">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#c49b66]" />
            <h2 className="text-base font-serif-display font-bold uppercase tracking-wider text-[#f5f1e8]">
              Compartilhar Edição da Revista
            </h2>
          </div>
          <button onClick={onClose} className="text-[#8a857b] hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-[#dedad1]">
          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1">
            <h3 className="text-sm font-serif-display font-semibold text-white">
              Link Temporário Autônomo
            </h3>
            <p className="text-xs font-sans-body text-[#9e998f] leading-relaxed">
              Gere um link temporário exclusivo da sua revista <strong className="text-[#c49b66]">{edition.name}</strong> para enviar a colegas, clientes ou leitores. Quem acessar visualizará as 12 páginas diagramadas com todos os efeitos e fotos.
            </p>
          </div>

          {/* Expiration Setting */}
          <div className="p-3.5 bg-[#1e1c19] border border-[#2b2723] rounded flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-sans-body text-[#a09b91]">
              <Clock className="w-4 h-4 text-[#c49b66]" />
              <span>Tempo de Expiração:</span>
            </div>

            <select
              value={expiresInHours}
              onChange={(e) => {
                setExpiresInHours(parseInt(e.target.value));
                setShareUrl('');
              }}
              disabled={isGenerating}
              className="bg-[#26231f] text-[#f5f1e8] text-xs font-sans-body px-3 py-1.5 rounded border border-[#3b3630] focus:outline-none focus:border-[#c49b66]"
            >
              <option value={24}>24 Horas (1 dia)</option>
              <option value={72}>72 Horas (3 dias)</option>
              <option value={168}>168 Horas (7 dias)</option>
              <option value={720}>720 Horas (30 dias)</option>
            </select>
          </div>

          {/* Share Link Box */}
          <div className="space-y-2">
            <label className="text-xs font-sans-body uppercase tracking-wider font-semibold text-[#c49b66] block">
              Link de Acesso Direto:
            </label>

            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#121110] border border-[#332f2a] px-3.5 py-2.5 rounded font-mono text-xs text-[#dedad1] truncate select-all">
                {isGenerating ? 'Gerando link temporário no serviço de armazenamento...' : shareUrl}
              </div>

              <button
                onClick={handleCopy}
                disabled={isGenerating || !shareUrl}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-sans-body uppercase tracking-wider font-semibold text-black bg-[#c49b66] hover:bg-[#d6af7c] rounded transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-950" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>

            {expiresAtDate && (
              <div className="flex items-center justify-between text-[11px] font-sans-body text-[#78746c] pt-1 px-1">
                <span>Válido até: {expiresAtDate}</span>
                <span className="font-mono text-[#a8a39a]">Serviço de Armazenamento Temporário Ativo</span>
              </div>
            )}
          </div>

          {/* Native Web Share button if available */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                disabled={!shareUrl}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans-body uppercase tracking-wider text-[#d0cbc2] bg-[#24211e] hover:bg-[#332f2a] border border-[#3b3630] rounded transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-[#c49b66]" />
                <span>Compartilhar via Celular / Apps</span>
              </button>
            )}

            {!shareUrl && !isGenerating && (
              <button
                onClick={handleCreateShareLink}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-sans-body uppercase tracking-wider font-semibold text-black bg-[#c49b66] rounded"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gerar Novo Link</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#2b2723] bg-[#141210]">
          <span className="text-[11px] font-mono text-[#736f66]">Mock Storage API Active</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-sans-body uppercase tracking-wider text-[#8a857b] hover:text-white transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
