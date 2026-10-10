import React from 'react';

interface ScaledPaperProps {
  scale: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Composant partagé ScaledPaper :
 * Encapsule la feuille A4 (794 x 1123 px) dans un wrapper aux dimensions physiques exactes
 * (794 * scale) x (1123 * scale) avec transform-origin: top left.
 * Empêche tout décalage d'en-tête, tronquage de scroll ou vide en bas de page.
 */
export const ScaledPaper: React.FC<ScaledPaperProps> = ({
  scale,
  children,
  className = '',
  style,
}) => {
  const scaledWidth = Math.round(794 * scale);
  const scaledHeight = Math.round(1123 * scale);

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{
        width: `${scaledWidth}px`,
        height: `${scaledHeight}px`,
        minWidth: `${scaledWidth}px`,
        maxWidth: `${scaledWidth}px`,
        minHeight: `${scaledHeight}px`,
        maxHeight: `${scaledHeight}px`,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '794px',
          height: '1123px',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </div>
    </div>
  );
};
