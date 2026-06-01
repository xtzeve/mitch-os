import { createFileRoute, Link } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import wordmark from "@/assets/mitch-wordmark.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MITCH OS — The pipeline that converts itself." },
      {
        name: "description",
        content:
          "MITCH OS is the thinking layer for outbound. Sourced dossier, decision-maker profile, trigger, and ready-to-send multichannel campaign for every account.",
      },
      { property: "og:title", content: "MITCH OS — The pipeline that converts itself." },
      {
        property: "og:description",
        content:
          "Outbound intelligence at any scale. A complete, sourced, ready-to-execute campaign for every account.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: MitchOSPage,
});

const NAV = [
  { href: "#what", label: "What" },
  { href: "#why", label: "Why" },
  { href: "#how", label: "How" },
  { href: "#go", label: "Go!" },
];

function OSHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[color:var(--warmwhite)]/85 border-b border-[color:var(--border)]">
      <div className="container-mitch flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center" aria-label="MITCH OS home">
          <img src={wordmark} alt="MITCH" className="h-10 md:h-12 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm tracking-wide text-[color:var(--offblack)] hover:text-[color:var(--burnt)] transition-colors"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <a
          href="#go"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[color:var(--offblack)] text-[color:var(--warmwhite)] hover:bg-[color:var(--burnt)] transition-colors rounded-sm"
        >
          Book a call <span aria-hidden>→</span>
        </a>
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

function Hero() {
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
          MITCH OS · The pipeline that converts itself
        </Reveal>
        <Reveal
          as="h1"
          className="mt-6 text-[clamp(2.25rem,6vw,5.25rem)] leading-[1.04] tracking-tight max-w-5xl"
        >
          MITCH OS is the thinking layer for outbound.
        </Reveal>

        <Reveal
          as="p"
          className="mt-10 text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed max-w-4xl italic font-display text-[color:var(--burnt)]"
          delay={150}
        >
          Before your team reaches out, it builds a dossier on each account, creates a granular profile of decision makers, identifies current triggers and produces a multichannel campaign with ready to send content.
        </Reveal>
        <Reveal className="mt-10 grid gap-10 md:grid-cols-[1.4fr_1fr] items-end">
          <p className="text-lg md:text-xl leading-relaxed text-[color:var(--offblack)]/85 max-w-2xl">
            For outbound sales teams and leaders, this is the new start line.
          </p>
          <div className="md:text-right">
            <a
              href="#go"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[color:var(--offblack)] text-[color:var(--warmwhite)] hover:bg-[color:var(--burnt)] transition-colors rounded-sm text-base font-medium"
            >
              Book a call <span aria-hidden>→</span>
            </a>
          </div>
        </Reveal>
      </div>
      <div className="rule" />
    </section>
  );
}

const DELIVERABLES = [
  {
    title: "The company as it is right now",
    body: "Not only as their website describes it. What is driving the business, where it is heading, and why your offer is relevant.",
  },
  {
    title: "Who controls the decision",
    body: "What they say in public, how they frame the issues, and what motivates them as business people.",
  },
  {
    title: "The trigger",
    body: "The specific reason this company is timely to contact now, based on real events.",
  },
  {
    title: "Campaign and content",
    body: "A multichannel sequence built around a coordinated narrative, with touchpoints written for the specific person receiving them.",
  },
];

function WhatSection() {
  return (
    <section id="what" className="py-24 md:py-36">
      <div className="container-mitch">
        <Reveal>
          <p className="eyebrow">01 — What</p>
          <h2 className="mt-5 text-[clamp(2rem,4.6vw,3.75rem)] max-w-4xl">
            Good outbound depends on three things.
          </h2>
          <ol className="mt-10 max-w-3xl divide-y divide-[color:var(--border)] border-y border-[color:var(--border)]">
            {[
              "Knowing the account",
              "Understanding the person",
              "Choosing the right moment",
            ].map((item, i) => (
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
          <p className="mt-10 max-w-3xl text-[clamp(1.125rem,1.6vw,1.5rem)] leading-snug font-display italic text-[color:var(--burnt)]">
            In practice, that work takes too long — so it gets skipped, approximated, or faked.
          </p>
        </Reveal>

        <Reveal className="mt-12 text-[color:var(--offblack)]/85">
          <p className="text-lg leading-relaxed max-w-4xl">
            MITCH OS eliminates the manual research layer behind outbound sales. It continuously maps the current state of each target company, surfaces the most relevant stakeholders, detects actionable timing signals, and automatically assembles coordinated outreach sequences with tailored messaging for every channel.
          </p>
        </Reveal>

        <Reveal className="my-20 md:my-28 text-center">
          <p className="font-display italic text-[clamp(1.75rem,4.5vw,3.5rem)] leading-tight tracking-tight max-w-4xl mx-auto">
            At <span className="text-[color:var(--burnt)]">20,000 accounts</span>, every single one
            receives what a skilled analyst would give to{" "}
            <span className="text-[color:var(--burnt)]">five</span>.
          </p>
        </Reveal>

        <p className="eyebrow mb-6">What MITCH OS gives you for every account</p>
        <div className="grid gap-px bg-[color:var(--border)] md:grid-cols-2 border border-[color:var(--border)]">
          {DELIVERABLES.map((d, i) => (
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

const REASONS = [
  {
    title: "No variance",
    body: "The intelligence applied to every account is identical in depth and rigour, whether your list has fifty names or fifty thousand.",
  },
  {
    title: "No ramp-up",
    body: "No hire, no training, no three-month wait. MITCH OS is operational from day one and knows your business within minutes of being briefed.",
  },
  {
    title: "No ceiling",
    body: "Your pipeline grows with your ambition. Add accounts. The system scales the thinking without scaling the cost.",
  },
];

function WhySection() {
  return (
    <section
      id="why"
      className="py-24 md:py-36 bg-[color:var(--offblack)] text-[color:var(--warmwhite)]"
    >
      <div className="container-mitch">
        <Reveal>
          <p className="eyebrow" style={{ color: "var(--burnt)" }}>
            02 — Why
          </p>
          <h2 className="mt-5 text-[clamp(2rem,4.6vw,3.75rem)] max-w-4xl text-[color:var(--warmwhite)]">
            Outbound has always forced a choice between quality and quantity.{" "}
            <span className="italic font-display text-[color:var(--burnt)]">
              That tension is over.
            </span>
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2 max-w-5xl text-[color:var(--warmwhite)]/80">
            <p className="text-lg leading-relaxed">
              Reach more people, or reach them well. That tension was inevitable for as long as
              intelligence required human time to produce. It no longer does.
            </p>
            <p className="text-lg leading-relaxed">
              A human team cannot sustain research quality at volume. It gets skipped when the
              queue is long, approximate when the deadline is tight, and inconsistent as the day
              goes on. MITCH OS does not have these problems. The depth of intelligence at account
              10,000 is identical to account one. The quality of output exceeds what a human team
              produces even at low volume. Quantity, at that point, is simply irrelevant.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-px bg-[color:var(--warmwhite)]/10 md:grid-cols-3 border border-[color:var(--warmwhite)]/10">
          {REASONS.map((r, i) => (
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

const STEPS = [
  {
    n: "01",
    title: "Investigation",
    body: "The system profiles every account from public sources: structure, activity, recent developments, technology, and market position. This is the foundation everything else is built on.",
  },
  {
    n: "02",
    title: "Intel",
    body: "From the investigation, MITCH OS extracts what matters for outreach: current priorities, the pressures the company is operating under, and the opportunities they have not yet acted on.",
  },
  {
    n: "03",
    title: "Triggers",
    body: "The system identifies the specific events and signals that make this the right moment to reach out. Not a generic reason. A specific, sourced, verifiable one.",
  },
  {
    n: "04",
    title: "Campaign Structure",
    body: "Based on the intelligence and the triggers, MITCH OS designs the outreach sequence: which channels, in which order, on which timeline, with which angle at each touchpoint.",
  },
  {
    n: "05",
    title: "Content",
    body: "Every message for every touchpoint is written from the intelligence, with tone and style matched to the specific person receiving it. Ultra-specific to this company and this person, nothing templated, nothing approximate, ready to send.",
  },
];

const FLOW = ["Investigation", "Intel", "Triggers", "Campaign Structure", "Content"];

function HowSection() {
  return (
    <section id="how" className="py-24 md:py-36">
      <div className="container-mitch">
        <Reveal>
          <p className="eyebrow">03 — How</p>
          <h2 className="mt-5 text-[clamp(2rem,4.6vw,3.75rem)] max-w-4xl">
            You provide the accounts.
          </h2>
          <p className="mt-10 text-[clamp(1.25rem,2.5vw,1.75rem)] leading-snug max-w-4xl italic font-display text-[color:var(--burnt)]">
            MITCH OS builds the operational intelligence required to penetrate them — synthesizing company developments, stakeholder priorities, market signals, and commercial triggers into a fully structured outbound motion.
          </p>
          <p className="mt-10 text-[clamp(1.25rem,2.5vw,1.75rem)] leading-snug max-w-4xl italic font-display text-[color:var(--burnt)]">
            Your sales organization gains aligned messaging, strategic timing, campaign coordination, and account-specific execution infrastructure before the first interaction even happens.
          </p>
        </Reveal>

        <ol className="mt-16 grid gap-px bg-[color:var(--border)] border border-[color:var(--border)]">
          {STEPS.map((s, i) => (
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
                <span className="eyebrow">Phase {i + 1}</span>
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
            {FLOW.map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div
                  className={`px-4 py-2 rounded-sm text-sm whitespace-nowrap border ${
                    i === FLOW.length - 1
                      ? "bg-[color:var(--burnt)] text-[color:var(--warmwhite)] border-[color:var(--burnt)]"
                      : "border-[color:var(--offblack)]/30 text-[color:var(--offblack)]"
                  }`}
                >
                  {step}
                </div>
                {i < FLOW.length - 1 && (
                  <span aria-hidden className="text-[color:var(--muted-foreground)]">
                    ──→
                  </span>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-16 max-w-3xl">
          <p className="font-display italic text-2xl md:text-3xl leading-snug">
            Priced per account on a volume-based drawdown model.{" "}
            <span className="text-[color:var(--burnt)]">
              You use what you need, when you need it.
            </span>
          </p>
        </Reveal>

      </div>
    </section>
  );
}

function ClosingSection() {
  return (
    <section id="go" className="py-24 md:py-36">
      <div className="container-mitch">
        <Reveal className="max-w-4xl">
          <p className="eyebrow">04 — Get started</p>
          <h2 className="mt-5 text-[clamp(2.25rem,5.5vw,4.5rem)]">
            Your team is built to close.{" "}
            <span className="italic font-display text-[color:var(--burnt)]">
              MITCH OS builds the ground they close on.
            </span>
          </h2>
          <p className="mt-8 text-lg md:text-xl text-[color:var(--offblack)]/80 max-w-2xl leading-relaxed">
            Book a call and we will show you exactly what the output looks like on your accounts.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href="mailto:vp@pearson-consulting.de?subject=MITCH%20OS%20—%20Book%20a%20call"
              className="inline-flex items-center gap-2 px-7 py-4 bg-[color:var(--offblack)] text-[color:var(--warmwhite)] hover:bg-[color:var(--burnt)] transition-colors rounded-sm font-medium text-base"
            >
              Book a call <span aria-hidden>→</span>
            </a>
            <p className="text-sm text-[color:var(--muted-foreground)]">
              No pitch. No pressure. Just clarity.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function MitchOSFooter() {
  return (
    <footer className="border-t border-[color:var(--border)] mt-20 md:mt-32">
      <div className="container-mitch py-12 md:py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl tracking-tight">
            MITCH <span className="italic text-[color:var(--burnt)]">OS</span>
          </p>
          <p className="mt-3 text-sm text-[color:var(--muted-foreground)] max-w-md">
            The pipeline that converts itself. A MITCH company.
          </p>
        </div>
        <div className="text-sm space-y-2">
          <p className="eyebrow mb-3">Company</p>
          <a
            href="mailto:info@mitchos.com"
            className="block text-[color:var(--muted-foreground)] hover:text-[color:var(--burnt)] transition-colors"
          >
            info@mitchos.com
          </a>
        </div>
        <div className="text-sm space-y-2">
          <p className="eyebrow mb-3">Legal</p>
          <Link
            to="/legal-notice"
            className="block text-[color:var(--muted-foreground)] hover:text-[color:var(--burnt)] transition-colors"
          >
            Legal Notice
          </Link>
          <Link
            to="/privacy-policy"
            className="block text-[color:var(--muted-foreground)] hover:text-[color:var(--burnt)] transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
      <div className="border-t border-[color:var(--border)]">
        <div className="container-mitch py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs text-[color:var(--muted-foreground)]">
          <p>MITCH OS is a service by Pearson Consulting.</p>
          <p>© {new Date().getFullYear()} — All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function MitchOSPage() {
  return (
    <div className="min-h-screen bg-[color:var(--background)]">
      <OSHeader />
      <main>
        <Hero />
        <WhatSection />
        <WhySection />
        <HowSection />
        <ClosingSection />
      </main>
      <MitchOSFooter />
    </div>
  );
}
