import React from 'react';
import { MagazineEdition } from '../../types/magazine';
import { Sparkles } from 'lucide-react';

interface BackCoverPageProps {
  edition: MagazineEdition;
  onRefinePage?: (pageNumber: number) => void;
}

export const BackCoverPage: React.FC<BackCoverPageProps> = ({ edition, onRefinePage }) => {
  const page = edition.pages.find((p) => p.pageNumber === 12) || edition.pages[11];

  return (
    <div className="relative w-full h-full bg-[#121110] text-white p-10 sm:p-16 flex flex-col justify-between overflow-hidden select-none group/page">
      {/* Background subtle geometric hairline grid */}
      <div className="absolute inset-0 bg-radial from-[#1e1c1a] to-[#121110] opacity-80" />
      <div className="absolute inset-8 border border-white/10 pointer-events-none" />

      {onRefinePage && (
        <button
          onClick={() => onRefinePage(12)}
          className="no-print absolute top-12 right-12 opacity-0 group-hover/page:opacity-100 transition-opacity flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-sans-body uppercase tracking-wider bg-white/10 hover:bg-white/20 text-[#c49b66] rounded backdrop-blur-sm shadow-xs z-20"
        >
          <Sparkles className="w-3 h-3" />
          <span>Refinar Contracapa</span>
        </button>
      )}

      {/* Top Section: Running Issue Number */}
      <div className="relative z-10 flex items-center justify-between text-[11px] font-sans-body uppercase tracking-widest text-[#a8a39a]">
        <span>{edition.category}</span>
        <span>{edition.issueNumber}</span>
      </div>

      {/* Center Section: Iconic Wordmark and Closing Aphorism */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center max-w-xl mx-auto py-12">
        <h2 className="text-5xl sm:text-6xl font-headline font-bold tracking-widest text-[#f5f1e8] uppercase mb-6">
          {edition.name}
        </h2>

        <div className="h-[1px] w-12 bg-[#c49b66] mb-8" />

        {page.pullQuote?.text && (
          <p className="text-xl sm:text-2xl font-editorial italic text-[#e0dad0] leading-relaxed mb-4">
            {page.pullQuote.text}
          </p>
        )}

        <span className="text-xs font-sans-body uppercase tracking-widest text-[#c49b66]">
          {page.pullQuote?.attribution || 'VANGUARD ARCHIVES'}
        </span>

        {page.paragraphs && page.paragraphs.length > 0 && (
          <p className="mt-8 text-xs font-sans-body text-[#8c877e] leading-relaxed max-w-md">
            {page.paragraphs[0]}
          </p>
        )}
      </div>

      {/* Bottom Section: Barcode, ISBN and Publisher Seal */}
      <div className="relative z-10 flex items-end justify-between border-t border-white/15 pt-6 text-[10px] font-mono text-[#8a857b]">
        <div className="flex flex-col gap-1">
          <span className="font-sans-body tracking-wider uppercase text-[#c49b66]">
            MAGAZINE ARCHITECT AUTONOMOUS EDITION
          </span>
          <span>ISSN 2984-1184 · ED. 2026</span>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="tracking-tighter text-sm font-mono select-all">||||| | ||||| |||| | |||</span>
          <span className="text-[9px] uppercase tracking-normal font-sans-body">VANGUARDPRESS.COM</span>
        </div>
      </div>
    </div>
  );
};
