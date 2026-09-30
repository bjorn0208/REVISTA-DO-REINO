export type PhotoFilterType =
  | 'natural'
  | 'monochrome'
  | 'editorial-duotone'
  | 'film-grain'
  | 'curatorial-sepia'
  | 'bronze-glow';

export interface PhotoAnalysis {
  subjectDescription: string;
  framing: string;
  posture: string;
  expression: string;
  gazeDirection: string;
  attire: string;
  lightingKey: string;
  negativeSpace: string;
  dominantColors: string[];
  recommendedPhotoTreatment: PhotoFilterType;
  detectedMood: string;
  editorialPotential: string;
}

export interface AuditReport {
  identityPreserved: boolean;
  photoCenteredNarrative: boolean;
  realMagazineAesthetic: boolean;
  typographicHierarchy: boolean;
  zeroFabricatedQuotes: boolean;
  rhythmAndBalance: boolean;
  flawlessOrthography: boolean;
  overallStatus: 'passed' | 'warning';
  auditNotes: string[];
}

export interface PullQuote {
  text: string;
  attribution?: string;
  context?: string;
}

export interface SidebarBox {
  title: string;
  items: string[];
  note?: string;
}

export interface StatPillar {
  label: string;
  value: string;
  description: string;
}

export interface TimelineMilestone {
  phase: string;
  title: string;
  detail: string;
}

export interface SecondaryStory {
  title: string;
  pageRef: string;
  summary: string;
}

export interface ColophonStaff {
  role: string;
  name: string;
}

export interface ImageSlot {
  placement:
    | 'full_bleed'
    | 'asymmetric_right'
    | 'hero_top'
    | 'portrait_inset'
    | 'editorial_split'
    | 'minimal_accent';
  caption?: string;
  credit?: string;
  aspectRatio?: string;
  customImageUrl?: string;
}

export type PageType =
  | 'cover'
  | 'editorial'
  | 'feature_story_part1'
  | 'feature_story_part2'
  | 'profile'
  | 'insights'
  | 'deep_dive'
  | 'dialogue'
  | 'infographic_timeline'
  | 'manifesto_quote'
  | 'colophon'
  | 'back_cover';

export interface MagazinePage {
  pageNumber: number;
  pageType: PageType;
  title: string;
  kicker?: string;
  subtitle?: string;
  deck?: string;
  paragraphs: string[];
  pullQuote?: PullQuote;
  sidebarBox?: SidebarBox;
  statsOrPillars?: StatPillar[];
  timelineMilestones?: TimelineMilestone[];
  secondaryStories?: SecondaryStory[];
  colophonStaff?: ColophonStaff[];
  imageSlot?: ImageSlot;
  layoutTheme?: 'light_archival' | 'dark_luxury' | 'stark_gallery' | 'editorial_terracotta';
}

export interface MagazineEdition {
  id: string;
  name: string;
  issueNumber: string;
  date: string;
  category: string;
  editorialTone: string;
  headline: string;
  subheadline: string;
  editorialSummary: string;
  colorPalette: {
    canvas: string;
    textPrimary: string;
    textMuted: string;
    accent: string;
    divider: string;
    surface: string;
  };
  typographyStyle: {
    displayFont: string;
    bodyFont: string;
    genreStyle:
      | 'vogue_prestige'
      | 'wired_modern'
      | 'forbes_business'
      | 'kinfolk_minimal'
      | 'atlantic_journalistic';
  };
  photoAnalysis: PhotoAnalysis;
  auditReport: AuditReport;
  pages: MagazinePage[];
  primaryPhotoUrl: string;
  activePhotoFilter: PhotoFilterType;
}
