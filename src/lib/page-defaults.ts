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
  greeting: "Hallo [First Name], schön, dass Sie hier vorbeischauen.",
  why_body:
    "Outbound-Vertrieb zwang schon immer zu einer Entscheidung zwischen Qualität und Quantität: mehr Menschen erreichen oder sie gut erreichen. Dieser Zielkonflikt war unvermeidlich, solange dafür menschliche Zeit nötig war. MITCH schafft diese Entscheidung ab.",
  why_claim: "Das ist eine Pipeline, die sich selbst aufbaut.",
  preview_intro:
    "Im Folgenden sehen Sie, was MITCH über Ihr Unternehmen erstellt — kein Mockup, keine generischen Füllinhalte. Er arbeitet mit Ihrem eigenen öffentlichen Auftritt: Ihrer Website, Ihrer Positionierung, Ihren Ansprechpartnern und jedem Signal, das jetzt einen Anruf wert ist.",
  four_thing_1:
    "Analysiert Ihr Unternehmen — liest Ihre Website, Ihre Positionierung, Ihre USPs und alle weiteren relevanten öffentlichen Quellen, inkl. Social Media und LinkedIn",
  four_thing_2:
    "Versteht Ihr Leistungsversprechen — was Sie gerade wirklich von anderen unterscheidet",
  four_thing_3: "Erstellt das Who's who — Struktur, Entscheider, Unternehmenskultur",
  four_thing_4:
    "Findet die Informationen und Anlässe, die einen Anruf jetzt sinnvoll machen",
  structure_intro:
    "Jedes MITCH OS Account-Dossier hat die gleiche Form — vier Teile, immer in dieser Reihenfolge. Was sich von Account zu Account ändert, ist der Inhalt, nicht die Struktur.",
  mechanism_p1:
    "Jeder Account muss erst auf Sie aufmerksam werden und verstehen, warum Sie relevant sind, bevor überhaupt jemand verkaufen kann. Heute macht das ein Mensch von Hand — deshalb erreichen Sie nur so viele Accounts, wie Sie Stunden haben. MITCH übernimmt beides automatisch, für jeden Account.",
  mechanism_p2:
    "MITCH übernimmt Awareness und Comprehension — in einem Umfang, einer Qualität und zu Kosten, die bisher nicht möglich waren. Ihr Team kümmert sich nur noch um Conviction und Action.",
  mechanism_p3:
    "Bestehende Kunden nutzen MITCH bereits in großem Umfang — manche lassen Dossiers wie dieses bereits zu Tausenden erstellen, jedes genauso gründlich, jedes Mal für einen anderen echten Account.",
  unseen_p1:
    "Was Sie gesehen haben, ist die Struktur, nicht der Inhalt. MITCH erstellt die vollständige Kampagne für Ihr Unternehmen: Recherche, Ansprache, Telefonate, E-Mail, LinkedIn, Social Media und einen 12-Monats-Ansprachplan — alles zugeschnitten auf Ihren Markt und von Grund auf neu erstellt.",
  unseen_p2:
    "Keine Grenze bei Awareness und Comprehension. Für weniger, als Sie ohnehin schon ausgeben.",
  cta_phone: "+00000000000",
  cta_label: "20 Minuten buchen",
  cta_alt:
    "Wir gehen gemeinsam eine vollständige, speziell für Sie erstellte Kampagne durch. Alle 12 Monate.",
};

export const DEFAULT_DESCRIPTIONS_BY_LANGUAGE: Record<number, PageDescriptionFields> = {
  1: DEFAULT_PAGE_DESCRIPTION_EN,
  2: DEFAULT_PAGE_DESCRIPTION_DE,
};
