import { createFileRoute } from "@tanstack/react-router";
import {
  endPageVisit,
  pingPageVisit,
  startOrResumePageVisit,
} from "@/lib/page-visit-repository.server";

type VisitBody = {
  action?: string;
  pageId?: number;
  visitId?: number;
  durationSec?: number;
  locale?: string;
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
          const action = body.action;

          if (action === "start") {
            const result = await startOrResumePageVisit({
              pageId: Number(body.pageId),
              visitId: body.visitId != null ? Number(body.visitId) : null,
              locale: body.locale ?? null,
              userAgent: request.headers.get("user-agent"),
            });
            return Response.json(result);
          }

          if (action === "ping") {
            await pingPageVisit({
              visitId: Number(body.visitId),
              pageId: Number(body.pageId),
              durationSec: Number(body.durationSec ?? 0),
            });
            return Response.json({ ok: true });
          }

          if (action === "end") {
            await endPageVisit({
              visitId: Number(body.visitId),
              pageId: Number(body.pageId),
              durationSec: Number(body.durationSec ?? 0),
            });
            return Response.json({ ok: true });
          }

          return Response.json({ error: "Unknown action." }, { status: 400 });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Visit tracking failed.";
          return Response.json({ error: message }, { status: 400 });
        }
      },
    },
  },
});
