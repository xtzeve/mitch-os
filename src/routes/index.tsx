import { createFileRoute, Link } from "@tanstack/react-router";
import { AccaMechanismBlock } from "@/components/acca-mechanism-block";
import { BookCallButton } from "@/components/book-call-button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useReveal } from "@/hooks/use-reveal";
import { getHomeCopy, getHomeMeta, type HomeCopy, type HomeLocale } from "@/lib/home-i18n";
import wordmark from "@/assets/mitch-wordmark.png";

export const Route = createFileRoute("/")({
  head: () => getHomeMeta("en", wordmark),
  component: HomePageEn,
});

function HomePageEn() {
  return <MitchOSPage locale="en" />;
}

function OSHeader({ locale, copy }: { locale: HomeLocale; copy: HomeCopy }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[color:var(--warmwhite)]/85 border-b border-[color:var(--border)]">
      <div className="container-mitch flex items-center justify-between h-16 md:h-20">
        <Link
          to={locale === "de" ? "/de" : "/"}
          className="flex items-center"
          aria-label="MITCH OS home"
        >
          <img src={wordmark} alt="MITCH" className="h-10 md:h-12 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {copy.nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm tracking-wide text-[color:var(--offblack)] hover:text-[color:var(--burnt)] transition-colors"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} />
          <BookCallButton className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[color:var(--offblack)] text-[color:var(--warmwhite)] hover:bg-[color:var(--burnt)] transition-colors rounded-sm">
            {copy.headerCta} <span aria-hidden>→</span>
          </BookCallButton>
        </div>
      </div>
    </header>
  );
}

function Reveal({
  as: As = "div",
  children,
  className = "",
  delay = 0,
  ...rest
}: {
  as?: any;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  [k: string]: any;
}) {
  const r = useReveal();
  return (
    <As
      ref={r.ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`${r.className} ${className}`}
      {...rest}
    >
      {children}
    </As>
  );
}

function Hero({ copy }: { copy: HomeCopy }) {
  const [p1, p2, p3] = copy.hero.paragraphs;
  return (
    <section id="hero" className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, var(--burnt) 0, transparent 40%), radial-gradient(circle at 80% 70%, var(--offblack) 0, transparent 45%)",
        }}
      />
      <div className="container-mitch pt-16 pb-24 md:pt-28 md:pb-36">
        <Reveal as="p" className="eyebrow">
          {copy.hero.kicker}
        </Reveal>
        <Reveal
          as="h1"
          className="mt-6 text-[clamp(2.25rem,6vw,5.25rem)] leading-[1.04] tracking-tight max-w-5xl"
        >
          {copy.hero.h1}
        </Reveal>
        <Reveal
          as="p"
          className="mt-6 text-[clamp(1.25rem,2.4vw,1.75rem)] leading-snug max-w-4xl font-display italic text-[color:var(--burnt)]"
          delay={80}
        >
          {copy.hero.subHeadline}
        </Reveal>
        <Reveal className="mt-10 max-w-4xl space-y-5 text-lg md:text-xl leading-relaxed text-[color:var(--offblack)]/85" delay={120}>
          <p>{p1}</p>
          <p>{p2}</p>
          <p>{p3}</p>
        </Reveal>
        <Reveal className="mt-10" delay={160}>
          <BookCallButton className="inline-flex items-center gap-2 px-6 py-3.5 bg-[color:var(--offblack)] text-[color:var(--warmwhite)] hover:bg-[color:var(--burnt)] transition-colors rounded-sm text-base font-medium">
            {copy.hero.cta} <span aria-hidden>→</span>
          </BookCallButton>
        </Reveal>
      </div>
      <div className="rule" />
    </section>
  );
}

function WhatSection({ copy }: { copy: HomeCopy }) {
  const { what } = copy;
  return (
    <section id="what" className="py-24 md:py-36">
      <div className="container-mitch">
        <Reveal>
          <p className="eyebrow">{what.eyebrow}</p>
          <h2 className="mt-5 text-[clamp(2rem,4.6vw,3.75rem)] max-w-4xl">{what.headline}</h2>
          <div className="mt-10 max-w-4xl space-y-5 text-lg leading-relaxed text-[color:var(--offblack)]/85">
            {what.beforeStages.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-16 md:mt-20">
          <AccaMechanismBlock tone="light" />
        </Reveal>

        <Reveal className="mt-16 max-w-4xl space-y-5 text-lg leading-relaxed text-[color:var(--offblack)]/85">
          {what.afterStages.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </Reveal>

        <Reveal className="mt-16 md:mt-20 text-center">
          <p className="font-display italic text-[clamp(1.75rem,4.5vw,3.25rem)] leading-tight tracking-tight max-w-3xl mx-auto text-[color:var(--burnt)]">
            {what.emphasis}
          </p>
        </Reveal>

        <Reveal className="mt-10 text-center">
          <p className="font-display text-[clamp(1.35rem,3vw,2.25rem)] leading-snug tracking-tight max-w-3xl mx-auto">
            {what.closing}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function WhySection({ copy }: { copy: HomeCopy }) {
  const { why } = copy;
  return (
    <section
      id="why"
      className="py-24 md:py-36 bg-[color:var(--offblack)] text-[color:var(--warmwhite)]"
    >
      <div className="container-mitch">
        <Reveal>
          <p className="eyebrow" style={{ color: "var(--burnt)" }}>
            {why.eyebrow}
          </p>
          <h2 className="mt-5 text-[clamp(2rem,4.6vw,3.75rem)] max-w-4xl text-[color:var(--warmwhite)]">
            {why.headline}
          </h2>
          <p className="mt-5 text-[clamp(1.15rem,2.2vw,1.5rem)] max-w-3xl text-[color:var(--warmwhite)]/75 leading-snug">
            {why.subHeadline}
          </p>
          <div className="mt-10 max-w-4xl space-y-5 text-lg leading-relaxed text-[color:var(--warmwhite)]/80">
            {why.paragraphs.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
          <p className="mt-10 font-display text-2xl md:text-3xl text-[color:var(--burnt)]">
            {why.cardsLead}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-px bg-[color:var(--warmwhite)]/10 md:grid-cols-3 border border-[color:var(--warmwhite)]/10">
          {why.cards.map((r, i) => (
            <Reveal
              key={r.title}
              as="article"
              delay={i * 80}
              className="bg-[color:var(--offblack)] p-7 md:p-9 flex flex-col gap-4"
            >
              <span className="font-display text-3xl md:text-4xl text-[color:var(--burnt)]">
                0{i + 1}
              </span>
              <h3 className="font-display text-xl md:text-2xl text-[color:var(--warmwhite)]">
                {r.title}
              </h3>
              <p className="text-sm text-[color:var(--warmwhite)]/70 leading-relaxed">{r.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 max-w-3xl space-y-4 text-[color:var(--warmwhite)]/80">
          {why.closing.map((para) => (
            <p key={para} className="text-lg leading-relaxed">
              {para}
            </p>
          ))}
          <p className="pt-4 font-display italic text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight text-[color:var(--burnt)]">
            {why.closingEmphasis}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function HowSection({ copy }: { copy: HomeCopy }) {
  const { how } = copy;
  return (
    <section id="how" className="py-24 md:py-36">
      <div className="container-mitch">
        <Reveal>
          <p className="eyebrow">{how.eyebrow}</p>
          <h2 className="mt-5 text-[clamp(2rem,4.6vw,3.75rem)] max-w-4xl">{how.headline}</h2>
          <div className="mt-10 max-w-4xl space-y-5 text-lg leading-relaxed text-[color:var(--offblack)]/85">
            {how.opening.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
          <p className="mt-12 font-display italic text-[clamp(1.5rem,3vw,2.25rem)] leading-snug max-w-4xl text-[color:var(--burnt)]">
            {how.emphasis}
          </p>
          <div className="mt-10 max-w-4xl space-y-5 text-lg leading-relaxed text-[color:var(--offblack)]/85">
            {how.continuing.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        </Reveal>

        <div className="mt-16 grid gap-px bg-[color:var(--border)] border border-[color:var(--border)] md:grid-cols-2">
          {how.stages.map((stage, i) => (
            <Reveal
              key={stage.title}
              as="article"
              delay={i * 70}
              className="bg-[color:var(--warmwhite)] p-7 md:p-9 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-2xl md:text-3xl">{stage.title}</h3>
                <span
                  className={`eyebrow ${
                    stage.variant === "team" ? "text-[color:var(--offblack)]/55" : "text-[color:var(--burnt)]"
                  }`}
                >
                  {stage.variant === "team" ? "Your team" : "MITCH"}
                </span>
              </div>
              <p className="text-[color:var(--offblack)]/80 leading-relaxed">{stage.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 max-w-3xl space-y-3">
          <p className="font-display italic text-2xl md:text-3xl leading-snug">{how.closingLead}</p>
          <p className="font-display text-2xl md:text-3xl leading-snug text-[color:var(--burnt)]">
            {how.closingAccent}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function ClosingSection({ copy }: { copy: HomeCopy }) {
  const { closing } = copy;
  return (
    <section id="go" className="py-24 md:py-36">
      <div className="container-mitch">
        <Reveal className="max-w-4xl">
          <p className="eyebrow">{closing.eyebrow}</p>
          <h2 className="mt-5 text-[clamp(2.25rem,5.5vw,4.25rem)] leading-[1.08]">
            {closing.headline}
          </h2>
          <div className="mt-8 max-w-2xl space-y-4 text-lg md:text-xl text-[color:var(--offblack)]/80 leading-relaxed">
            {closing.body.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
          <div className="mt-12 space-y-2">
            {closing.closingLines.map((line, i) => (
              <p
                key={line}
                className={`font-display text-[clamp(1.5rem,3vw,2.5rem)] leading-tight ${
                  i === closing.closingLines.length - 1
                    ? "italic text-[color:var(--burnt)]"
                    : ""
                }`}
              >
                {line}
              </p>
            ))}
          </div>
          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <BookCallButton className="inline-flex items-center gap-2 px-7 py-4 bg-[color:var(--offblack)] text-[color:var(--warmwhite)] hover:bg-[color:var(--burnt)] transition-colors rounded-sm font-medium text-base">
              {closing.cta} <span aria-hidden>→</span>
            </BookCallButton>
            <p className="text-sm text-[color:var(--muted-foreground)]">{closing.ctaNote}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function MitchOSFooter({ copy }: { copy: HomeCopy }) {
  const { footer } = copy;
  return (
    <footer className="border-t border-[color:var(--border)] mt-20 md:mt-32">
      <div className="container-mitch py-12 md:py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl tracking-tight">
            MITCH <span className="italic text-[color:var(--burnt)]">OS</span>
          </p>
          <p className="mt-3 text-sm text-[color:var(--muted-foreground)] max-w-md">{footer.tagline}</p>
        </div>
        <div className="text-sm space-y-2">
          <p className="eyebrow mb-3">{footer.company}</p>
          <a
            href="mailto:info@mitchos.com"
            className="block text-[color:var(--muted-foreground)] hover:text-[color:var(--burnt)] transition-colors"
          >
            info@mitchos.com
          </a>
        </div>
        <div className="text-sm space-y-2">
          <p className="eyebrow mb-3">{footer.legal}</p>
          <Link
            to="/legal-notice"
            className="block text-[color:var(--muted-foreground)] hover:text-[color:var(--burnt)] transition-colors"
          >
            {footer.legalNotice}
          </Link>
          <Link
            to="/privacy-policy"
            className="block text-[color:var(--muted-foreground)] hover:text-[color:var(--burnt)] transition-colors"
          >
            {footer.privacyPolicy}
          </Link>
        </div>
      </div>
      <div className="border-t border-[color:var(--border)]">
        <div className="container-mitch py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs text-[color:var(--muted-foreground)]">
          <p>{footer.serviceBy}</p>
          <p>© {new Date().getFullYear()} — {footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}

export function MitchOSPage({ locale = "en" }: { locale?: HomeLocale }) {
  const copy = getHomeCopy(locale);
  return (
    <div className="min-h-screen bg-[color:var(--background)]">
      <OSHeader locale={locale} copy={copy} />
      <main>
        <Hero copy={copy} />
        <WhatSection copy={copy} />
        <WhySection copy={copy} />
        <HowSection copy={copy} />
        <ClosingSection copy={copy} />
      </main>
      <MitchOSFooter copy={copy} />
    </div>
  );
}
