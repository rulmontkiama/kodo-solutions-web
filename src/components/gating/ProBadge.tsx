'use client';

import React from 'react';
import { Lock } from 'lucide-react';

interface ProBadgeProps {
  label?: string;
  className?: string;
}

export const ProBadge: React.FC<ProBadgeProps> = ({ label = 'PRO', className = '' }) => {
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 ${className}`}>
      <Lock className="w-3 h-3 mr-1" />
      {label}
    </span>
  );
};
