import { cn } from "@/lib/utils";

export type AccaStage = {
  letter: string;
  label: string;
  variant: "mitch" | "team";
};

const ACCA_STAGES: AccaStage[] = [
  { letter: "A", label: "Awareness", variant: "mitch" },
  { letter: "C", label: "Comprehension", variant: "mitch" },
  { letter: "C", label: "Conviction", variant: "team" },
  { letter: "A", label: "Action", variant: "team" },
];

type AccaMechanismBlockProps = {
  kicker: string;
  /** Stage labels stay in English on both locales (ACCA acronym). */
  stages?: AccaStage[];
};

export function AccaMechanismBlock({ kicker, stages = ACCA_STAGES }: AccaMechanismBlockProps) {
  return (
    <div className="acca-mechanism mb-8 text-center">
      <p className="acca-kicker mb-7 text-base text-[color:var(--warmwhite)]/85">{kicker}</p>
      <div className="acca-row flex flex-wrap justify-center gap-10 max-[480px]:gap-x-6 max-[480px]:gap-y-6">
        {stages.map((stage) => (
          <div
            key={stage.label}
            className="acca-stage flex max-[480px]:basis-[40%] flex-col items-center"
          >
            <span
              className={cn(
                "acca-letter text-[3.5rem] leading-none font-bold max-[480px]:text-[2.75rem]",
                stage.variant === "mitch"
                  ? "text-[color:var(--burnt)]"
                  : "text-[color:var(--warmwhite)]",
              )}
            >
              {stage.letter}
            </span>
            <span
              className={cn(
                "acca-label mt-1.5 text-[0.7rem] tracking-[0.06em] uppercase",
                stage.variant === "mitch" ? "text-[color:var(--burnt)]" : "text-[#8A8480]",
              )}
            >
              {stage.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
