import React from 'react';
import { MagazineEdition } from '../../types/magazine';
import { Sparkles } from 'lucide-react';

interface FeatureStoryPart2PageProps {
  edition: MagazineEdition;
  onRefinePage?: (pageNumber: number) => void;
}

export const FeatureStoryPart2Page: React.FC<FeatureStoryPart2PageProps> = ({
  edition,
  onRefinePage,
}) => {
  const page = edition.pages.find((p) => p.pageNumber === 4) || edition.pages[3];

  return (
    <div className="relative w-full h-full bg-[#fbf9f5] text-[#1a1918] p-8 sm:p-12 flex flex-col justify-between overflow-hidden select-text paper-texture group/page">
      {/* Top Running Header */}
      <div className="flex items-center justify-between border-b border-[#ded9cf] pb-2 text-[11px] font-sans-body uppercase tracking-widest text-[#706c64]">
        <span>MATÉRIA DE CAPA · DESDOBRAMENTO</span>
        <span>PÁGINA 04</span>
      </div>

      {onRefinePage && (
        <button
          onClick={() => onRefinePage(4)}
          className="no-print absolute top-3 right-3 opacity-0 group-hover/page:opacity-100 transition-opacity flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-sans-body uppercase tracking-wider bg-[#1f1d1a] text-[#c49b66] rounded shadow-xs"
        >
          <Sparkles className="w-3 h-3" />
          <span>Refinar Matéria</span>
        </button>
      )}

      {/* Main Content Area */}
      <div className="my-auto flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <div className="text-xs uppercase font-sans-body tracking-widest text-[#8c2b1d] font-semibold">
            {page.kicker || 'MATÉRIA PRINCIPAL // PARTE II'}
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif-display font-bold text-[#141413] tracking-tight leading-tight max-w-2xl text-balance">
            {page.title}
          </h2>

          {page.subtitle && (
            <p className="text-sm sm:text-base font-editorial italic text-[#524e47] leading-relaxed max-w-2xl">
              {page.subtitle}
            </p>
          )}
        </div>

        {/* 2 Columns + Structured Box Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main 2-column prose (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-[13px] font-sans-body text-[#2e2c28] leading-relaxed">
              {page.paragraphs && page.paragraphs.length > 0 ? (
                page.paragraphs.map((p, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {p}
                  </p>
                ))
              ) : (
                <p>Desenvolvimento da matéria em diagramação.</p>
              )}
            </div>

            {page.pullQuote && (
              <div className="my-2 p-5 bg-[#f4efe5] border-l-3 border-[#8c2b1d] rounded-r">
                <p className="text-base sm:text-lg font-editorial italic text-[#141413] leading-snug">
                  "{page.pullQuote.text}"
                </p>
                {page.pullQuote.attribution && (
                  <span className="block text-[11px] font-sans-body uppercase tracking-wider text-[#7d786f] mt-2">
                    — {page.pullQuote.attribution}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Editorial Analysis Box (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {page.sidebarBox ? (
              <div className="p-5 bg-[#f3ede3] border border-[#ded7ca] rounded flex flex-col gap-3">
                <div className="text-[11px] font-sans-body uppercase tracking-wider text-[#8c2b1d] font-bold">
                  {page.sidebarBox.title}
                </div>
                <div className="h-[1px] w-8 bg-[#8c2b1d]" />

                <ul className="space-y-2.5 text-xs font-sans-body text-[#3e3b35]">
                  {page.sidebarBox.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#8c2b1d] font-mono text-[11px] mt-0.5 font-bold">
                        0{idx + 1}.
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                {page.sidebarBox.note && (
                  <div className="pt-2 border-t border-[#ded7ca] text-[10px] font-sans-body text-[#757067] italic">
                    {page.sidebarBox.note}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-[#f3ede3] border border-[#ded7ca] text-xs font-sans-body">
                Box analítico complementar da liderança executiva.
              </div>
            )}

            <div className="p-4 border border-[#ded9cf] text-[11px] font-sans-body text-[#6b665d] leading-relaxed">
              <span className="font-semibold text-[#141413] block mb-1">
                Critério de Não-Invenção Editorial:
              </span>
              O conteúdo deste desdobramento traduz fielmente os pilares conceituais do tema fornecido, sem atribuir aspas não confirmadas a fontes reais.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Running Footer */}
      <div className="flex items-center justify-between border-t border-[#ded9cf] pt-2 text-[10px] font-mono text-[#7a766e]">
        <span>MATÉRIA PRINCIPAL CONCLUÍDA</span>
        <span>SEGUINTE: PERFIL & CONTEXTO (PÁG. 05) →</span>
      </div>
    </div>
  );
};
