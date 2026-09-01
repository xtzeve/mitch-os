import type { PageDescriptionFields } from "./page-types";

export const DEFAULT_PAGE_DESCRIPTION_EN: PageDescriptionFields = {
  greeting: "Hi [First Name], thanks for dropping in.",
  why_body:
    "Outbound has always forced a choice between quality and quantity: reach more people, or reach them well. That choice was inevitable for as long as intelligence took a person's time to produce. MITCH removes it.",
  why_claim: "This is the pipeline that converts itself.",
  preview_intro:
    "Below is what MITCH builds about your company — not a mockup, not generic filler. It works from your own public footprint: your website, your positioning, your people, and any signal worth acting on now.",
  four_thing_1:
    "Studies your business — reads your website, your positioning, your USPs, and any other relevant public source of information incl. social media and LinkedIn",
  four_thing_2: "Maps your value proposition — what actually sets you apart right now",
  four_thing_3: "Maps who's who — structure, decision makers, company culture",
  four_thing_4: "Finds the intel and triggers that make an account worth calling now",
  structure_intro:
    "Every MITCH OS Account Dossier takes the same shape — four parts, in this order, every time. What changes account to account is the substance inside them, not the structure.",
  mechanism_p1:
    "Every account has to become aware of you and understand why you matter before anyone can sell to them. Today, a person does that by hand — which is why you can only reach as many accounts as you have hours for. MITCH does both automatically, for every account.",
  mechanism_p2:
    "Buy Awareness and Comprehension from MITCH — at scale, at quality, at a cost never possible before. Your people work Conviction and Action only.",
  mechanism_p3:
    "Existing clients already run MITCH at volume — some book dossiers like this one by the thousand, each built this thoroughly, on a different real account every time.",
  unseen_p1:
    "What you've seen is the structure, not the substance. MITCH builds the full campaign for your company: research, messaging, phone calls, email, LinkedIn, social and a 12-month engagement plan — all tailored to your market and built from scratch.",
  unseen_p2: "No limit on awareness and comprehension. For less than you're already spending.",
  cta_phone: "+00000000000",
  cta_label: "Book 20 minutes",
  cta_alt: "We'll walk through a full campaign built specifically for you. The whole 12 months.",
};

export const DEFAULT_PAGE_DESCRIPTION_DE: PageDescriptionFields = {
  greeting: "Hallo [First Name], schön, dass du vorbeischaust.",
  why_body:
    "Outbound hat immer eine Wahl erzwungen: mehr Menschen erreichen oder sie gut erreichen. Solange Intelligence Zeit einer Person brauchte, war diese Wahl unvermeidlich. MITCH hebt sie auf.",
  why_claim: "Das ist die Pipeline, die sich selbst konvertiert.",
  preview_intro:
    "Im Folgenden sehen Sie, was MITCH über Ihr Unternehmen erstellt — kein Mock-up, kein generischer Fülltext. Es arbeitet mit Ihrer öffentlichen Präsenz: Website, Positionierung, Menschen und jedem Signal, das jetzt handlungsrelevant ist.",
  four_thing_1:
    "Analysiert Ihr Unternehmen — liest Website, Positionierung, USPs und andere relevante öffentliche Quellen inkl. Social Media und LinkedIn",
  four_thing_2: "Mappt Ihr Wertversprechen — was Sie gerade wirklich unterscheidet",
  four_thing_3: "Mappt die Struktur — Entscheider, Hierarchie, Unternehmenskultur",
  four_thing_4: "Findet Intel und Trigger, die ein Konto jetzt ansprechbar machen",
  structure_intro:
    "Jedes MITCH OS Account Dossier folgt derselben Form — vier Teile, in dieser Reihenfolge, jedes Mal. Was sich ändert, ist der Inhalt, nicht die Struktur.",
  mechanism_p1:
    "Jedes Konto muss sich Ihrer bewusst werden und verstehen, warum Sie relevant sind, bevor jemand verkaufen kann. Heute macht das ein Mensch von Hand — deshalb erreichen Sie nur so viele Konten, wie Sie Stunden haben. MITCH macht beides automatisch, für jedes Konto.",
  mechanism_p2:
    "Kaufen Sie Awareness und Comprehension bei MITCH — in Scale, in Qualität, zu Kosten, die vorher unmöglich waren. Ihre Leute arbeiten nur Conviction und Action.",
  mechanism_p3:
    "Bestehende Kunden nutzen MITCH bereits in großem Umfang — manche buchen Dossiers wie dieses in Tausenden, jedes so gründlich, jedes Mal ein anderes echtes Konto.",
  unseen_p1:
    "Sie haben die Struktur gesehen, nicht die Substanz. MITCH baut die vollständige Kampagne für Ihr Unternehmen: Research, Messaging, Anrufe, E-Mail, LinkedIn, Social und einen 12-Monats-Plan — maßgeschneidert für Ihren Markt und von Grund auf neu.",
  unseen_p2: "Kein Limit bei Awareness und Comprehension. Für weniger, als Sie bereits ausgeben.",
  cta_phone: "+00000000000",
  cta_label: "20 Minuten buchen",
  cta_alt:
    "Wir gehen eine vollständige Kampagne durch, die speziell für Sie erstellt wurde. Die gesamten 12 Monate.",
};

export const DEFAULT_DESCRIPTIONS_BY_LANGUAGE: Record<number, PageDescriptionFields> = {
  1: DEFAULT_PAGE_DESCRIPTION_EN,
  2: DEFAULT_PAGE_DESCRIPTION_DE,
};
