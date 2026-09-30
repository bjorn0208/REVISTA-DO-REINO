import { PhotoFilterType } from '../types/magazine';

export function getFilterClass(filter: PhotoFilterType): string {
  switch (filter) {
    case 'monochrome':
      return 'grayscale contrast-125 brightness-95';
    case 'editorial-duotone':
      return 'sepia-[.30] hue-rotate-[320deg] contrast-115 saturate-[.85]';
    case 'film-grain':
      return 'contrast-105 brightness-102 saturate-90';
    case 'curatorial-sepia':
      return 'sepia-[.40] contrast-110 brightness-95';
    case 'bronze-glow':
      return 'sepia-[.20] contrast-115 brightness-105 saturate-125';
    case 'natural':
    default:
      return '';
  }
}
