import { createFileRoute, Link } from "@tanstack/react-router";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useReveal } from "@/hooks/use-reveal";
import { getHomeCopy, getHomeMeta, type HomeCopy, type HomeLocale } from "@/lib/home-i18n";
import wordmark from "@/assets/mitch-wordmark.png";

export const Route = createFileRoute("/")({
  head: () => getHomeMeta("en"),
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
          <a
            href="#go"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[color:var(--offblack)] text-[color:var(--warmwhite)] hover:bg-[color:var(--burnt)] transition-colors rounded-sm"
          >
            {copy.headerCta} <span aria-hidden>→</span>
          </a>
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
          className="mt-8 text-[clamp(1.125rem,2vw,1.5rem)] leading-relaxed max-w-4xl text-[color:var(--offblack)]/90"
          delay={100}
        >
          {copy.hero.subHeadline}
        </Reveal>
        <Reveal
          as="p"
          className="mt-8 text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed max-w-4xl italic font-display text-[color:var(--burnt)]"
          delay={150}
        >
          {copy.hero.body}
        </Reveal>
        <Reveal className="mt-10 grid gap-10 md:grid-cols-[1.4fr_1fr] items-end">
          <p className="text-lg md:text-xl leading-relaxed text-[color:var(--offblack)]/85 max-w-2xl">
            {copy.hero.tagline}
          </p>
          <div className="md:text-right">
            <a
              href="#go"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[color:var(--offblack)] text-[color:var(--warmwhite)] hover:bg-[color:var(--burnt)] transition-colors rounded-sm text-base font-medium"
            >
              {copy.hero.cta} <span aria-hidden>→</span>
            </a>
          </div>
        </Reveal>
      </div>
      <div className="rule" />
    </section>
  );
}

function WhatSection({ copy }: { copy: HomeCopy }) {
  return (
    <section id="what" className="py-24 md:py-36">
      <div className="container-mitch">
        <Reveal>
          <p className="eyebrow">{copy.what.eyebrow}</p>
          <h2 className="mt-5 text-[clamp(2rem,4.6vw,3.75rem)] max-w-4xl">{copy.what.headline}</h2>
          <ol className="mt-10 max-w-3xl divide-y divide-[color:var(--border)] border-y border-[color:var(--border)]">
            {copy.what.listItems.map((item, i) => (
              <li
                key={item}
                className="flex items-baseline gap-6 py-5 text-[clamp(1.25rem,2.2vw,1.875rem)] font-display"
              >
                <span className="text-[color:var(--burnt)] text-base tracking-widest">
                  0{i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal className="mt-12 text-[color:var(--offblack)]/85">
          <p className="text-lg leading-relaxed max-w-4xl">{copy.what.body}</p>
        </Reveal>

        <Reveal className="my-20 md:my-28 text-center">
          <p className="font-display italic text-[clamp(1.75rem,4.5vw,3.5rem)] leading-tight tracking-tight max-w-4xl mx-auto">
            {copy.what.scaleLine}
          </p>
        </Reveal>

        <p className="eyebrow mb-6">{copy.what.deliverablesEyebrow}</p>
        <div className="grid gap-px bg-[color:var(--border)] md:grid-cols-2 border border-[color:var(--border)]">
          {copy.what.deliverables.map((d, i) => (
            <Reveal
              key={i}
              as="article"
              delay={i * 80}
              className="bg-[color:var(--warmwhite)] p-7 md:p-9 flex flex-col gap-4"
            >
              <span className="font-display text-4xl md:text-5xl text-[color:var(--burnt)] leading-none">
                0{i + 1}
              </span>
              <h3 className="font-display text-2xl">{d.title}</h3>
              <p className="text-[color:var(--offblack)]/80 leading-relaxed">{d.body}</p>
            </Reveal>
          ))}
        </div>
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
          <div className="mt-10 grid gap-8 md:grid-cols-2 max-w-5xl text-[color:var(--warmwhite)]/80">
            <p className="text-lg leading-relaxed">
              {why.openingLead}
              {why.openingStages.map((stage, i) => (
                <span key={stage}>
                  {i > 0 ? ", " : null}
                  <strong className="font-semibold text-[color:var(--warmwhite)]">{stage}</strong>
                </span>
              ))}
              {why.openingTail}
            </p>
            <p className="text-lg leading-relaxed">{why.paragraph2}</p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-px bg-[color:var(--warmwhite)]/10 md:grid-cols-3 border border-[color:var(--warmwhite)]/10">
          {why.cards.map((r, i) => (
            <Reveal
              key={i}
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
          <p className="mt-10 text-[clamp(1.25rem,2.5vw,1.75rem)] leading-snug max-w-4xl italic font-display text-[color:var(--burnt)]">
            {how.opening}
          </p>
          <p className="mt-10 text-[clamp(1.25rem,2.5vw,1.75rem)] leading-snug max-w-4xl italic font-display text-[color:var(--burnt)]">
            {how.paragraph2}
          </p>
        </Reveal>

        <ol className="mt-16 grid gap-px bg-[color:var(--border)] border border-[color:var(--border)]">
          {how.steps.map((s, i) => (
            <Reveal
              key={s.n}
              as="li"
              delay={i * 60}
              className="bg-[color:var(--warmwhite)] p-8 md:p-12 grid gap-6 md:grid-cols-[180px_1fr] items-start"
            >
              <div className="flex md:flex-col items-baseline md:items-start gap-4 md:gap-2">
                <span className="font-display text-5xl md:text-6xl text-[color:var(--burnt)] leading-none">
                  {s.n}
                </span>
                <span className="eyebrow">
                  {how.phaseLabel} {i + 1}
                </span>
              </div>
              <div>
                <h3 className="font-display text-2xl md:text-3xl">{s.title}</h3>
                <p className="mt-3 text-[color:var(--offblack)]/80 leading-relaxed max-w-3xl">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-16 overflow-x-auto">
          <div className="flex items-center gap-3 min-w-max py-4">
            {how.flow.map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div
                  className={`px-4 py-2 rounded-sm text-sm whitespace-nowrap border ${
                    i === how.flow.length - 1
                      ? "bg-[color:var(--burnt)] text-[color:var(--warmwhite)] border-[color:var(--burnt)]"
                      : "border-[color:var(--offblack)]/30 text-[color:var(--offblack)]"
                  }`}
                >
                  {step}
                </div>
                {i < how.flow.length - 1 && (
                  <span aria-hidden className="text-[color:var(--muted-foreground)]">
                    ──→
                  </span>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-16 max-w-3xl">
          <p className="font-display italic text-2xl md:text-3xl leading-snug">{how.closingLine}</p>
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
          <h2 className="mt-5 text-[clamp(2.25rem,5.5vw,4.5rem)]">
            {closing.headlineLead}{" "}
            <span className="italic font-display text-[color:var(--burnt)]">
              {closing.headlineAccent}
            </span>
          </h2>
          <p className="mt-8 text-lg md:text-xl text-[color:var(--offblack)]/80 max-w-2xl leading-relaxed">
            {closing.body}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href="mailto:vp@pearson-consulting.de?subject=MITCH%20OS%20—%20Book%20a%20call"
              className="inline-flex items-center gap-2 px-7 py-4 bg-[color:var(--offblack)] text-[color:var(--warmwhite)] hover:bg-[color:var(--burnt)] transition-colors rounded-sm font-medium text-base"
            >
              {closing.cta} <span aria-hidden>→</span>
            </a>
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
