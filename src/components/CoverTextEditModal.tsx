import React, { useState } from 'react';
import { X, Type, Check, Sparkles, Layers, BookOpen, RotateCcw } from 'lucide-react';
import { MagazineEdition, SecondaryStory } from '../types/magazine';

interface CoverTextEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  edition: MagazineEdition;
  onSaveTexts: (updatedTexts: {
    name: string;
    kicker: string;
    category: string;
    date: string;
    issueNumber: string;
    headline: string;
    subheadline: string;
    deck: string;
    secondaryStories: SecondaryStory[];
    mastheadFont?: string;
  }) => void;
}

export const CoverTextEditModal: React.FC<CoverTextEditModalProps> = ({
  isOpen,
  onClose,
  edition,
  onSaveTexts,
}) => {
  const coverPage = edition.pages.find((p) => p.pageNumber === 1) || edition.pages[0];

  const [name, setName] = useState<string>(edition.name);
  const [kicker, setKicker] = useState<string>(coverPage.kicker || 'EDIÇÃO ESPECIAL // DIÁLOGOS DE LIDERANÇA');
  const [category, setCategory] = useState<string>(edition.category);
  const [date, setDate] = useState<string>(edition.date);
  const [issueNumber, setIssueNumber] = useState<string>(edition.issueNumber);
  const [headline, setHeadline] = useState<string>(coverPage.title || edition.headline);
  const [subheadline, setSubheadline] = useState<string>(coverPage.subtitle || edition.subheadline);
  const [deck, setDeck] = useState<string>(coverPage.deck || '');
  const [mastheadFont, setMastheadFont] = useState<string>(edition.typographyStyle.displayFont || 'Cinzel');

  const defaultStories: SecondaryStory[] = [
    { title: 'O Fim da Rotina Mecânica', pageRef: 'PÁG. 04', summary: 'Automação cognitiva e estratégia' },
    { title: 'A Empresa Adaptativa', pageRef: 'PÁG. 07', summary: 'Governança ágil em tempo real' },
    { title: 'Colaboração Homem-Algoritmo', pageRef: 'PÁG. 09', summary: 'Competências críticas do futuro' },
  ];

  const [stories, setStories] = useState<SecondaryStory[]>(
    coverPage.secondaryStories && coverPage.secondaryStories.length > 0
      ? coverPage.secondaryStories
      : defaultStories
  );

  if (!isOpen) return null;

  const handleStoryChange = (index: number, field: keyof SecondaryStory, value: string) => {
    setStories((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSave = () => {
    onSaveTexts({
      name: name.trim() || edition.name,
      kicker,
      category,
      date,
      issueNumber,
      headline,
      subheadline,
      deck,
      secondaryStories: stories,
      mastheadFont,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-[#171513] border border-[#2b2723] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2b2723] bg-[#141210]">
          <div className="flex items-center gap-2.5">
            <Type className="w-5 h-5 text-[#c49b66]" />
            <div>
              <h2 className="text-base font-serif-display font-bold uppercase tracking-wider text-[#f5f1e8]">
                Editor de Tipografia & Textos da Capa
              </h2>
              <p className="text-[11px] font-sans-body text-[#8a857b]">
                Edite os títulos, manchetes, créditos e chamadas da capa
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#8a857b] hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-[#dedad1]">
          {/* Section 1: Masthead & Header Coordinates */}
          <div className="p-4 bg-[#121110] border border-[#26231f] rounded-lg space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#c49b66] font-semibold block">
              1. Identidade & Masthead (Nome da Revista)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-sans-body uppercase tracking-wider text-[#a09b91] block">
                  Nome da Publicação (Masthead):
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1b1917] border border-[#38332c] focus:border-[#c49b66] text-xl font-headline font-bold text-white px-3 py-2 rounded uppercase tracking-widest focus:outline-none"
                  placeholder="Ex: VANGUARD, ELEVATE, HORIZONTE..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-sans-body uppercase tracking-wider text-[#a09b91] block">
                  Cartola / Kicker (Tagline da Capa):
                </label>
                <input
                  type="text"
                  value={kicker}
                  onChange={(e) => setKicker(e.target.value)}
                  className="w-full bg-[#1b1917] border border-[#38332c] focus:border-[#c49b66] text-xs font-editorial italic text-[#e8e4dc] px-3 py-2 rounded focus:outline-none"
                  placeholder="Ex: EDIÇÃO EXCLUSIVA DE ALTA DIREÇÃO"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-sans-body uppercase tracking-wider text-[#a09b91] block">
                  Categoria Editorial:
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#1b1917] border border-[#38332c] focus:border-[#c49b66] text-xs font-sans-body text-white px-3 py-2 rounded uppercase tracking-wider focus:outline-none"
                  placeholder="Ex: INTELIGÊNCIA ARTIFICIAL, NEGÓCIOS & FUTURO"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-sans-body uppercase tracking-wider text-[#a09b91] block">
                  Data de Publicação:
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#1b1917] border border-[#38332c] focus:border-[#c49b66] text-xs font-sans-body text-white px-3 py-2 rounded uppercase focus:outline-none"
                  placeholder="Ex: OUTUBRO 2026"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-sans-body uppercase tracking-wider text-[#a09b91] block">
                  Número da Edição:
                </label>
                <input
                  type="text"
                  value={issueNumber}
                  onChange={(e) => setIssueNumber(e.target.value)}
                  className="w-full bg-[#1b1917] border border-[#38332c] focus:border-[#c49b66] text-xs font-sans-body text-white px-3 py-2 rounded uppercase focus:outline-none"
                  placeholder="Ex: ED. 42 / VOL. VIII"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Main Story Headline & Deck */}
          <div className="p-4 bg-[#121110] border border-[#26231f] rounded-lg space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#c49b66] font-semibold block">
              2. Manchete Principal (Cover Story)
            </span>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-sans-body uppercase tracking-wider text-[#a09b91] block">
                  Manchete de Capa (Título de Impacto):
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full bg-[#1b1917] border border-[#38332c] focus:border-[#c49b66] text-base font-serif-display font-bold text-white px-3 py-2 rounded leading-snug focus:outline-none"
                  placeholder="Ex: A INTELIGÊNCIA COMO INFRAESTRUTURA"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-sans-body uppercase tracking-wider text-[#a09b91] block">
                  Subtítulo / Linha Fina:
                </label>
                <input
                  type="text"
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  className="w-full bg-[#1b1917] border border-[#38332c] focus:border-[#c49b66] text-xs font-editorial italic text-[#e8e4dc] px-3 py-2 rounded leading-relaxed focus:outline-none"
                  placeholder="Ex: Como o cruzamento entre tecnologia e negócios redefine as fronteiras do trabalho."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-sans-body uppercase tracking-wider text-[#a09b91] block">
                  Texto de Apoio (Deck):
                </label>
                <textarea
                  value={deck}
                  onChange={(e) => setDeck(e.target.value)}
                  rows={2}
                  className="w-full bg-[#1b1917] border border-[#38332c] focus:border-[#c49b66] text-xs font-sans-body text-[#c0bcb3] p-3 rounded leading-relaxed focus:outline-none"
                  placeholder="Breve contextualização que ancora a manchete na imagem..."
                />
              </div>
            </div>
          </div>

          {/* Section 3: Secondary Story Highlights */}
          <div className="p-4 bg-[#121110] border border-[#26231f] rounded-lg space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#c49b66] font-semibold block">
              3. Chamadas Secundárias (Destaques da Lateral)
            </span>

            <div className="space-y-3">
              {stories.map((story, idx) => (
                <div key={idx} className="p-3 bg-[#171513] border border-[#2b2723] rounded flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#c49b66]">
                    <span>Destaque {idx + 1}</span>
                    <input
                      type="text"
                      value={story.pageRef}
                      onChange={(e) => handleStoryChange(idx, 'pageRef', e.target.value)}
                      className="w-20 bg-[#121110] border border-[#38332c] text-[10px] text-right px-2 py-0.5 rounded text-white focus:outline-none focus:border-[#c49b66]"
                      placeholder="PÁG. 04"
                    />
                  </div>

                  <input
                    type="text"
                    value={story.title}
                    onChange={(e) => handleStoryChange(idx, 'title', e.target.value)}
                    className="w-full bg-[#121110] border border-[#38332c] focus:border-[#c49b66] text-xs font-serif-display font-medium text-white px-2.5 py-1.5 rounded focus:outline-none"
                    placeholder="Título da matéria secundária..."
                  />

                  <input
                    type="text"
                    value={story.summary}
                    onChange={(e) => handleStoryChange(idx, 'summary', e.target.value)}
                    className="w-full bg-[#121110] border border-[#38332c] focus:border-[#c49b66] text-[11px] font-sans-body text-[#a09b91] px-2.5 py-1 rounded focus:outline-none"
                    placeholder="Breve resumo da matéria..."
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#2b2723] bg-[#141210]">
          <span className="text-[11px] font-sans-body text-[#736f66]">
            Salva e sincroniza em tempo real com a capa e todo o exemplar.
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-sans-body uppercase tracking-wider text-[#8a857b] hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-sans-body uppercase tracking-wider font-semibold text-black bg-[#c49b66] hover:bg-[#d6af7c] rounded transition-colors shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Salvar Textos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
