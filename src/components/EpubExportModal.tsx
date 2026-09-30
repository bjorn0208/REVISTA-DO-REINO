import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Download,
  CheckCircle2,
  Loader2,
  Smartphone,
  Tablet,
  Laptop,
  Check,
  FileCheck,
} from 'lucide-react';
import { MagazineEdition } from '../types/magazine';
import { exportMagazineAsEpub, downloadEpubFile } from '../utils/epubGenerator';

interface EpubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  edition: MagazineEdition;
}

export const EpubExportModal: React.FC<EpubExportModalProps> = ({
  isOpen,
  onClose,
  edition,
}) => {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<string>('');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleExportEpub = async () => {
    setIsExporting(true);
    setErrorMsg('');
    setDownloadSuccess(false);

    try {
      const epubBlob = await exportMagazineAsEpub(edition, (status) => {
        setExportProgress(status);
      });

      downloadEpubFile(epubBlob, edition);
      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
      }, 6000);
    } catch (err: any) {
      console.error('EPUB Generation error:', err);
      setErrorMsg(err.message || 'Erro ao gerar arquivo EPUB.');
    } finally {
      setIsExporting(false);
      setExportProgress('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#171513] border border-[#2b2723] rounded-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2b2723] bg-[#141210]">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#c49b66]" />
            <div>
              <h2 className="text-base font-serif-display font-bold uppercase tracking-wider text-[#f5f1e8]">
                Exportar Revista como e-Book EPUB
              </h2>
              <p className="text-[11px] font-sans-body text-[#8a857b]">
                Compatível com Apple Books, Kindle, Kobo, Google Play Livros e Calibre
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#8a857b] hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-[#dedad1]">
          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded">
              {errorMsg}
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <h3 className="text-sm font-serif-display font-semibold text-white">
              Publicação Digital em Formato EPUB 3 Standard
            </h3>
            <p className="text-xs font-sans-body text-[#a09b91] leading-relaxed">
              O arquivo EPUB gerado compila todas as 12 páginas da revista{' '}
              <strong className="text-[#c49b66]">{edition.name}</strong> em documentos XHTML editorialmente formatados,
              preservando a hierarquia tipográfica, capitulares, citações destacadas, caixas de análise, sumário dinâmico
              e fotografia de capa integrada.
            </p>
          </div>

          {/* E-Reader Compatibility Badges */}
          <div className="p-3.5 bg-[#121110] border border-[#26231f] rounded-lg space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#c49b66] font-semibold block">
              Dispositivos & Leitores Compatíveis:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-sans-body text-[#b0aba0]">
              <div className="flex items-center gap-2 p-1.5 bg-[#1b1917] rounded border border-[#2d2924]">
                <Smartphone className="w-3.5 h-3.5 text-[#c49b66]" />
                <span>Apple Books (iOS/Mac)</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 bg-[#1b1917] rounded border border-[#2d2924]">
                <Tablet className="w-3.5 h-3.5 text-[#c49b66]" />
                <span>Amazon Kindle (Mobi/EPUB)</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 bg-[#1b1917] rounded border border-[#2d2924]">
                <Tablet className="w-3.5 h-3.5 text-[#c49b66]" />
                <span>Kobo & Tolino e-Readers</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 bg-[#1b1917] rounded border border-[#2d2924]">
                <Smartphone className="w-3.5 h-3.5 text-[#c49b66]" />
                <span>Google Play Livros</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 bg-[#1b1917] rounded border border-[#2d2924]">
                <Laptop className="w-3.5 h-3.5 text-[#c49b66]" />
                <span>Calibre & Thorium</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 bg-[#1b1917] rounded border border-[#2d2924]">
                <FileCheck className="w-3.5 h-3.5 text-green-400" />
                <span>EPUB 3 / NCX Válido</span>
              </div>
            </div>
          </div>

          {/* Book Metadata Preview */}
          <div className="p-3 bg-[#1e1c19] rounded border border-[#2b2723] text-xs font-sans-body space-y-1">
            <div className="flex justify-between">
              <span className="text-[#8a857b]">Título do e-Book:</span>
              <span className="font-semibold text-white">{edition.name} - {edition.headline}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8a857b]">Edição / Data:</span>
              <span className="text-[#c49b66]">{edition.issueNumber} · {edition.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8a857b]">Estrutura:</span>
              <span>12 Capítulos / Seções com Sumário Ativo</span>
            </div>
          </div>

          {/* Action Button & Status */}
          <div className="pt-1 flex flex-col items-center gap-3">
            <button
              onClick={handleExportEpub}
              disabled={isExporting}
              className="w-full py-3 px-6 bg-[#c49b66] hover:bg-[#d6af7c] text-black font-semibold text-xs uppercase tracking-widest font-sans-body rounded shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{exportProgress || 'Gerando Arquivo EPUB...'}</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Download Concluído! Baixar Novamente?</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Baixar Arquivo .EPUB da Revista</span>
                </>
              )}
            </button>

            {downloadSuccess && (
              <div className="flex items-center gap-2 text-xs text-green-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>O arquivo .epub foi salvo com sucesso na sua pasta de downloads.</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#2b2723] bg-[#141210]">
          <span className="text-[11px] font-mono text-[#736f66]">Formato Aberto OEBPS / IDPF</span>
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
