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
    stepWhy: "Warum Sie das sehen",
    stepPreview: "Was Sie gleich sehen werden",
    stepStructure: "Wie es aufgebaut ist",
    stepMechanism: "Warum das funktioniert",
    stepUnseen: "Was Sie noch nicht gesehen haben",
    mechanismIntro: "Die Phasen ändern sich nie.",
    acca: ["Awareness", "Comprehension", "Conviction", "Action"],
    structureParts: [
      {
        num: "Teil 1",
        title: "Overview",
        purpose:
          "Wer das Unternehmen ist, in welchem Bereich es tätig ist und warum MITCH dieses Konto gerade jetzt als relevant identifiziert hat.",
      },
      {
        num: "Teil 2",
        title: "Triggers",
        purpose:
          "Datierte, öffentlich sichtbare Ereignisse — nicht ob das Konto passt, sondern warum jetzt der richtige Moment ist.",
      },
      {
        num: "Teil 3",
        title: "Intel & Research Edge",
        purpose:
          "Die faktische Grundlage für jedes Gespräch: was das Unternehmen wirklich macht, wie das zu Ihrem Angebot passt und was eine oberflächliche Suche verpasst hätte.",
        includes:
          "Company Intel · Focus-Area-Mapping · Research Edge — was geprüft, korrigiert oder ausgeschlossen wurde",
      },
      {
        num: "Teil 4",
        title: "Campaign",
        purpose:
          "Wie, über wen und mit welcher Begründung das Konto angesprochen wird — vom Erstkontakt bis zu einem Jahr Outreach.",
        subhead: "Entscheider & Kanal",
        includes:
          "Wen Sie erreichen und warum dieser Kanal — abgeleitet aus öffentlicher Rolle, Seniorität und Kommunikation des Unternehmens. Eine 12-Monats-Kampagne, einsatzbereit.",
      },
    ],
    back: "← Zurück",
    next: "Weiter →",
    done: "Fertig",
    pageTitle: "MITCH OS Preview",
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
