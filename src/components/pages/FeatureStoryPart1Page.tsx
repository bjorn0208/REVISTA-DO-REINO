import React from 'react';
import { MagazineEdition } from '../../types/magazine';
import { Sparkles } from 'lucide-react';

interface FeatureStoryPart1PageProps {
  edition: MagazineEdition;
  onRefinePage?: (pageNumber: number) => void;
}

export const FeatureStoryPart1Page: React.FC<FeatureStoryPart1PageProps> = ({
  edition,
  onRefinePage,
}) => {
  const page = edition.pages.find((p) => p.pageNumber === 3) || edition.pages[2];
  const photoUrl = page.imageSlot?.customImageUrl || '/src/assets/images/editorial_summit_hall_1790801404528.jpg';

  return (
    <div className="relative w-full h-full bg-[#fbf9f5] text-[#1a1918] p-8 sm:p-12 flex flex-col justify-between overflow-hidden select-text paper-texture group/page">
      {/* Top Running Header */}
      <div className="flex items-center justify-between border-b border-[#ded9cf] pb-2 text-[11px] font-sans-body uppercase tracking-widest text-[#706c64]">
        <span>MATÉRIA DE CAPA · {edition.category}</span>
        <span>PÁGINA 03</span>
      </div>

      {onRefinePage && (
        <button
          onClick={() => onRefinePage(3)}
          className="no-print absolute top-3 right-3 opacity-0 group-hover/page:opacity-100 transition-opacity flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-sans-body uppercase tracking-wider bg-[#1f1d1a] text-[#c49b66] rounded shadow-xs"
        >
          <Sparkles className="w-3 h-3" />
          <span>Refinar Matéria</span>
        </button>
      )}

      {/* Main Content Area */}
      <div className="my-auto flex flex-col gap-6">
        {/* Header Block */}
        <div className="flex flex-col gap-2">
          <div className="text-xs uppercase font-sans-body tracking-widest text-[#8c2b1d] font-semibold">
            {page.kicker || 'MATÉRIA PRINCIPAL // PARTE I'}
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display font-bold text-[#141413] tracking-tight leading-tight max-w-3xl text-balance">
            {page.title}
          </h2>

          {page.subtitle && (
            <p className="text-base sm:text-lg font-editorial italic text-[#4a4741] leading-relaxed max-w-2xl">
              {page.subtitle}
            </p>
          )}

          {page.deck && (
            <div className="border-l-2 border-[#8c2b1d] pl-4 py-1 text-xs sm:text-sm font-sans-body text-[#5c574e] leading-relaxed max-w-2xl bg-[#f5f1e8]/60 mt-1">
              {page.deck}
            </div>
          )}
        </div>

        {/* Content Layout: 2 Columns of Text + Asymmetric Image Feature */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Prose columns (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4 text-xs sm:text-[13px] font-sans-body text-[#2e2c28] leading-relaxed">
            {page.paragraphs && page.paragraphs.length > 0 ? (
              page.paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 0
                      ? 'first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[#8c2b1d]'
                      : ''
                  }
                >
                  {p}
                </p>
              ))
            ) : (
              <p>Texto editorial da matéria principal em diagramação.</p>
            )}

            {page.pullQuote && (
              <div className="my-3 py-3 border-y border-[#ded9cf]">
                <p className="text-base sm:text-lg font-editorial italic text-[#141413] leading-snug">
                  "{page.pullQuote.text}"
                </p>
                {page.pullQuote.context && (
                  <span className="block text-[10px] font-sans-body uppercase tracking-wider text-[#8a857b] mt-1.5">
                    {page.pullQuote.context}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Editorial Visual Feature (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-2">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded bg-[#1e1c1a] shadow-xs">
              <img
                src={photoUrl}
                alt="Matéria Principal"
                className="w-full h-full object-cover grayscale-[20%] contrast-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 border border-black/10 pointer-events-none" />
            </div>

            <div className="text-[11px] font-sans-body text-[#6e6960] flex flex-col">
              <span className="italic font-editorial text-xs text-[#383632]">
                {page.imageSlot?.caption || 'Perspectiva plenária sobre inteligência artificial e estratégias corporativas.'}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#99948a] mt-0.5 font-mono">
                {page.imageSlot?.credit || 'ARQUIVO DE COBERTURA EDITORIAL'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Running Footer */}
      <div className="flex items-center justify-between border-t border-[#ded9cf] pt-2 text-[10px] font-mono text-[#7a766e]">
        <span>VANGUARD · {edition.issueNumber}</span>
        <span>CONTINUA NA PÁGINA 04 →</span>
      </div>
    </div>
  );
};
