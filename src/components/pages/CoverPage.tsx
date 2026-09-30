import React, { useState } from 'react';
import { MagazineEdition } from '../../types/magazine';
import { getFilterClass } from '../../utils/filterStyles';
import { Sparkles, Camera, Edit3, Check, X, Sliders, Type } from 'lucide-react';

interface CoverPageProps {
  edition: MagazineEdition;
  onRefinePage?: (pageNumber: number) => void;
  onUpdateEdition?: (updatedEdition: MagazineEdition) => void;
  onOpenBackgroundModal?: () => void;
  onOpenTextModal?: () => void;
  isPrintMode?: boolean;
}

export const CoverPage: React.FC<CoverPageProps> = ({
  edition,
  onRefinePage,
  onUpdateEdition,
  onOpenBackgroundModal,
  onOpenTextModal,
  isPrintMode = false,
}) => {
  const page = edition.pages.find((p) => p.pageNumber === 1) || edition.pages[0];
  const photoUrl = page.imageSlot?.customImageUrl || edition.primaryPhotoUrl;
  const filterClass = getFilterClass(edition.activePhotoFilter);

  // Inline editing state: which field is being touched/edited directly on cover
  const [inlineEditing, setInlineEditing] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');

  const startInlineEdit = (field: string, initialValue: string) => {
    if (isPrintMode) return;
    setInlineEditing(field);
    setTempValue(initialValue);
  };

  const commitInlineEdit = (field: string) => {
    if (!onUpdateEdition || !tempValue.trim()) {
      setInlineEditing(null);
      return;
    }

    const trimmed = tempValue.trim();

    onUpdateEdition({
      ...edition,
      name: field === 'name' ? trimmed : edition.name,
      category: field === 'category' ? trimmed : edition.category,
      date: field === 'date' ? trimmed : edition.date,
      issueNumber: field === 'issueNumber' ? trimmed : edition.issueNumber,
      headline: field === 'headline' ? trimmed : edition.headline,
      subheadline: field === 'subtitle' ? trimmed : edition.subheadline,
      pages: edition.pages.map((p) => {
        if (p.pageNumber === 1) {
          return {
            ...p,
            title: field === 'headline' ? trimmed : p.title,
            kicker: field === 'kicker' ? trimmed : p.kicker,
            subtitle: field === 'subtitle' ? trimmed : p.subtitle,
            deck: field === 'deck' ? trimmed : p.deck,
          };
        }
        return p;
      }),
    });

    setInlineEditing(null);
  };

  const cancelInlineEdit = () => {
    setInlineEditing(null);
  };

  return (
    <div className="relative w-full h-full bg-[#121110] text-white flex flex-col justify-between overflow-hidden select-none group/cover">
      {/* 1. Background Photo with Scrim and Editorial Mask */}
      <div
        className="absolute inset-0 z-0 overflow-hidden cursor-pointer"
        onClick={() => {
          if (!isPrintMode && onOpenBackgroundModal && !inlineEditing) {
            onOpenBackgroundModal();
          }
        }}
        title={!isPrintMode ? 'Clique para trocar a foto ou ajustar o fundo da capa' : undefined}
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Capa da Revista"
            className={`w-full h-full object-cover object-top transition-all duration-700 ${filterClass}`}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2a2622] to-[#121110]" />
        )}

        {/* Sophisticated Editorial Gradient Scrims for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/25 to-black/90 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30 pointer-events-none" />

        {/* Subtle background touch indicator on hover */}
        {!isPrintMode && (
          <div className="no-print absolute top-4 left-4 z-20 opacity-0 group-hover/cover:opacity-90 transition-opacity">
            <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-sans-body uppercase tracking-wider bg-black/75 backdrop-blur-md text-[#c49b66] border border-[#c49b66]/40 rounded-full shadow-lg">
              <Camera className="w-3 h-3" />
              <span>Clique no fundo para trocar a foto</span>
            </span>
          </div>
        )}
      </div>

      {/* Floating Action Controls on Cover (Always Visible & Touch-Optimized) */}
      {!isPrintMode && (
        <div className="no-print absolute top-3 right-3 sm:top-5 sm:right-5 z-40 flex items-center gap-2 bg-black/75 backdrop-blur-md p-1.5 rounded-lg border border-[#c49b66]/40 shadow-2xl">
          {onOpenBackgroundModal && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenBackgroundModal();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] sm:text-xs font-sans-body uppercase tracking-wider bg-[#1c1a17] hover:bg-[#2c2722] text-[#c49b66] hover:text-[#e4be8c] border border-[#c49b66]/60 rounded-md transition-all active:scale-95 shadow-md"
              title="Trocar a foto ou gerar novo fundo com IA"
            >
              <Camera className="w-3.5 h-3.5 text-[#c49b66]" />
              <span className="font-semibold">Trocar Fundo</span>
            </button>
          )}

          {onOpenTextModal && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenTextModal();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] sm:text-xs font-sans-body uppercase tracking-wider bg-[#1c1a17] hover:bg-[#2c2722] text-[#f5f1e8] hover:text-white border border-white/30 rounded-md transition-all active:scale-95 shadow-md"
              title="Editar todos os textos e tipografia da capa"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#c49b66]" />
              <span className="font-semibold">Editar Letras</span>
            </button>
          )}

          {onRefinePage && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRefinePage(1);
              }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-sans-body uppercase tracking-wider bg-[#1c1a17] hover:bg-[#2c2722] text-[#c49b66] border border-[#c49b66]/30 rounded-md transition-all active:scale-95 shadow-md"
              title="Refinar Capa com Inteligência Gemini"
            >
              <Sparkles className="w-3 h-3" />
              <span>IA</span>
            </button>
          )}
        </div>
      )}

      {/* Floating Touch Guidance Badge (No Print) */}
      {!isPrintMode && (
        <div className="no-print absolute bottom-14 right-4 sm:right-8 z-30 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-sans-body uppercase tracking-wider bg-black/85 backdrop-blur-md text-[#dcd7ce] border border-[#c49b66]/30 rounded-full shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c49b66] animate-pulse" />
            <span>Toque nas letras para editar · Toque no fundo para trocar a foto</span>
          </span>
        </div>
      )}

      {/* 2. Top Section: Masthead and Issue Coordinates */}
      <div className="relative z-10 p-6 sm:p-10 flex flex-col items-center">
        {/* Category, Date & Issue Header Bar with Touch-to-Edit */}
        <div className="w-full flex items-center justify-between text-[10px] sm:text-[11px] font-sans-body uppercase tracking-widest text-[#dcd7ce]/95 border-b border-white/20 pb-2 mb-3">
          {inlineEditing === 'category' ? (
            <div className="flex items-center gap-1 w-1/2">
              <input
                autoFocus
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={() => commitInlineEdit('category')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitInlineEdit('category');
                  if (e.key === 'Escape') cancelInlineEdit();
                }}
                className="bg-black/90 text-white text-[11px] uppercase tracking-wider px-2 py-0.5 rounded border border-[#c49b66] w-full focus:outline-none"
              />
              <button
                onClick={() => commitInlineEdit('category')}
                className="p-1 text-green-400 hover:text-green-300"
              >
                <Check className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <span
              onClick={(e) => {
                e.stopPropagation();
                startInlineEdit('category', edition.category);
              }}
              className="cursor-pointer hover:text-[#c49b66] hover:underline transition-colors flex items-center gap-1 group/cat"
              title="Tocar para editar a categoria"
            >
              <span>{edition.category}</span>
              {!isPrintMode && <span className="opacity-0 group-hover/cat:opacity-100 text-[10px]">✎</span>}
            </span>
          )}

          <div className="flex items-center gap-2">
            {inlineEditing === 'date' ? (
              <div className="flex items-center gap-1">
                <input
                  autoFocus
                  type="text"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  onBlur={() => commitInlineEdit('date')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitInlineEdit('date');
                    if (e.key === 'Escape') cancelInlineEdit();
                  }}
                  className="bg-black/90 text-white text-[11px] uppercase px-2 py-0.5 rounded border border-[#c49b66] w-28 focus:outline-none"
                />
                <button
                  onClick={() => commitInlineEdit('date')}
                  className="p-1 text-green-400 hover:text-green-300"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  startInlineEdit('date', edition.date);
                }}
                className="cursor-pointer hover:text-[#c49b66] hover:underline transition-colors"
                title="Tocar para editar a data"
              >
                {edition.date}
              </span>
            )}

            <span>·</span>

            {inlineEditing === 'issueNumber' ? (
              <div className="flex items-center gap-1">
                <input
                  autoFocus
                  type="text"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  onBlur={() => commitInlineEdit('issueNumber')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitInlineEdit('issueNumber');
                    if (e.key === 'Escape') cancelInlineEdit();
                  }}
                  className="bg-black/90 text-white text-[11px] uppercase px-2 py-0.5 rounded border border-[#c49b66] w-28 focus:outline-none"
                />
                <button
                  onClick={() => commitInlineEdit('issueNumber')}
                  className="p-1 text-green-400 hover:text-green-300"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  startInlineEdit('issueNumber', edition.issueNumber);
                }}
                className="cursor-pointer hover:text-[#c49b66] hover:underline transition-colors"
                title="Tocar para editar a edição"
              >
                {edition.issueNumber}
              </span>
            )}
          </div>
        </div>

        {/* The Dominant Magazine Masthead (Touch to edit directly on cover) */}
        {inlineEditing === 'name' ? (
          <div className="w-full flex items-center justify-center gap-2 my-2 z-30">
            <input
              autoFocus
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onBlur={() => commitInlineEdit('name')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitInlineEdit('name');
                if (e.key === 'Escape') cancelInlineEdit();
              }}
              className="w-full text-center text-5xl sm:text-7xl md:text-8xl font-headline font-black tracking-widest uppercase bg-black/90 text-[#c49b66] border-2 border-[#c49b66] rounded-md px-3 py-1 shadow-2xl focus:outline-none"
            />
            <button
              onClick={() => commitInlineEdit('name')}
              className="p-2 bg-[#c49b66] text-black font-bold rounded-md hover:bg-[#d6af7c]"
              title="Salvar Nome"
            >
              <Check className="w-5 h-5 stroke-[3]" />
            </button>
            <button
              onClick={cancelInlineEdit}
              className="p-2 bg-[#2b2723] text-white rounded-md hover:bg-[#3d3730]"
              title="Cancelar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div
            onClick={(e) => {
              e.stopPropagation();
              startInlineEdit('name', edition.name);
            }}
            className="group/masthead relative cursor-pointer text-center w-full py-1 hover:outline hover:outline-1 hover:outline-[#c49b66]/60 rounded transition-all"
            title="Tocar para editar o nome da revista"
          >
            <h1
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-headline font-black tracking-tighter uppercase text-white drop-shadow-lg leading-none select-none transition-transform group-hover/masthead:scale-[1.01]"
              style={{ letterSpacing: '0.04em' }}
            >
              {edition.name}
            </h1>
            {!isPrintMode && (
              <span className="opacity-0 group-hover/masthead:opacity-100 absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-sans-body uppercase tracking-wider text-[#c49b66] bg-black/80 px-2 py-0.5 rounded shadow pointer-events-none whitespace-nowrap">
                ✎ Toque para editar o nome da revista
              </span>
            )}
          </div>
        )}

        {/* Kicker Tagline (Touch to edit) */}
        {inlineEditing === 'kicker' ? (
          <div className="flex items-center gap-2 mt-2 w-full max-w-md">
            <input
              autoFocus
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onBlur={() => commitInlineEdit('kicker')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitInlineEdit('kicker');
                if (e.key === 'Escape') cancelInlineEdit();
              }}
              className="w-full text-center text-xs sm:text-sm font-editorial italic text-white bg-black/80 border border-[#c49b66] rounded px-3 py-1 focus:outline-none"
            />
            <button
              onClick={() => commitInlineEdit('kicker')}
              className="p-1 bg-[#c49b66] text-black rounded"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={(e) => {
              e.stopPropagation();
              startInlineEdit('kicker', page.kicker || 'EDIÇÃO EXCLUSIVA DE ALTA DIREÇÃO');
            }}
            className="group/kicker cursor-pointer mt-2 text-xs sm:text-sm font-editorial italic tracking-wider text-[#c49b66] hover:text-[#d6af7c] transition-colors relative"
            title="Tocar para editar o subtítulo superior"
          >
            <span>{page.kicker || 'EDIÇÃO EXCLUSIVA DE ALTA DIREÇÃO'}</span>
            {!isPrintMode && <span className="opacity-0 group-hover/kicker:opacity-100 text-[10px] ml-1">✎</span>}
          </div>
        )}
      </div>

      {/* 3. Bottom Section: Main Headline, Deck & Secondary Teases */}
      <div className="relative z-10 p-6 sm:p-10 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          {/* Main Cover Story Headline (8 cols) */}
          <div className="md:col-span-8 flex flex-col gap-2.5">
            <div className="inline-flex items-center gap-2 text-xs uppercase font-sans-body tracking-widest text-[#c49b66] font-semibold">
              <span className="w-2 h-[1px] bg-[#c49b66]" />
              <span>MATÉRIA PRINCIPAL</span>
            </div>

            {/* Main Headline (Touch to Edit) */}
            {inlineEditing === 'headline' ? (
              <div className="flex flex-col gap-2 my-1">
                <textarea
                  autoFocus
                  rows={2}
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  onBlur={() => commitInlineEdit('headline')}
                  className="w-full text-2xl sm:text-3xl font-serif-display font-bold text-white bg-black/90 border border-[#c49b66] rounded p-2 focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => commitInlineEdit('headline')}
                    className="px-3 py-1 bg-[#c49b66] text-black font-semibold text-xs rounded uppercase tracking-wider"
                  >
                    Salvar Título
                  </button>
                  <button
                    onClick={cancelInlineEdit}
                    className="px-3 py-1 bg-[#2b2723] text-white text-xs rounded uppercase tracking-wider"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  startInlineEdit('headline', page.title || edition.headline);
                }}
                className="group/headline cursor-pointer relative hover:outline hover:outline-1 hover:outline-[#c49b66]/60 rounded transition-all py-0.5"
                title="Tocar para editar a manchete principal"
              >
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-display font-bold text-white tracking-tight leading-tight text-balance drop-shadow-md">
                  {page.title || edition.headline}
                </h2>
                {!isPrintMode && (
                  <span className="opacity-0 group-hover/headline:opacity-100 absolute -top-5 left-0 text-[10px] font-sans-body uppercase tracking-wider text-[#c49b66] bg-black/80 px-2 py-0.5 rounded shadow pointer-events-none">
                    ✎ Toque para editar a manchete
                  </span>
                )}
              </div>
            )}

            {/* Subtitle (Touch to Edit) */}
            {inlineEditing === 'subtitle' ? (
              <div className="flex flex-col gap-2 my-1">
                <textarea
                  autoFocus
                  rows={2}
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  onBlur={() => commitInlineEdit('subtitle')}
                  className="w-full text-sm font-editorial italic text-white bg-black/90 border border-[#c49b66] rounded p-2 focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => commitInlineEdit('subtitle')}
                    className="px-3 py-1 bg-[#c49b66] text-black font-semibold text-xs rounded uppercase tracking-wider"
                  >
                    Salvar Subtítulo
                  </button>
                  <button
                    onClick={cancelInlineEdit}
                    className="px-3 py-1 bg-[#2b2723] text-white text-xs rounded uppercase tracking-wider"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              (page.subtitle || !isPrintMode) && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    startInlineEdit('subtitle', page.subtitle || edition.subheadline);
                  }}
                  className="group/sub cursor-pointer relative hover:outline hover:outline-1 hover:outline-[#c49b66]/60 rounded transition-all py-0.5"
                  title="Tocar para editar o subtítulo"
                >
                  <p className="text-sm sm:text-base font-editorial italic text-[#e8e4dc] leading-relaxed max-w-xl drop-shadow">
                    {page.subtitle || edition.subheadline}
                  </p>
                  {!isPrintMode && (
                    <span className="opacity-0 group-hover/sub:opacity-100 text-[10px] text-[#c49b66] ml-1">
                      ✎
                    </span>
                  )}
                </div>
              )
            )}

            {/* Deck text */}
            {page.deck && (
              <p className="text-xs font-sans-body text-[#c0bcb3] leading-relaxed max-w-lg hidden sm:block">
                {page.deck}
              </p>
            )}
          </div>

          {/* Secondary Story Teases (4 cols) */}
          <div
            onClick={(e) => {
              if (onOpenTextModal && !isPrintMode) {
                e.stopPropagation();
                onOpenTextModal();
              }
            }}
            className="md:col-span-4 flex flex-col gap-3.5 border-t md:border-t-0 md:border-l border-white/20 pt-4 md:pt-0 md:pl-5 cursor-pointer group/teases hover:border-[#c49b66]/60 transition-colors"
            title={!isPrintMode ? 'Clique para editar as chamadas secundárias' : undefined}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#a8a39a]">
                CHAMADAS DESTAQUE
              </span>
              {!isPrintMode && (
                <span className="opacity-0 group-hover/teases:opacity-100 text-[10px] text-[#c49b66] uppercase font-sans-body">
                  ✎ Editar Chamadas
                </span>
              )}
            </div>

            {page.secondaryStories && page.secondaryStories.length > 0 ? (
              page.secondaryStories.slice(0, 3).map((story, idx) => (
                <div key={idx} className="group/story">
                  <div className="flex items-center justify-between text-[10px] font-sans-body tracking-wider uppercase text-[#c49b66]">
                    <span>DESTAQUE {idx + 1}</span>
                    <span>{story.pageRef}</span>
                  </div>
                  <h3 className="text-sm font-serif-display font-medium text-white group-hover/story:text-[#c49b66] transition-colors leading-snug">
                    {story.title}
                  </h3>
                  <p className="text-[11px] font-sans-body text-[#a09c94] line-clamp-1">
                    {story.summary}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-xs font-sans-body text-[#888]">
                <span>Especiais: A Fronteira da Decisão · Os Três Eixos da Liderança</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Barcode & Editorial Seal */}
        <div className="flex items-center justify-between border-t border-white/20 pt-3 text-[10px] font-mono tracking-widest text-[#a8a39a]">
          <div className="flex items-center gap-3">
            <span className="font-sans-body tracking-wider uppercase">{edition.name} EDITORIAL PRESS</span>
            <span>·</span>
            <span>ISSN 2984-1184</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="tracking-tighter font-mono select-all">||||| | ||||| |||| | |||</span>
            <span className="text-[9px] uppercase tracking-normal font-sans-body">EDIÇÃO IMPRESSA R$ 38,00</span>
          </div>
        </div>
      </div>
    </div>
  );
};
