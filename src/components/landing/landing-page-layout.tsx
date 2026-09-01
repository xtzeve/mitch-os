import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { LandingPage, type LandingPageContent } from "@/components/landing/landing-page";
import type { LandingLocale } from "@/lib/landing-i18n";

type LandingPageLayoutProps = {
  locale: LandingLocale;
  content: LandingPageContent;
};

export function LandingPageLayout({ locale, content }: LandingPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[color:var(--warmwhite)]">
      <SiteHeader landingLocale={locale} landingSlug={content.slug} />
      <LandingPage locale={locale} content={content} />
      <SiteFooter />
    </div>
  );
}
