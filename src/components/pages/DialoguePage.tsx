import React from 'react';
import { MagazineEdition } from '../../types/magazine';
import { Sparkles, CheckSquare } from 'lucide-react';

interface DialoguePageProps {
  edition: MagazineEdition;
  onRefinePage?: (pageNumber: number) => void;
}

export const DialoguePage: React.FC<DialoguePageProps> = ({ edition, onRefinePage }) => {
  const page = edition.pages.find((p) => p.pageNumber === 8) || edition.pages[7];

  return (
    <div className="relative w-full h-full bg-[#fbf9f5] text-[#1a1918] p-8 sm:p-12 flex flex-col justify-between overflow-hidden select-text paper-texture group/page">
      {/* Top Running Header */}
      <div className="flex items-center justify-between border-b border-[#ded9cf] pb-2 text-[11px] font-sans-body uppercase tracking-widest text-[#706c64]">
        <span>GOVERNANÇA & ÉTICA · DECISÃO ESTRATÉGICA</span>
        <span>PÁGINA 08</span>
      </div>

      {onRefinePage && (
        <button
          onClick={() => onRefinePage(8)}
          className="no-print absolute top-3 right-3 opacity-0 group-hover/page:opacity-100 transition-opacity flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-sans-body uppercase tracking-wider bg-[#1f1d1a] text-[#c49b66] rounded shadow-xs"
        >
          <Sparkles className="w-3 h-3" />
          <span>Refinar Página</span>
        </button>
      )}

      {/* Main Content Area */}
      <div className="my-auto flex flex-col gap-6">
        <div className="flex flex-col gap-2 max-w-2xl">
          <div className="text-xs uppercase font-sans-body tracking-widest text-[#8c2b1d] font-semibold">
            {page.kicker || 'DESENVOLVIMENTO // GOVERNANÇA & ÉTICA'}
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Prose (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3.5 text-xs sm:text-[13px] font-sans-body text-[#2e2c28] leading-relaxed">
            {page.paragraphs && page.paragraphs.length > 0 ? (
              page.paragraphs.map((p, idx) => (
                <p key={idx} className="leading-relaxed">
                  {p}
                </p>
              ))
            ) : (
              <p>Texto de governança em diagramação.</p>
            )}
          </div>

          {/* Governance Checklist Sidebar (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {page.sidebarBox && (
              <div className="p-6 bg-[#f4efe5] border border-[#ded7ca] rounded-sm flex flex-col gap-4">
                <div className="flex items-center gap-2 text-[#8c2b1d] font-bold text-xs uppercase font-sans-body tracking-wider">
                  <CheckSquare className="w-4 h-4" />
                  <span>{page.sidebarBox.title}</span>
                </div>

                <div className="space-y-3">
                  {page.sidebarBox.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs font-sans-body text-[#383530]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8c2b1d] mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#ded7ca] text-[10px] font-mono text-[#8a857b] uppercase">
                  PROTOCOLO DE RESPONSABILIDADE HUMANA
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Running Footer */}
      <div className="flex items-center justify-between border-t border-[#ded9cf] pt-2 text-[10px] font-mono text-[#7a766e]">
        <span>CONVERGÊNCIA ÉTICA & MERCADOLÓGICA</span>
        <span>SEGUINTE: INFOGRÁFICO & MATRIZ (PÁG. 09) →</span>
      </div>
    </div>
  );
};
