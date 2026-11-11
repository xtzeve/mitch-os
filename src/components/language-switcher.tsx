import type { LandingLocale } from "@/lib/landing-i18n";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  locale: LandingLocale;
  slug?: string;
  /** Custom hrefs per locale (e.g. `/intro` ↔ `/de/intro`). Takes precedence over `slug`. */
  hrefs?: Record<LandingLocale, string>;
  /** `dark` is for dark surfaces such as the intro presentation. */
  tone?: "light" | "dark";
  /** `lg` is for the 1600×900 intro stage (scaled down to fit the viewport). */
  size?: "md" | "lg";
  className?: string;
};

export function LanguageSwitcher({
  locale,
  slug,
  hrefs,
  tone = "light",
  size = "md",
  className,
}: LanguageSwitcherProps) {
  const languages: { code: LandingLocale; label: string; href: string }[] =
    hrefs
      ? [
          { code: "en", label: "EN", href: hrefs.en },
          { code: "de", label: "DE", href: hrefs.de },
        ]
      : slug
        ? [
            { code: "en", label: "EN", href: `/${slug}` },
            { code: "de", label: "DE", href: `/de/${slug}` },
          ]
        : [
            { code: "en", label: "EN", href: "/" },
            { code: "de", label: "DE", href: "/de" },
          ];

  const dark = tone === "dark";

  return (
    <nav
      aria-label="Language"
      className={cn(
        "inline-flex items-center rounded-sm border p-0.5",
        dark ? "border-[#3A3A40]" : "border-[color:var(--border)]",
        className,
      )}
    >
      {languages.map((language) => {
        const isActive = locale === language.code;
        return (
          <a
            key={language.code}
            href={language.href}
            className={cn(
              "font-semibold tracking-wide transition-colors rounded-sm",
              size === "lg"
                ? "px-4 py-1.5 text-[15px] leading-5"
                : "px-3 py-1.5 text-xs",
              dark
                ? isActive
                  ? "bg-[#F4F0E8] text-[#0A0A0B]"
                  : "text-[#8F8B83] hover:text-[#FF6B2C]"
                : isActive
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
