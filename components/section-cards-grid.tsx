"use client";

import { ReactNode } from "react";

interface SectionCardsGridProps {
  /**
   * Cards to be displayed in the grid
   */
  children: ReactNode;
  /**
   * Custom className to override default styles
   */
  className?: string;
}

/**
 * Grid layout for section cards with responsive behavior
 */
export function SectionCardsGrid({ children, className = "" }: SectionCardsGridProps) {
  return (
    <div className={`grid grid-cols-1 gap-4 px-4 lg:px-6 xl:grid-cols-2 5xl:grid-cols-4 ${className}`}>
      {children}
    </div>
  );
}