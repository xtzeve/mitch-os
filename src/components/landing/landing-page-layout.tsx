import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { LandingPage, type LandingPageContent } from "@/components/landing/landing-page";
import { LandingVisitTracker } from "@/components/landing/landing-visit-tracker";
import type { LandingLocale } from "@/lib/landing-i18n";

type LandingPageLayoutProps = {
  locale: LandingLocale;
  content: LandingPageContent & { page_id: number };
};

export function LandingPageLayout({ locale, content }: LandingPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[color:var(--warmwhite)]">
      <LandingVisitTracker pageId={content.page_id} locale={locale} />
      <SiteHeader landingLocale={locale} landingSlug={content.slug} />
      <LandingPage locale={locale} content={content} />
      <SiteFooter />
    </div>
  );
}
