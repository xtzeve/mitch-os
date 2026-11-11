import {
  Fragment,
  useEffect,
  useRef,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { introCopy, type IntroLocale, type IntroSectionKey } from "./intro-copy";
import {
  INTRO_HREFS,
  LOGO_SRC,
  parseHeadline,
  usePresentation,
  type IntroPresentationView,
} from "./intro-engine";
import "./intro-mobile.css";

function AccentHeadline({ text }: { text: string }) {
  const words = parseHeadline(text);
  return (
    <h2 className="im-h">
      {words.map((w, idx) => (
        <Fragment key={idx}>
          {idx > 0 ? " " : null}
          <span className={w.accent ? "im-o" : undefined}>{w.word}</span>
        </Fragment>
      ))}
    </h2>
  );
}

function MobileNav({
  copy,
  v,
}: {
  copy: (typeof introCopy)[IntroLocale];
  v: IntroPresentationView;
}) {
  return (
    <nav
      className="im-nav"
      aria-label={copy.navAria}
      style={{ "--rd": v.rd } as CSSProperties}
    >
      <div className="im-segs">
        {v.segs.map((sg, idx) => (
          <button
            key={idx}
            type="button"
            className={sg.c.replace(/\bseg\b/g, "im-seg")}
            aria-label={sg.aria}
            onClick={sg.go}
          />
        ))}
      </div>
      <div className="im-nav-row">
        <span className="im-count">{v.count}</span>
        <button
          type="button"
          className="im-btn ghost"
          onClick={v.prev}
          disabled={v.atStart}
        >
          {copy.backLabel}
        </button>
        {v.nA ? (
          <button
            key="nxA"
            type="button"
            className={`im-btn primary nx ${v.nxc}`}
            onClick={v.next}
          >
            <span className="nxl">{v.nextLabel}</span>
          </button>
        ) : null}
        {v.nB ? (
          <button
            key="nxB"
            type="button"
            className={`im-btn primary nx ${v.nxc}`}
            onClick={v.next}
          >
            <span className="nxl">{v.nextLabel}</span>
          </button>
        ) : null}
      </div>
    </nav>
  );
}

function PartBody({
  locale,
  sectionKey,
}: {
  locale: IntroLocale;
  sectionKey: IntroSectionKey;
}) {
  const sec = introCopy[locale].sections;
  const chapter =
    introCopy[locale].story.find((s) => s.key === sectionKey)?.ch ?? 1;
  const chapterTitle = introCopy[locale].chapters[chapter - 1];

  switch (sectionKey) {
    case "n1":
    case "n2":
      return (
        <div className="im-slide">
          <p className="im-ch">{chapterTitle}</p>
          <AccentHeadline text={sec[sectionKey].h} />
          <p className="im-sub">{sec[sectionKey].sub}</p>
          {/* n1 = sparse key dots; n2 = wave-fill all dots (desktop .nfield.f2) */}
          <div
            className={sectionKey === "n2" ? "im-dots wave" : "im-dots"}
            aria-hidden="true"
          >
            {Array.from({ length: 48 }, (_, i) => (
              <i
                key={i}
                className={
                  sectionKey === "n2"
                    ? "fill"
                    : i % 7 === 0
                      ? "on"
                      : undefined
                }
                style={
                  sectionKey === "n2"
                    ? ({ "--i": i } as CSSProperties)
                    : undefined
                }
              />
            ))}
          </div>
        </div>
      );
    case "n3":
      return (
        <div className="im-slide">
          <p className="im-ch">{chapterTitle}</p>
          <AccentHeadline text={sec.n3.h} />
          <p className="im-sub">{sec.n3.sub}</p>
          <ol className="im-steps">
            {sec.n3.steps.map(([num, title, text]) => (
              <li key={num}>
                <b>{num}</b>
                <div>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      );
    case "nai":
      return (
        <div className="im-slide">
          <p className="im-ch">{chapterTitle}</p>
          <AccentHeadline text={sec.nai.h} />
          <div className="im-card">
            <p className="im-kicker">{sec.nai.kickerA}</p>
            <ul className="im-list">
              {sec.nai.a.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="im-card">
            <p className="im-kicker">{sec.nai.kickerB}</p>
            <p className="im-stages">
              {sec.nai.stages.map((t, idx) => (
                <Fragment key={t}>
                  {idx > 0 ? <span className="im-arrow">→</span> : null}
                  <span>{t}</span>
                </Fragment>
              ))}
            </p>
            <p className="im-chip">
              <b>{sec.nai.chip[0]}</b> {sec.nai.chip[1]}
            </p>
          </div>
        </div>
      );
    case "n4":
      return (
        <div className="im-slide">
          <p className="im-ch">{chapterTitle}</p>
          <AccentHeadline text={sec.n4.h} />
          <p className="im-sub">{sec.n4.sub}</p>
          <div className="im-card">
            <p className="im-kicker">{sec.n4.label}</p>
            <div className="im-ticks">
              {sec.n4.ticks.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <ul className="im-checks">
              {sec.n4.checks.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    case "n5":
      return (
        <div className="im-slide">
          <p className="im-ch">{chapterTitle}</p>
          <AccentHeadline text={sec.n5.h} />
          <p className="im-sub">{sec.n5.sub}</p>
          <div className="im-timeline">
            <span>{sec.n5.planned}</span>
            <span className="im-tl-mid">{sec.n5.signal}</span>
            <div className="im-tl-ends">
              <b>{sec.n5.buys}</b>
              <b>{sec.n5.stop}</b>
            </div>
          </div>
        </div>
      );
    case "n6":
      return (
        <div className="im-slide">
          <p className="im-ch">{chapterTitle}</p>
          <AccentHeadline text={sec.n6.h} />
          <p className="im-sub">{sec.n6.sub}</p>
          <div className="im-ready">
            <span className="im-ready-dot" />
            <span>{sec.n6.ready}</span>
          </div>
          <div className="im-box">{sec.n6.box}</div>
        </div>
      );
    case "n7":
      return (
        <div className="im-slide">
          <p className="im-ch">{chapterTitle}</p>
          <AccentHeadline text={sec.n7.h} />
          <p className="im-sub">{sec.n7.sub}</p>
          <div className="im-compare">
            {sec.n7.compare.map(([title, text], k) => (
              <div
                key={title}
                className={k === sec.n7.compare.length - 1 ? "im-comp m" : "im-comp"}
              >
                <b>{title}</b>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      );
    case "n8":
      return (
        <div className="im-slide">
          <p className="im-ch">{chapterTitle}</p>
          <AccentHeadline text={sec.n8.h} />
          <p className="im-sub">{sec.n8.sub}</p>
          <div className="im-bars">
            <div className="im-bar">
              <span>{sec.n8.bars[0]}</span>
              <i className="tall" />
            </div>
            <div className="im-bar m">
              <span>
                {sec.n8.bars[1]}
                <em>{sec.n8.mitchSuffix}</em>
              </span>
              <i className="short" />
            </div>
          </div>
          <p className="im-note">{sec.n8.note}</p>
        </div>
      );
    default:
      return null;
  }
}

export function IntroMobile({ locale }: { locale: IntroLocale }) {
  const copy = introCopy[locale];
  const v = usePresentation(copy);
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const prevLang = html.lang;
    html.classList.add("intro-open");
    html.lang = copy.htmlLang;
    rootRef.current?.focus({ preventScroll: true });
    return () => {
      html.classList.remove("intro-open");
      html.lang = prevLang;
    };
  }, [copy.htmlLang]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
  }, [v.slideIndex]);

  const { onKey } = v;
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      onKey(e);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onKey]);

  const slide = v.slide;
  const sm = copy.summary;

  return (
    <div
      ref={rootRef}
      className={`im-root ${locale}`}
      tabIndex={0}
      onKeyDown={(e: ReactKeyboardEvent<HTMLDivElement>) => v.onKey(e)}
    >
      <header className="im-top">
        <img
          className={v.lgc === "off" ? "im-logo off" : "im-logo"}
          src={LOGO_SRC}
          alt="MITCH"
        />
        <LanguageSwitcher
          className="im-lang"
          locale={locale}
          hrefs={INTRO_HREFS}
          tone="dark"
          size="md"
        />
      </header>

      <div ref={bodyRef} className="im-body">
        {slide.m === "home" ? (
          <div className="im-slide im-home">
            <p className="im-wel">{copy.welcome.l1}</p>
            <p className="im-wel">{copy.welcome.l2}</p>
            <p className="im-q">{copy.welcome.q}</p>
            <img className="im-home-logo" src={LOGO_SRC} alt="" />
            <h1 className="im-title">
              {copy.title.before}
              <em>{copy.title.em}</em>
            </h1>
            <p className="im-by">{copy.label}</p>
          </div>
        ) : null}

        {slide.m === "part" && slide.key ? (
          <PartBody locale={locale} sectionKey={slide.key} />
        ) : null}

        {slide.m === "sum" ? (
          <div className="im-slide im-sum">
            <p className="im-wel">{sm.eyebrow1}</p>
            <p className="im-wel">{sm.eyebrow2}</p>
            <h2 className="im-sum-h">{sm.heading}</h2>
            <div className="im-recap">
              {sm.recap.map(([title, text]) => (
                <div key={title}>
                  <b>{title}</b>
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <a
              className="im-btn primary im-cta"
              href={sm.ctaHref}
              target="_blank"
              rel="noopener"
            >
              {sm.cta}
            </a>
            <p className="im-who">{sm.who}</p>
            <p className="im-contact">{sm.contact}</p>
          </div>
        ) : null}
      </div>

      <MobileNav copy={copy} v={v} />
    </div>
  );
}
