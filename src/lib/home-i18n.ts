import type { LandingLocale } from "@/lib/landing-i18n";

export type HomeLocale = LandingLocale;

export type HomeCopy = {
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
  nav: { href: string; label: string }[];
  headerCta: string;
  hero: {
    kicker: string;
    h1: string;
    subHeadline: string;
    body: string;
    tagline: string;
    cta: string;
  };
  what: {
    eyebrow: string;
    headline: string;
    listItems: [string, string, string];
    body: string;
    scaleLine: string;
    deliverablesEyebrow: string;
    deliverables: { title: string; body: string }[];
  };
  why: {
    eyebrow: string;
    kicker: string;
    headline: string;
    paragraph1: string;
    paragraph2: string;
    caption: string;
    cards: { title: string; body: string }[];
  };
  how: {
    eyebrow: string;
    headline: string;
    opening: string;
    paragraph2: string;
    phaseLabel: string;
    steps: { n: string; title: string; body: string }[];
    flow: string[];
    closingLine: string;
  };
  closing: {
    eyebrow: string;
    headlineLead: string;
    headlineAccent: string;
    body: string;
    cta: string;
    ctaNote: string;
  };
  footer: {
    tagline: string;
    company: string;
    legal: string;
    legalNotice: string;
    privacyPolicy: string;
    serviceBy: string;
    rights: string;
  };
};

export const homeCopy: Record<HomeLocale, HomeCopy> = {
  en: {
    meta: {
      title: "MITCH OS — The pipeline that converts itself.",
      description:
        "MITCH OS is the thinking layer for outbound. Sourced dossier, decision-maker profile, trigger, and ready-to-send multichannel campaign for every account.",
      ogTitle: "MITCH OS — The pipeline that converts itself.",
      ogDescription:
        "Outbound intelligence at any scale. A complete, sourced, ready-to-execute campaign for every account.",
    },
    nav: [
      { href: "#what", label: "What" },
      { href: "#why", label: "Why" },
      { href: "#how", label: "How" },
      { href: "#go", label: "Go!" },
    ],
    headerCta: "Book a call",
    hero: {
      kicker: "MITCH OS · Outbound Intelligence",
      h1: "The pipeline that converts itself.",
      subHeadline:
        "Outbound has always forced a choice between quality and quantity. That tension is over.",
      body: "Before your team reaches out, MITCH creates a granular profile of decision makers, identifies current triggers, produces a multichannel campaign with ready to send content, and builds intel on each account.",
      tagline: "For outbound sales teams and leaders, this is the new start line.",
      cta: "Book a call",
    },
    what: {
      eyebrow: "01 — What",
      headline: "Good outbound depends on three things.",
      listItems: ["Knowing the account", "Understanding the person", "Choosing the right moment"],
      body: "This is exactly where the quality/quantity tension bites. Nobody has the hours to do this properly at scale, so it gets skipped, guessed at, or faked. MITCH finds everything about an account you wished you knew and never had time to dig up — continuously mapping the current state of each target company, surfacing the stakeholders, detecting actionable timing signals, and assembling coordinated outreach sequences with tailored messaging for every channel.",
      scaleLine:
        "Every account arrives worked — researched, sequenced, ready to send — whether the list has fifty names or fifty thousand.",
      deliverablesEyebrow: "What MITCH OS gives you for every account",
      deliverables: [
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
      ],
    },
    why: {
      eyebrow: "02 — Why",
      kicker: "The stages never change.",
      headline: "No limit on awareness and comprehension. For less than you're already spending.",
      paragraph1:
        "Every account has to become aware of you and understand why you matter before anyone can sell to them. Today, a person does that by hand — which is why you can only reach as many accounts as you have hours for. MITCH does both automatically, for every account, at the same depth at account one as at account fifty thousand.",
      paragraph2:
        "Buy Awareness and Comprehension from MITCH — at scale, at quality, at a cost never possible before. Your people work Conviction and Action only.",
      caption:
        "Existing clients already run MITCH at this volume — some book dossiers like this one by the thousand, on a different account every time.",
      cards: [
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
      ],
    },
    how: {
      eyebrow: "03 — How",
      headline: "MITCH figures it all out on his own.",
      opening:
        "MITCH doesn't wait for a list. He starts by reading your website, your materials, your market position — and builds a clearer picture of your value proposition than most internal teams keep current. From that, he defines your ICP: the companies that should actually be your customers. You set the boundaries of the addressable market — geography, size, sector, whatever applies — MITCH finds everyone who fits inside them.",
      paragraph2:
        "Your sales organization gains aligned messaging, strategic timing, campaign coordination, and account-specific execution infrastructure before the first interaction even happens.",
      phaseLabel: "Phase",
      steps: [
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
      ],
      flow: ["Positioning", "Investigation", "Intel", "Triggers", "Campaign Structure", "Content"],
      closingLine:
        "You don't hand MITCH accounts. You show him your business — and get back accounts already primed for conviction.",
    },
    closing: {
      eyebrow: "04 — Get started",
      headlineLead: "Your team is built to close.",
      headlineAccent: "MITCH OS builds the ground they close on.",
      body: "Book a call and we will show you exactly what the output looks like on your accounts.",
      cta: "Book a call",
      ctaNote: "No pitch. No pressure. Just clarity.",
    },
    footer: {
      tagline: "The pipeline that converts itself. A MITCH company.",
      company: "Company",
      legal: "Legal",
      legalNotice: "Legal Notice",
      privacyPolicy: "Privacy Policy",
      serviceBy: "MITCH OS is a service by Pearson Consulting.",
      rights: "All rights reserved.",
    },
  },
  de: {
    meta: {
      title: "MITCH OS — Die Pipeline, die sich selbst konvertiert.",
      description:
        "MITCH OS ist die Intelligence-Schicht für Outbound. Quellenbasiertes Dossier, Entscheiderprofil, Trigger und versandfertige Multichannel-Kampagne für jeden Account.",
      ogTitle: "MITCH OS — Die Pipeline, die sich selbst konvertiert.",
      ogDescription:
        "Outbound Intelligence in jedem Maßstab. Eine vollständige, quellenbasierte, sofort einsetzbare Kampagne für jeden Account.",
    },
    nav: [
      { href: "#what", label: "Was" },
      { href: "#why", label: "Warum" },
      { href: "#how", label: "Wie" },
      { href: "#go", label: "Los!" },
    ],
    headerCta: "Gespräch buchen",
    hero: {
      kicker: "MITCH OS · Outbound Intelligence",
      h1: "Die Pipeline, die sich selbst konvertiert.",
      subHeadline:
        "Im Outbound musste man sich bisher zwischen Qualität und Quantität entscheiden. Diese Spannung ist vorbei.",
      body: "Bevor Ihr Team einen Account anspricht, erstellt MITCH ein detailliertes Profil der Entscheider, identifiziert aktuelle Trigger, erstellt eine Multichannel-Kampagne mit versandfertigen Inhalten und baut Intelligence zu jedem Account auf.",
      tagline: "Für Outbound-Vertriebsteams und Führungskräfte ist dies die neue Startlinie.",
      cta: "Gespräch buchen",
    },
    what: {
      eyebrow: "01 — Was",
      headline: "Gutes Outbound hängt von drei Dingen ab.",
      listItems: [
        "Den Account kennen",
        "Die Person verstehen",
        "Den richtigen Moment wählen",
      ],
      body: "Genau hier schlägt die Spannung zwischen Qualität und Quantität durch. Niemand hat die Zeit, dies in großem Maßstab richtig zu machen, also wird es übersprungen, geraten oder vorgetäuscht. MITCH findet alles über einen Account heraus, von dem Sie sich gewünscht hätten, es zu wissen, aber nie die Zeit hatten, es zu recherchieren — und bildet kontinuierlich den aktuellen Stand jedes Zielunternehmens ab, identifiziert die Stakeholder, erkennt verwertbare Timing-Signale und erstellt koordinierte Outreach-Sequenzen mit individuell zugeschnittenen Botschaften für jeden Kanal.",
      scaleLine:
        "Jeder Account kommt bereits bearbeitet an — recherchiert, sequenziert, versandbereit — unabhängig davon, ob die Liste fünfzig Namen oder fünfzigtausend umfasst.",
      deliverablesEyebrow: "Was MITCH OS Ihnen für jeden Account liefert",
      deliverables: [
        {
          title: "Das Unternehmen, wie es jetzt ist",
          body: "Nicht nur, wie die Website es beschreibt. Was das Geschäft antreibt, wohin es geht und warum Ihr Angebot relevant ist.",
        },
        {
          title: "Wer die Entscheidung trifft",
          body: "Was sie öffentlich sagen, wie sie Themen framen und was sie als Unternehmer motiviert.",
        },
        {
          title: "Der Trigger",
          body: "Der konkrete Grund, warum dieses Unternehmen jetzt der richtige Zeitpunkt für Kontakt ist — basierend auf echten Ereignissen.",
        },
        {
          title: "Kampagne und Content",
          body: "Eine Multichannel-Sequenz um eine koordinierte Erzählung — mit Touchpoints, die für die jeweilige empfangende Person geschrieben sind.",
        },
      ],
    },
    why: {
      eyebrow: "02 — Warum",
      kicker: "Die Phasen ändern sich nie.",
      headline:
        "Keine Begrenzung bei Awareness und Comprehension. Für weniger, als Sie heute bereits ausgeben.",
      paragraph1:
        "Jeder Account muss zunächst auf Sie aufmerksam werden und verstehen, warum Sie relevant sind, bevor überhaupt verkauft werden kann. Heute übernimmt das ein Mensch von Hand — deshalb erreichen Sie nur so viele Accounts, wie Sie Stunden dafür haben. MITCH erledigt beides automatisch, für jeden Account, mit derselben Tiefe bei Account eins wie bei Account 50.000.",
      paragraph2:
        "Kaufen Sie Awareness und Comprehension von MITCH — in jedem Maßstab, in gleichbleibender Qualität, zu Kosten, die bisher nicht möglich waren. Ihr Team arbeitet nur noch an Conviction und Action.",
      caption:
        "Bestehende Kunden setzen MITCH bereits in diesem Umfang ein — einige erstellen Dossiers wie dieses zu Tausenden, jedes für einen anderen Account.",
      cards: [
        {
          title: "Keine Varianz",
          body: "Die auf jeden Account angewandte Intelligence ist in Tiefe und Gründlichkeit identisch — ob die Liste fünfzig oder fünfzigtausend Namen hat.",
        },
        {
          title: "Kein Ramp-up",
          body: "Keine Einstellung, kein Training, kein dreimonatiges Warten. MITCH OS ist ab Tag eins einsatzbereit und kennt Ihr Geschäft innerhalb von Minuten nach dem Briefing.",
        },
        {
          title: "Keine Obergrenze",
          body: "Ihre Pipeline wächst mit Ihren Ambitionen. Accounts hinzufügen. Das System skaliert das Denken, ohne die Kosten zu skalieren.",
        },
      ],
    },
    how: {
      eyebrow: "03 — Wie",
      headline: "MITCH klärt alles eigenständig.",
      opening:
        "MITCH wartet nicht auf eine Liste. Er beginnt damit, Ihre Website, Ihre Unterlagen und Ihre Marktposition zu analysieren — und entwickelt daraus ein klareres Bild Ihres Wertversprechens, als es viele interne Teams aktuell halten. Daraus definiert er Ihren ICP: die Unternehmen, die tatsächlich Ihre Kunden sein sollten. Sie setzen die Grenzen des adressierbaren Marktes — Geografie, Größe, Branche, was auch immer relevant ist — MITCH findet jeden, der innerhalb dieser Grenzen liegt.",
      paragraph2:
        "Ihre Vertriebsorganisation erhält abgestimmte Botschaften, strategisches Timing, Kampagnenkoordination und account-spezifische Ausführungsinfrastruktur — noch bevor die erste Interaktion stattfindet.",
      phaseLabel: "Phase",
      steps: [
        {
          n: "01",
          title: "Untersuchung",
          body: "Das System profiliert jeden Account aus öffentlichen Quellen: Struktur, Aktivität, jüngste Entwicklungen, Technologie und Marktposition. Das ist das Fundament, auf dem alles andere aufbaut.",
        },
        {
          n: "02",
          title: "Intelligence",
          body: "Aus der Untersuchung extrahiert MITCH OS, was für Outreach relevant ist: aktuelle Prioritäten, der Druck, unter dem das Unternehmen steht, und Chancen, die noch nicht genutzt wurden.",
        },
        {
          n: "03",
          title: "Trigger",
          body: "Das System identifiziert die konkreten Ereignisse und Signale, die diesen Moment zum richtigen Zeitpunkt für Outreach machen. Kein generischer Grund. Ein spezifischer, quellenbasierter, überprüfbarer.",
        },
        {
          n: "04",
          title: "Kampagnenstruktur",
          body: "Basierend auf Intelligence und Triggern entwirft MITCH OS die Outreach-Sequenz: welche Kanäle, in welcher Reihenfolge, in welchem Zeitplan, mit welchem Angle an jedem Touchpoint.",
        },
        {
          n: "05",
          title: "Content",
          body: "Jede Nachricht für jeden Touchpoint wird aus der Intelligence geschrieben — mit Ton und Stil, abgestimmt auf die jeweilige empfangende Person. Ultra-spezifisch für dieses Unternehmen und diese Person. Nichts templated, nichts approximiert. Versandbereit.",
        },
      ],
      flow: [
        "Positionierung",
        "Untersuchung",
        "Intelligence",
        "Trigger",
        "Kampagnenstruktur",
        "Content",
      ],
      closingLine:
        "Sie geben MITCH keine Accounts vor. Sie zeigen ihm Ihr Unternehmen — und erhalten Accounts zurück, die bereits für Conviction vorbereitet sind.",
    },
    closing: {
      eyebrow: "04 — Jetzt starten",
      headlineLead: "Ihr Team ist zum Abschließen gebaut.",
      headlineAccent: "MITCH OS baut den Boden, auf dem es abschließt.",
      body: "Buchen Sie ein Gespräch — wir zeigen Ihnen genau, wie das Ergebnis auf Ihren Accounts aussieht.",
      cta: "Gespräch buchen",
      ctaNote: "Kein Pitch. Kein Druck. Nur Klarheit.",
    },
    footer: {
      tagline: "Die Pipeline, die sich selbst konvertiert. Ein MITCH-Unternehmen.",
      company: "Unternehmen",
      legal: "Rechtliches",
      legalNotice: "Impressum",
      privacyPolicy: "Datenschutz",
      serviceBy: "MITCH OS ist ein Service von Pearson Consulting.",
      rights: "Alle Rechte vorbehalten.",
    },
  },
};

export function getHomeCopy(locale: HomeLocale): HomeCopy {
  return homeCopy[locale];
}

export function getHomeMeta(locale: HomeLocale) {
  const { meta } = getHomeCopy(locale);
  return {
    meta: [
      { title: meta.title },
      { name: "description", content: meta.description },
      { property: "og:title", content: meta.ogTitle },
      { property: "og:description", content: meta.ogDescription },
      { property: "og:type", content: "website" },
    ],
  };
}
