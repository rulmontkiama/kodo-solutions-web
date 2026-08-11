import { verifyLicenseToken, TokenPayload } from '@/lib/jwt';

const LOCAL_STORAGE_KEY = 'kodo_license_token';
const LAST_VALIDATION_KEY = 'kodo_last_validation';

export interface ValidationResult {
  isValid: boolean;
  payload?: TokenPayload;
  reason?: string;
  isOffline?: boolean;
}

export class LicenseValidator {

  /**
   * Retrieves and verifies the locally cached token.
   * Tolerates up to 14 days of offline usage without contacting the server.
   */
  static async validateLocalToken(): Promise<ValidationResult> {
    if (typeof window === 'undefined') {
      return { isValid: false, reason: 'SSR' };
    }

    const token = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!token) {
      return { isValid: false, reason: 'No token found in cache.' };
    }

    // Verify the token cryptographically
    const payload = await verifyLicenseToken(token);
    if (!payload) {
      return { isValid: false, reason: 'Token is invalid or corrupted.' };
    }

    // Check if the license status is explicitly suspended/revoked within the token
    if (payload.status !== 'active' && payload.status !== 'ACTIVE') {
      return { isValid: false, reason: 'License is not active.', payload };
    }

    // Check overall license expiration date (hard limit)
    const today = new Date().toISOString().split('T')[0];
    if (payload.expires_at !== 'Permanent' && payload.expires_at !== 'A vie' && today > payload.expires_at) {
       return { isValid: false, reason: `License expired on ${payload.expires_at}`, payload };
    }

    // Offline Tolerance Check: Has it been more than 14 days since the last successful server ping?
    const lastValidation = localStorage.getItem(LAST_VALIDATION_KEY);
    if (lastValidation) {
      const lastValidationDate = new Date(lastValidation);
      const daysSinceLastValidation = (new Date().getTime() - lastValidationDate.getTime()) / (1000 * 3600 * 24);

      if (daysSinceLastValidation > 14) {
        return {
          isValid: false,
          reason: 'Offline tolerance exceeded (14 days). Please reconnect to the internet.',
          payload,
          isOffline: true
        };
      }
    } else {
      // If we have a token but no last validation date, set it to now to start the clock
      localStorage.setItem(LAST_VALIDATION_KEY, new Date().toISOString());
    }

    return { isValid: true, payload, isOffline: true };
  }

  /**
   * Pings the central server to validate the license key and fetch a fresh token.
   */
  static async validateWithServer(licenseKey: string, hardwareId: string = 'UNKNOWN'): Promise<ValidationResult> {
    try {
      const apiUrl = typeof window !== 'undefined' ? '/api/license/validate' : `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/license/validate`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ license_key: licenseKey, hardware_id: hardwareId }),
      });

      const data = await response.json();

      if (data.valid && data.token) {
        if (typeof window !== 'undefined') {
          // Cache the new token and update the last validation timestamp
          localStorage.setItem(LOCAL_STORAGE_KEY, data.token);
          localStorage.setItem(LAST_VALIDATION_KEY, new Date().toISOString());
        }

        const payload = await verifyLicenseToken(data.token);
        return { isValid: true, payload: payload || undefined, isOffline: false };
      } else {
        return { isValid: false, reason: data.reason || 'Server rejected license.' };
      }
    } catch (error) {
      console.warn('Could not reach license server, falling back to local validation.', error);
      return this.validateLocalToken();
    }
  }

  /**
   * Helper to clear local license state (e.g. on logout or factory reset)
   */
  static clearCache() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem(LAST_VALIDATION_KEY);
    }
  }
}
