import { useEffect, useRef } from "react";
import { VISIT_HEARTBEAT_SEC, VISIT_SESSION_TTL_SEC } from "@/lib/page-visit-constants";

type LandingVisitTrackerProps = {
  pageId: number;
  locale: string;
};

function cookieName(pageId: number) {
  return `lp_vid_${pageId}`;
}

function readVisitId(pageId: number): number | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${cookieName(pageId)}=([^;]*)`));
  if (!match?.[1]) return null;
  const id = Number(decodeURIComponent(match[1]));
  return Number.isFinite(id) && id > 0 ? id : null;
}

function writeVisitId(pageId: number, visitId: number) {
  document.cookie = `${cookieName(pageId)}=${visitId}; Path=/; Max-Age=${VISIT_SESSION_TTL_SEC}; SameSite=Lax`;
}

function postVisit(body: Record<string, unknown>, opts?: { keepalive?: boolean; beacon?: boolean }) {
  const payload = JSON.stringify(body);
  if (opts?.beacon && typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([payload], { type: "application/json" });
    return navigator.sendBeacon("/api/visit", blob);
  }
  void fetch("/api/visit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: opts?.keepalive ?? false,
    credentials: "same-origin",
  }).catch(() => undefined);
  return true;
}

/**
 * Session-based landing visit tracker:
 * - cookie per page_id, 30 min sliding
 * - counts visible time only
 * - refresh / EN↔DE reuse same visit
 */
export function LandingVisitTracker({ pageId, locale }: LandingVisitTrackerProps) {
  const visitIdRef = useRef<number | null>(null);
  const activeSecRef = useRef(0);
  const segmentStartRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let heartbeatTimer: number | undefined;

    const currentVisibleSec = () => {
      let total = activeSecRef.current;
      if (segmentStartRef.current != null) {
        total += (Date.now() - segmentStartRef.current) / 1000;
      }
      return Math.max(0, Math.floor(total));
    };

    const startSegment = () => {
      if (document.visibilityState === "visible" && segmentStartRef.current == null) {
        segmentStartRef.current = Date.now();
      }
    };

    const pauseSegment = () => {
      if (segmentStartRef.current != null) {
        activeSecRef.current += (Date.now() - segmentStartRef.current) / 1000;
        segmentStartRef.current = null;
      }
    };

    const flush = (action: "ping" | "end", useBeacon = false) => {
      const visitId = visitIdRef.current;
      if (!visitId) return;
      postVisit(
        {
          action,
          pageId,
          visitId,
          durationSec: currentVisibleSec(),
        },
        { keepalive: action === "end", beacon: useBeacon && action === "end" },
      );
      if (action === "ping") {
        writeVisitId(pageId, visitId);
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        pauseSegment();
        flush("ping");
      } else {
        startSegment();
      }
    };

    const onPageHide = () => {
      pauseSegment();
      flush("end", true);
    };

    async function boot() {
      const existing = readVisitId(pageId);
      try {
        const res = await fetch("/api/visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({
            action: "start",
            pageId,
            visitId: existing,
            locale,
          }),
        });
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as { visitId?: number };
        if (!data.visitId || cancelled) return;
        visitIdRef.current = data.visitId;
        writeVisitId(pageId, data.visitId);
        startSegment();
        heartbeatTimer = window.setInterval(() => {
          if (document.visibilityState !== "visible") return;
          flush("ping");
        }, VISIT_HEARTBEAT_SEC * 1000);
      } catch {
        // ignore tracking failures
      }
    }

    void boot();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      cancelled = true;
      pauseSegment();
      flush("end", true);
      if (heartbeatTimer) window.clearInterval(heartbeatTimer);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [pageId, locale]);

  return null;
}
