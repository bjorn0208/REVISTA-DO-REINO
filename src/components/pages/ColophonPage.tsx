import React from 'react';
import { MagazineEdition } from '../../types/magazine';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface ColophonPageProps {
  edition: MagazineEdition;
  onRefinePage?: (pageNumber: number) => void;
}

export const ColophonPage: React.FC<ColophonPageProps> = ({ edition, onRefinePage }) => {
  const page = edition.pages.find((p) => p.pageNumber === 11) || edition.pages[10];

  return (
    <div className="relative w-full h-full bg-[#fbf9f5] text-[#1a1918] p-8 sm:p-12 flex flex-col justify-between overflow-hidden select-text paper-texture group/page">
      {/* Top Running Header */}
      <div className="flex items-center justify-between border-b border-[#ded9cf] pb-2 text-[11px] font-sans-body uppercase tracking-widest text-[#706c64]">
        <span>EXPEDIENTE TÉCNICO & DIRETORIA EDITORIAL</span>
        <span>PÁGINA 11</span>
      </div>

      {onRefinePage && (
        <button
          onClick={() => onRefinePage(11)}
          className="no-print absolute top-3 right-3 opacity-0 group-hover/page:opacity-100 transition-opacity flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-sans-body uppercase tracking-wider bg-[#1f1d1a] text-[#c49b66] rounded shadow-xs"
        >
          <Sparkles className="w-3 h-3" />
          <span>Refinar Expediente</span>
        </button>
      )}

      {/* Main Content Area */}
      <div className="my-auto flex flex-col gap-6 max-w-4xl mx-auto w-full">
        <div className="flex flex-col gap-2">
          <div className="text-xs uppercase font-sans-body tracking-widest text-[#8c2b1d] font-semibold">
            {page.kicker || 'EXPEDIENTE TÉCNICO // FICHA EDITORIAL'}
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif-display font-medium text-[#141413] leading-tight text-balance">
            {page.title}
          </h2>

          {page.subtitle && (
            <p className="text-sm font-editorial italic text-[#524e47] leading-relaxed">
              {page.subtitle}
            </p>
          )}
        </div>

        {/* Colophon Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-2 border-y border-[#ded7ca] py-6">
          {/* Staff & Production */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-sans-body uppercase tracking-widest text-[#141413] font-bold">
              Corpo Editorial & Produção
            </h3>

            <div className="space-y-3">
              {page.colophonStaff && page.colophonStaff.length > 0 ? (
                page.colophonStaff.map((staff, idx) => (
                  <div key={idx} className="flex flex-col text-xs font-sans-body">
                    <span className="text-[10px] uppercase tracking-wider text-[#8a857b] font-mono">
                      {staff.role}
                    </span>
                    <span className="font-medium text-[#1f1e1c]">{staff.name}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs">Ficha técnica em diagramação.</div>
              )}
            </div>
          </div>

          {/* Ethics, Integrity & Preservation Statement */}
          <div className="flex flex-col justify-between gap-4 bg-[#f4efe5] p-6 rounded-sm border border-[#ded7ca]">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#8c2b1d] font-semibold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Compromisso com a Verdade Documental</span>
              </div>

              <p className="text-xs font-sans-body text-[#3e3b35] leading-relaxed">
                Esta publicação segue os padrões éticos internacionais de direção editorial autônoma. Nenhuma citação entre aspas foi fabricada ou atribuída sem comprovação prévia. A fotografia original teve seus traços, iluminação e características preservados em sua totalidade.
              </p>

              <div className="pt-2 border-t border-[#ded7ca] text-[11px] font-sans-body text-[#6b665d]">
                <span className="font-semibold block text-[#141413]">Distribuição & Direitos:</span>
                VANGUARD PUBLISHING HOUSE · Edição Especial Digital & Impressa.
              </div>
            </div>

            <div className="pt-3 border-t border-[#ded7ca] flex items-center justify-between text-[10px] font-mono text-[#8a857b]">
              <span>TIRAGEM LIMITADA · 2.500 EXEMPLARES</span>
              <span>DEPÓSITO LEGAL 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Running Footer */}
      <div className="flex items-center justify-between border-t border-[#ded9cf] pt-2 text-[10px] font-mono text-[#7a766e]">
        <span>PUBLICAÇÃO REGISTRADA SOB PROTOCOLO INTERNACIONAL</span>
        <span>FINALIZAÇÃO NA CONTRACAPA (PÁG. 12) →</span>
      </div>
    </div>
  );
};
