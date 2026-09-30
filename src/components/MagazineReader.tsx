import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MagazineEdition, PhotoFilterType } from '../types/magazine';
import { PageRenderer } from './pages/PageRenderer';
import { playPageTurnSound } from '../utils/audio';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  Sliders,
  Palette,
  FileText,
  Printer,
  BookOpen,
  Volume2,
  VolumeX,
  Share2,
} from 'lucide-react';

interface MagazineReaderProps {
  edition: MagazineEdition;
  viewMode: 'spread' | 'single' | 'grid';
  onRefinePage: (pageNumber: number) => void;
  onFilterChange: (filter: PhotoFilterType) => void;
  onPrint: () => void;
  onOpenShare?: () => void;
  onOpenEpubModal?: () => void;
  onUpdateEdition?: (updatedEdition: MagazineEdition) => void;
  onOpenCoverBackgroundModal?: () => void;
  onOpenCoverTextModal?: () => void;
}

export const MagazineReader: React.FC<MagazineReaderProps> = ({
  edition,
  viewMode,
  onRefinePage,
  onFilterChange,
  onPrint,
  onOpenShare,
  onOpenEpubModal,
  onUpdateEdition,
  onOpenCoverBackgroundModal,
  onOpenCoverTextModal,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [direction, setDirection] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const totalPages = edition.pages.length || 12;

  const triggerSound = () => {
    if (soundEnabled) {
      playPageTurnSound();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        goToNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        goToPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, viewMode, totalPages, soundEnabled]);

  const goToNext = () => {
    setDirection(1);
    triggerSound();
    if (viewMode === 'spread') {
      if (currentPage === 1) {
        setCurrentPage(2);
      } else if (currentPage < totalPages - 1) {
        setCurrentPage(Math.min(currentPage + 2, totalPages));
      } else if (currentPage === totalPages - 1) {
        setCurrentPage(totalPages);
      }
    } else {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  const goToPrev = () => {
    setDirection(-1);
    triggerSound();
    if (viewMode === 'spread') {
      if (currentPage === totalPages && totalPages % 2 === 0) {
        setCurrentPage(Math.max(1, totalPages - 2));
      } else if (currentPage > 2) {
        setCurrentPage(Math.max(2, currentPage - 2));
      } else {
        setCurrentPage(1);
      }
    } else {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const jumpToPage = (pageNum: number) => {
    if (pageNum !== currentPage) {
      triggerSound();
    }
    setDirection(pageNum >= currentPage ? 1 : -1);
    setCurrentPage(pageNum);
  };

  // Determine current spread
  const leftPageNumber =
    viewMode === 'spread' && currentPage > 1 && currentPage < totalPages ? currentPage : currentPage;
  const rightPageNumber =
    viewMode === 'spread' && currentPage > 1 && currentPage < totalPages ? currentPage + 1 : null;

  const currentStoryTitle =
    edition.pages.find((p) => p.pageNumber === currentPage)?.title || edition.headline;

  const filterOptions: { label: string; value: PhotoFilterType }[] = [
    { label: 'Natural / Fidedigno', value: 'natural' },
    { label: 'Monocromático Alta Densidade', value: 'monochrome' },
    { label: 'Duotone Editorial', value: 'editorial-duotone' },
    { label: 'Granulação Analógica', value: 'film-grain' },
    { label: 'Sépia Curatorial', value: 'curatorial-sepia' },
    { label: 'Bronze Dourado', value: 'bronze-glow' },
  ];

  return (
    <div className="flex flex-col items-center justify-between w-full min-h-[calc(100vh-60px)] p-4 sm:p-6 lg:p-8 bg-[#0c0b0a]">
      {/* Magazine Sub-Header & Controls Bar (No Print) */}
      <div className="no-print w-full max-w-6xl flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-[#24221f]">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-[11px] font-sans-body uppercase tracking-wider text-[#a09b91]">
            <span className="text-[#c49b66] font-semibold">{edition.name}</span>
            <span>·</span>
            <span>{edition.issueNumber}</span>
            <span>·</span>
            <span>{edition.category}</span>
          </div>
          <h2 className="text-sm font-serif-display text-[#eae6df] truncate max-w-md">
            Pág {currentPage.toString().padStart(2, '0')}: {currentStoryTitle}
          </h2>
        </div>

        {/* Transition Badge, Audio Toggle & Photo Filter Switcher */}
        <div className="flex items-center gap-3">
          {/* Sound Toggle Button */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playPageTurnSound();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-sans-body transition-colors ${
              soundEnabled
                ? 'bg-[#24211e] text-[#c49b66] border-[#3d372e]'
                : 'bg-[#181614] text-[#736f66] border-[#292622] hover:text-[#aaa]'
            }`}
            title={soundEnabled ? 'Som tátil de papel ativado' : 'Som desativado'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Som Tátil Ativo' : 'Mudo'}</span>
          </button>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#181614] border border-[#2b2723] text-[10px] font-mono text-[#a8a398]">
            <BookOpen className="w-3 h-3 text-[#c49b66]" />
            <span>Page-Flip 3D Dinâmico</span>
          </div>

          <div className="flex items-center gap-2 bg-[#171513] p-1 rounded-md border border-[#2b2723]">
            <span className="text-[10px] font-sans-body uppercase tracking-wider text-[#736f66] pl-2 flex items-center gap-1">
              <Palette className="w-3 h-3 text-[#c49b66]" />
              <span className="hidden md:inline">Tratamento Fotográfico:</span>
            </span>

            <select
              value={edition.activePhotoFilter}
              onChange={(e) => onFilterChange(e.target.value as PhotoFilterType)}
              className="bg-[#24211e] text-[#e8e5df] text-xs font-sans-body px-2.5 py-1 rounded border border-[#3b3630] focus:outline-none focus:border-[#c49b66]"
            >
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reader Main Display Area */}
      <div className="relative w-full max-w-6xl flex items-center justify-center my-auto py-2">
        {/* Navigation Arrow Left */}
        {viewMode !== 'grid' && (
          <button
            onClick={goToPrev}
            disabled={currentPage === 1}
            className={`no-print absolute left-0 z-30 p-2.5 rounded-full bg-[#1b1917]/90 text-[#f3efe7] border border-[#33302b] shadow-xl hover:bg-[#2e2a25] transition-all -translate-x-2 md:-translate-x-6 ${
              currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-85 hover:opacity-100'
            }`}
            title="Página Anterior (Seta Esquerda)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Dynamic Views: Spread vs Single vs Grid */}
        {viewMode === 'spread' ? (
          <div className="w-full flex items-center justify-center [perspective:1600px]">
            <AnimatePresence mode="wait" custom={direction}>
              {currentPage === 1 ? (
                // Cover (Single Spread Center)
                <motion.div
                  key="page-1"
                  custom={direction}
                  initial={{
                    opacity: 0,
                    rotateY: direction > 0 ? 8 : -8,
                    x: direction > 0 ? 30 : -30,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    rotateY: 0,
                    x: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    rotateY: direction > 0 ? -8 : 8,
                    x: direction > 0 ? -30 : 30,
                    scale: 0.98,
                  }}
                  transition={{
                    duration: 0.36,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="w-full max-w-[540px] transform-gpu origin-center relative group"
                >
                  <PageRenderer
                    pageNumber={1}
                    edition={edition}
                    onRefinePage={onRefinePage}
                    onNavigateToPage={jumpToPage}
                    onUpdateEdition={onUpdateEdition}
                    onOpenCoverBackgroundModal={onOpenCoverBackgroundModal}
                    onOpenCoverTextModal={onOpenCoverTextModal}
                  />

                  {/* Corner dog-ear interactive curl to flip to page 2 */}
                  <div
                    onClick={goToNext}
                    className="no-print absolute bottom-0 right-0 w-12 h-12 cursor-pointer z-30 group/curl overflow-hidden"
                    title="Virar para o Sumário e Editorial →"
                  >
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-[#c49b66]/60 via-black/40 to-transparent transform rotate-0 group-hover/curl:scale-125 transition-transform origin-bottom-right" />
                  </div>
                </motion.div>
              ) : currentPage === totalPages ? (
                // Back Cover (Single Spread Center)
                <motion.div
                  key={`page-${totalPages}`}
                  custom={direction}
                  initial={{
                    opacity: 0,
                    rotateY: direction > 0 ? 8 : -8,
                    x: direction > 0 ? 30 : -30,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    rotateY: 0,
                    x: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    rotateY: direction > 0 ? -8 : 8,
                    x: direction > 0 ? -30 : 30,
                    scale: 0.98,
                  }}
                  transition={{
                    duration: 0.36,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="w-full max-w-[540px] transform-gpu origin-center relative"
                >
                  <PageRenderer
                    pageNumber={totalPages}
                    edition={edition}
                    onRefinePage={onRefinePage}
                    onNavigateToPage={jumpToPage}
                  />

                  {/* Corner dog-ear to flip back */}
                  <div
                    onClick={goToPrev}
                    className="no-print absolute bottom-0 left-0 w-12 h-12 cursor-pointer z-30 group/curl overflow-hidden"
                    title="← Voltar para o Colofão"
                  >
                    <div className="absolute bottom-0 left-0 w-8 h-8 bg-gradient-to-tr from-[#c49b66]/60 via-black/40 to-transparent transform rotate-0 group-hover/curl:scale-125 transition-transform origin-bottom-left" />
                  </div>
                </motion.div>
              ) : (
                // Two-Page Spread (Left + Right side by side) with physical magazine spine depth
                <motion.div
                  key={`spread-${leftPageNumber}`}
                  custom={direction}
                  initial={{
                    opacity: 0,
                    rotateY: direction > 0 ? 6 : -6,
                    x: direction > 0 ? 32 : -32,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    rotateY: 0,
                    x: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    rotateY: direction > 0 ? -6 : 6,
                    x: direction > 0 ? -32 : 32,
                    scale: 0.98,
                  }}
                  transition={{
                    duration: 0.38,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="w-full max-w-5xl transform-gpu origin-center relative"
                >
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-0 bg-[#0f0e0d] p-1 rounded-sm shadow-2xl relative select-none">
                    {/* Realistic Magazine Spine Depth Shadow */}
                    <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-10 pointer-events-none z-20 bg-gradient-to-r from-black/35 via-transparent to-black/35 opacity-90" />

                    {/* Left Page Leaf */}
                    <div className="w-full relative border-r border-[#24211d] origin-right">
                      <PageRenderer
                        pageNumber={leftPageNumber}
                        edition={edition}
                        onRefinePage={onRefinePage}
                        onNavigateToPage={jumpToPage}
                      />

                      {/* Interactive Bottom-Left Corner Curl */}
                      <div
                        onClick={goToPrev}
                        className="no-print absolute bottom-0 left-0 w-10 h-10 cursor-pointer z-30 group/curl overflow-hidden"
                        title="← Voltar página"
                      >
                        <div className="absolute bottom-0 left-0 w-6 h-6 bg-gradient-to-tr from-[#c49b66]/50 via-black/25 to-transparent group-hover/curl:scale-150 transition-transform origin-bottom-left" />
                      </div>
                    </div>

                    {/* Right Page Leaf */}
                    {rightPageNumber && (
                      <div className="w-full relative origin-left">
                        <PageRenderer
                          pageNumber={rightPageNumber}
                          edition={edition}
                          onRefinePage={onRefinePage}
                          onNavigateToPage={jumpToPage}
                        />

                        {/* Interactive Bottom-Right Corner Curl */}
                        <div
                          onClick={goToNext}
                          className="no-print absolute bottom-0 right-0 w-10 h-10 cursor-pointer z-30 group/curl overflow-hidden"
                          title="Virar página →"
                        >
                          <div className="absolute bottom-0 right-0 w-6 h-6 bg-gradient-to-tl from-[#c49b66]/50 via-black/25 to-transparent group-hover/curl:scale-150 transition-transform origin-bottom-right" />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : viewMode === 'single' ? (
          <div className="w-full flex items-center justify-center [perspective:1400px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`single-${currentPage}`}
                custom={direction}
                initial={{
                  opacity: 0,
                  rotateY: direction > 0 ? 6 : -6,
                  x: direction > 0 ? 25 : -25,
                  scale: 0.985,
                }}
                animate={{
                  opacity: 1,
                  rotateY: 0,
                  x: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  rotateY: direction > 0 ? -6 : 6,
                  x: direction > 0 ? -25 : 25,
                  scale: 0.985,
                }}
                transition={{
                  duration: 0.32,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="w-full max-w-[580px] transform-gpu origin-center relative"
              >
                <PageRenderer
                  pageNumber={currentPage}
                  edition={edition}
                  onRefinePage={onRefinePage}
                  onNavigateToPage={jumpToPage}
                  onUpdateEdition={onUpdateEdition}
                  onOpenCoverBackgroundModal={onOpenCoverBackgroundModal}
                  onOpenCoverTextModal={onOpenCoverTextModal}
                />

                {/* Single page interactive corner curls */}
                {currentPage < totalPages && (
                  <div
                    onClick={goToNext}
                    className="no-print absolute bottom-0 right-0 w-10 h-10 cursor-pointer z-30 group/curl overflow-hidden"
                    title="Próxima página →"
                  >
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-gradient-to-tl from-[#c49b66]/50 via-black/25 to-transparent group-hover/curl:scale-150 transition-transform origin-bottom-right" />
                  </div>
                )}
                {currentPage > 1 && (
                  <div
                    onClick={goToPrev}
                    className="no-print absolute bottom-0 left-0 w-10 h-10 cursor-pointer z-30 group/curl overflow-hidden"
                    title="← Página anterior"
                  >
                    <div className="absolute bottom-0 left-0 w-6 h-6 bg-gradient-to-tr from-[#c49b66]/50 via-black/25 to-transparent group-hover/curl:scale-150 transition-transform origin-bottom-left" />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          /* Grid View (All 12 Pages Thumbnails) */
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-2">
            {edition.pages.map((p) => (
              <div
                key={p.pageNumber}
                onClick={() => {
                  jumpToPage(p.pageNumber);
                }}
                className={`flex flex-col gap-1.5 cursor-pointer group transition-transform ${
                  currentPage === p.pageNumber ? 'scale-[1.03]' : 'hover:scale-[1.01]'
                }`}
              >
                <div
                  className={`rounded overflow-hidden border-2 transition-all ${
                    currentPage === p.pageNumber
                      ? 'border-[#c49b66] shadow-lg ring-1 ring-[#c49b66]'
                      : 'border-[#2d2a26] group-hover:border-[#524d45]'
                  }`}
                >
                  <PageRenderer
                    pageNumber={p.pageNumber}
                    edition={edition}
                    onRefinePage={onRefinePage}
                    onNavigateToPage={jumpToPage}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-sans-body px-1">
                  <span
                    className={`font-mono font-bold ${
                      currentPage === p.pageNumber ? 'text-[#c49b66]' : 'text-[#888]'
                    }`}
                  >
                    Pág {p.pageNumber.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-[#6b665f] truncate max-w-[100px]">
                    {p.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation Arrow Right */}
        {viewMode !== 'grid' && (
          <button
            onClick={goToNext}
            disabled={currentPage >= totalPages}
            className={`no-print absolute right-0 z-30 p-2.5 rounded-full bg-[#1b1917]/90 text-[#f3efe7] border border-[#33302b] shadow-xl hover:bg-[#2e2a25] transition-all translate-x-2 md:translate-x-6 ${
              currentPage >= totalPages
                ? 'opacity-30 cursor-not-allowed'
                : 'opacity-85 hover:opacity-100'
            }`}
            title="Próxima Página (Seta Direita)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Reader Bottom Navigation Bar (No Print) */}
      <div className="no-print w-full max-w-4xl flex flex-wrap items-center justify-between gap-4 mt-6 pt-3 border-t border-[#24221f]">
        {/* Page status text without pill enclosures */}
        <div className="flex items-center gap-2 text-xs font-sans-body text-[#8a857b]">
          <span>Página {currentPage.toString().padStart(2, '0')}</span>
          <span aria-hidden="true">/</span>
          <span>{totalPages.toString().padStart(2, '0')} Páginas</span>
          <span aria-hidden="true" className="hidden sm:inline">
            ·
          </span>
          <span className="hidden sm:inline text-[#aba59a]">{currentStoryTitle}</span>
        </div>

        {/* Page Quick-Jump Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full py-1">
          {edition.pages.map((p) => (
            <button
              key={p.pageNumber}
              onClick={() => jumpToPage(p.pageNumber)}
              className={`w-7 h-7 text-[11px] font-mono font-medium rounded transition-colors ${
                currentPage === p.pageNumber
                  ? 'bg-[#c49b66] text-black font-bold shadow-xs'
                  : 'text-[#8a857b] hover:text-white hover:bg-[#24211e]'
              }`}
            >
              {p.pageNumber.toString().padStart(2, '0')}
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onRefinePage(currentPage)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans-body uppercase tracking-wider text-[#c49b66] bg-[#1e1c19] hover:bg-[#2b2723] border border-[#3b3630] rounded transition-colors"
            title="Refinar esta página com Gemini AI"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Refinar Esta Página</span>
          </button>

          {onOpenShare && (
            <button
              onClick={onOpenShare}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans-body uppercase tracking-wider text-[#d0cbc2] bg-[#1e1c19] hover:bg-[#2b2723] border border-[#3b3630] rounded transition-colors"
              title="Gerar link temporário compartilhável"
            >
              <Share2 className="w-3.5 h-3.5 text-[#c49b66]" />
              <span className="hidden md:inline">Compartilhar</span>
            </button>
          )}

          {onOpenEpubModal && (
            <button
              onClick={onOpenEpubModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans-body uppercase tracking-wider text-[#d0cbc2] bg-[#1e1c19] hover:bg-[#2b2723] border border-[#3b3630] rounded transition-colors"
              title="Exportar como e-Book EPUB para Kindle, Kobo e Apple Books"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#c49b66]" />
              <span className="hidden md:inline">Exportar EPUB</span>
            </button>
          )}

          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans-body uppercase tracking-wider text-[#d0cbc2] bg-[#1e1c19] hover:bg-[#2b2723] border border-[#3b3630] rounded transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Imprimir Edição</span>
          </button>
        </div>
      </div>
    </div>
  );
};

