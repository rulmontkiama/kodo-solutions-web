'use client';

import React from 'react';
import { useLicense } from '@/lib/gating/LicenseContext';
import { ProBadge } from './ProBadge';

interface FeatureGateProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  behavior?: 'hide' | 'disable' | 'overlay';
  disabledMessage?: string;
  requiredPlanLabel?: string;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  children,
  fallback,
  behavior = 'hide',
  disabledMessage = 'Cette fonctionnalité nécessite un abonnement supérieur.',
  requiredPlanLabel = 'PRO'
}) => {
  const { isChecking, hasFeature } = useLicense();

  if (isChecking) {
    return <div className="animate-pulse opacity-50">{children}</div>; // Or a dedicated skeleton
  }

  const isAllowed = hasFeature(feature);

  if (isAllowed) {
    return <>{children}</>;
  }

  // Feature is NOT allowed. Handle based on requested behavior:

  if (behavior === 'hide') {
    return fallback ? <>{fallback}</> : null;
  }

  if (behavior === 'disable') {
    return (
      <div className="relative group opacity-60 grayscale cursor-not-allowed pointer-events-none transition-all duration-300">
        <div className="absolute -top-3 -right-3 z-10 pointer-events-auto">
          <ProBadge label={requiredPlanLabel} />
        </div>
        {children}
      </div>
    );
  }

  if (behavior === 'overlay') {
    return (
      <div className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-white/10">
        <div className="blur-[2px] opacity-40 select-none pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-white/30 dark:bg-black/30 backdrop-blur-sm">
          <ProBadge label={requiredPlanLabel} className="mb-3 scale-110" />
          <h3 className="font-outfit text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Mise à niveau requise
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 max-w-sm">
            {disabledMessage}
          </p>
          <a
             href="/billing/upgrade"
             className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-medium rounded-lg text-sm transition-transform hover:scale-105"
          >
            Voir les abonnements
          </a>
        </div>
      </div>
    );
  }

  return null;
};
