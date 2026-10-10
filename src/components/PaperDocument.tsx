import React from 'react';
import {
  CVData,
  CoverLetterData,
  PaletteColors,
  TemplateId,
  CVLang,
  SpacingMode,
} from '../types';
import { ModerneBleu } from '../templates/ModerneBleu';
import { CanvaCreatifSidebar } from '../templates/CanvaCreatifSidebar';
import { CanvaElegantHeader } from '../templates/CanvaElegantHeader';
import { CanvaMinimaliste } from '../templates/CanvaMinimaliste';
import { CanvaCadres } from '../templates/CanvaCadres';
import { CanvaArche } from '../templates/CanvaArche';
import { CanvaVague } from '../templates/CanvaVague';
import { CanvaGeometrique } from '../templates/CanvaGeometrique';
import { CanvaExecutif } from '../templates/CanvaExecutif';
import { ClassiqueATS } from '../templates/ClassiqueATS';
import { LettreTemplate } from '../templates/Lettre';

export interface PaperDocumentProps {
  cv: CVData;
  letter: CoverLetterData;
  activeTab: 'cv' | 'lettre';
  palette: PaletteColors;
  templateId: TemplateId;
  lang: CVLang;
  compact: boolean;
  spacingMode?: SpacingMode;
  showPhotoInATS?: boolean;
  letterFontSize?: number;
  className?: string;
}

export const PaperDocument: React.FC<PaperDocumentProps> = ({
  cv,
  letter,
  activeTab,
  palette,
  templateId,
  lang,
  compact,
  spacingMode = 'remplir',
  showPhotoInATS = true,
  letterFontSize = 10,
  className = '',
}) => {
  const isCompact = compact || spacingMode === 'compact';

  const renderContent = () => {
    if (activeTab === 'lettre') {
      return (
        <LettreTemplate
          cv={cv}
          letter={letter}
          palette={palette}
          lang={lang}
          compact={isCompact}
          fontSizePt={letterFontSize}
        />
      );
    }

    switch (templateId) {
      case 'moderne-bleu':
        return (
          <ModerneBleu
            data={cv}
            palette={palette}
            lang={lang}
            compact={isCompact}
            spacingMode={spacingMode}
          />
        );
      case 'canva-sidebar':
        return (
          <CanvaCreatifSidebar
            data={cv}
            palette={palette}
            lang={lang}
            compact={isCompact}
            spacingMode={spacingMode}
          />
        );
      case 'canva-elegant':
        return (
          <CanvaElegantHeader
            data={cv}
            palette={palette}
            lang={lang}
            compact={isCompact}
            spacingMode={spacingMode}
          />
        );
      case 'canva-minimaliste':
        return (
          <CanvaMinimaliste
            data={cv}
            palette={palette}
            lang={lang}
            compact={isCompact}
            spacingMode={spacingMode}
          />
        );
      case 'canva-cadres':
        return (
          <CanvaCadres
            data={cv}
            palette={palette}
            lang={lang}
            compact={isCompact}
            spacingMode={spacingMode}
          />
        );
      case 'canva-arche':
        return (
          <CanvaArche
            data={cv}
            palette={palette}
            lang={lang}
            compact={isCompact}
            spacingMode={spacingMode}
          />
        );
      case 'canva-vague':
        return (
          <CanvaVague
            data={cv}
            palette={palette}
            lang={lang}
            compact={isCompact}
            spacingMode={spacingMode}
          />
        );
      case 'canva-geometrique':
        return (
          <CanvaGeometrique
            data={cv}
            palette={palette}
            lang={lang}
            compact={isCompact}
            spacingMode={spacingMode}
          />
        );
      case 'canva-executif':
        return (
          <CanvaExecutif
            data={cv}
            palette={palette}
            lang={lang}
            compact={isCompact}
            spacingMode={spacingMode}
          />
        );
      case 'classique-ats':
      default:
        return (
          <ClassiqueATS
            data={cv}
            palette={palette}
            lang={lang}
            compact={isCompact}
            spacingMode={spacingMode}
            showPhoto={showPhotoInATS}
          />
        );
    }
  };

  return (
    <div
      className={`paper-document-root ${className}`}
      style={{
        position: 'relative',
        width: '794px',
        height: '1123px',
        margin: 0,
        transform: 'none',
        backgroundColor: '#ffffff',
        boxSizing: 'border-box',
        overflow: 'hidden',
        isolation: 'isolate',
      }}
    >
      {renderContent()}
    </div>
  );
};
