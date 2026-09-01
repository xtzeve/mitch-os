import type { LandingLocale } from "@/lib/landing-i18n";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  locale: LandingLocale;
  slug?: string;
};

export function LanguageSwitcher({ locale, slug }: LanguageSwitcherProps) {
  const languages: { code: LandingLocale; label: string; href: string }[] = slug
    ? [
        { code: "en", label: "EN", href: `/${slug}` },
        { code: "de", label: "DE", href: `/de/${slug}` },
      ]
    : [
        { code: "en", label: "EN", href: "/" },
        { code: "de", label: "DE", href: "/de" },
      ];

  return (
    <nav
      aria-label="Language"
      className="inline-flex items-center rounded-sm border border-[color:var(--border)] p-0.5"
    >
      {languages.map((language) => {
        const isActive = locale === language.code;
        return (
          <a
            key={language.code}
            href={language.href}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors rounded-sm",
              isActive
                ? "bg-[color:var(--offblack)] text-[color:var(--warmwhite)]"
                : "text-[color:var(--muted-foreground)] hover:text-[color:var(--burnt)]",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {language.label}
          </a>
        );
      })}
    </nav>
  );
}
