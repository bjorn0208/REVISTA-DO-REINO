import React, { useState, useEffect } from 'react';
import { X, Printer, Download, Eye, CheckCircle2, AlertTriangle, Sparkles, Loader2, FileDown, BookOpen } from 'lucide-react';
import { MagazineEdition } from '../types/magazine';
import { exportMagazineAsEpub, downloadEpubFile } from '../utils/epubGenerator';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  edition: MagazineEdition;
  onToggleContinuousPrintView: () => void;
  isContinuousPrintView: boolean;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  edition,
  onToggleContinuousPrintView,
  isContinuousPrintView,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [browserPrintBlocked, setBrowserPrintBlocked] = useState<boolean>(false);
  const [isInIframe, setIsInIframe] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isExportingEpub, setIsExportingEpub] = useState<boolean>(false);
  const [epubSuccess, setEpubSuccess] = useState<boolean>(false);

  useEffect(() => {
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }
  }, []);

  if (!isOpen) return null;

  const handleBrowserPrint = () => {
    try {
      window.print();
      if (isInIframe) {
        // If in an iframe, Chrome frequently ignores print() without throwing.
        // Alert the user so they know alternative options are ready.
        setTimeout(() => {
          setBrowserPrintBlocked(true);
        }, 300);
      }
    } catch (e) {
      console.warn('Browser print blocked by iframe sandbox:', e);
      setBrowserPrintBlocked(true);
    }
  };

  const handleDownloadStandaloneHtml = async () => {
    setIsExporting(true);
    try {
      const printContainer = document.getElementById('magazine-print-export-root');
      if (!printContainer) {
        throw new Error('Elemento de impressão não encontrado.');
      }

      // Clone container to process images without modifying live DOM
      const clone = printContainer.cloneNode(true) as HTMLElement;

      // Ensure all images have absolute URLs or valid sources
      const imgElements = clone.querySelectorAll('img');
      imgElements.forEach((img) => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('data:') && !src.startsWith('http')) {
          img.setAttribute('src', `${window.location.origin}${src.startsWith('/') ? '' : '/'}${src}`);
        }
      });

      const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
        .map((el) => el.outerHTML)
        .join('\n');

      const standaloneHtml = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${edition.name} - ${edition.issueNumber} - Edição Completa para Impressão</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400;1,6..72,600&family=Playfair+Display:ital,wght@0,500;0,700;0,900;1,400;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  ${styles}
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    html, body {
      background: #ffffff !important;
      color: #000000 !important;
      margin: 0 !important;
      padding: 0 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .print-only-container {
      display: block !important;
      visibility: visible !important;
    }
    .magazine-print-sheet {
      page-break-after: always !important;
      break-after: page !important;
      width: 210mm !important;
      min-height: 297mm !important;
      height: 297mm !important;
      overflow: hidden !important;
      margin: 0 auto !important;
      background: #ffffff !important;
      position: relative !important;
    }
    @media screen {
      body {
        background: #11100e !important;
        padding: 24px 0 !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 32px !important;
      }
      .standalone-banner {
        width: 210mm;
        background: #1e1c19;
        color: #f5f1e8;
        padding: 16px 24px;
        border-radius: 8px;
        border: 1px solid #3b3630;
        font-family: 'Plus Jakarta Sans', sans-serif;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      }
      .standalone-btn {
        background: #c49b66;
        color: #0c0b0a;
        font-weight: 700;
        padding: 8px 16px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        text-transform: uppercase;
        font-size: 12px;
        letter-spacing: 0.05em;
      }
      .magazine-print-sheet {
        box-shadow: 0 20px 40px rgba(0,0,0,0.6) !important;
        border-radius: 4px !important;
      }
    }
    @media print {
      .standalone-banner {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="standalone-banner">
    <div>
      <div style="font-weight: bold; font-size: 15px; color: #c49b66;">${edition.name} · Edição Pronta para Impressão A4</div>
      <div style="font-size: 12px; color: #a09b91; margin-top: 4px;">Clique no botão ao lado para imprimir ou salvar como PDF (com Gráficos de Plano de Fundo ativados).</div>
    </div>
    <button class="standalone-btn" onclick="window.print()">Imprimir / Salvar PDF</button>
  </div>

  <div class="print-only-container">
    ${clone.innerHTML}
  </div>

  <script>
    // Automatically open print dialog when opened in external tab or window
    window.addEventListener('load', function() {
      setTimeout(function() {
        try {
          window.print();
        } catch(e) {
          console.warn('Auto print deferred:', e);
        }
      }, 700);
    });
  </script>
</body>
</html>`;

      const blob = new Blob([standaloneHtml], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Revista_${edition.name.replace(/\s+/g, '_')}_${edition.issueNumber.replace(/[^a-zA-Z0-9]/g, '_')}_A4.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to export HTML:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportEpub = async () => {
    setIsExportingEpub(true);
    try {
      const epubBlob = await exportMagazineAsEpub(edition);
      downloadEpubFile(epubBlob, edition);
      setEpubSuccess(true);
      setTimeout(() => setEpubSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to export EPUB:', err);
    } finally {
      setIsExportingEpub(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#171513] border border-[#2b2723] rounded-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2b2723] bg-[#141210]">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#c49b66]" />
            <h2 className="text-base font-serif-display font-bold uppercase tracking-wider text-[#f5f1e8]">
              Central de Impressão & Exportação PDF (A4)
            </h2>
          </div>
          <button onClick={onClose} className="text-[#8a857b] hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-[#dedad1]">
          {/* Iframe Notice / Blocked Fallback */}
          {(browserPrintBlocked || isInIframe) && (
            <div className="p-3.5 bg-amber-950/60 border border-amber-800/80 text-amber-200 text-xs rounded-md flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <div className="space-y-1">
                <span className="font-semibold block text-amber-100">
                  Ambiente de Pré-visualização Protegido (iFrame)
                </span>
                <span className="text-[#e2dad0] leading-relaxed">
                  Os navegadores restringem caixas de diálogo modais de impressão direta dentro de iframes. Recomendamos utilizar a opção <strong>"Baixar Revista para Impressão (HTML/PDF)"</strong> abaixo ou o <strong>"Modo Visualizador Contínuo A4"</strong>!
                </span>
              </div>
            </div>
          )}

          <p className="text-xs font-sans-body text-[#9e998f] leading-relaxed">
            A revista <strong className="text-white">{edition.name}</strong> possui 12 páginas diagramadas na proporção exata do padrão internacional de publicação A4 (210mm x 297mm).
          </p>

          {/* Action Options */}
          <div className="space-y-3 pt-1">
            {/* Primary Recommended Option: Standalone File with Auto-Print */}
            <div className="p-4 bg-[#1e1c19] border border-[#c49b66]/60 rounded-md transition-colors flex items-center justify-between gap-4 shadow-sm">
              <div className="flex items-start gap-3">
                <Download className="w-5 h-5 text-[#c49b66] mt-0.5 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-xs font-serif-display text-white block">
                      1. Baixar Revista para Impressão / Salvar PDF
                    </strong>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-[#c49b66]/20 text-[#c49b66] rounded font-semibold">
                      100% Garantido
                    </span>
                  </div>
                  <span className="text-[11px] font-sans-body text-[#a8a39a] leading-tight block mt-0.5">
                    Gera um arquivo A4 completo autônomo com todas as 12 páginas e imagens. Ao abrir no navegador, dispara a impressão para PDF automaticamente.
                  </span>
                </div>
              </div>

              <button
                onClick={handleDownloadStandaloneHtml}
                disabled={isExporting}
                className="px-4 py-2 text-xs font-sans-body uppercase tracking-wider font-semibold text-black bg-[#c49b66] hover:bg-[#d6af7c] rounded transition-colors whitespace-nowrap shrink-0 shadow-xs disabled:opacity-50 flex items-center gap-1.5"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Gerando...</span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                    <span>Baixado!</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Baixar Revista</span>
                  </>
                )}
              </button>
            </div>

            {/* Option 2: Direct print trigger in browser */}
            <div className="p-4 bg-[#1e1c19] border border-[#2b2723] hover:border-[#3b3630] rounded-md transition-colors flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Printer className="w-5 h-5 text-[#c49b66] mt-0.5 shrink-0" />
                <div>
                  <strong className="text-xs font-serif-display text-white block">
                    2. Disparar Impressão Direta no Navegador (Ctrl+P / Cmd+P)
                  </strong>
                  <span className="text-[11px] font-sans-body text-[#8a857b]">
                    Tenta acionar o diálogo de impressão nativo do sistema operacional.
                  </span>
                </div>
              </div>

              <button
                onClick={handleBrowserPrint}
                className="px-3.5 py-1.5 text-xs font-sans-body uppercase tracking-wider font-semibold text-[#d0cbc2] bg-[#24211e] hover:bg-[#332f2a] border border-[#3b3630] rounded transition-colors whitespace-nowrap shrink-0"
              >
                Imprimir Agora
              </button>
            </div>

            {/* Option 3: Continuous In-App A4 Scroll Mode */}
            <div className="p-4 bg-[#1e1c19] border border-[#2b2723] hover:border-[#3b3630] rounded-md transition-colors flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Eye className="w-5 h-5 text-[#c49b66] mt-0.5 shrink-0" />
                <div>
                  <strong className="text-xs font-serif-display text-white block">
                    3. Modo Visualizador Contínuo A4 na Tela
                  </strong>
                  <span className="text-[11px] font-sans-body text-[#8a857b]">
                    Exibe todas as 12 folhas A4 sequencialmente na tela para inspeção de layout e diagramação.
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onToggleContinuousPrintView();
                  onClose();
                }}
                className="px-3.5 py-1.5 text-xs font-sans-body uppercase tracking-wider text-[#d0cbc2] bg-[#24211e] hover:bg-[#332f2a] border border-[#3b3630] rounded transition-colors whitespace-nowrap shrink-0"
              >
                {isContinuousPrintView ? 'Desativar Modo A4' : 'Ativar Modo A4'}
              </button>
            </div>

            {/* Option 4: EPUB Digital Reader Export */}
            <div className="p-4 bg-[#1e1c19] border border-[#2b2723] hover:border-[#c49b66]/60 rounded-md transition-colors flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-[#c49b66] mt-0.5 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-xs font-serif-display text-white block">
                      4. Exportar como e-Book EPUB (Leitores Digitais)
                    </strong>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-[#c49b66]/20 text-[#c49b66] rounded font-semibold">
                      Kindle · Apple · Kobo
                    </span>
                  </div>
                  <span className="text-[11px] font-sans-body text-[#8a857b]">
                    Compila todas as 12 páginas em arquivo .epub com sumário ativo, capítulos em XHTML editorial e foto de capa integrada.
                  </span>
                </div>
              </div>

              <button
                onClick={handleExportEpub}
                disabled={isExportingEpub}
                className="px-4 py-2 text-xs font-sans-body uppercase tracking-wider font-semibold text-black bg-[#c49b66] hover:bg-[#d6af7c] rounded transition-colors whitespace-nowrap shrink-0 shadow-xs disabled:opacity-50 flex items-center gap-1.5"
              >
                {isExportingEpub ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Gerando EPUB...</span>
                  </>
                ) : epubSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                    <span>Baixado!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar EPUB</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* PDF Configuration Tip */}
          <div className="p-3 bg-[#141210] rounded border border-[#2b2723] text-[11px] font-sans-body text-[#78746c] space-y-1">
            <span className="font-semibold text-[#a8a398] block">Dica para exportação perfeita em PDF:</span>
            <p>1. Na janela de impressão, marque a opção <strong>"Gráficos de segundo plano"</strong>.</p>
            <p>2. Em <strong>"Margens"</strong>, selecione <strong>"Nenhuma"</strong> para preservar o sangramento de capa.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 border-t border-[#2b2723] bg-[#141210]">
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

