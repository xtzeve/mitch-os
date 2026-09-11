/** Best-effort client fingerprint for visit debug logging. */
export function collectVisitClientProbe(extra?: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return { unavailable: true, ...extra };
  }

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { effectiveType?: string; rtt?: number; downlink?: number; saveData?: boolean };
    userAgentData?: {
      brands?: Array<{ brand: string; version: string }>;
      mobile?: boolean;
      platform?: string;
      getHighEntropyValues?: (hints: string[]) => Promise<Record<string, unknown>>;
    };
  };

  const connection = nav.connection
    ? {
        effectiveType: nav.connection.effectiveType ?? null,
        rtt: nav.connection.rtt ?? null,
        downlink: nav.connection.downlink ?? null,
        saveData: nav.connection.saveData ?? null,
      }
    : null;

  return {
    href: location.href,
    origin: location.origin,
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
    referrer: document.referrer || null,
    title: document.title,
    visibilityState: document.visibilityState,
    hidden: document.hidden,
    hasFocus: typeof document.hasFocus === "function" ? document.hasFocus() : null,
    cookieEnabled: nav.cookieEnabled,
    language: nav.language,
    languages: Array.from(nav.languages ?? []),
    userAgent: nav.userAgent,
    platform: nav.platform,
    vendor: nav.vendor,
    webdriver: Boolean(nav.webdriver),
    hardwareConcurrency: nav.hardwareConcurrency ?? null,
    deviceMemory: nav.deviceMemory ?? null,
    maxTouchPoints: nav.maxTouchPoints ?? null,
    pdfViewerEnabled: "pdfViewerEnabled" in nav ? Boolean((nav as { pdfViewerEnabled?: boolean }).pdfViewerEnabled) : null,
    pluginsLength: nav.plugins?.length ?? null,
    mimeTypesLength: nav.mimeTypes?.length ?? null,
    connection,
    userAgentData: nav.userAgentData
      ? {
          brands: nav.userAgentData.brands ?? null,
          mobile: nav.userAgentData.mobile ?? null,
          platform: nav.userAgentData.platform ?? null,
        }
      : null,
    screen: {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth,
      orientation: screen.orientation?.type ?? null,
    },
    window: {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight,
      devicePixelRatio: window.devicePixelRatio,
      screenX: window.screenX,
      screenY: window.screenY,
    },
    historyLength: history.length,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffsetMin: new Date().getTimezoneOffset(),
    performanceNow: typeof performance !== "undefined" ? Math.round(performance.now()) : null,
    ...extra,
  };
}

export async function enrichVisitClientProbe(base: Record<string, unknown>) {
  const nav = typeof navigator !== "undefined"
    ? (navigator as Navigator & {
        userAgentData?: {
          getHighEntropyValues?: (hints: string[]) => Promise<Record<string, unknown>>;
        };
      })
    : null;

  if (!nav?.userAgentData?.getHighEntropyValues) return base;

  try {
    const highEntropy = await nav.userAgentData.getHighEntropyValues([
      "architecture",
      "bitness",
      "model",
      "platformVersion",
      "uaFullVersion",
      "fullVersionList",
    ]);
    return { ...base, userAgentDataHighEntropy: highEntropy };
  } catch {
    return base;
  }
}
