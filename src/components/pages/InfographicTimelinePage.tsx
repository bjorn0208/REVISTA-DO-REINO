import React from 'react';
import { MagazineEdition } from '../../types/magazine';
import { Sparkles } from 'lucide-react';

interface InfographicTimelinePageProps {
  edition: MagazineEdition;
  onRefinePage?: (pageNumber: number) => void;
}

export const InfographicTimelinePage: React.FC<InfographicTimelinePageProps> = ({
  edition,
  onRefinePage,
}) => {
  const page = edition.pages.find((p) => p.pageNumber === 9) || edition.pages[8];

  return (
    <div className="relative w-full h-full bg-[#fbf9f5] text-[#1a1918] p-8 sm:p-12 flex flex-col justify-between overflow-hidden select-text paper-texture group/page">
      {/* Top Running Header */}
      <div className="flex items-center justify-between border-b border-[#ded9cf] pb-2 text-[11px] font-sans-body uppercase tracking-widest text-[#706c64]">
        <span>INFOGRÁFICO ESPECIAL · MATRIZ ESTRATÉGICA</span>
        <span>PÁGINA 09</span>
      </div>

      {onRefinePage && (
        <button
          onClick={() => onRefinePage(9)}
          className="no-print absolute top-3 right-3 opacity-0 group-hover/page:opacity-100 transition-opacity flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-sans-body uppercase tracking-wider bg-[#1f1d1a] text-[#c49b66] rounded shadow-xs"
        >
          <Sparkles className="w-3 h-3" />
          <span>Refinar Infográfico</span>
        </button>
      )}

      {/* Main Content Area */}
      <div className="my-auto flex flex-col gap-6">
        <div className="flex flex-col gap-2 max-w-3xl">
          <div className="text-xs uppercase font-sans-body tracking-widest text-[#8c2b1d] font-semibold">
            {page.kicker || 'INFOGRÁFICO // MATRIZ EVOLUTIVA'}
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif-display font-medium text-[#141413] leading-tight text-balance">
            {page.title}
          </h2>

          {page.subtitle && (
            <p className="text-sm sm:text-base font-editorial italic text-[#524e47] leading-relaxed">
              {page.subtitle}
            </p>
          )}

          {page.paragraphs && page.paragraphs.length > 0 && (
            <p className="text-xs sm:text-[13px] font-sans-body text-[#3e3b35] leading-relaxed mt-1">
              {page.paragraphs[0]}
            </p>
          )}
        </div>

        {/* 4-Stage Editorial Timeline Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-2">
          {page.timelineMilestones && page.timelineMilestones.length > 0 ? (
            page.timelineMilestones.map((m, idx) => (
              <div
                key={idx}
                className="p-5 bg-[#f4efe5] border border-[#ded7ca] rounded-sm flex flex-col justify-between gap-3 relative"
              >
                <div>
                  <div className="flex items-center justify-between text-[#8c2b1d] text-xs font-mono font-bold tracking-wider mb-2">
                    <span className="text-[11px] truncate">{m.phase || `ETAPA 0${idx + 1}`}</span>
                    <span className="text-lg font-serif-display text-[#8c2b1d]/40">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-sm font-serif-display font-bold text-[#141413] leading-snug mb-2">
                    {m.title}
                  </h3>

                  <p className="text-[11px] font-sans-body text-[#47433c] leading-relaxed">
                    {m.detail}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#ded7ca] flex items-center justify-between text-[10px] font-mono text-[#8a857b]">
                  <span>MATURIDADE {idx * 25 + 25}%</span>
                  <span>FASE {idx + 1}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs">Linha do tempo em diagramação.</div>
          )}
        </div>

        {/* Footnote on editorial veracity */}
        <div className="p-3.5 bg-[#f3ede3] border-l-2 border-[#8c2b1d] text-[11px] font-sans-body text-[#5e5a52]">
          <span className="font-semibold text-[#141413]">Nota Metodológica: </span>
          Os estágios acima foram sintetizados pela equipe editorial a partir do conteúdo debatido em conferência, constituindo um modelo interpretativo para análise executiva.
        </div>
      </div>

      {/* Bottom Running Footer */}
      <div className="flex items-center justify-between border-t border-[#ded9cf] pt-2 text-[10px] font-mono text-[#7a766e]">
        <span>MATRIZ EVOLUTIVA CONCLUÍDA</span>
        <span>SEGUINTE: MANIFESTO EDITORIAL (PÁG. 10) →</span>
      </div>
    </div>
  );
};
