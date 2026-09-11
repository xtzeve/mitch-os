export type PageVisitRecord = {
  visit_id: number;
  page_id: number;
  started_at: string;
  last_seen_at: string;
  ended_at: string | null;
  duration_sec: number;
  locale: string | null;
  user_agent: string | null;
  is_bot: boolean;
  counted: boolean;
};

/** Common crawlers, link-previewers, and email security scanners. */
export function isBotUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  return /bot|crawl|spider|slurp|facebookexternalhit|linkedinbot|twitterbot|whatsapp|telegrambot|discordbot|preview|headless|phantom|selenium|puppeteer|playwright|httpclient|python-requests|curl\/|wget|outlook|safelinks|proofpoint|mimecast|barracuda|microsoft office|googleimageproxy|yahoo.*mail|applebot|bytespider|gptbot|claudebot|semrush|ahrefs|mj12bot|dotbot|petalbot|pingdom|uptimerobot|statuscake|monitoring/i.test(
    userAgent,
  );
}

/**
 * Cloudflare ASN numbers that run LinkedIn/Azure-style headless link scanners.
 * Observed: rotating IPs, Chrome spoof, ~27s sessions, asOrganization "Microsoft Limited".
 */
export const BLOCKED_VISIT_ASNS = new Set([8075]);

export function isBlockedVisitAsn(asn: number | string | null | undefined): boolean {
  if (asn == null || asn === "") return false;
  const n = typeof asn === "number" ? asn : Number(asn);
  return Number.isFinite(n) && BLOCKED_VISIT_ASNS.has(n);
}

export function getRequestAsn(request: Request): number | null {
  const cf = request.cf as { asn?: number | string } | undefined;
  if (cf?.asn == null || cf.asn === "") return null;
  const n = Number(cf.asn);
  return Number.isFinite(n) ? n : null;
}
