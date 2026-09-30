import React from 'react';
import { MagazineEdition } from '../../types/magazine';
import { Sparkles } from 'lucide-react';

interface EditorialPageProps {
  edition: MagazineEdition;
  onRefinePage?: (pageNumber: number) => void;
  onNavigateToPage?: (pageNumber: number) => void;
}

export const EditorialPage: React.FC<EditorialPageProps> = ({
  edition,
  onRefinePage,
  onNavigateToPage,
}) => {
  const page = edition.pages.find((p) => p.pageNumber === 2) || edition.pages[1];

  return (
    <div className="relative w-full h-full bg-[#fbf9f5] text-[#1a1918] p-8 sm:p-12 flex flex-col justify-between overflow-hidden select-text paper-texture group/page">
      {/* Top Running Header */}
      <div className="flex items-center justify-between border-b border-[#ded9cf] pb-2 text-[11px] font-sans-body uppercase tracking-widest text-[#706c64]">
        <span>{edition.name} · CADERNO DE ABERTURA</span>
        <span>{edition.date} · PÁGINA 02</span>
      </div>

      {/* Refine affordance */}
      {onRefinePage && (
        <button
          onClick={() => onRefinePage(2)}
          className="no-print absolute top-3 right-3 opacity-0 group-hover/page:opacity-100 transition-opacity flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-sans-body uppercase tracking-wider bg-[#1f1d1a] text-[#c49b66] rounded shadow-xs"
        >
          <Sparkles className="w-3 h-3" />
          <span>Refinar Editorial</span>
        </button>
      )}

      {/* Main Grid: Letter from the Editor (7 cols) + Table of Contents (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 my-auto">
        {/* Left: Carta do Editor */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="text-xs uppercase font-sans-body tracking-widest text-[#8c2b1d] font-semibold">
            {page.kicker || 'CARTA DO EDITOR // ED. 42'}
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif-display font-medium text-[#111] leading-tight text-balance">
            {page.title || 'O Imperativo da Síntese'}
          </h2>

          {page.subtitle && (
            <p className="text-sm font-editorial italic text-[#59554d] leading-relaxed">
              {page.subtitle}
            </p>
          )}

          <div className="h-[1px] w-12 bg-[#8c2b1d] my-1" />

          {/* Letter Body with Classic Drop Cap */}
          <div className="space-y-3.5 text-xs sm:text-[13px] leading-relaxed font-sans-body text-[#383531]">
            {page.paragraphs && page.paragraphs.length > 0 ? (
              page.paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 0
                      ? 'first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[#8c2b1d] leading-relaxed'
                      : 'leading-relaxed'
                  }
                >
                  {p}
                </p>
              ))
            ) : (
              <p>Conteúdo editorial em diagramação.</p>
            )}
          </div>

          {page.pullQuote && (
            <div className="border-l-2 border-[#8c2b1d] pl-4 py-1.5 my-2 bg-[#f3efe7]/50">
              <p className="text-xs sm:text-sm font-editorial italic text-[#262422] leading-snug">
                "{page.pullQuote.text}"
              </p>
              {page.pullQuote.attribution && (
                <span className="block text-[10px] font-sans-body uppercase tracking-wider text-[#736f67] mt-1">
                  — {page.pullQuote.attribution}
                </span>
              )}
            </div>
          )}

          {/* Editor Sign-off */}
          <div className="pt-2 text-xs font-editorial italic text-[#4a4740]">
            <div>Mesa Diretora de Redação</div>
            <div className="font-serif-display not-italic font-bold text-sm tracking-wide text-[#111]">
              MAGAZINE ARCHITECT
            </div>
          </div>
        </div>

        {/* Right: Sumário / Table of Contents */}
        <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#ded9cf] pt-6 lg:pt-0 lg:pl-8">
          <div>
            <div className="text-xs uppercase font-sans-body tracking-widest text-[#706c64] font-semibold mb-1">
              SUMÁRIO DA PUBLICAÇÃO
            </div>
            <h3 className="text-xl font-serif-display font-bold text-[#111] mb-4">
              Nesta Edição
            </h3>

            <div className="divide-y divide-[#e8e4dc]">
              {page.secondaryStories && page.secondaryStories.length > 0 ? (
                page.secondaryStories.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (onNavigateToPage) {
                        const target = idx === 0 ? 1 : idx === 1 ? 3 : idx === 2 ? 5 : idx === 3 ? 6 : idx === 4 ? 7 : idx === 5 ? 9 : 10;
                        onNavigateToPage(target);
                      }
                    }}
                    className="py-2.5 flex items-start justify-between gap-3 group cursor-pointer hover:bg-[#f3efe7]/80 px-1 rounded transition-colors"
                  >
                    <div>
                      <h4 className="text-xs font-serif-display font-semibold text-[#1f1e1c] group-hover:text-[#8c2b1d] transition-colors leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[11px] font-sans-body text-[#6b665e] mt-0.5 line-clamp-1">
                        {item.summary}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-medium text-[#8c2b1d] tracking-wider shrink-0">
                      {item.pageRef}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-[#777]">Sumário padrão em diagramação.</div>
              )}
            </div>
          </div>

          {/* Barcode & Issue Registration stamp */}
          <div className="mt-6 pt-4 border-t border-[#ded9cf] flex items-center justify-between text-[10px] font-mono text-[#8a857b]">
            <span>REGISTRO EDITORIAL: ISO-9001/BR</span>
            <span>VOL. 08 // EXCL</span>
          </div>
        </div>
      </div>

      {/* Bottom Running Footer */}
      <div className="flex items-center justify-between border-t border-[#ded9cf] pt-2 text-[10px] font-mono text-[#7a766e]">
        <span>DIRETORIA EDITORIAL INDEPENDENTE</span>
        <span>VANGUARD PRESS · TODOS OS DIREITOS RESERVADOS</span>
      </div>
    </div>
  );
};
