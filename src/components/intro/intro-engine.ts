import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { IntroCopy, IntroSectionKey } from "./intro-copy";

export const STAGE_W = 1600;
export const STAGE_H = 900;
export const LOGO_SRC = "/intro/logo.png";
export const INTRO_HREFS = { en: "/intro", de: "/de/intro" } as const;

type SlideKind = "home" | "part" | "sum";

export type IntroSlide = {
  m: SlideKind;
  g: number;
  lbl: string;
  ms: number;
  key?: IntroSectionKey;
  ch?: number;
  dl?: string[];
  nd?: number;
  name?: string;
};

type PresentationState = {
  i: number;
  d: number;
  late: boolean;
  skip: boolean;
  w: boolean;
  n: number;
};

const INITIAL_STATE: PresentationState = {
  i: 0,
  d: 0,
  late: true,
  skip: false,
  w: true,
  n: 0,
};

function buildSlides(copy: IntroCopy): IntroSlide[] {
  const S: IntroSlide[] = [{ m: "home", g: 0, lbl: copy.openingLabel, ms: 2000 }];
  copy.story.forEach((x) =>
    S.push({
      m: "part",
      key: x.key,
      ch: x.ch,
      dl: x.dl,
      nd: x.dl.length,
      name: x.name,
      g: x.ch,
      lbl: `${copy.chapters[x.ch - 1]} · ${x.name}`,
      ms: x.ms,
    }),
  );
  S.push({ m: "sum", g: 5, lbl: copy.summaryLabel, ms: 5200 });
  return S;
}

const pad = (v: number) => (v < 10 ? "0" : "") + v;

export function usePresentation(copy: IntroCopy) {
  const S = useMemo(() => buildSlides(copy), [copy]);
  const last = S.length - 1;

  const stateRef = useRef<PresentationState>(INITIAL_STATE);
  const [state, setStateRaw] = useState<PresentationState>(INITIAL_STATE);
  const tRef = useRef(0);

  useEffect(() => {
    tRef.current = Date.now();
  }, []);

  const setState = useCallback((patch: Partial<PresentationState>) => {
    stateRef.current = { ...stateRef.current, ...patch };
    setStateRaw(stateRef.current);
  }, []);

  const dur = useCallback(
    (ci: number, cd: number, lt: boolean) =>
      cd > 0
        ? 900
        : !lt
          ? 1000
          : ci === 0 && stateRef.current.w !== false
            ? 9500
            : S[ci].ms || 3000,
    [S],
  );

  const go = useCallback(
    (ni: number, w?: boolean) => {
      tRef.current = Date.now();
      setState({
        i: ni,
        d: 0,
        late: true,
        skip: false,
        w: !!w,
        n: (stateRef.current.n || 0) + 1,
      });
    },
    [setState],
  );

  const next = useCallback(() => {
    const s0 = stateRef.current;
    const ci = s0.i || 0;
    const cd = s0.d || 0;
    if (
      !s0.skip &&
      Date.now() - (tRef.current || 0) < dur(ci, cd, s0.late !== false)
    ) {
      setState({ skip: true });
      return;
    }
    if (cd > 0) {
      tRef.current = Date.now();
      setState({
        d: cd < (S[ci].nd || 0) ? cd + 1 : 0,
        late: false,
        skip: false,
      });
      return;
    }
    go(ci < last ? ci + 1 : 0, ci >= last);
  }, [S, dur, go, last, setState]);

  const more = useCallback(() => {
    const s0 = stateRef.current;
    const ci = s0.i || 0;
    const cd = s0.d || 0;
    if (cd === 0 && (S[ci].nd || 0) > 0) {
      tRef.current = Date.now();
      setState({ d: 1, late: false, skip: false });
    }
  }, [S, setState]);

  const close = useCallback(() => {
    tRef.current = Date.now();
    setState({ d: 0, late: false, skip: false });
  }, [setState]);

  const prev = useCallback(() => {
    const s0 = stateRef.current;
    const ci = s0.i || 0;
    const cd = s0.d || 0;
    if (cd > 0) {
      tRef.current = Date.now();
      setState({ d: cd - 1, late: false, skip: false });
    } else if (ci > 0) {
      go(ci - 1);
    }
  }, [go, setState]);

  const onKey = useCallback(
    (e: { key?: string; preventDefault?: () => void }) => {
      const k = e && e.key;
      if (k === "ArrowRight" || k === "PageDown") {
        e.preventDefault?.();
        next();
      } else if (k === "ArrowLeft" || k === "PageUp") {
        e.preventDefault?.();
        prev();
      } else if (k === "ArrowDown") {
        e.preventDefault?.();
        more();
      } else if (k === "Escape") {
        close();
      }
    },
    [close, more, next, prev],
  );

  const st = state;
  const i = Math.min(Math.max(st.i || 0, 0), last);
  const c = S[i];
  const nd = c.nd || 0;
  const d = Math.min(st.d || 0, nd);
  const late = st.late !== false;
  const m = c.m;

  const ns: Partial<Record<IntroSectionKey, string>> = {};
  S.forEach((x, y) => {
    if (x.m !== "part" || !x.key) return;
    ns[x.key] =
      y === i
        ? "on" + (d === 0 && late ? " late" : "")
        : y < i
          ? "past"
          : "next";
  });

  const ch: Record<number, string> = {};
  for (let n = 1; n <= 4; n++) ch[n] = m === "part" && c.ch === n ? "on" : "";

  const nf =
    (c.key === "n1" ? "f1" : c.key === "n2" ? "f2" : "") +
    ((c.key === "n1" || c.key === "n2") && d === 0 && late ? " late" : "");

  const smc = m === "sum" ? "on" : "next";

  const segs = S.map((x, y) => ({
    c:
      "seg" +
      (y === i ? " cur" : y < i ? " done" : "") +
      (y > 0 && x.g !== S[y - 1].g ? " gap" : ""),
    aria: `${copy.stepAria} ${y + 1}: ${x.lbl}`,
    go: () => go(y),
  }));

  let nextLabel = copy.nextLabel;
  if (i === 0) nextLabel = copy.startLabel;
  else if (i === last) nextLabel = copy.restartLabel;

  const auto = d === 0 && late;
  const rdS = auto ? (i === 0 && st.w !== false ? 9.5 : (c.ms || 0) / 1000) : 0;
  const par = (st.n || 0) % 2 === 0;

  return {
    slide: c,
    slideIndex: i,
    slideCount: S.length,
    stc: i === 0 && st.w !== false ? "wm" : "",
    sfc: st.skip ? "settle" : "",
    welc: i === 0 && st.w !== false ? "on" : "",
    ttc: i === 0 ? "on" + (st.w !== false ? " wm" : "") : "",
    lgc: i === 0 ? "off" : "",
    ch,
    ns,
    nf,
    smc,
    segs,
    label: copy.label,
    count: `${pad(i + 1)} / ${pad(S.length)}`,
    nA: par,
    nB: !par,
    rd: `${rdS}s`,
    nxc: auto ? "wait" : "",
    next,
    prev,
    go,
    onKey,
    atStart: i === 0 && d === 0,
    nextLabel,
    skip: st.skip,
  };
}

export type IntroPresentationView = ReturnType<typeof usePresentation>;

/** Splits a headline into word spans (`*accent*` runs → accent). */
export function parseHeadline(text: string): { word: string; accent: boolean }[] {
  const out: { word: string; accent: boolean }[] = [];
  let on = false;
  for (const raw of text.split(" ")) {
    let word = raw;
    let ends = false;
    if (word.startsWith("*")) {
      on = true;
      word = word.slice(1);
    }
    if (word.endsWith("*")) {
      ends = true;
      word = word.slice(0, -1);
    }
    out.push({ word, accent: on });
    if (ends) on = false;
  }
  return out;
}

function isIntroMobileViewport() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(max-width: 900px) and (orientation: portrait)")
      .matches || window.matchMedia("(max-width: 520px)").matches
  );
}

/** True for narrow portrait (and very small phones) — use the mobile layout. */
export function useIntroMobileLayout() {
  const [mobile, setMobile] = useState(isIntroMobileViewport);

  useEffect(() => {
    const mqPortrait = window.matchMedia(
      "(max-width: 900px) and (orientation: portrait)",
    );
    const mqNarrow = window.matchMedia("(max-width: 520px)");
    const sync = () => setMobile(mqPortrait.matches || mqNarrow.matches);
    sync();
    mqPortrait.addEventListener("change", sync);
    mqNarrow.addEventListener("change", sync);
    window.addEventListener("orientationchange", sync);
    return () => {
      mqPortrait.removeEventListener("change", sync);
      mqNarrow.removeEventListener("change", sync);
      window.removeEventListener("orientationchange", sync);
    };
  }, []);

  return mobile;
}
