import { Link } from "@tanstack/react-router";
import wordmark from "@/assets/mitch-wordmark.png";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { LandingLocale } from "@/lib/landing-i18n";

type SiteHeaderProps = {
  landingLocale?: LandingLocale;
  landingSlug?: string;
};

export function SiteHeader({ landingLocale, landingSlug }: SiteHeaderProps = {}) {
  const showLanguageSwitcher = Boolean(landingLocale && landingSlug);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[color:var(--warmwhite)]/85 border-b border-[color:var(--border)]">
      <div className="container-mitch flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center" aria-label="MITCH OS home">
          <img src={wordmark} alt="MITCH" className="h-10 md:h-12 w-auto" />
        </Link>
        {showLanguageSwitcher ? (
          <LanguageSwitcher locale={landingLocale!} slug={landingSlug!} />
        ) : null}
      </div>
    </header>
  );
}
