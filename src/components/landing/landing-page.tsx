import { useEffect, useRef, useState } from "react";
import { BookCallButton } from "@/components/book-call-button";
import type { PageDescriptionFields } from "@/lib/page-types";
import {
  getLandingUi,
  replaceFirstName,
  type LandingLocale,
} from "@/lib/landing-i18n";
import "./landing-page.css";

import iconGreeting from "@/assets/landing/icons/01-greeting-diamond.svg";
import iconWhy from "@/assets/landing/icons/02-why-lightbulb.svg";
import iconPreview from "@/assets/landing/icons/03-preview-eye.svg";
import iconStudies from "@/assets/landing/icons/04-studies-business-search.svg";
import iconValue from "@/assets/landing/icons/05-value-proposition-target.svg";
import iconPeople from "@/assets/landing/icons/06-decision-makers-people.svg";
import iconBolt from "@/assets/landing/icons/07-intel-triggers-bolt.svg";
import iconStructure from "@/assets/landing/icons/08-structure-grid.svg";
import iconMechanism from "@/assets/landing/icons/09-mechanism-gear.svg";
import iconUnseen from "@/assets/landing/icons/10-unseen-envelope.svg";

export type LandingPageContent = PageDescriptionFields & {
  first_name: string;
  slug: string;
};

type LandingPageProps = {
  locale: LandingLocale;
  content: LandingPageContent;
};

const STEP_COUNT = 5;

function readingTimeMs(root: HTMLElement | null, wpm = 220) {
  if (!root) return 2000;
  const words = root.textContent?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  return Math.max(2000, Math.round((words / wpm) * 60000));
}

function t(text: string, firstName: string) {
  return replaceFirstName(text, firstName);
}

export function LandingPage({ locale, content }: LandingPageProps) {
  const ui = getLandingUi(locale);
  const firstName = content.first_name.trim() || "there";
  const [current, setCurrent] = useState(0);
  const [nextReady, setNextReady] = useState(false);
  const stepBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNextReady(false);
    const timer = window.setTimeout(() => {
      setNextReady(true);
    }, readingTimeMs(stepBodyRef.current));

    return () => window.clearTimeout(timer);
  }, [current]);

  const goTo = (index: number) => {
    setCurrent(Math.max(0, Math.min(STEP_COUNT - 1, index)));
  };

  const fourThings = [
    { icon: iconStudies, text: content.four_thing_1 },
    { icon: iconValue, text: content.four_thing_2 },
    { icon: iconPeople, text: content.four_thing_3 },
    { icon: iconBolt, text: content.four_thing_4 },
  ];

  return (
    <div className="landing-page">
      <div className="wrap">
        <div className="card">
          <div className="intro">
            <p className="greet">
              <span className="greet-icon">
                <img src={iconGreeting} alt="" />
              </span>
              {t(content.greeting, firstName)}
            </p>
          </div>

          <div className="slide-nav">
            {Array.from({ length: STEP_COUNT }).map((_, index) => (
              <button
                key={index}
                type="button"
                className={[
                  "slide-dot",
                  index === current ? "active" : "",
                  index < current ? "done" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-label={`Slide ${index + 1}`}
                onClick={() => goTo(index)}
              />
            ))}
          </div>

          <div className={`step step--why${current === 0 ? " active" : ""}`}>
            <div className="step-band">
              <span className="step-icon">
                <img src={iconWhy} alt="" />
              </span>
              <span className="step-heading">{ui.stepWhy}</span>
            </div>
            <div className="step-body" ref={current === 0 ? stepBodyRef : undefined}>
              <p className="step-note">
                {t(content.why_body, firstName)}{" "}
                <strong className="claim-line">{t(content.why_claim, firstName)}</strong>
              </p>
            </div>
          </div>

          <div className={`step step--preview${current === 1 ? " active" : ""}`}>
            <div className="step-band">
              <span className="step-icon">
                <img src={iconPreview} alt="" />
              </span>
              <span className="step-heading">{ui.stepPreview}</span>
            </div>
            <div className="step-body" ref={current === 1 ? stepBodyRef : undefined}>
              <p className="step-note">{t(content.preview_intro, firstName)}</p>
              <div className="four-things">
                {fourThings.map((item) => (
                  <div className="four-item" key={item.text}>
                    <span className="four-icon">
                      <img src={item.icon} alt="" />
                    </span>
                    <span className="four-text">{t(item.text, firstName)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`step step--reveal${current === 2 ? " active" : ""}`}>
            <div className="step-band">
              <span className="step-icon">
                <img src={iconStructure} alt="" />
              </span>
              <span className="step-heading">{ui.stepStructure}</span>
            </div>
            <div className="step-body" ref={current === 2 ? stepBodyRef : undefined}>
              <p className="step-note">{t(content.structure_intro, firstName)}</p>
              <div className="structure-list">
                {ui.structureParts.map((part) => (
                  <div className="structure-item" key={part.title}>
                    <div className="structure-head">
                      <span className="structure-num">{part.num}</span>
                      <h3 className="structure-title">{part.title}</h3>
                    </div>
                    <p className="structure-purpose">{part.purpose}</p>
                    {"includes" in part && part.includes ? (
                      <>
                        {"subhead" in part && part.subhead ? (
                          <p className="campaign-subhead">{part.subhead}</p>
                        ) : null}
                        <p className="structure-includes">{part.includes}</p>
                      </>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`step step--mechanism${current === 3 ? " active" : ""}`}>
            <div className="step-band">
              <span className="step-icon">
                <img src={iconMechanism} alt="" />
              </span>
              <span className="step-heading">{ui.stepMechanism}</span>
            </div>
            <div className="step-body" ref={current === 3 ? stepBodyRef : undefined}>
              <p className="step-note">{ui.mechanismIntro}</p>
              <div className="acca-wrap">
                {ui.acca.map((word) => (
                  <div className="acca-item" key={word}>
                    <span className="acca-big">{word[0]}</span>
                    <span className="acca-word">{word}</span>
                  </div>
                ))}
              </div>
              <p className="step-note">{t(content.mechanism_p1, firstName)}</p>
              <p className="step-note">{t(content.mechanism_p2, firstName)}</p>
              <p className="step-note">{t(content.mechanism_p3, firstName)}</p>
            </div>
          </div>

          <div className={`step step--unseen${current === 4 ? " active" : ""}`}>
            <div className="step-band">
              <span className="step-icon">
                <img src={iconUnseen} alt="" />
              </span>
              <span className="step-heading">{ui.stepUnseen}</span>
            </div>
            <div className="step-body" ref={current === 4 ? stepBodyRef : undefined}>
              <p className="step-note">{t(content.unseen_p1, firstName)}</p>
              <p className="step-note">{t(content.unseen_p2, firstName)}</p>
              <p style={{ marginTop: 20 }}>
                <BookCallButton className="cta-btn primary" type="button">
                  {t(content.cta_label, firstName)}
                </BookCallButton>
                <span className="cta-alt">{t(content.cta_alt, firstName)}</span>
              </p>
            </div>
          </div>

          <div className="slide-arrows">
            <button
              type="button"
              className="slide-btn"
              disabled={current === 0}
              onClick={() => goTo(current - 1)}
            >
              {ui.back}
            </button>
            <button
              type="button"
              className={`slide-btn${nextReady && current !== STEP_COUNT - 1 ? " ready" : ""}`}
              disabled={current === STEP_COUNT - 1}
              onClick={() => goTo(current + 1)}
            >
              {current === STEP_COUNT - 1 ? ui.done : ui.next}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
