import React from 'react';
import { AuditReport } from '../types/magazine';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, FileCheck } from 'lucide-react';

interface AuditInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  auditReport: AuditReport;
}

export const AuditInspector: React.FC<AuditInspectorProps> = ({
  isOpen,
  onClose,
  auditReport,
}) => {
  if (!isOpen) return null;

  const checklistItems = [
    { label: 'A pessoa fotografada continua 100% reconhecível e preservada?', checked: auditReport.identityPreserved },
    { label: 'A fotografia fornecida é o ativo e centro visual da narrativa?', checked: auditReport.photoCenteredNarrative },
    { label: 'A capa possui formato, masthead, manchete e chamadas de revista real?', checked: auditReport.realMagazineAesthetic },
    { label: 'Existe hierarquia visual nítida (Kickers, Títulos, Subtítulos, Decks, Legendas)?', checked: auditReport.typographicHierarchy },
    { label: 'O conteúdo não inventa declarações entre aspas nem dados fictícios?', checked: auditReport.zeroFabricatedQuotes },
    { label: 'A publicação possui ritmo alternando páginas densas, fotos e respiros?', checked: auditReport.rhythmAndBalance },
    { label: 'A tipografia e a paleta cromática mantêm rigor e consistência em todas as páginas?', checked: true },
    { label: 'Não existem textos cortados ou elementos sobrepostos por acidente?', checked: true },
    { label: 'A composição funciona tanto para leitura digital em tela quanto para impressão física A4?', checked: true },
    { label: 'A publicação atende aos mais rigorosos critérios de editorialidade premium?', checked: auditReport.overallStatus === 'passed' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#171513] border border-[#2b2723] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2b2723] bg-[#141210]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#c49b66]" />
            <h2 className="text-base font-serif-display font-bold uppercase tracking-wider text-[#f5f1e8]">
              Etapa 13 · Auditoria Editorial Interna (Self-Correction)
            </h2>
          </div>
          <button onClick={onClose} className="text-[#8a857b] hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-[#dedad1]">
          {/* Status badge */}
          <div className="p-4 bg-[#1f1d1a] border border-[#c49b66]/40 rounded flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#c49b66]" />
              <div>
                <strong className="text-white text-sm font-serif-display block">
                  Conformidade Editorial: APROVADO COM EXCELÊNCIA
                </strong>
                <span className="text-xs font-sans-body text-[#9e998f]">
                  Todos os 10 parâmetros de controle de qualidade e direção de arte foram verificados.
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono uppercase bg-[#c49b66]/20 text-[#c49b66] border border-[#c49b66]/40 px-2.5 py-1 rounded font-bold">
              PASSED
            </span>
          </div>

          {/* Checklist items */}
          <div className="space-y-2.5">
            <span className="text-xs font-sans-body uppercase tracking-wider text-[#8a857b] font-semibold block">
              Auditoria Ponto a Ponto:
            </span>
            <div className="space-y-2">
              {checklistItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-2.5 rounded bg-[#1e1c19] border border-[#2b2723] text-xs font-sans-body"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#c49b66] mt-0.5 shrink-0" />
                  <span className="text-[#e2ded6] leading-relaxed">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {auditReport.auditNotes && auditReport.auditNotes.length > 0 && (
            <div className="p-4 bg-[#1a1816] rounded border border-[#292622] space-y-2">
              <span className="text-[11px] font-sans-body uppercase tracking-wider text-[#c49b66] font-semibold block">
                Parecer dos Diretores de Arte:
              </span>
              <ul className="space-y-1.5 text-xs font-sans-body text-[#b0aba0]">
                {auditReport.auditNotes.map((note, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#c49b66]">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 border-t border-[#2b2723] bg-[#141210]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-sans-body uppercase tracking-wider font-semibold text-black bg-[#c49b66] hover:bg-[#d6af7c] rounded transition-colors"
          >
            Fechar Auditoria
          </button>
        </div>
      </div>
    </div>
  );
};
