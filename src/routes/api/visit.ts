import { createFileRoute } from "@tanstack/react-router";
import {
  endPageVisit,
  pingPageVisit,
  startOrResumePageVisit,
} from "@/lib/page-visit-repository.server";
import { getRequestAsn } from "@/lib/page-visit-types";
import {
  buildVisitDebugPayload,
  writeVisitDebugLog,
} from "@/lib/visit-debug-log.server";

type VisitBody = {
  action?: string;
  pageId?: number;
  visitId?: number;
  durationSec?: number;
  locale?: string;
  client?: Record<string, unknown>;
};

async function parseBody(request: Request): Promise<VisitBody> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await request.json()) as VisitBody;
  }
  const text = await request.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as VisitBody;
  } catch {
    return {};
  }
}

export const Route = createFileRoute("/api/visit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await parseBody(request);

          await writeVisitDebugLog(
            buildVisitDebugPayload({
              request,
              body: body as Record<string, unknown>,
            }),
          );

          const action = body.action;
          const asn = getRequestAsn(request);

          if (action === "start") {
            const result = await startOrResumePageVisit({
              pageId: Number(body.pageId),
              visitId: body.visitId != null ? Number(body.visitId) : null,
              locale: body.locale ?? null,
              userAgent: request.headers.get("user-agent"),
              asn,
            });
            await writeVisitDebugLog(
              buildVisitDebugPayload({
                request,
                body: body as Record<string, unknown>,
                extra: { phase: "start-result", result, asn },
              }),
            );
            return Response.json(result);
          }

          if (action === "ping") {
            await pingPageVisit({
              visitId: Number(body.visitId),
              pageId: Number(body.pageId),
              durationSec: Number(body.durationSec ?? 0),
              asn,
            });
            return Response.json({ ok: true });
          }

          if (action === "end") {
            await endPageVisit({
              visitId: Number(body.visitId),
              pageId: Number(body.pageId),
              durationSec: Number(body.durationSec ?? 0),
              asn,
            });
            return Response.json({ ok: true });
          }

          return Response.json({ error: "Unknown action." }, { status: 400 });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Visit tracking failed.";
          try {
            await writeVisitDebugLog({
              at: new Date().toISOString(),
              action: "error",
              pageId: null,
              visitId: null,
              error: message,
            });
          } catch {
            // ignore logging failures
          }
          return Response.json({ error: message }, { status: 400 });
        }
      },
    },
  },
});
