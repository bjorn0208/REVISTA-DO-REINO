import React from 'react';
import { MagazineEdition } from '../../types/magazine';
import { Sparkles } from 'lucide-react';

interface InsightsPageProps {
  edition: MagazineEdition;
  onRefinePage?: (pageNumber: number) => void;
}

export const InsightsPage: React.FC<InsightsPageProps> = ({ edition, onRefinePage }) => {
  const page = edition.pages.find((p) => p.pageNumber === 6) || edition.pages[5];

  return (
    <div className="relative w-full h-full bg-[#fbf9f5] text-[#1a1918] p-8 sm:p-12 flex flex-col justify-between overflow-hidden select-text paper-texture group/page">
      {/* Top Running Header */}
      <div className="flex items-center justify-between border-b border-[#ded9cf] pb-2 text-[11px] font-sans-body uppercase tracking-widest text-[#706c64]">
        <span>PAINEL ESTRATÉGICO · INSIGHTS & EIXOS</span>
        <span>PÁGINA 06</span>
      </div>

      {onRefinePage && (
        <button
          onClick={() => onRefinePage(6)}
          className="no-print absolute top-3 right-3 opacity-0 group-hover/page:opacity-100 transition-opacity flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-sans-body uppercase tracking-wider bg-[#1f1d1a] text-[#c49b66] rounded shadow-xs"
        >
          <Sparkles className="w-3 h-3" />
          <span>Refinar Insights</span>
        </button>
      )}

      {/* Main Content Area */}
      <div className="my-auto flex flex-col gap-6">
        <div className="flex flex-col gap-2 max-w-3xl">
          <div className="text-xs uppercase font-sans-body tracking-widest text-[#8c2b1d] font-semibold">
            {page.kicker || 'DESTAQUES & INSIGHTS // PAINEL EXECUTIVO'}
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif-display font-bold text-[#141413] leading-tight text-balance">
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

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-2">
          {page.statsOrPillars && page.statsOrPillars.length > 0 ? (
            page.statsOrPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-6 bg-[#f4efe5] border border-[#ded7ca] rounded-sm flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between text-[#8c2b1d] text-xs font-mono font-bold tracking-wider mb-2">
                    <span>{pillar.label || `EIXO 0${idx + 1}`}</span>
                    <span className="text-2xl font-serif-display text-[#8c2b1d]/40">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-lg font-serif-display font-semibold text-[#141413] leading-snug mb-2">
                    {pillar.value}
                  </h3>

                  <p className="text-xs font-sans-body text-[#47433c] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#ded7ca] text-[10px] font-mono text-[#8a857b] uppercase">
                  VETOR OPERACIONAL · VANGUARD
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs">Pilares em diagramação.</div>
          )}
        </div>

        {/* Strategic Implications Box */}
        {page.sidebarBox && (
          <div className="p-5 bg-[#f3ede3] border-l-3 border-[#8c2b1d] rounded-r flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-sans-body uppercase tracking-wider text-[#8c2b1d] font-bold mb-1">
                {page.sidebarBox.title}
              </h4>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-sans-body text-[#383530]">
                {page.sidebarBox.items.map((it, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8c2b1d]" />
                    <span>{it}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="shrink-0 text-[10px] font-mono uppercase text-[#736f66] bg-[#e8e2d5] px-2.5 py-1 rounded">
              DIRETRIZ ESTRATÉGICA
            </div>
          </div>
        )}
      </div>

      {/* Bottom Running Footer */}
      <div className="flex items-center justify-between border-t border-[#ded9cf] pt-2 text-[10px] font-mono text-[#7a766e]">
        <span>PAINEL DE EIXOS CONCLUÍDO</span>
        <span>SEGUINTE: DESENVOLVIMENTO (PÁG. 07 & 08) →</span>
      </div>
    </div>
  );
};
