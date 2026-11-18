import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { introCopy, type IntroCopy, type IntroLocale } from "./intro-copy";
import {
  INTRO_HREFS,
  LOGO_SRC,
  STAGE_H,
  STAGE_W,
  parseHeadline,
  useIntroMobileLayout,
  usePresentation,
  type IntroPresentationView,
} from "./intro-engine";
import { IntroMobile } from "./intro-mobile";
import "./intro.css";

/* Field of 480 dots (n1/n2 background): `ndt z{0..9}` with six "key" dots. */
const NDS_KEYS = [85, 177, 224, 309, 369, 435];
const NDS: string[] = Array.from(
  { length: 480 },
  (_, x) =>
    `ndt z${Math.floor((x % 40) / 4)}${NDS_KEYS.indexOf(x) >= 0 ? " k" : ""}`,
);

/** n5 timeline geometry (from the reference markup) */
const NPD: [number, number][] = [
  [47.5, 1],
  [142.5, 2],
  [237.5, 3],
  [332.5, 4],
  [427.5, 5],
  [522.5, 6],
  [617.5, 7],
  [712.5, 8],
  [807.5, 9],
  [902.5, 10],
  [997.5, 11],
  [1092.5, 12],
];
const NSG: [number, number][] = [
  [152.0, 0],
  [313.5, 1],
  [541.5, 2],
  [627.0, 3],
  [836.0, 4],
];

/** n6 "ready" graph geometry (from the reference markup) */
const NLK2: { left: number; top: number; width: number; rotate: number }[] = [
  { left: 138.8, top: 43.5, width: 802.1, rotate: 2.64 },
  { left: 369.4, top: 119.5, width: 571.9, rotate: -3.91 },
  { left: 501.2, top: 5.5, width: 445.2, rotate: 9.7 },
  { left: 237.6, top: 195.5, width: 711.7, rotate: -9.3 },
  { left: 567.1, top: 81.5, width: 372.9, rotate: -0.15 },
];
const NRG_CELLS = 120;
const NRR: Record<number, number> = { 15: 2, 24: 0, 57: 4, 71: 1, 107: 3 };
const NRINGS: { left: number; top: number }[] = [
  { left: 129.8, top: 36.0 },
  { left: 360.4, top: 112.0 },
  { left: 492.2, top: -2.0 },
  { left: 228.6, top: 188.0 },
  { left: 558.1, top: 74.0 },
];

const cssVars = (vars: Record<string, string | number>) =>
  vars as CSSProperties;

function NHead({
  h,
  sub,
  sd,
  questions,
}: {
  h: string;
  sub?: string;
  sd?: string;
  questions?: { text: string; sd: string }[];
}) {
  const words = parseHeadline(h);
  /** Ref sets `--n` to the headline word count excluding `nsdr` asides (drives accent pop delay). */
  const nCount = words.filter((w) => !w.nsdr).length;
  return (
    <div className="nhd" style={cssVars({ "--n": nCount })}>
      <h2 className="nl">
        {words.map((w, idx) => (
          <Fragment key={idx}>
            {idx > 0 ? " " : null}
            <span
              className={
                w.nsdr ? "w nsdr" : w.accent ? "w o" : "w"
              }
              style={cssVars({ "--i": idx })}
            >
              {w.word}
            </span>
          </Fragment>
        ))}
      </h2>
      {questions?.map((q) => (
        <p
          key={q.text}
          className="nsub nq"
          style={cssVars({ "--sd": `${q.sd}s` })}
        >
          {q.text}
        </p>
      ))}
      {!questions?.length && sub ? (
        <p className="nsub" style={cssVars({ "--sd": `${sd}s` })}>
          {sub}
        </p>
      ) : null}
    </div>
  );
}

function IntroNav({
  copy,
  v,
}: {
  copy: IntroCopy;
  v: IntroPresentationView;
}) {
  return (
    <nav
      className="nav"
      aria-label={copy.navAria}
      style={cssVars({ "--rd": v.rd })}
    >
      <div className="segs">
        {v.segs.map((sg, idx) => (
          <button
            key={idx}
            type="button"
            className={sg.c}
            aria-label={sg.aria}
            onClick={sg.go}
          />
        ))}
      </div>
      <span className="count">{v.count}</span>
      <button
        type="button"
        className="btn ghost"
        onClick={v.prev}
        disabled={v.atStart}
      >
        {copy.backLabel}
      </button>
      {v.nA ? (
        <button
          key="nxA"
          type="button"
          className={`btn primary nx ${v.nxc}`}
          onClick={v.next}
        >
          <span className="nxl">{v.nextLabel}</span>
        </button>
      ) : null}
      {v.nB ? (
        <button
          key="nxB"
          type="button"
          className={`btn primary nx ${v.nxc}`}
          onClick={v.next}
        >
          <span className="nxl">{v.nextLabel}</span>
        </button>
      ) : null}
    </nav>
  );
}

function IntroDesktop({ locale }: { locale: IntroLocale }) {
  const copy = introCopy[locale];
  const v = usePresentation(copy);
  const { sections: sec, summary: sm } = copy;

  const hostRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const fit = () => {
      const w = hostRef.current?.clientWidth || window.innerWidth;
      const h = hostRef.current?.clientHeight || window.innerHeight;
      setScale(Math.min(w / STAGE_W, h / STAGE_H));
      // Ultrawide / letterboxed sides: enrich the pillarbox, keep the 16:9 stage intact.
      setWide(w / h > STAGE_W / STAGE_H + 0.04);
    };
    fit();
    window.addEventListener("resize", fit);
    window.addEventListener("orientationchange", fit);
    return () => {
      window.removeEventListener("resize", fit);
      window.removeEventListener("orientationchange", fit);
    };
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const prevLang = html.lang;
    html.classList.add("intro-open");
    html.lang = copy.htmlLang;
    stageRef.current?.focus({ preventScroll: true });
    return () => {
      html.classList.remove("intro-open");
      html.lang = prevLang;
    };
  }, [copy.htmlLang]);

  const { onKey } = v;
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      if (
        stageRef.current &&
        e.target instanceof Node &&
        stageRef.current.contains(e.target)
      ) {
        return;
      }
      onKey(e);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onKey]);

  const hostStyle = cssVars({ "--intro-scale": scale ?? 1 });

  return (
    <div
      ref={hostRef}
      className={
        "intro-host" +
        (scale !== null ? " ready" : "") +
        (wide ? " wide" : "")
      }
      style={hostStyle}
    >
      <div className="intro-bleed" aria-hidden="true">
        <i />
        <i />
      </div>
      <div
        ref={stageRef}
        className={`stage ${locale}`}
        tabIndex={0}
        onKeyDown={(e: ReactKeyboardEvent<HTMLDivElement>) => v.onKey(e)}
        data-canvas-width={STAGE_W}
        data-canvas-height={STAGE_H}
        data-document-role="page"
      >
        <div className={`sx ${v.stc}`}>
          <i className={`sxf ${v.sfc}`} aria-hidden="true" />
          <div className="amb" aria-hidden="true">
            <i className="loop" />
            <i className="loop" />
          </div>

          <div className="topbar">
            <img className={`logo ${v.lgc}`} src={LOGO_SRC} alt="MITCH" />
            <span className="where">{v.label}</span>
            <LanguageSwitcher
              className="lang"
              locale={locale}
              hrefs={INTRO_HREFS}
              tone="dark"
              size="lg"
            />
          </div>

          <div className={`wel ${v.welc}`}>
            <div className="wtg">
              <p className="wtl wtl1">{copy.welcome.l1}</p>
              <p className="wtl wtl2">{copy.welcome.l2}</p>
              <p className="wtq">{copy.welcome.q}</p>
            </div>
          </div>
          <div className={`ttl ${v.ttc}`}>
            <img className="tlg" src={LOGO_SRC} alt="MITCH" />
            <h2 className="tth">
              {copy.title.before}
              <em>{copy.title.em}</em>
            </h2>
            <p className="ttsub">{copy.title.sub}</p>
          </div>

          {copy.chapters.map((title, idx) => (
            <p key={idx} className={`chp ${v.ch[idx + 1]}`}>
              {title}
            </p>
          ))}

          <div className={`nfield ${v.nf}`} aria-hidden="true">
            {NDS.map((cls, idx) => (
              <span key={idx} className={cls} />
            ))}
          </div>

          <section className={`ns ${v.ns.n1}`}>
            <NHead
              h={sec.n1.h}
              questions={sec.n1.questions}
            />
            <span className="nscan" />
          </section>

          <section className={`ns ${v.ns.n2}`}>
            <NHead {...sec.n2} />
          </section>

          <section className={`ns ${v.ns.n3}`}>
            <NHead {...sec.n3} />
            <span className="nsbar">
              <i />
            </span>
            <div className="nsteps">
              {sec.n3.steps.map(([num, title, text], k) => (
                <div key={k} className="nstep" style={cssVars({ "--k": k })}>
                  <b>{num}</b>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={`ns ${v.ns.nex}`}>
            <NHead h={sec.nex.h} />
            <div
              className="nsteps"
              style={{ gridTemplateColumns: "1fr 1fr 1fr 2fr" }}
            >
              {sec.nex.steps.map(([num, title, text], k) => (
                <div key={k} className="nstep" style={cssVars({ "--k": k })}>
                  <b>{num}</b>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={`ns ${v.ns.nai}`}>
            <NHead h={sec.nai.h} />
            <div className="nai">
              <div className="naiA">
                <p className="naik">{sec.nai.kickerA}</p>
                {sec.nai.a.map((text, k) => (
                  <span key={k} style={cssVars({ "--k": k })}>
                    {text}
                  </span>
                ))}
              </div>
              <span className="naiar">
                {[0, 1, 2].map((k) => (
                  <i key={k} className="loop" style={cssVars({ "--k": k })} />
                ))}
              </span>
              <div className="naiB">
                <p className="naik">{sec.nai.kickerB}</p>
                <div className="naist">
                  {sec.nai.stages.map((text, idx) => (
                    <Fragment key={idx}>
                      {idx > 0 ? (
                        <i style={cssVars({ "--k": idx * 2 - 1 })}>→</i>
                      ) : null}
                      <span style={cssVars({ "--k": idx * 2 })}>{text}</span>
                    </Fragment>
                  ))}
                </div>
                <p className="naichip">
                  <b>{sec.nai.chip[0]}</b> {sec.nai.chip[1]}
                </p>
              </div>
            </div>
          </section>

          <section className={`ns ${v.ns.n4}`}>
            <NHead {...sec.n4} />
            <div className="ncnt">
              <div>
                <p className="ncl">{sec.n4.label}</p>
                <div className="ncn">
                  <span className="one">1</span>
                  <span className="many" />
                </div>
                <span className="ncbar">
                  <i />
                </span>
                <span className="nctk">
                  {sec.n4.ticks.map((t, k) => (
                    <b key={k}>{t}</b>
                  ))}
                </span>
              </div>
              <div className="nchk">
                {sec.n4.checks.map((text, k) => (
                  <span key={k} style={cssVars({ "--k": k })}>
                    <i />
                    {text}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className={`ns ${v.ns.n5}`}>
            <NHead {...sec.n5} />
            <div className="ntl">
              <span className="ntr" />
              {NPD.map(([left, k]) => (
                <span
                  key={k}
                  className="npd"
                  style={cssVars({ left: `${left}px`, "--k": k })}
                />
              ))}
              {NSG.map(([left, k]) => (
                <span
                  key={k}
                  className="nsg"
                  style={cssVars({ left: `${left}px`, "--k": k })}
                />
              ))}
              <span className="npl loop" />
              <span className="nlk">{sec.n5.planned}</span>
              <span className="nlk s">{sec.n5.signal}</span>
              <span className="nend b">{sec.n5.buys}</span>
              <span className="nend t">{sec.n5.stop}</span>
            </div>
          </section>

          <section className={`ns ${v.ns.n6}`}>
            <NHead {...sec.n6} />
            <div className="nrd">
              {NLK2.map((l, k) => (
                <span
                  key={k}
                  className="nlk2"
                  style={cssVars({
                    left: `${l.left}px`,
                    top: `${l.top}px`,
                    width: `${l.width}px`,
                    transform: `rotate(${l.rotate}deg)`,
                    "--k": k,
                  })}
                >
                  <i />
                  <b className="loop" />
                </span>
              ))}
              <div className="nrgd">
                {Array.from({ length: NRG_CELLS }, (_, idx) =>
                  idx in NRR ? (
                    <span
                      key={idx}
                      className="nrr"
                      style={cssVars({ "--k": NRR[idx] })}
                    />
                  ) : (
                    <span key={idx} className="nrg0" />
                  ),
                )}
              </div>
              {NRINGS.map((r, k) => (
                <span
                  key={k}
                  className="nring loop"
                  style={cssVars({
                    left: `${r.left}px`,
                    top: `${r.top}px`,
                    "--k": k,
                  })}
                />
              ))}
              <span className="nrl">{sec.n6.ready}</span>
              <div className="nbox">{sec.n6.box}</div>
            </div>
          </section>

          <section className={`ns ${v.ns.n7}`}>
            <NHead {...sec.n7} />
            <div className="ncmp">
              {sec.n7.compare.map(([title, text], k) => (
                <div
                  key={k}
                  className={
                    k === sec.n7.compare.length - 1 ? "nch m" : "nch x"
                  }
                  style={cssVars({ "--k": k })}
                >
                  <b>{title}</b>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={`ns ${v.ns.n8}`}>
            <NHead {...sec.n8} />
            <div className="nbars">
              <div className="nbr">
                <p className="nbw">{sec.n8.bars[0]}</p>
                <span className="nbt">
                  <i />
                </span>
                <b className="nbv ev1" />
              </div>
              <div className="nbr m">
                <p className="nbw">{sec.n8.bars[1]}</p>
                <span className="nbt">
                  <i />
                </span>
                <b className="nbv ev2" />
              </div>
              <p className="nbx">{sec.n8.note}</p>
            </div>
          </section>

          <div className={`sm ${v.smc}`}>
            <p className="sme">{sm.eyebrow1}</p>
            <p className="sme s2">{sm.eyebrow2}</p>
            <h2 className="smh">{sm.heading}</h2>
            <div className="srec">
              {sm.recap.map(([title, text], k) => (
                <div key={k} style={cssVars({ "--k": k })}>
                  <b>{title}</b>
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <p className="sproof">{sm.proof}</p>
            <p className="sstart">
              <b>{sm.startLead}</b> {sm.startRest}
            </p>
            <div className="cta2">
              <a
                className="btn primary"
                href={sm.ctaHref}
                target="_blank"
                rel="noopener"
              >
                {sm.cta}
              </a>
              <span className="who">{sm.who}</span>
              <span className="sel">{sm.contact}</span>
            </div>
            <p className="sbio">{sm.bio}</p>
          </div>

          <IntroNav copy={copy} v={v} />
        </div>
      </div>
    </div>
  );
}

export function IntroPresentation({ locale }: { locale: IntroLocale }) {
  const mobile = useIntroMobileLayout();
  if (mobile) return <IntroMobile locale={locale} />;
  return <IntroDesktop locale={locale} />;
}
