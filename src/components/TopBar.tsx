import React from 'react';
import { Sparkles, Printer, Layers, Eye, ShieldCheck, Image as ImageIcon, Film, Globe, Share2, Camera, Type, BookOpen } from 'lucide-react';

interface TopBarProps {
  onOpenCreationModal: () => void;
  onOpenImageStudio: () => void;
  onOpenAuditModal: () => void;
  onOpenAnalysisModal: () => void;
  onOpenVeoModal: () => void;
  onOpenSearchModal: () => void;
  onOpenShareModal: () => void;
  onOpenCoverBackgroundModal?: () => void;
  onOpenCoverTextModal?: () => void;
  onOpenEpubModal?: () => void;
  onPrint: () => void;
  activeViewMode: 'spread' | 'single' | 'grid';
  onChangeViewMode: (mode: 'spread' | 'single' | 'grid') => void;
  magazineName: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenCreationModal,
  onOpenImageStudio,
  onOpenAuditModal,
  onOpenAnalysisModal,
  onOpenVeoModal,
  onOpenSearchModal,
  onOpenShareModal,
  onOpenCoverBackgroundModal,
  onOpenCoverTextModal,
  onOpenEpubModal,
  onPrint,
  activeViewMode,
  onChangeViewMode,
  magazineName,
}) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3.5 bg-[#141312]/95 backdrop-blur-md border-b border-[#292724] no-print">
      {/* Zone 1: Brand title, single text element wordmark */}
      <div className="flex items-center gap-3">
        <a href="/" className="flex items-baseline gap-2 group">
          <span className="text-lg font-serif-display font-bold tracking-widest text-[#f3efe7] uppercase group-hover:text-[#c49b66] transition-colors">
            MAGAZINE ARCHITECT
          </span>
          <span className="hidden xl:inline text-[11px] font-sans-body uppercase tracking-wider text-[#8a857c]">
            · Autonomous Editorial Engine
          </span>
        </a>
      </div>

      {/* Zone 2: Clean text navigation links / view controls */}
      <nav className="hidden lg:flex items-center gap-5 text-xs uppercase tracking-wider font-sans-body text-[#9e998f]">
        {onOpenCoverBackgroundModal && (
          <button
            onClick={onOpenCoverBackgroundModal}
            className="flex items-center gap-1.5 hover:text-[#c49b66] transition-colors"
            title="Trocar a foto ou fundo da capa da revista"
          >
            <Camera className="w-3.5 h-3.5 text-[#c49b66]" />
            <span className="text-[#e2ded5]">Fundo da Capa</span>
          </button>
        )}

        {onOpenCoverTextModal && (
          <button
            onClick={onOpenCoverTextModal}
            className="flex items-center gap-1.5 hover:text-[#c49b66] transition-colors"
            title="Editar títulos, manchetes e textos da capa"
          >
            <Type className="w-3.5 h-3.5 text-[#c49b66]" />
            <span className="text-[#e2ded5]">Letras da Capa</span>
          </button>
        )}

        <button
          onClick={onOpenAnalysisModal}
          className="flex items-center gap-1.5 hover:text-[#f3efe7] transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Análise Visual</span>
        </button>

        <button
          onClick={onOpenImageStudio}
          className="flex items-center gap-1.5 hover:text-[#f3efe7] transition-colors"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Proporções</span>
        </button>

        <button
          onClick={onOpenVeoModal}
          className="flex items-center gap-1.5 hover:text-[#f3efe7] transition-colors"
        >
          <Film className="w-3.5 h-3.5" />
          <span>Vídeo Veo 3</span>
        </button>

        <button
          onClick={onOpenSearchModal}
          className="flex items-center gap-1.5 hover:text-[#f3efe7] transition-colors"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Pesquisa Google</span>
        </button>

        <button
          onClick={onOpenAuditModal}
          className="flex items-center gap-1.5 hover:text-[#f3efe7] transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Auditoria</span>
        </button>

        <div className="h-3.5 w-[1px] bg-[#33302b]" />

        {/* View mode segmented buttons */}
        <div className="flex items-center p-0.5 bg-[#1e1c1a] rounded-md border border-[#33302b]">
          <button
            onClick={() => onChangeViewMode('spread')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors whitespace-nowrap ${
              activeViewMode === 'spread'
                ? 'bg-[#2e2a25] text-[#f3efe7] shadow-xs'
                : 'text-[#8a857c] hover:text-[#e8e6e3]'
            }`}
            title="Visualização em página dupla (Spread)"
          >
            Página Dupla
          </button>
          <button
            onClick={() => onChangeViewMode('single')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors whitespace-nowrap ${
              activeViewMode === 'single'
                ? 'bg-[#2e2a25] text-[#f3efe7] shadow-xs'
                : 'text-[#8a857c] hover:text-[#e8e6e3]'
            }`}
            title="Visualização página única"
          >
            Página Única
          </button>
          <button
            onClick={() => onChangeViewMode('grid')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors whitespace-nowrap ${
              activeViewMode === 'grid'
                ? 'bg-[#2e2a25] text-[#f3efe7] shadow-xs'
                : 'text-[#8a857c] hover:text-[#e8e6e3]'
            }`}
            title="Grade de páginas (Thumbnails)"
          >
            Grade
          </button>
        </div>
      </nav>

      {/* Zone 3: Primary actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenShareModal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans-body uppercase tracking-wider text-[#dcd7ce] bg-[#1e1c1a] hover:bg-[#2e2a25] border border-[#3a3630] rounded-md transition-colors whitespace-nowrap"
          title="Gerar link temporário compartilhável da revista"
        >
          <Share2 className="w-3.5 h-3.5 text-[#c49b66]" />
          <span className="hidden sm:inline">Compartilhar</span>
        </button>

        <button
          onClick={onPrint}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans-body uppercase tracking-wider text-[#dcd7ce] bg-[#1e1c1a] hover:bg-[#2e2a25] border border-[#3a3630] rounded-md transition-colors whitespace-nowrap"
          title="Exportar ou Imprimir em PDF formato Revista A4"
        >
          <Printer className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Imprimir / PDF</span>
        </button>

        {onOpenEpubModal && (
          <button
            onClick={onOpenEpubModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans-body uppercase tracking-wider text-[#dcd7ce] bg-[#1e1c1a] hover:bg-[#2e2a25] border border-[#3a3630] rounded-md transition-colors whitespace-nowrap"
            title="Exportar como e-Book EPUB para Kindle, Kobo e Apple Books"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#c49b66]" />
            <span className="hidden md:inline">EPUB</span>
          </button>
        )}

        <button
          onClick={onOpenCreationModal}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-sans-body uppercase tracking-wider font-semibold text-[#0f0e0d] bg-[#c49b66] hover:bg-[#d6af7c] rounded-md transition-colors shadow-xs whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Criar Revista</span>
        </button>
      </div>
    </header>
  );
};
