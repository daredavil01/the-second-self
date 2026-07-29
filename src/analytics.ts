/**
 * Counting, honestly.
 *
 * The whole piece argues for a healthier relationship with technology, so the
 * only consistent analytics is the kind you'd be happy to describe in full on
 * the privacy page — which is exactly what /privacy/ does.
 *
 * GoatCounter: no cookies, no personal data, no cross-site profile, ~3.5KB.
 * It records a page view and a referrer. That is the entire dataset.
 *
 * Three rules enforced here:
 *
 *  1. OFF UNLESS CONFIGURED. Without VITE_GOATCOUNTER the script is never
 *     loaded and no request is made. Local development therefore never
 *     phones home, and a fork of this repo is silent by default.
 *  2. DO-NOT-TRACK AND GLOBAL PRIVACY CONTROL ARE OBEYED. GoatCounter honours
 *     DNT itself; we check first anyway, so the request is never even made.
 *  3. NO COUNT IS EVER SHOWN IN THE EXPERIENCE. The number belongs in a quiet
 *     line on the About page, not in the piece. A visible engagement metric on
 *     a work critiquing engagement metrics is self-refuting — see the
 *     Demetricator note in docs/IMPLEMENTATION-PLAN.md §2.
 */

const ENDPOINT = 'https://gc.zgo.at/count.js';

interface PrivacySignals {
  doNotTrack?: string | null;
  globalPrivacyControl?: boolean;
}

/** Has the visitor asked, by any available signal, not to be counted? */
export function optedOut(): boolean {
  const nav = navigator as Navigator & PrivacySignals;
  if (nav.globalPrivacyControl === true) return true;
  const dnt = nav.doNotTrack ?? (window as unknown as PrivacySignals).doNotTrack;
  return dnt === '1' || dnt === 'yes';
}

export function initAnalytics(): void {
  const code = import.meta.env.VITE_GOATCOUNTER as string | undefined;
  if (!code) return; // unconfigured: no script, no request, no counting
  if (optedOut()) return;

  const script = document.createElement('script');
  script.async = true;
  script.dataset['goatcounter'] = `https://${code}.goatcounter.com/count`;
  script.src = ENDPOINT;
  document.head.appendChild(script);
}
