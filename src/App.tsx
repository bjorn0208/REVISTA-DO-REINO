import React, { useState, useEffect } from 'react';
import { defaultEdition } from './data/defaultEdition';
import { MagazineEdition, PhotoFilterType, MagazinePage } from './types/magazine';
import { TopBar } from './components/TopBar';
import { MagazineReader } from './components/MagazineReader';
import { CreationModal } from './components/CreationModal';
import { VisualAnalysisModal } from './components/VisualAnalysisModal';
import { ImageStudioModal } from './components/ImageStudioModal';
import { AuditInspector } from './components/AuditInspector';
import { RefinePageModal } from './components/RefinePageModal';
import { VeoVideoModal } from './components/VeoVideoModal';
import { SearchGroundingModal } from './components/SearchGroundingModal';
import { PrintModal } from './components/PrintModal';
import { ShareModal } from './components/ShareModal';
import { CoverBackgroundModal } from './components/CoverBackgroundModal';
import { CoverTextEditModal } from './components/CoverTextEditModal';
import { EpubExportModal } from './components/EpubExportModal';
import { PageRenderer } from './components/pages/PageRenderer';
import { Eye, ArrowLeft, Printer, Share2, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [edition, setEdition] = useState<MagazineEdition>(defaultEdition);
  const [activeViewMode, setActiveViewMode] = useState<'spread' | 'single' | 'grid'>('spread');

  // Modal States
  const [isCreationModalOpen, setIsCreationModalOpen] = useState<boolean>(false);
  const [isVisualAnalysisModalOpen, setIsVisualAnalysisModalOpen] = useState<boolean>(false);
  const [isImageStudioModalOpen, setIsImageStudioModalOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isVeoModalOpen, setIsVeoModalOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isCoverBackgroundModalOpen, setIsCoverBackgroundModalOpen] = useState<boolean>(false);
  const [isCoverTextModalOpen, setIsCoverTextModalOpen] = useState<boolean>(false);
  const [isEpubModalOpen, setIsEpubModalOpen] = useState<boolean>(false);
  const [isContinuousPrintView, setIsContinuousPrintView] = useState<boolean>(false);
  const [refiningPageNumber, setRefiningPageNumber] = useState<number | null>(null);
  const [sharedBanner, setSharedBanner] = useState<string>('');

  // Check URL query for temporary shared link on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareId = params.get('share');
    if (shareId) {
      fetch(`/api/share/${shareId}`)
        .then((res) => {
          if (!res.ok) throw new Error('Link expirado ou inexistente');
          return res.json();
        })
        .then((data) => {
          if (data.edition) {
            setEdition(data.edition);
            setSharedBanner(`Você está visualizando a edição compartilhada "${data.edition.name}" (Visualização #${data.views})`);
            setTimeout(() => setSharedBanner(''), 8000);
          }
        })
        .catch((err) => {
          console.warn('Could not load shared edition:', err);
        });
    }
  }, []);

  // Filter change handler
  const handleFilterChange = (filter: PhotoFilterType) => {
    setEdition((prev) => ({
      ...prev,
      activePhotoFilter: filter,
    }));
  };

  // Image insertion from aspect ratio generator
  const handleApplyImageToPage = (pageNumber: number, imageUrl: string) => {
    setEdition((prev) => {
      const updatedPages = prev.pages.map((p) => {
        if (p.pageNumber === pageNumber) {
          return {
            ...p,
            imageSlot: {
              ...(p.imageSlot || { placement: 'asymmetric_right' }),
              customImageUrl: imageUrl,
            },
          };
        }
        return p;
      });

      // If page 1 (cover) or page 5 (profile), optionally update primary photo url
      let updatedPhotoUrl = prev.primaryPhotoUrl;
      if (pageNumber === 1 || pageNumber === 5) {
        updatedPhotoUrl = imageUrl;
      }

      return {
        ...prev,
        pages: updatedPages,
        primaryPhotoUrl: updatedPhotoUrl,
      };
    });
  };

  // Page refined by Gemini Editor-Chief
  const handlePageRefined = (pageNumber: number, refinedPage: MagazinePage) => {
    setEdition((prev) => ({
      ...prev,
      pages: prev.pages.map((p) => (p.pageNumber === pageNumber ? refinedPage : p)),
    }));
  };

  // Magazine created by autonomous creation engine
  const handleMagazineCreated = (newEdition: MagazineEdition) => {
    setEdition(newEdition);
    setActiveViewMode('spread');
  };

  // Direct cover background updater
  const handleApplyCoverBackground = (
    newPhotoUrl: string,
    filter?: PhotoFilterType,
    scrimIntensity?: string,
    photoPosition?: string
  ) => {
    setEdition((prev) => ({
      ...prev,
      primaryPhotoUrl: newPhotoUrl,
      activePhotoFilter: filter || prev.activePhotoFilter,
      pages: prev.pages.map((p) => {
        if (p.pageNumber === 1) {
          return {
            ...p,
            imageSlot: {
              ...(p.imageSlot || { placement: 'full_bleed' }),
              customImageUrl: newPhotoUrl,
            },
          };
        }
        return p;
      }),
    }));
  };

  // Direct cover typography and text updater
  const handleSaveCoverTexts = (updatedTexts: {
    name: string;
    kicker: string;
    category: string;
    date: string;
    issueNumber: string;
    headline: string;
    subheadline: string;
    deck: string;
    secondaryStories: any[];
  }) => {
    setEdition((prev) => ({
      ...prev,
      name: updatedTexts.name,
      category: updatedTexts.category,
      date: updatedTexts.date,
      issueNumber: updatedTexts.issueNumber,
      headline: updatedTexts.headline,
      subheadline: updatedTexts.subheadline,
      pages: prev.pages.map((p) => {
        if (p.pageNumber === 1) {
          return {
            ...p,
            title: updatedTexts.headline,
            kicker: updatedTexts.kicker,
            subtitle: updatedTexts.subheadline,
            deck: updatedTexts.deck,
            secondaryStories: updatedTexts.secondaryStories,
          };
        }
        return p;
      }),
    }));
  };

  const handleUpdateEdition = (updatedEdition: MagazineEdition) => {
    setEdition(updatedEdition);
  };

  const handleOpenPrint = () => {
    setIsPrintModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0c0b0a] text-[#e8e5df] flex flex-col font-sans-body">
      {/* 1. Universal Top Navigation Bar */}
      <TopBar
        onOpenCreationModal={() => setIsCreationModalOpen(true)}
        onOpenImageStudio={() => setIsImageStudioModalOpen(true)}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
        onOpenAnalysisModal={() => setIsVisualAnalysisModalOpen(true)}
        onOpenVeoModal={() => setIsVeoModalOpen(true)}
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenCoverBackgroundModal={() => setIsCoverBackgroundModalOpen(true)}
        onOpenCoverTextModal={() => setIsCoverTextModalOpen(true)}
        onOpenEpubModal={() => setIsEpubModalOpen(true)}
        onPrint={handleOpenPrint}
        activeViewMode={activeViewMode}
        onChangeViewMode={setActiveViewMode}
        magazineName={edition.name}
      />

      {/* Shared Link Notice Banner */}
      {sharedBanner && (
        <div className="no-print bg-[#1a1714] border-b border-[#c49b66]/40 px-6 py-2 flex items-center justify-between text-xs text-[#f5f1e8]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#c49b66]" />
            <span>{sharedBanner}</span>
          </div>
          <button
            onClick={() => setSharedBanner('')}
            className="text-[11px] font-mono text-[#8a857b] hover:text-white"
          >
            Fechar aviso [×]
          </button>
        </div>
      )}

      {/* Continuous A4 Inspection Bar (when active) */}
      {isContinuousPrintView && (
        <div className="no-print bg-[#1a1816] border-b border-[#332f2a] px-6 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#c49b66]">
            <Eye className="w-4 h-4" />
            <span className="font-semibold uppercase tracking-wider">
              Modo Contínuo de Impressão A4 Ativo (12 Páginas)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenPrint}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#c49b66] hover:bg-[#d6af7c] text-black font-semibold rounded uppercase tracking-wider text-[11px] transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar PDF</span>
            </button>

            <button
              onClick={() => setIsContinuousPrintView(false)}
              className="flex items-center gap-1 text-[#8a857b] hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Leitor</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Main Interactive Magazine Workspace (Screen View) */}
      <main className="flex-1 flex flex-col no-print">
        {isContinuousPrintView ? (
          <div className="w-full flex flex-col items-center gap-8 py-8 px-4 bg-[#080706]">
            {edition.pages.map((p) => (
              <div
                key={p.pageNumber}
                className="w-full max-w-[210mm] shadow-2xl rounded-sm overflow-hidden border border-[#2b2723]"
                style={{ aspectRatio: '210 / 297' }}
              >
                <PageRenderer pageNumber={p.pageNumber} edition={edition} isPrintMode={false} />
              </div>
            ))}
          </div>
        ) : (
          <MagazineReader
            edition={edition}
            viewMode={activeViewMode}
            onRefinePage={(pageNum) => setRefiningPageNumber(pageNum)}
            onFilterChange={handleFilterChange}
            onPrint={handleOpenPrint}
            onOpenShare={() => setIsShareModalOpen(true)}
            onOpenEpubModal={() => setIsEpubModalOpen(true)}
            onUpdateEdition={handleUpdateEdition}
            onOpenCoverBackgroundModal={() => setIsCoverBackgroundModalOpen(true)}
            onOpenCoverTextModal={() => setIsCoverTextModalOpen(true)}
          />
        )}
      </main>

      {/* 3. Dedicated Print Layout: Renders all 12 magazine pages sequentially for PDF/Printer export */}
      <div id="magazine-print-export-root" className="print-only-container">
        {edition.pages.map((p) => (
          <div key={p.pageNumber} className="magazine-print-sheet">
            <PageRenderer pageNumber={p.pageNumber} edition={edition} isPrintMode={true} />
          </div>
        ))}
      </div>

      {/* 4. Autonomous Creation Studio Modal */}
      <CreationModal
        isOpen={isCreationModalOpen}
        onClose={() => setIsCreationModalOpen(false)}
        onMagazineCreated={handleMagazineCreated}
      />

      {/* 5. Visual Analysis Breakdown Modal */}
      <VisualAnalysisModal
        isOpen={isVisualAnalysisModalOpen}
        onClose={() => setIsVisualAnalysisModalOpen(false)}
        photoAnalysis={edition.photoAnalysis}
        photoUrl={edition.primaryPhotoUrl}
        activeFilter={edition.activePhotoFilter}
        onFilterChange={handleFilterChange}
      />

      {/* 6. Aspect Ratio Image Generation Studio */}
      <ImageStudioModal
        isOpen={isImageStudioModalOpen}
        onClose={() => setIsImageStudioModalOpen(false)}
        onApplyImageToPage={handleApplyImageToPage}
      />

      {/* 7. Internal Audit & Self-Correction Inspector */}
      <AuditInspector
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        auditReport={edition.auditReport}
      />

      {/* 8. Page Refinement with Gemini Intelligence */}
      {refiningPageNumber !== null && (
        <RefinePageModal
          isOpen={refiningPageNumber !== null}
          onClose={() => setRefiningPageNumber(null)}
          pageNumber={refiningPageNumber}
          edition={edition}
          onPageRefined={handlePageRefined}
        />
      )}

      {/* 9. Veo 3 Video Generator Modal (veo-3.1-fast-generate-preview) */}
      <VeoVideoModal
        isOpen={isVeoModalOpen}
        onClose={() => setIsVeoModalOpen(false)}
        primaryPhotoUrl={edition.primaryPhotoUrl}
      />

      {/* 10. Google Search Grounding Modal (gemini-3.5-flash with googleSearch) */}
      <SearchGroundingModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onApplyContext={(groundedText) => {
          setEdition((prev) => ({
            ...prev,
            editorialSummary: `${prev.editorialSummary}\n\n[DADOS PESQUISADOS]: ${groundedText}`,
          }));
        }}
      />

      {/* 11. Print & PDF Export Studio Modal */}
      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        edition={edition}
        onToggleContinuousPrintView={() => setIsContinuousPrintView(!isContinuousPrintView)}
        isContinuousPrintView={isContinuousPrintView}
      />

      {/* 12. Temporary Shareable Link Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        edition={edition}
      />

      {/* 13. Cover Background & Photo Replacement Modal */}
      <CoverBackgroundModal
        isOpen={isCoverBackgroundModalOpen}
        onClose={() => setIsCoverBackgroundModalOpen(false)}
        edition={edition}
        onApplyBackground={handleApplyCoverBackground}
      />

      {/* 14. Cover Typography & Text Customization Modal */}
      <CoverTextEditModal
        isOpen={isCoverTextModalOpen}
        onClose={() => setIsCoverTextModalOpen(false)}
        edition={edition}
        onSaveTexts={handleSaveCoverTexts}
      />

      {/* 15. EPUB Digital Reader Export Modal */}
      <EpubExportModal
        isOpen={isEpubModalOpen}
        onClose={() => setIsEpubModalOpen(false)}
        edition={edition}
      />
    </div>
  );
}
