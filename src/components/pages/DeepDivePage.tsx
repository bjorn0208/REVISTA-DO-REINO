import React from 'react';
import { MagazineEdition } from '../../types/magazine';
import { Sparkles } from 'lucide-react';

interface DeepDivePageProps {
  edition: MagazineEdition;
  onRefinePage?: (pageNumber: number) => void;
}

export const DeepDivePage: React.FC<DeepDivePageProps> = ({ edition, onRefinePage }) => {
  const page = edition.pages.find((p) => p.pageNumber === 7) || edition.pages[6];

  return (
    <div className="relative w-full h-full bg-[#fbf9f5] text-[#1a1918] p-8 sm:p-12 flex flex-col justify-between overflow-hidden select-text paper-texture group/page">
      {/* Top Running Header */}
      <div className="flex items-center justify-between border-b border-[#ded9cf] pb-2 text-[11px] font-sans-body uppercase tracking-widest text-[#706c64]">
        <span>ENSAIO EDITORIAL · MERCADO & TRABALHO</span>
        <span>PÁGINA 07</span>
      </div>

      {onRefinePage && (
        <button
          onClick={() => onRefinePage(7)}
          className="no-print absolute top-3 right-3 opacity-0 group-hover/page:opacity-100 transition-opacity flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-sans-body uppercase tracking-wider bg-[#1f1d1a] text-[#c49b66] rounded shadow-xs"
        >
          <Sparkles className="w-3 h-3" />
          <span>Refinar Ensaio</span>
        </button>
      )}

      {/* Main Content Area */}
      <div className="my-auto flex flex-col gap-6">
        <div className="flex flex-col gap-2 max-w-3xl">
          <div className="text-xs uppercase font-sans-body tracking-widest text-[#8c2b1d] font-semibold">
            {page.kicker || 'ENSAIO // SOCIABILIDADE & MERCADO'}
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif-display font-medium text-[#141413] leading-tight text-balance">
            {page.title}
          </h2>

          {page.subtitle && (
            <p className="text-sm sm:text-base font-editorial italic text-[#524e47] leading-relaxed">
              {page.subtitle}
            </p>
          )}
        </div>

        {/* 2-Column Prose with Generous Lead */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-[13px] font-sans-body text-[#2e2c28] leading-relaxed">
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
            <p>Texto do ensaio em diagramação.</p>
          )}
        </div>

        {/* Dramatic Pull Quote Section */}
        {page.pullQuote && (
          <div className="my-3 py-6 px-8 bg-[#f4efe5] border-y border-[#ded7ca] text-center flex flex-col items-center">
            <span className="text-[#8c2b1d] text-2xl font-serif-display leading-none mb-1">“</span>
            <p className="text-lg sm:text-xl font-editorial italic text-[#141413] max-w-2xl leading-snug">
              {page.pullQuote.text}
            </p>
            {page.pullQuote.context && (
              <span className="text-[10px] font-sans-body uppercase tracking-wider text-[#8a857b] mt-3 font-mono">
                {page.pullQuote.context}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Running Footer */}
      <div className="flex items-center justify-between border-t border-[#ded9cf] pt-2 text-[10px] font-mono text-[#7a766e]">
        <span>SÉRIE ESPECIAL · O FUTURO DO TRABALHO</span>
        <span>CONTINUAÇÃO NA PÁGINA 08 →</span>
      </div>
    </div>
  );
};
