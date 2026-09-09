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
