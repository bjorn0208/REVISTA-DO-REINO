import React from 'react';
import { MagazineEdition } from '../../types/magazine';
import { CoverPage } from './CoverPage';
import { EditorialPage } from './EditorialPage';
import { FeatureStoryPart1Page } from './FeatureStoryPart1Page';
import { FeatureStoryPart2Page } from './FeatureStoryPart2Page';
import { ProfilePage } from './ProfilePage';
import { InsightsPage } from './InsightsPage';
import { DeepDivePage } from './DeepDivePage';
import { DialoguePage } from './DialoguePage';
import { InfographicTimelinePage } from './InfographicTimelinePage';
import { ManifestoQuotePage } from './ManifestoQuotePage';
import { ColophonPage } from './ColophonPage';
import { BackCoverPage } from './BackCoverPage';

interface PageRendererProps {
  pageNumber: number;
  edition: MagazineEdition;
  onRefinePage?: (pageNumber: number) => void;
  onNavigateToPage?: (pageNumber: number) => void;
  onUpdateEdition?: (updatedEdition: MagazineEdition) => void;
  onOpenCoverBackgroundModal?: () => void;
  onOpenCoverTextModal?: () => void;
  isPrintMode?: boolean;
}

export const PageRenderer: React.FC<PageRendererProps> = ({
  pageNumber,
  edition,
  onRefinePage,
  onNavigateToPage,
  onUpdateEdition,
  onOpenCoverBackgroundModal,
  onOpenCoverTextModal,
  isPrintMode = false,
}) => {
  const renderContent = () => {
    switch (pageNumber) {
      case 1:
        return (
          <CoverPage
            edition={edition}
            onRefinePage={onRefinePage}
            onUpdateEdition={onUpdateEdition}
            onOpenBackgroundModal={onOpenCoverBackgroundModal}
            onOpenTextModal={onOpenCoverTextModal}
            isPrintMode={isPrintMode}
          />
        );
      case 2:
        return (
          <EditorialPage
            edition={edition}
            onRefinePage={onRefinePage}
            onNavigateToPage={onNavigateToPage}
          />
        );
      case 3:
        return <FeatureStoryPart1Page edition={edition} onRefinePage={onRefinePage} />;
      case 4:
        return <FeatureStoryPart2Page edition={edition} onRefinePage={onRefinePage} />;
      case 5:
        return <ProfilePage edition={edition} onRefinePage={onRefinePage} />;
      case 6:
        return <InsightsPage edition={edition} onRefinePage={onRefinePage} />;
      case 7:
        return <DeepDivePage edition={edition} onRefinePage={onRefinePage} />;
      case 8:
        return <DialoguePage edition={edition} onRefinePage={onRefinePage} />;
      case 9:
        return <InfographicTimelinePage edition={edition} onRefinePage={onRefinePage} />;
      case 10:
        return <ManifestoQuotePage edition={edition} onRefinePage={onRefinePage} />;
      case 11:
        return <ColophonPage edition={edition} onRefinePage={onRefinePage} />;
      case 12:
        return <BackCoverPage edition={edition} onRefinePage={onRefinePage} />;
      default:
        return (
          <div className="w-full h-full bg-[#fbf9f5] flex items-center justify-center text-[#777]">
            Página {pageNumber}
          </div>
        );
    }
  };

  return (
    <div
      className={`relative w-full h-full ${
        isPrintMode
          ? 'magazine-print-sheet'
          : 'shadow-2xl rounded-sm overflow-hidden border border-[#2b2723]'
      }`}
      style={{
        aspectRatio: isPrintMode ? undefined : '210 / 297', // International Standard A4 / Magazine Ratio
      }}
    >
      {renderContent()}
    </div>
  );
};
