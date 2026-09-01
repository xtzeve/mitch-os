export type LandingLocale = "en" | "de";

export const landingUi = {
  en: {
    stepWhy: "Why you're seeing this",
    stepPreview: "What you're about to see",
    stepStructure: "How it's structured",
    stepMechanism: "Why this works",
    stepUnseen: "What you haven't seen yet",
    mechanismIntro: "The stages never change.",
    acca: ["Awareness", "Comprehension", "Conviction", "Action"],
    structureParts: [
      {
        num: "Part 1",
        title: "Overview",
        purpose:
          "Who the company is, what field it's in, and why MITCH surfaced this account as worth pursuing right now.",
      },
      {
        num: "Part 2",
        title: "Triggers",
        purpose:
          "Dated, publicly visible events — not whether the account fits, but why now is the right moment to reach out.",
      },
      {
        num: "Part 3",
        title: "Intel & Research Edge",
        purpose:
          "The factual foundation for every conversation: what the company actually does, how that maps to what you're selling, and what a shallow search would have missed.",
        includes:
          "Company intel · Focus-area mapping · Research edge — what was checked, corrected, or ruled out",
      },
      {
        num: "Part 4",
        title: "Campaign",
        purpose:
          "How, through whom, and with what reasoning the account gets approached — from first contact to a year of ongoing outreach.",
        subhead: "Decision-makers & channel",
        includes:
          "Who to reach and why that channel — mapped from public role, seniority, and how the company itself communicates. A 12 month campaign ready to use.",
      },
    ],
    back: "← Back",
    next: "Next →",
    done: "Done",
    pageTitle: "MITCH OS Preview",
  },
  de: {
    stepWhy: "Warum Sie das hier sehen",
    stepPreview: "Was Sie gleich sehen",
    stepStructure: "So ist es aufgebaut",
    stepMechanism: "Warum das funktioniert",
    stepUnseen: "Was Sie noch nicht gesehen haben",
    mechanismIntro: "Die Phasen ändern sich nie.",
    acca: ["Awareness", "Comprehension", "Conviction", "Action"],
    structureParts: [
      {
        num: "Teil 1",
        title: "Übersicht",
        purpose:
          "Wer das Unternehmen ist, in welchem Bereich es tätig ist und warum MITCH ihn gerade jetzt für vielversprechend hält.",
      },
      {
        num: "Teil 2",
        title: "Trigger",
        purpose:
          "Datierte, öffentlich sichtbare Ereignisse — nicht ob der Account passt, sondern warum genau jetzt der richtige Zeitpunkt ist.",
      },
      {
        num: "Teil 3",
        title: "Research & Intelligence",
        purpose:
          "Das faktische Fundament für jedes Gespräch: was das Unternehmen tatsächlich tut, wie sich das mit Ihrem Angebot deckt und was eine oberflächliche Recherche übersehen hätte.",
        includes:
          "Unternehmens-Intel · Themenfeld-Zuordnung · was geprüft, korrigiert oder ausgeschlossen wurde",
      },
      {
        num: "Teil 4",
        title: "Kampagne",
        purpose:
          "Wie, über wen und mit welcher Begründung der Account angesprochen wird — vom Erstkontakt bis zu einem Jahr laufender Ansprache.",
        subhead: "Entscheider & Kanal",
        includes:
          "Wer angesprochen wird und warum genau dieser Kanal — abgeleitet aus öffentlicher Rolle, Seniorität und der eigenen Kommunikationsweise des Unternehmens. Eine vollständige 12-Monats-Kampagne.",
      },
    ],
    back: "← Zurück",
    next: "Weiter →",
    done: "Fertig",
    pageTitle: "MITCH OS Vorschau",
  },
} as const;

export function getLandingUi(locale: LandingLocale) {
  return landingUi[locale];
}

export function replaceFirstName(text: string, firstName: string) {
  return text.replaceAll("[First Name]", firstName);
}

export function languageIdToLocale(languageId: number): LandingLocale {
  return languageId === 2 ? "de" : "en";
}

export function localeToLanguageId(locale: LandingLocale): number {
  return locale === "de" ? 2 : 1;
}
