import React from 'react';
import { PhotoAnalysis, PhotoFilterType } from '../types/magazine';
import { getFilterClass } from '../utils/filterStyles';
import { X, Eye, ShieldCheck, Palette, Camera } from 'lucide-react';

interface VisualAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoAnalysis: PhotoAnalysis;
  photoUrl: string;
  activeFilter: PhotoFilterType;
  onFilterChange: (filter: PhotoFilterType) => void;
}

export const VisualAnalysisModal: React.FC<VisualAnalysisModalProps> = ({
  isOpen,
  onClose,
  photoAnalysis,
  photoUrl,
  activeFilter,
  onFilterChange,
}) => {
  if (!isOpen) return null;

  const filterOptions: { label: string; value: PhotoFilterType; desc: string }[] = [
    { label: 'Natural / Fidedigno', value: 'natural', desc: 'Preserva 100% das cores e iluminação originais.' },
    { label: 'Monocromático Alta Densidade', value: 'monochrome', desc: 'Preto e branco editorial com contraste profundo estilo Leica.' },
    { label: 'Duotone Editorial', value: 'editorial-duotone', desc: 'Tonalidade magenta/terracota suave com saturação calibrada.' },
    { label: 'Granulação Analógica', value: 'film-grain', desc: 'Textura vintage com calor analógico e calibração de médios.' },
    { label: 'Sépia Curatorial', value: 'curatorial-sepia', desc: 'Acabamento arquivístico clássico inspirado em publicações de arte.' },
    { label: 'Bronze Dourado', value: 'bronze-glow', desc: 'Destaque sutil de iluminação executiva com calor metálico.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-[#171513] border border-[#2b2723] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2b2723] bg-[#141210]">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#c49b66]" />
            <h2 className="text-base font-serif-display font-bold uppercase tracking-wider text-[#f5f1e8]">
              Etapa 1 · Relatório de Análise Visual & Fotografia
            </h2>
          </div>
          <button onClick={onClose} className="text-[#8a857b] hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#dedad1]">
          {/* Identity preservation banner */}
          <div className="p-3.5 bg-[#1f1d1a] border border-[#c49b66]/30 rounded flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#c49b66] shrink-0" />
              <div className="text-xs font-sans-body">
                <strong className="text-white block font-medium">
                  Preservação Rígida de Identidade Ativa
                </strong>
                <span className="text-[#9e998f]">
                  Rosto, proporções faciais, tom de pele e características anatômicas estão 100% mantidos. O tratamento visual aplica apenas camadas cromáticas não-destrutivas.
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left: Photo with Interactive Filter Preview (5 cols) */}
            <div className="md:col-span-5 flex flex-col gap-3">
              <div className="relative aspect-[3/4] w-full rounded overflow-hidden bg-black border border-[#332f29] shadow-md">
                <img
                  src={photoUrl}
                  alt="Retrato sob análise"
                  className={`w-full h-full object-cover object-top transition-all duration-300 ${getFilterClass(
                    activeFilter
                  )}`}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Photo Filter Picker */}
              <div className="flex flex-col gap-1.5 pt-2">
                <span className="text-[11px] font-sans-body uppercase tracking-wider text-[#c49b66] font-semibold flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" />
                  <span>Tratamento Editorial Aplicado:</span>
                </span>

                <div className="grid grid-cols-2 gap-1.5">
                  {filterOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => onFilterChange(opt.value)}
                      className={`p-2 text-left rounded text-[11px] font-sans-body transition-colors border ${
                        activeFilter === opt.value
                          ? 'bg-[#2b2721] text-[#c49b66] border-[#c49b66]'
                          : 'bg-[#1b1917] text-[#999] border-[#292622] hover:text-white'
                      }`}
                    >
                      <span className="font-semibold block">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Detailed Visual Analysis Metrics (7 cols) */}
            <div className="md:col-span-7 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans-body">
                <div className="p-3 bg-[#1e1c19] rounded border border-[#2b2723]">
                  <span className="text-[10px] uppercase tracking-wider text-[#8a857b] block font-mono">
                    Enquadramento & Plano
                  </span>
                  <span className="text-white font-medium mt-0.5 block">
                    {photoAnalysis.framing || 'Plano Médio 3:4'}
                  </span>
                </div>

                <div className="p-3 bg-[#1e1c19] rounded border border-[#2b2723]">
                  <span className="text-[10px] uppercase tracking-wider text-[#8a857b] block font-mono">
                    Expressão & Foco
                  </span>
                  <span className="text-white font-medium mt-0.5 block">
                    {photoAnalysis.expression || 'Serena, analítica e reflexiva'}
                  </span>
                </div>

                <div className="p-3 bg-[#1e1c19] rounded border border-[#2b2723]">
                  <span className="text-[10px] uppercase tracking-wider text-[#8a857b] block font-mono">
                    Direção do Olhar
                  </span>
                  <span className="text-white font-medium mt-0.5 block">
                    {photoAnalysis.gazeDirection || 'Direcionado à platéia em ângulo 3/4'}
                  </span>
                </div>

                <div className="p-3 bg-[#1e1c19] rounded border border-[#2b2723]">
                  <span className="text-[10px] uppercase tracking-wider text-[#8a857b] block font-mono">
                    Iluminação & Atmosfera
                  </span>
                  <span className="text-white font-medium mt-0.5 block">
                    {photoAnalysis.lightingKey || 'Luz lateral difusa de auditório'}
                  </span>
                </div>
              </div>

              {/* Detailed Observations */}
              <div className="space-y-3 text-xs font-sans-body leading-relaxed bg-[#1b1917] p-4 rounded border border-[#292622]">
                <div>
                  <strong className="text-[#c49b66] uppercase text-[10px] tracking-wider block font-mono mb-1">
                    Descrição do Sujeito:
                  </strong>
                  <p className="text-[#dedad1]">{photoAnalysis.subjectDescription}</p>
                </div>

                <div>
                  <strong className="text-[#c49b66] uppercase text-[10px] tracking-wider block font-mono mb-1">
                    Espaço Negativo para Diagramação:
                  </strong>
                  <p className="text-[#dedad1]">{photoAnalysis.negativeSpace}</p>
                </div>

                <div>
                  <strong className="text-[#c49b66] uppercase text-[10px] tracking-wider block font-mono mb-1">
                    Potencial Editorial & Capa:
                  </strong>
                  <p className="text-[#dedad1]">{photoAnalysis.editorialPotential}</p>
                </div>

                {photoAnalysis.dominantColors && photoAnalysis.dominantColors.length > 0 && (
                  <div>
                    <strong className="text-[#c49b66] uppercase text-[10px] tracking-wider block font-mono mb-1">
                      Cores Predominantes Detectadas:
                    </strong>
                    <div className="flex items-center gap-2 mt-1">
                      {photoAnalysis.dominantColors.map((color, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] font-mono">
                          <span
                            className="w-4 h-4 rounded-full border border-white/20"
                            style={{ backgroundColor: color }}
                          />
                          <span>{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 border-t border-[#2b2723] bg-[#141210]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-sans-body uppercase tracking-wider font-semibold text-black bg-[#c49b66] hover:bg-[#d6af7c] rounded transition-colors"
          >
            Concluir Inspeção
          </button>
        </div>
      </div>
    </div>
  );
};
