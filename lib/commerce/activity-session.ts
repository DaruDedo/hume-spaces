export const analyticsConsentKey = 'hume-analytics-consent';
export const visitWindow = 30 * 60 * 1000;

export function analyticsEnabled() {
  return localStorage.getItem(analyticsConsentKey) !== 'declined';
}

export function currentStorefrontVisit() {
  try {
    const lastSeen = Number(sessionStorage.getItem('hume-visit-time'));
    if (analyticsEnabled() && Date.now() - lastSeen < visitWindow) {
      return sessionStorage.getItem('hume-visit') ?? undefined;
    }
  } catch {
    // Checkout works without analytics storage.
  }
}
