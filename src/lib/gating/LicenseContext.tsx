'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { LicenseValidator, ValidationResult } from '@/lib/gating/LicenseValidator';
import { TokenPayload } from '@/lib/jwt';

interface LicenseContextType {
  isChecking: boolean;
  isValid: boolean;
  payload: TokenPayload | null;
  hasFeature: (featureName: string) => boolean;
  refreshLicense: (licenseKey: string, hardwareId?: string) => Promise<ValidationResult>;
  error: string | null;
}

const LicenseContext = createContext<LicenseContextType>({
  isChecking: true,
  isValid: false,
  payload: null,
  hasFeature: () => false,
  refreshLicense: async () => ({ isValid: false, reason: 'Not initialized' }),
  error: null,
});

export const useLicense = () => useContext(LicenseContext);

export const LicenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [payload, setPayload] = useState<TokenPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const runInit = async () => {
      // 1. First, check local offline token for fast rendering
      const localResult = await LicenseValidator.validateLocalToken();
      if (!isMounted) return;

      if (localResult.isValid && localResult.payload) {
        setIsValid(true);
        setPayload(localResult.payload);

        // 2. If it's been more than 24 hours since the last validation, ping server in background
        const lastValidationStr = typeof window !== 'undefined' ? localStorage.getItem('kodo_last_validation') : null;
        if (lastValidationStr) {
          const lastValidation = new Date(lastValidationStr);
          const hoursSinceLastPing = (new Date().getTime() - lastValidation.getTime()) / (1000 * 3600);

          if (hoursSinceLastPing > 24) {
            console.log('[LICENSE] Triggering background refresh (24h elapsed)');
            LicenseValidator.validateWithServer(localResult.payload.license_key, localResult.payload.hardware_id)
              .then(serverResult => {
                 if (isMounted && serverResult.isValid && serverResult.payload) {
                   setPayload(serverResult.payload);
                 }
              })
              .catch(err => console.warn('[LICENSE] Background refresh failed, continuing offline', err));
          }
        }
      } else {
        setIsValid(false);
        setError(localResult.reason || 'Invalid license');
      }
      setIsChecking(false);
    };

    runInit();

    return () => { isMounted = false; };
  }, []);

  const hasFeature = useCallback((featureName: string) => {
    if (!isValid || !payload) return false;
    // Special override for master plans if needed
    if (payload.plan === 'ENTERPRISE') return true;
    return payload.features?.includes(featureName) ?? false;
  }, [isValid, payload]);

  const refreshLicense = async (licenseKey: string, hardwareId?: string) => {
    setIsChecking(true);
    const result = await LicenseValidator.validateWithServer(licenseKey, hardwareId);

    if (result.isValid && result.payload) {
      setIsValid(true);
      setPayload(result.payload);
      setError(null);
    } else {
      setIsValid(false);
      setPayload(null);
      setError(result.reason || 'Validation failed');
    }

    setIsChecking(false);
    return result;
  };

  return (
    <LicenseContext.Provider value={{ isChecking, isValid, payload, hasFeature, refreshLicense, error }}>
      {children}
    </LicenseContext.Provider>
  );
};
