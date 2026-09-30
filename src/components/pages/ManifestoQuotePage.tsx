import React from 'react';
import { MagazineEdition } from '../../types/magazine';
import { Sparkles } from 'lucide-react';

interface ManifestoQuotePageProps {
  edition: MagazineEdition;
  onRefinePage?: (pageNumber: number) => void;
}

export const ManifestoQuotePage: React.FC<ManifestoQuotePageProps> = ({
  edition,
  onRefinePage,
}) => {
  const page = edition.pages.find((p) => p.pageNumber === 10) || edition.pages[9];

  return (
    <div className="relative w-full h-full bg-[#181716] text-[#f5f1e8] p-8 sm:p-14 flex flex-col justify-between overflow-hidden select-text paper-texture-dark group/page">
      {/* Top Running Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[11px] font-sans-body uppercase tracking-widest text-[#a8a398]">
        <span>{edition.name} · MANIFESTO EDITORIAL</span>
        <span>PÁGINA 10</span>
      </div>

      {onRefinePage && (
        <button
          onClick={() => onRefinePage(10)}
          className="no-print absolute top-3 right-3 opacity-0 group-hover/page:opacity-100 transition-opacity flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-sans-body uppercase tracking-wider bg-white/10 hover:bg-white/20 text-[#c49b66] rounded backdrop-blur-sm shadow-xs"
        >
          <Sparkles className="w-3 h-3" />
          <span>Refinar Manifesto</span>
        </button>
      )}

      {/* Main Full-Bleed Typographic Statement */}
      <div className="my-auto flex flex-col items-center text-center max-w-3xl mx-auto py-8">
        <div className="text-xs uppercase font-sans-body tracking-widest text-[#c49b66] font-semibold mb-6">
          {page.kicker || 'MANIFESTO DE ENCERRAMENTO // ED. 42'}
        </div>

        <span className="text-6xl sm:text-7xl font-serif-display text-[#c49b66]/60 leading-none mb-4 select-none">
          “
        </span>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-editorial italic font-normal text-white leading-relaxed tracking-wide text-balance mb-6">
          {page.pullQuote?.text ||
            'O futuro não pertence àqueles que resistem à tecnologia, nem àqueles que se curvam cegamente a ela — mas sim àqueles que sabem direcioná-la com coragem, sabedoria e generosidade humana.'}
        </h2>

        <div className="h-[1px] w-16 bg-[#c49b66] my-4" />

        <div className="text-xs font-sans-body uppercase tracking-widest text-[#c49b66] font-medium">
          {page.pullQuote?.attribution || 'VANGUARD EDITORIAL PRESS'}
        </div>

        {page.paragraphs && page.paragraphs.length > 0 && (
          <p className="mt-6 text-xs sm:text-sm font-sans-body text-[#9e998f] max-w-xl leading-relaxed">
            {page.paragraphs[0]}
          </p>
        )}
      </div>

      {/* Bottom Running Footer */}
      <div className="flex items-center justify-between border-t border-white/10 pt-2 text-[10px] font-mono text-[#8a857b]">
        <span>DIRETIVA FILOSÓFICA DE PUBLICAÇÃO</span>
        <span>SEGUINTE: EXPEDIENTE TÉCNICO (PÁG. 11) →</span>
      </div>
    </div>
  );
};
