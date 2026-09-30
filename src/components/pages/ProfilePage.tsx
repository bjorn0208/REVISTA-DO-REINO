import React from 'react';
import { MagazineEdition } from '../../types/magazine';
import { getFilterClass } from '../../utils/filterStyles';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface ProfilePageProps {
  edition: MagazineEdition;
  onRefinePage?: (pageNumber: number) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ edition, onRefinePage }) => {
  const page = edition.pages.find((p) => p.pageNumber === 5) || edition.pages[4];
  const photoUrl = page.imageSlot?.customImageUrl || edition.primaryPhotoUrl;
  const filterClass = getFilterClass(edition.activePhotoFilter);

  return (
    <div className="relative w-full h-full bg-[#fbf9f5] text-[#1a1918] p-8 sm:p-12 flex flex-col justify-between overflow-hidden select-text paper-texture group/page">
      {/* Top Running Header */}
      <div className="flex items-center justify-between border-b border-[#ded9cf] pb-2 text-[11px] font-sans-body uppercase tracking-widest text-[#706c64]">
        <span>PERFIL DE LIDERANÇA · ENSAIO BIOGRÁFICO</span>
        <span>PÁGINA 05</span>
      </div>

      {onRefinePage && (
        <button
          onClick={() => onRefinePage(5)}
          className="no-print absolute top-3 right-3 opacity-0 group-hover/page:opacity-100 transition-opacity flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-sans-body uppercase tracking-wider bg-[#1f1d1a] text-[#c49b66] rounded shadow-xs"
        >
          <Sparkles className="w-3 h-3" />
          <span>Refinar Perfil</span>
        </button>
      )}

      {/* Main Content Area */}
      <div className="my-auto flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Focal Editorial Portrait (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-[#1a1918] shadow-md border border-[#ded9cf]">
              <img
                src={photoUrl}
                alt="Retrato de Liderança"
                className={`w-full h-full object-cover object-top ${filterClass}`}
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4">
                <span className="text-xs font-serif-display font-medium text-white block">
                  Preservação Fidedigna da Identidade
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#d0cbc1]">
                  FOTOGRAFIA DOCUMENTAL ORIGINAL
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-sans-body text-[#736f66] px-1">
              <span>{page.imageSlot?.caption || 'Registro documental durante pronunciamento oficial.'}</span>
              <span className="inline-flex items-center gap-1 text-[#8c2b1d] font-semibold text-[10px]">
                <ShieldCheck className="w-3 h-3" />
                VERIFICADO
              </span>
            </div>
          </div>

          {/* Right: Narrative Profile (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="text-xs uppercase font-sans-body tracking-widest text-[#8c2b1d] font-semibold">
              {page.kicker || 'PERFIL // DIÁLOGO & VISÃO'}
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif-display font-medium text-[#141413] leading-tight text-balance">
              {page.title}
            </h2>

            {page.subtitle && (
              <p className="text-sm sm:text-base font-editorial italic text-[#524e47] leading-relaxed">
                {page.subtitle}
              </p>
            )}

            <div className="h-[1px] w-12 bg-[#8c2b1d] my-1" />

            <div className="space-y-3.5 text-xs sm:text-[13px] font-sans-body text-[#2e2c28] leading-relaxed">
              {page.paragraphs && page.paragraphs.length > 0 ? (
                page.paragraphs.map((p, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {p}
                  </p>
                ))
              ) : (
                <p>Perfil analítico em diagramação.</p>
              )}
            </div>

            {page.pullQuote && (
              <div className="border-l-2 border-[#8c2b1d] pl-4 py-2 bg-[#f4efe5] mt-2">
                <p className="text-sm font-editorial italic text-[#141413] leading-relaxed">
                  "{page.pullQuote.text}"
                </p>
                {page.pullQuote.attribution && (
                  <span className="block text-[10px] font-sans-body uppercase tracking-wider text-[#736f66] mt-1">
                    — {page.pullQuote.attribution}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Running Footer */}
      <div className="flex items-center justify-between border-t border-[#ded9cf] pt-2 text-[10px] font-mono text-[#7a766e]">
        <span>REGISTRO DE PERSONALIDADE & CONTEXTO</span>
        <span>SEGUINTE: DESTAQUES & EIXOS (PÁG. 06) →</span>
      </div>
    </div>
  );
};
