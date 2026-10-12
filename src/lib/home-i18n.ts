import type { LandingLocale } from "@/lib/landing-i18n";
import { absoluteSiteUrl, buildShareMeta } from "@/lib/site-meta";

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
    paragraphs: [string, string, string];
    cta: string;
  };
  what: {
    eyebrow: string;
    headline: string;
    beforeStages: [string, string, string];
    afterStages: [string, string, string];
    emphasis: string;
    closing: string;
  };
  why: {
    eyebrow: string;
    headline: string;
    subHeadline: string;
    paragraphs: [string, string, string];
    cardsLead: string;
    cards: { title: string; body: string }[];
    closing: [string, string];
    closingEmphasis: string;
  };
  how: {
    eyebrow: string;
    headline: string;
    opening: [string, string, string];
    emphasis: string;
    continuing: [string, string, string, string];
    stages: { title: string; body: string; variant: "mitch" | "team" }[];
    closingLead: string;
    closingAccent: string;
  };
  closing: {
    eyebrow: string;
    headline: string;
    body: [string, string];
    closingLines: [string, string];
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
        "MITCH OS turns your entire addressable market into an ongoing new logo acquisition program — work your whole market without adding headcount.",
      ogTitle: "MITCH OS — The pipeline that converts itself.",
      ogDescription:
        "MITCH OS turns your entire addressable market into an ongoing new logo acquisition program — work your whole market without adding headcount.",
    },
    nav: [
      { href: "#what", label: "What" },
      { href: "#why", label: "Why" },
      { href: "#how", label: "How" },
      { href: "#go", label: "Go!" },
    ],
    headerCta: "Book a call",
    hero: {
      kicker: "MITCH OS",
      h1: "The pipeline that converts itself.",
      subHeadline: "Industrialise new business acquisition.",
      paragraphs: [
        "MITCH turns your entire addressable market into an ongoing new logo acquisition program.",
        "He finds the companies you want to win, understands what matters to them, identifies the people you need to reach and creates the reason to start a conversation.",
        "He does this across your market without the human capacity constraint that limits conventional prospecting.",
      ],
      cta: "Book a call",
    },
    what: {
      eyebrow: "01 — What",
      headline: "MITCH turns your market into a permanent source of new business.",
      beforeStages: [
        "Every company you want to sell to is somewhere in a buying journey.",
        "They need to become aware of you. They need to understand why you are relevant. They need a reason to believe you can solve their problem. Then they can take action.",
        "This is the same journey every time.",
      ],
      afterStages: [
        "MITCH industrialises the first three stages so your sales team can focus on the fourth.",
        "He works across your entire addressable market, finding the companies, people and circumstances that create an opportunity to sell.",
        "Your brand enters the buying journey before the prospect is actively looking for you.",
      ],
      emphasis: "And MITCH stays there.",
      closing: "This is not a four-week campaign. It is an ongoing new logo acquisition program.",
    },
    why: {
      eyebrow: "02 — Why",
      headline: "You are going to prospect your market anyway.",
      subHeadline: "The question is how much of it you can afford to work.",
      paragraphs: [
        "Traditional prospecting is constrained by people, time and cost. Your team can only research and contact as many companies as it has capacity to handle.",
        "That creates a choice.",
        "Work more accounts and accept less preparation and lower quality, or maintain quality and accept that most of your market will never be properly worked.",
      ],
      cardsLead: "MITCH removes that constraint.",
      cards: [
        {
          title: "Expand your market",
          body: "The number of companies you can actively pursue is no longer limited by the number of people you have available to prospect them.",
        },
        {
          title: "Maintain quality at scale",
          body: "Increasing the number of accounts does not mean reducing the quality of the work. MITCH applies the same standard across the market.",
        },
        {
          title: "Reduce acquisition cost",
          body: "MITCH replaces expensive, labour-intensive prospecting with software infrastructure. You can work more of your market without adding the equivalent sales capacity.",
        },
      ],
      closing: [
        "The result is a different economics for new business.",
        "You stop choosing which part of the market your team has time to work.",
      ],
      closingEmphasis: "You work the market.",
    },
    how: {
      eyebrow: "03 — How",
      headline: "MITCH applies the principles of good outbound across your entire market.",
      opening: [
        "You give MITCH your business, your proposition and the market you want to reach.",
        "He builds the understanding needed to make your proposition relevant to each account.",
        "He researches the company, the people who matter and what is happening in the business. He identifies the circumstances that create a reason to engage and uses them to build the conversation.",
      ],
      emphasis: "The output is not a lead list, it is a market that has been worked.",
      continuing: [
        "Every account has a reason to be approached. Every relevant person has been considered. Every conversation is grounded in what is actually happening in the business.",
        "You choose how much your team is involved. MITCH can prepare campaigns for your team to review, edit and send, or run them autonomously and bring your team in when a prospect shows real interest. Over time, you can automate more of the process as confidence grows.",
        "And because MITCH keeps working the market, the intelligence does not go stale.",
        "A company that is not ready today may be relevant tomorrow. A new event can create a new reason to engage. MITCH keeps looking.",
      ],
      stages: [
        {
          title: "Awareness",
          body: "Make your company known to the companies you want to win.",
          variant: "mitch",
        },
        {
          title: "Comprehension",
          body: "Give them a clear reason to understand why you are relevant.",
          variant: "mitch",
        },
        {
          title: "Conviction",
          body: "Give your sales team the intelligence and context to create a commercial conversation.",
          variant: "mitch",
        },
        {
          title: "Action",
          body: "Your sales team takes over when human judgement matters most.",
          variant: "team",
        },
      ],
      closingLead: "MITCH turns the first three stages into infrastructure.",
      closingAccent: "Your sales team turns them into revenue.",
    },
    closing: {
      eyebrow: "04 — Get started",
      headline: "Stop choosing which accounts your team has time to prospect.",
      body: [
        "Your entire addressable market can be active.",
        "MITCH turns new logo acquisition from a headcount problem into a software cost.",
      ],
      closingLines: [
        "Not a four-week campaign.",
        "An ongoing program for winning new business.",
      ],
      cta: "Book a call",
      ctaNote: "See what MITCH finds in your market.",
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
        "MITCH OS verwandelt Ihren gesamten adressierbaren Markt in ein laufendes Programm zur Gewinnung neuer Logos — ohne zusätzliches Headcount.",
      ogTitle: "MITCH OS — Die Pipeline, die sich selbst konvertiert.",
      ogDescription:
        "MITCH OS verwandelt Ihren gesamten adressierbaren Markt in ein laufendes Programm zur Gewinnung neuer Logos — ohne zusätzliches Headcount.",
    },
    nav: [
      { href: "#what", label: "Was" },
      { href: "#why", label: "Warum" },
      { href: "#how", label: "Wie" },
      { href: "#go", label: "Los!" },
    ],
    headerCta: "Gespräch buchen",
    hero: {
      kicker: "MITCH OS",
      h1: "Die Pipeline, die sich selbst konvertiert.",
      subHeadline: "Neue Geschäftsakquise industrialisieren.",
      paragraphs: [
        "MITCH verwandelt Ihren gesamten adressierbaren Markt in ein laufendes Programm zur Gewinnung neuer Logos.",
        "Er findet die Unternehmen, die Sie gewinnen wollen, versteht, was ihnen wichtig ist, identifiziert die Menschen, die Sie erreichen müssen, und schafft den Anlass für ein Gespräch.",
        "Das tut er über Ihren Markt hinweg — ohne die Kapazitätsgrenze, die klassisches Prospecting einschränkt.",
      ],
      cta: "Gespräch buchen",
    },
    what: {
      eyebrow: "01 — Was",
      headline: "MITCH macht Ihren Markt zu einer permanenten Quelle neuen Geschäfts.",
      beforeStages: [
        "Jedes Unternehmen, an das Sie verkaufen wollen, befindet sich irgendwo in einer Buying Journey.",
        "Es muss auf Sie aufmerksam werden. Es muss verstehen, warum Sie relevant sind. Es braucht einen Grund zu glauben, dass Sie das Problem lösen können. Dann kann es handeln.",
        "Diese Journey ist jedes Mal dieselbe.",
      ],
      afterStages: [
        "MITCH industrialisiert die ersten drei Stufen, damit sich Ihr Vertriebsteam auf die vierte konzentrieren kann.",
        "Er arbeitet über Ihren gesamten adressierbaren Markt und findet Unternehmen, Menschen und Umstände, die eine Verkaufschance schaffen.",
        "Ihre Marke tritt in die Buying Journey ein, bevor der Prospect aktiv nach Ihnen sucht.",
      ],
      emphasis: "Und MITCH bleibt dort.",
      closing:
        "Das ist keine vierwöchige Kampagne. Es ist ein laufendes Programm zur Gewinnung neuer Logos.",
    },
    why: {
      eyebrow: "02 — Warum",
      headline: "Sie werden Ihren Markt ohnehin prospecten.",
      subHeadline: "Die Frage ist, wie viel davon Sie sich leisten können zu bearbeiten.",
      paragraphs: [
        "Klassisches Prospecting ist durch Menschen, Zeit und Kosten begrenzt. Ihr Team kann nur so viele Unternehmen recherchieren und kontaktieren, wie Kapazität vorhanden ist.",
        "Das erzwingt eine Wahl.",
        "Mehr Accounts bearbeiten und weniger Vorbereitung sowie geringere Qualität akzeptieren — oder Qualität halten und hinnehmen, dass der Großteil Ihres Marktes nie richtig bearbeitet wird.",
      ],
      cardsLead: "MITCH hebt diese Begrenzung auf.",
      cards: [
        {
          title: "Ihren Markt erweitern",
          body: "Die Zahl der Unternehmen, die Sie aktiv verfolgen können, ist nicht mehr durch die Zahl der Menschen begrenzt, die Ihnen für Prospecting zur Verfügung stehen.",
        },
        {
          title: "Qualität bei Scale halten",
          body: "Mehr Accounts bedeuten nicht weniger Qualität. MITCH wendet denselben Standard über den gesamten Markt an.",
        },
        {
          title: "Akquisitionskosten senken",
          body: "MITCH ersetzt teures, personalintensives Prospecting durch Software-Infrastruktur. Sie können mehr von Ihrem Markt bearbeiten, ohne die entsprechende Vertriebskapazität aufzubauen.",
        },
      ],
      closing: [
        "Das Ergebnis ist eine andere Ökonomie für neues Geschäft.",
        "Sie hören auf zu wählen, welchen Teil des Marktes Ihr Team Zeit hat zu bearbeiten.",
      ],
      closingEmphasis: "Sie bearbeiten den Markt.",
    },
    how: {
      eyebrow: "03 — Wie",
      headline: "MITCH wendet die Prinzipien guten Outbounds über Ihren gesamten Markt an.",
      opening: [
        "Sie geben MITCH Ihr Geschäft, Ihr Leistungsversprechen und den Markt, den Sie erreichen wollen.",
        "Er baut das Verständnis auf, das nötig ist, um Ihr Angebot für jeden Account relevant zu machen.",
        "Er recherchiert das Unternehmen, die relevanten Personen und was im Geschäft gerade passiert. Er erkennt Umstände, die einen Anlass zum Engagieren schaffen, und baut daraus die Conversation.",
      ],
      emphasis: "Das Ergebnis ist keine Lead-Liste — es ist ein bearbeiteter Markt.",
      continuing: [
        "Jeder Account hat einen Grund, angesprochen zu werden. Jede relevante Person wurde berücksichtigt. Jedes Gespräch basiert darauf, was im Unternehmen tatsächlich passiert.",
        "Sie entscheiden, wie stark Ihr Team eingebunden ist. MITCH kann Kampagnen für Review, Edit und Versand vorbereiten — oder autonom laufen und Ihr Team holen, wenn ein Prospect echtes Interesse zeigt. Mit wachsendem Vertrauen lässt sich mehr automatisieren.",
        "Und weil MITCH den Markt weiter bearbeitet, wird die Intelligence nicht stale.",
        "Ein Unternehmen, das heute nicht bereit ist, kann morgen relevant sein. Ein neues Ereignis kann einen neuen Anlass schaffen. MITCH schaut weiter.",
      ],
      stages: [
        {
          title: "Awareness",
          body: "Machen Sie Ihr Unternehmen bei den Unternehmen bekannt, die Sie gewinnen wollen.",
          variant: "mitch",
        },
        {
          title: "Comprehension",
          body: "Geben Sie ihnen einen klaren Grund zu verstehen, warum Sie relevant sind.",
          variant: "mitch",
        },
        {
          title: "Conviction",
          body: "Geben Sie Ihrem Vertriebsteam die Intelligence und den Kontext für ein kommerzielles Gespräch.",
          variant: "mitch",
        },
        {
          title: "Action",
          body: "Ihr Vertriebsteam übernimmt, wenn menschliches Urteil am wichtigsten ist.",
          variant: "team",
        },
      ],
      closingLead: "MITCH macht die ersten drei Stufen zur Infrastruktur.",
      closingAccent: "Ihr Vertriebsteam macht daraus Umsatz.",
    },
    closing: {
      eyebrow: "04 — Jetzt starten",
      headline: "Hören Sie auf zu wählen, welche Accounts Ihr Team Zeit hat zu prospecten.",
      body: [
        "Ihr gesamter adressierbarer Markt kann aktiv sein.",
        "MITCH macht aus New-Logo-Akquise ein Software-Kosten-Thema statt eines Headcount-Problems.",
      ],
      closingLines: [
        "Keine vierwöchige Kampagne.",
        "Ein laufendes Programm für neues Geschäft.",
      ],
      cta: "Gespräch buchen",
      ctaNote: "Sehen Sie, was MITCH in Ihrem Markt findet.",
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

export function getHomeMeta(locale: HomeLocale, shareImageUrl?: string) {
  const { meta } = getHomeCopy(locale);
  const image = shareImageUrl ? absoluteSiteUrl(shareImageUrl) : undefined;
  return {
    meta: buildShareMeta({
      title: meta.title,
      description: meta.description,
      image,
    }),
  };
}
