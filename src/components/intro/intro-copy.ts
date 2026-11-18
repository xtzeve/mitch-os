/**
 * Intro presentation copy (EN + DE).
 * Source: reference HTML bundles (template.html + app-logic.js). Do not edit wording here
 * without updating the reference decks.
 *
 * Headline strings mark accent (orange) word runs with `*`, e.g. "MITCH works *every one* of them."
 * Optional `†plain†` marks a non-uppercase aside (class `nsdr`), e.g. †(sales development representative).†
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
  | "nex"
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
  title: { before: string; em: string; sub: string };
  sections: {
    n1: Headline & { questions: { text: string; sd: string }[] };
    n2: Headline;
    n3: Headline & { steps: [string, string, string][] };
    nex: {
      h: string;
      steps: [string, string, string][];
    };
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
      note: string;
    };
  };
  summary: {
    eyebrow1: string;
    eyebrow2: string;
    heading: string;
    recap: [string, string][];
    proof: string;
    startLead: string;
    startRest: string;
    cta: string;
    ctaHref: string;
    who: string;
    contact: string;
    bio: string;
  };
};

export type Headline = {
  /** Headline with `*accent*` runs and optional `†nsdr†` */
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
    { key: "n1", ch: 1, name: "Four questions", dl: [], ms: 8000 },
    { key: "n2", ch: 1, name: "The buying journey", dl: [], ms: 4100 },
    { key: "n3", ch: 2, name: "The work of an SDR", dl: [], ms: 4500 },
    { key: "nex", ch: 2, name: "An example", dl: [], ms: 5200 },
    { key: "nai", ch: 2, name: "AI as a component", dl: [], ms: 5000 },
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
    { key: "n6", ch: 3, name: "Timing", dl: [], ms: 6400 },
    {
      key: "n7",
      ch: 4,
      name: "Four ways to work your market",
      dl: [],
      ms: 5600,
    },
    { key: "n8", ch: 4, name: "What it costs", dl: [], ms: 5500 },
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
    sub: "For B2B companies that already work outbound.",
  },
  sections: {
    n1: {
      h: "How many companies in your market could buy from you?",
      sub: "",
      sd: "0",
      questions: [
        {
          text: "How many of them is someone working on right now?",
          sd: "3.3",
        },
        {
          text: "When did anyone last speak to the others?",
          sd: "4.9",
        },
        {
          text: "What is the plan for them for the rest of the year?",
          sd: "6.5",
        },
      ],
    },
    n2: {
      h: "MITCH works *every one* of them.",
      sub: "Each one is researched, gets its own campaign with specific messaging, and is kept under watch.",
      sd: "1.43",
    },
    n3: {
      h: "For each company, he does the work of *a good SDR* †(sales development representative).†",
      sub: "MITCH prepares every touch. Your team or CRM sends it.",
      sd: "1.71",
      steps: [
        ["01", "Research", "The company and its decision makers."],
        ["02", "Reason", "A dated, sourced reason to make contact now."],
        [
          "03",
          "Message",
          "Copy written for named decision makers, in your voice.",
        ],
        [
          "04",
          "Channel",
          "Letter, LinkedIn, email, call preparation. Channels follow each country’s rules.",
        ],
      ],
    },
    nex: {
      h: "An example: from trigger to *first message.*",
      steps: [
        ["Account", "Who", "Machine builder, 400 staff."],
        [
          "Trigger",
          "What",
          "Second plant announced. Production starts in Q2.",
        ],
        [
          "Why now",
          "When",
          "Certifying a new line takes four to six months. The decision falls this quarter.",
        ],
        [
          "First message · Head of Operations",
          "How",
          "“Your new plant starts production in Q2. Certifying a new line usually takes four to six months, so the decision falls this quarter. Worth 20 minutes to see how others keep that on schedule?”",
        ],
      ],
    },
    nai: {
      h: "He is enterprise grade software that uses AI. *The AI decides nothing.*",
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
      h: "Then he keeps watching, and stays in touch *until they buy or say stop.*",
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
      h: "The work is not optional. *How well it is done is.*",
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
      h: "For the cost of one SDR, MITCH *works six times the volume.*",
      sub: "He is software: no sick days, no ramp up, no turnover.",
      sd: "1.7",
      bars: ["One SDR", "MITCH"],
      note: "Six times the volume, for the same cost.",
    },
  },
  summary: {
    eyebrow1: "Your next customers look like your current ones.",
    eyebrow2: "They just haven't heard from you yet.",
    heading: "Make yourself known to all of them.",
    recap: [
      ["Set up once", "Your market, your offer, your voice."],
      ["Every account, every month", "Until they buy or say stop."],
      ["Six times the volume", "For the cost of one SDR."],
    ],
    proof:
      "In use with B2B firms in consulting, IT infrastructure, branding, suppliers to retail and others. Tens of thousands of accounts under watch.",
    startLead: "Start small.",
    startRest:
      "100 accounts, three months, fixed price, credited in full if you continue. If it doesn’t pay off, you stop.",
    cta: "Book a call with me →",
    ctaHref: "https://calendar.app.google/Yq2mAJo4F361WknM8",
    who: "Vince Pearson",
    contact: "vince@mitch-os.com · +49 152 345 20 507",
    bio: "30 years running and turning around businesses across Europe. Built MITCH because prospecting is either thorough or broad, never both.",
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
    "Er hört nie auf",
    "Der Unterschied",
  ],
  story: [
    { key: "n1", ch: 1, name: "Vier Fragen", dl: [], ms: 8000 },
    { key: "n2", ch: 1, name: "Der Kaufprozess", dl: [], ms: 4100 },
    { key: "n3", ch: 2, name: "Die Arbeit eines SDR", dl: [], ms: 4500 },
    { key: "nex", ch: 2, name: "Ein Beispiel", dl: [], ms: 5200 },
    { key: "nai", ch: 2, name: "KI als Komponente", dl: [], ms: 5000 },
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
    { key: "n6", ch: 3, name: "Der Zeitpunkt", dl: [], ms: 6400 },
    {
      key: "n7",
      ch: 4,
      name: "Vier Wege, Ihren Markt zu bearbeiten",
      dl: [],
      ms: 5600,
    },
    { key: "n8", ch: 4, name: "Was es kostet", dl: [], ms: 5500 },
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
    sub: "Für B2B-Unternehmen, die bereits aktiv Outbound betreiben.",
  },
  sections: {
    n1: {
      h: "Wie viele Unternehmen in Ihrem Markt könnten bei Ihnen kaufen?",
      sub: "",
      sd: "0",
      questions: [
        {
          text: "Wie viele davon bearbeitet gerade jemand?",
          sd: "3.3",
        },
        {
          text: "Wann hat zuletzt jemand mit den anderen gesprochen?",
          sd: "4.9",
        },
        {
          text: "Was ist der Plan für sie bis Jahresende?",
          sd: "6.5",
        },
      ],
    },
    n2: {
      h: "MITCH bearbeitet *jedes einzelne* davon.",
      sub: "Jedes wird recherchiert, erhält eine eigene Kampagne mit gezielten Botschaften und bleibt im Blick.",
      sd: "1.43",
    },
    n3: {
      h: "Für jedes Unternehmen leistet er die Arbeit *eines guten SDR* †(Sales Development Representative).†",
      sub: "MITCH bereitet jeden Kontakt vor. Ihr Team oder Ihr CRM verschickt ihn.",
      sd: "1.71",
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
          "Texte für benannte Entscheider, in Ihrem Ton.",
        ],
        [
          "04",
          "Kanal",
          "Brief, LinkedIn, E-Mail, Anrufvorbereitung. Die Kanäle folgen den Regeln des jeweiligen Landes.",
        ],
      ],
    },
    nex: {
      h: "Ein Beispiel: vom Anlass zur *ersten Nachricht.*",
      steps: [
        ["Account", "Wer", "Maschinenbauer, 400 Mitarbeiter."],
        [
          "Anlass",
          "Was",
          "Zweites Werk angekündigt. Produktionsstart im zweiten Quartal.",
        ],
        [
          "Warum jetzt",
          "Wann",
          "Die Zertifizierung einer neuen Linie dauert vier bis sechs Monate. Die Entscheidung fällt in diesem Quartal.",
        ],
        [
          "Erste Nachricht · Leitung Operations",
          "Wie",
          "„Ihr neues Werk startet im zweiten Quartal die Produktion. Die Zertifizierung einer neuen Linie dauert meist vier bis sechs Monate, die Entscheidung fällt also in diesem Quartal. Haben Sie 20 Minuten, um zu sehen, wie andere das im Zeitplan halten?“",
        ],
      ],
    },
    nai: {
      h: "Er ist Unternehmenssoftware, die KI nutzt. *Die KI entscheidet nichts.*",
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
      sd: "1.59",
      label: "Account",
      ticks: ["1", "5.000", "10.000", "15.000", "20.000"],
      checks: [
        "Recherchiert",
        "Ein Anlass für den Kontakt",
        "Für eine Person geschrieben",
      ],
    },
    n5: {
      h: "Danach behält er sie im Blick und bleibt in Kontakt, *bis sie kaufen oder Stopp sagen.*",
      sub: "Fortlaufend, mit derselben Disziplin und Qualität in jedem Monat.",
      sd: "1.87",
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
      h: "Die Arbeit muss getan werden. *Entscheidend ist, wie gut.*",
      sub: "Jeder Account, jeden Monat, bis er kauft oder Stopp sagt.",
      sd: "1.54",
      compare: [
        ["Ihr Vertrieb", "Einige Accounts, dann fehlt die Zeit."],
        ["Eine Agentur", "Eine Vorlage, an alle verschickt."],
        ["Massenversand", "Menge, ohne Anlass für ein Gespräch."],
        ["MITCH", "Jeder Account, persönlich, bis er kauft oder Stopp sagt."],
      ],
    },
    n8: {
      h: "Für die Kosten eines SDR bearbeitet MITCH *das Sechsfache.*",
      sub: "Er ist Software: keine Krankheitstage, keine Einarbeitung, keine Fluktuation.",
      sd: "1.7",
      bars: ["Ein SDR", "MITCH"],
      note: "Das Sechsfache, zu denselben Kosten.",
    },
  },
  summary: {
    eyebrow1: "Ihre nächsten Kunden gleichen Ihren heutigen.",
    eyebrow2: "Nur haben sie noch nichts von Ihnen gehört.",
    heading: "Machen Sie sich bei allen bekannt.",
    recap: [
      ["Einmal eingerichtet", "Ihr Markt, Ihr Angebot, Ihr Ton."],
      ["Jeder Account, jeden Monat", "Bis sie kaufen oder Stopp sagen."],
      ["Das Sechsfache", "Zu den Kosten eines SDR."],
    ],
    proof:
      "Im Einsatz bei B2B-Unternehmen aus Beratung, IT-Infrastruktur, Branding, Handelszulieferung und mehr. Zehntausende Accounts im Blick.",
    startLead: "Klein anfangen.",
    startRest:
      "100 Accounts, drei Monate, Festpreis, voll angerechnet, wenn Sie weitermachen. Lohnt es sich nicht, hören Sie auf.",
    cta: "Termin mit mir vereinbaren →",
    ctaHref: "https://calendar.app.google/Yq2mAJo4F361WknM8",
    who: "Vince Pearson",
    contact: "vince@mitch-os.com · +49 152 345 20 507",
    bio: "30 Jahre Führung und Sanierung von Unternehmen in ganz Europa. MITCH entstand, weil Akquise sonst entweder gründlich oder breit ist, nie beides.",
  },
};

export const introCopy: Record<IntroLocale, IntroCopy> = {
  en: introCopyEN,
  de: introCopyDE,
};
