import React from 'react';

export interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = 'h-4 w-full' }) => {
  return (
    <div
      aria-hidden="true"
      className={`bg-surface-secondary border border-default/40 rounded-md animate-pulse ${className}`}
    />
  );
};
