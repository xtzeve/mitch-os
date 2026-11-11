/**
 * Intro presentation copy (EN + DE).
 * Source: reference HTML bundles (template.html + app-logic.js). Do not edit wording here
 * without updating the reference decks.
 *
 * Headline strings mark accent (orange) word runs with `*`, e.g. "Your market is *thousands of companies* that ...".
 */

export type IntroLocale = "en" | "de";

export type IntroStoryItem = {
  key: IntroSectionKey;
  ch: 1 | 2 | 3 | 4;
  name: string;
  /** Detail screens (empty in the reference, so no "more" drawer). */
  dl: string[];
  /** Auto-advance hint in ms. */
  ms: number;
};

export type IntroSectionKey =
  | "n1"
  | "n2"
  | "n3"
  | "nai"
  | "n4"
  | "n5"
  | "n6"
  | "n7"
  | "n8";

export type IntroCopy = {
  locale: IntroLocale;
  htmlLang: string;
  docTitle: string;
  /** Topbar label */
  label: string;
  navAria: string;
  /** Chapter titles (index 0 = chapter 1) */
  chapters: [string, string, string, string];
  story: IntroStoryItem[];
  /** Step labels */
  openingLabel: string;
  summaryLabel: string;
  stepAria: string;
  nextLabel: string;
  startLabel: string;
  restartLabel: string;
  backLabel: string;
  /** Detail drawer strings (unused while story[].dl is empty) */
  detail: {
    title: string;
    screenOne: string;
    screensMany: string;
    next: string;
    ret: string;
    aria: string;
    ariaRet: string;
  };
  welcome: { l1: string; l2: string; q: string };
  title: { before: string; em: string };
  sections: {
    n1: Headline;
    n2: Headline;
    n3: Headline & { steps: [string, string, string][] };
    nai: {
      h: string;
      kickerA: string;
      a: string[];
      kickerB: string;
      stages: string[];
      chip: [string, string];
    };
    n4: Headline & { label: string; ticks: string[]; checks: string[] };
    n5: Headline & {
      planned: string;
      signal: string;
      buys: string;
      stop: string;
    };
    n6: Headline & { ready: string; box: string };
    n7: Headline & { compare: [string, string][] };
    n8: Headline & {
      bars: [string, string];
      mitchSuffix: string;
      note: string;
    };
  };
  summary: {
    eyebrow1: string;
    eyebrow2: string;
    heading: string;
    recap: [string, string][];
    cta: string;
    ctaHref: string;
    who: string;
    contact: string;
  };
};

export type Headline = {
  /** Headline with `*accent*` runs */
  h: string;
  sub: string;
  /** Subline delay in seconds (CSS --sd) */
  sd: string;
};

export const introCopyEN: IntroCopy = {
  locale: "en",
  htmlLang: "en",
  docTitle: "MITCH, explained · Short version",
  label: "Vince Pearson · Founder, MITCH OS",
  navAria: "Presentation",
  chapters: [
    "Total coverage",
    "An SDR in software",
    "It never stops",
    "The difference",
  ],
  story: [
    {
      key: "n1",
      ch: 1,
      name: "Your market",
      dl: [],
      ms: 4300,
    },
    {
      key: "n2",
      ch: 1,
      name: "The buying journey",
      dl: [],
      ms: 4100,
    },
    {
      key: "n3",
      ch: 2,
      name: "The work of an SDR",
      dl: [],
      ms: 4500,
    },
    {
      key: "nai",
      ch: 2,
      name: "AI as a component",
      dl: [],
      ms: 5000,
    },
    {
      key: "n4",
      ch: 2,
      name: "The same work for every account",
      dl: [],
      ms: 5200,
    },
    {
      key: "n5",
      ch: 3,
      name: "Until they buy or say stop",
      dl: [],
      ms: 4800,
    },
    {
      key: "n6",
      ch: 3,
      name: "Timing",
      dl: [],
      ms: 6400,
    },
    {
      key: "n7",
      ch: 4,
      name: "Four ways to work your market",
      dl: [],
      ms: 5600,
    },
    {
      key: "n8",
      ch: 4,
      name: "What it costs",
      dl: [],
      ms: 5500,
    },
  ],
  openingLabel: "Opening",
  summaryLabel: "Back to the start",
  stepAria: "Step",
  nextLabel: "Next →",
  startLabel: "Start →",
  restartLabel: "Restart ↺",
  backLabel: "← Back",
  detail: {
    title: "More on · ",
    screenOne: "1 screen",
    screensMany: "screens",
    next: "Next",
    ret: "Return",
    aria: "Next detail screen",
    ariaRet: "Return to the presentation",
  },
  welcome: {
    l1: "Your next customers look like your current ones.",
    l2: "They just haven't heard from you yet.",
    q: "And how many of them are there?",
  },
  title: {
    before: "MITCH drives new business across your ",
    em: "entire market.",
  },
  sections: {
    n1: {
      h: "Your market is *thousands of companies* that fit what you sell.",
      sub: "Nearly all of them have never heard from you.",
      sd: "1.71",
    },
    n2: {
      h: "MITCH works *every one* of them.",
      sub: "Each one is researched, gets its own campaign with specific messaging, and is kept under watch.",
      sd: "1.43",
    },
    n3: {
      h: "For each company, it does the work of *a good SDR.*",
      sub: "An SDR (sales development representative) researches accounts and makes first contact.",
      sd: "1.71",
      steps: [
        ["01", "Research", "The company and its decision makers."],
        ["02", "Reason", "A dated, sourced reason to make contact now."],
        [
          "03",
          "Message",
          "Draft copy, written for specified decision makers, in your voice.",
        ],
        [
          "04",
          "Channel",
          "Email, letter, LinkedIn, call preparation, etc. Sent through your CRM, automated if you wish.",
        ],
      ],
    },
    nai: {
      h: "It is enterprise grade software that uses AI. *The AI decides nothing.*",
      kickerA: "Set with you",
      a: ["Your market", "Your offer", "Your voice"],
      kickerB: "Run by a fixed process",
      stages: ["Research", "Verify", "Write", "Check"],
      chip: [
        "AI",
        "carries out defined tasks inside the process. It decides nothing.",
      ],
    },
    n4: {
      h: "Account 20,000 gets *the same work* as account 1.",
      sub: "One process, run with the same discipline at any scale.",
      sd: "1.59",
      label: "Account",
      ticks: ["1", "5,000", "10,000", "15,000", "20,000"],
      checks: [
        "Researched",
        "A reason to make contact",
        "Written for one person",
      ],
    },
    n5: {
      h: "Then it keeps watching, and stays in touch *until they buy or say stop.*",
      sub: "Ongoing, with the same discipline and quality every month.",
      sd: "1.87",
      planned: "Planned",
      signal: "On a new signal",
      buys: "Buys",
      stop: "Says stop",
    },
    n6: {
      h: "When they are ready, *you are there.*",
      sub: "Your sales team takes it from there.",
      sd: "1.48",
      ready: "Ready",
      box: "Your sales team",
    },
    n7: {
      h: "This is work you would *never* do yourself.",
      sub: "Every account, every month, until they buy or say stop.",
      sd: "1.54",
      compare: [
        ["Your sales team", "A few accounts, then time runs out."],
        ["An agency", "One template, sent to everyone."],
        ["Lists and automation", "Volume, with no reason to talk."],
        ["MITCH", "Every account, personal, until they buy or say stop."],
      ],
    },
    n8: {
      h: "Compared with the alternatives, it costs *a fraction.*",
      sub: "Per account, per month, for the same work.",
      sd: "1.54",
      bars: ["An SDR doing this work", "MITCH"],
      mitchSuffix: " or less",
      note: "One sixth of the cost, or less.",
    },
  },
  summary: {
    eyebrow1: "Your next customers look like your current ones.",
    eyebrow2: "They just haven't heard from you yet.",
    heading: "Make yourself known to all of them.",
    recap: [
      ["Set up once", "Your market, your offer, your voice."],
      ["Every account, every month", "Until they buy or say stop."],
      ["A fraction of the cost", "Compared with an SDR doing the same work."],
    ],
    cta: "Book a call with me →",
    ctaHref: "https://calendar.app.google/Yq2mAJo4F361WknM8",
    who: "Vince Pearson",
    contact: "vince@mitch-os.com · +49 152 345 20 507",
  },
};

export const introCopyDE: IntroCopy = {
  locale: "de",
  htmlLang: "de",
  docTitle: "MITCH erklärt · Kurzfassung",
  label: "Vince Pearson · Gründer, MITCH OS",
  navAria: "Präsentation",
  chapters: [
    "Volle Abdeckung",
    "Ein SDR als Software",
    "Es hört nie auf",
    "Der Unterschied",
  ],
  story: [
    {
      key: "n1",
      ch: 1,
      name: "Ihr Markt",
      dl: [],
      ms: 4300,
    },
    {
      key: "n2",
      ch: 1,
      name: "Der Kaufprozess",
      dl: [],
      ms: 4100,
    },
    {
      key: "n3",
      ch: 2,
      name: "Die Arbeit eines SDR",
      dl: [],
      ms: 4500,
    },
    {
      key: "nai",
      ch: 2,
      name: "KI als Komponente",
      dl: [],
      ms: 5000,
    },
    {
      key: "n4",
      ch: 2,
      name: "Dieselbe Arbeit für jeden Account",
      dl: [],
      ms: 5200,
    },
    {
      key: "n5",
      ch: 3,
      name: "Bis sie kaufen oder Stopp sagen",
      dl: [],
      ms: 4800,
    },
    {
      key: "n6",
      ch: 3,
      name: "Der Zeitpunkt",
      dl: [],
      ms: 6400,
    },
    {
      key: "n7",
      ch: 4,
      name: "Vier Wege, Ihren Markt zu bearbeiten",
      dl: [],
      ms: 5600,
    },
    {
      key: "n8",
      ch: 4,
      name: "Was es kostet",
      dl: [],
      ms: 5500,
    },
  ],
  openingLabel: "Einstieg",
  summaryLabel: "Zurück zum Anfang",
  stepAria: "Schritt",
  nextLabel: "Weiter →",
  startLabel: "Start →",
  restartLabel: "Von vorn ↺",
  backLabel: "← Zurück",
  detail: {
    title: "Mehr zu · ",
    screenOne: "1 Seite",
    screensMany: "Seiten",
    next: "Weiter",
    ret: "Fertig",
    aria: "Nächste Detailseite",
    ariaRet: "Zurück zur Präsentation",
  },
  welcome: {
    l1: "Ihre nächsten Kunden gleichen Ihren heutigen.",
    l2: "Nur haben sie noch nichts von Ihnen gehört.",
    q: "Und wie viele gibt es davon?",
  },
  title: {
    before: "MITCH bringt Neugeschäft aus Ihrem ",
    em: "gesamten Markt.",
  },
  sections: {
    n1: {
      h: "Ihr Markt: *Tausende Unternehmen,* die zu Ihrem Angebot passen.",
      sub: "Fast alle haben noch nie von Ihnen gehört.",
      sd: "1.59",
    },
    n2: {
      h: "MITCH bearbeitet *jedes einzelne* davon.",
      sub: "Jedes wird recherchiert, erhält eine eigene Kampagne mit gezielten Botschaften und bleibt im Blick.",
      sd: "1.38",
    },
    n3: {
      h: "Für jedes Unternehmen leistet MITCH die Arbeit *eines guten SDR.*",
      sub: "Ein SDR (Sales Development Representative) recherchiert Accounts und nimmt den Erstkontakt auf.",
      sd: "1.65",
      steps: [
        ["01", "Recherche", "Das Unternehmen und seine Entscheider."],
        [
          "02",
          "Anlass",
          "Ein datierter Anlass mit Quelle, jetzt Kontakt aufzunehmen.",
        ],
        [
          "03",
          "Nachricht",
          "Textentwurf, geschrieben für festgelegte Entscheider, in Ihrem Ton.",
        ],
        [
          "04",
          "Kanal",
          "E-Mail, Brief, LinkedIn, Anrufvorbereitung usw. Versand über Ihr CRM, auf Wunsch automatisiert.",
        ],
      ],
    },
    nai: {
      h: "Es ist Unternehmenssoftware, die KI nutzt. *Die KI entscheidet nichts.*",
      kickerA: "Mit Ihnen festgelegt",
      a: ["Ihr Markt", "Ihr Angebot", "Ihr Ton"],
      kickerB: "Von einem festen Prozess ausgeführt",
      stages: ["Recherchieren", "Verifizieren", "Schreiben", "Prüfen"],
      chip: [
        "KI",
        "erledigt festgelegte Aufgaben innerhalb des Prozesses. Sie entscheidet nichts.",
      ],
    },
    n4: {
      h: "Account 20.000 bekommt *dieselbe Arbeit* wie Account 1.",
      sub: "Ein Prozess, mit derselben Disziplin in jeder Größenordnung.",
      sd: "1.54",
      label: "Account",
      ticks: ["1", "5.000", "10.000", "15.000", "20.000"],
      checks: [
        "Recherchiert",
        "Ein Anlass für den Kontakt",
        "Für eine Person geschrieben",
      ],
    },
    n5: {
      h: "Danach behält MITCH sie im Blick und bleibt in Kontakt, *bis sie kaufen oder Stopp sagen.*",
      sub: "Fortlaufend, mit derselben Disziplin und Qualität in jedem Monat.",
      sd: "1.98",
      planned: "Geplant",
      signal: "Bei neuem Signal",
      buys: "Kauft",
      stop: "Sagt Stopp",
    },
    n6: {
      h: "Wenn sie bereit sind, *sind Sie da.*",
      sub: "Ab dort übernimmt Ihr Vertrieb.",
      sd: "1.48",
      ready: "Bereit",
      box: "Ihr Vertrieb",
    },
    n7: {
      h: "Diese Arbeit würden Sie *nie* selbst machen.",
      sub: "Jeder Account, jeden Monat, bis er kauft oder Stopp sagt.",
      sd: "1.48",
      compare: [
        ["Ihr Vertrieb", "Einige Accounts, dann fehlt die Zeit."],
        ["Eine Agentur", "Eine Vorlage, an alle verschickt."],
        ["Massenversand", "Menge, ohne Anlass für ein Gespräch."],
        ["MITCH", "Jeder Account, persönlich, bis er kauft oder Stopp sagt."],
      ],
    },
    n8: {
      h: "Im Vergleich zu den Alternativen kostet es *einen Bruchteil.*",
      sub: "Pro Account und Monat, für dieselbe Arbeit.",
      sd: "1.59",
      bars: ["Ein SDR", "MITCH"],
      mitchSuffix: " oder weniger",
      note: "Ein Sechstel der Kosten oder weniger.",
    },
  },
  summary: {
    eyebrow1: "Ihre nächsten Kunden gleichen Ihren heutigen.",
    eyebrow2: "Nur haben sie noch nichts von Ihnen gehört.",
    heading: "Machen Sie sich bei allen bekannt.",
    recap: [
      ["Einmal eingerichtet", "Ihr Markt, Ihr Angebot, Ihr Ton."],
      ["Jeder Account, jeden Monat", "Bis sie kaufen oder Stopp sagen."],
      [
        "Ein Bruchteil der Kosten",
        "Im Vergleich zu einem SDR für dieselbe Arbeit.",
      ],
    ],
    cta: "Termin mit mir vereinbaren →",
    ctaHref: "https://calendar.app.google/Yq2mAJo4F361WknM8",
    who: "Vince Pearson",
    contact: "vince@mitch-os.com · +49 152 345 20 507",
  },
};

export const introCopy: Record<IntroLocale, IntroCopy> = {
  en: introCopyEN,
  de: introCopyDE,
};
