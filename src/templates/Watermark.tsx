import React from 'react';
import { WATERMARK_ENABLED } from '../config/app';

export const Watermark: React.FC = () => {
  if (!WATERMARK_ENABLED) return null;

  return (
    <div className="watermark-overlay" aria-hidden="true">
      <span className="watermark-text select-none">
        APERÇU
      </span>
    </div>
  );
};
