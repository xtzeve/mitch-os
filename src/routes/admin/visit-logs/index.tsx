import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  clearVisitDebugLogsAction,
  fetchVisitDebugLogs,
} from "@/lib/pages.server";
import type { VisitDebugLogRow } from "@/lib/visit-debug-log.server";

const PER_PAGE_OPTIONS = [20, 50, 100] as const;
const DEFAULT_PER_PAGE = 50;
const ALL = "__all__";

type LogsSearch = {
  page?: number;
  perPage?: number;
  pageId?: number;
  action?: string;
};

function normalizePerPage(value: unknown): number {
  const n = Number(value);
  return (PER_PAGE_OPTIONS as readonly number[]).includes(n) ? n : DEFAULT_PER_PAGE;
}

function optionalPositiveInt(value: unknown): number | undefined {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : undefined;
}

function parsePayload(raw: string): Record<string, unknown> | null {
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function summarizeLog(row: VisitDebugLogRow) {
  const payload = parsePayload(row.payload);
  const request = asRecord(payload?.request);
  const headers = asRecord(request?.headers);
  const cf = asRecord(request?.cf);
  const body = asRecord(payload?.body);
  const client = asRecord(body?.client);

  const ip =
    (typeof headers?.["cf-connecting-ip"] === "string" && headers["cf-connecting-ip"]) ||
    (typeof headers?.["true-client-ip"] === "string" && headers["true-client-ip"]) ||
    (typeof headers?.["x-real-ip"] === "string" && headers["x-real-ip"]) ||
    (typeof headers?.["x-forwarded-for"] === "string" &&
      headers["x-forwarded-for"].split(",")[0]?.trim()) ||
    "—";

  const country = typeof cf?.country === "string" ? cf.country : "—";
  const ua =
    (typeof client?.userAgent === "string" && client.userAgent) ||
    (typeof headers?.["user-agent"] === "string" && headers["user-agent"]) ||
    "—";
  const referrer =
    (typeof client?.referrer === "string" && client.referrer) ||
    (typeof headers?.referer === "string" && headers.referer) ||
    "—";
  const durationSec =
    typeof body?.durationSec === "number"
      ? body.durationSec
      : typeof body?.durationSec === "string"
        ? Number(body.durationSec)
        : null;
  const webdriver = client?.webdriver === true ? "yes" : client?.webdriver === false ? "no" : "—";
  const event = typeof client?.event === "string" ? client.event : null;

  return {
    ip: ip || "—",
    country,
    ua,
    referrer: referrer || "—",
    durationSec: Number.isFinite(durationSec as number) ? (durationSec as number) : null,
    webdriver,
    event,
    payload,
  };
}

export const Route = createFileRoute("/admin/visit-logs/")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }, { title: "Admin — Visit Logs" }],
  }),
  validateSearch: (search: Record<string, unknown>): LogsSearch => {
    const result: LogsSearch = {};
    const page = Math.max(1, Math.floor(Number(search.page)) || 1);
    if (page > 1) result.page = page;
    const perPage = normalizePerPage(search.perPage);
    if (perPage !== DEFAULT_PER_PAGE) result.perPage = perPage;
    const pageId = optionalPositiveInt(search.pageId);
    if (pageId) result.pageId = pageId;
    if (typeof search.action === "string" && search.action && search.action !== "all") {
      result.action = search.action;
    }
    return result;
  },
  loaderDeps: ({ search }) => ({
    page: search.page ?? 1,
    perPage: search.perPage ?? DEFAULT_PER_PAGE,
    pageId: search.pageId,
    action: search.action ?? "all",
  }),
  loader: async ({ deps }) =>
    fetchVisitDebugLogs({
      data: {
        page: deps.page,
        perPage: deps.perPage,
        pageId: deps.pageId,
        action: deps.action,
      },
    }),
  component: VisitLogsPage,
});

function VisitLogsPage() {
  const data = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const router = useRouter();
  const [selected, setSelected] = useState<VisitDebugLogRow | null>(null);
  const [clearing, setClearing] = useState(false);
  const [pageIdDraft, setPageIdDraft] = useState(
    search.pageId != null ? String(search.pageId) : "",
  );

  const selectedSummary = useMemo(
    () => (selected ? summarizeLog(selected) : null),
    [selected],
  );

  const totalPages = Math.max(1, Math.ceil(data.total / data.perPage));
  const from = data.total === 0 ? 0 : (data.page - 1) * data.perPage + 1;
  const to = Math.min(data.total, data.page * data.perPage);

  const patchSearch = (patch: Partial<LogsSearch>) => {
    void navigate({
      search: (prev) => {
        const next: LogsSearch = { ...prev, ...patch };
        if (patch.pageId === undefined && "pageId" in patch) delete next.pageId;
        if (patch.action === undefined && "action" in patch) delete next.action;
        if (next.page === 1) delete next.page;
        if (next.perPage === DEFAULT_PER_PAGE) delete next.perPage;
        if (!next.pageId) delete next.pageId;
        if (!next.action || next.action === "all") delete next.action;
        return next;
      },
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">Visit Logs</h1>
          <p className="text-sm text-muted-foreground">
            Debug dumps from <code className="text-xs">/api/visit</code> — headers, CF, client
            probe.
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => void router.invalidate()}>
            Refresh
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={clearing || data.total === 0}
            onClick={async () => {
              if (!window.confirm("Delete all visit debug logs?")) return;
              setClearing(true);
              try {
                await clearVisitDebugLogsAction();
                setSelected(null);
                await router.invalidate();
              } finally {
                setClearing(false);
              }
            }}
          >
            Clear all
          </Button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Page ID</label>
          <Input
            className="w-28"
            inputMode="numeric"
            placeholder="All"
            value={pageIdDraft}
            onChange={(e) => setPageIdDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              const n = optionalPositiveInt(pageIdDraft);
              patchSearch({ pageId: n, page: 1 });
            }}
            onBlur={() => {
              const n = optionalPositiveInt(pageIdDraft);
              const current = search.pageId;
              if (n !== current) patchSearch({ pageId: n, page: 1 });
              if (!n) setPageIdDraft("");
            }}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Action</label>
          <Select
            value={search.action ?? ALL}
            onValueChange={(value) =>
              patchSearch({ action: value === ALL ? undefined : value, page: 1 })
            }
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All</SelectItem>
              <SelectItem value="start">start</SelectItem>
              <SelectItem value="ping">ping</SelectItem>
              <SelectItem value="end">end</SelectItem>
              <SelectItem value="error">error</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Per page</label>
          <Select
            value={String(search.perPage ?? DEFAULT_PER_PAGE)}
            onValueChange={(value) =>
              patchSearch({ perPage: normalizePerPage(value), page: 1 })
            }
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PER_PAGE_OPTIONS.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Page</TableHead>
              <TableHead>Visit</TableHead>
              <TableHead>Dur</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>CC</TableHead>
              <TableHead>WD</TableHead>
              <TableHead>Referrer</TableHead>
              <TableHead>User-Agent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="py-10 text-center text-muted-foreground">
                  No logs yet. Open a landing page (or wait for LinkedIn) after deploy.
                </TableCell>
              </TableRow>
            ) : (
              data.rows.map((row) => {
                const s = summarizeLog(row);
                return (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer"
                    onClick={() => setSelected(row)}
                  >
                    <TableCell className="font-mono text-xs">{row.id}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs">{row.created_at}</TableCell>
                    <TableCell className="text-xs font-medium">
                      {row.action ?? "—"}
                      {s.event && s.event !== row.action ? (
                        <span className="text-muted-foreground">/{s.event}</span>
                      ) : null}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{row.page_id ?? "—"}</TableCell>
                    <TableCell className="font-mono text-xs">{row.visit_id ?? "—"}</TableCell>
                    <TableCell className="text-xs">
                      {s.durationSec != null ? `${s.durationSec}s` : "—"}
                    </TableCell>
                    <TableCell className="max-w-[9rem] truncate font-mono text-xs" title={s.ip}>
                      {s.ip}
                    </TableCell>
                    <TableCell className="text-xs">{s.country}</TableCell>
                    <TableCell className="text-xs">{s.webdriver}</TableCell>
                    <TableCell className="max-w-[10rem] truncate text-xs" title={s.referrer}>
                      {s.referrer}
                    </TableCell>
                    <TableCell className="max-w-[18rem] truncate text-xs" title={s.ua}>
                      {s.ua}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>
          Showing {from}–{to} of {data.total}
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={data.page <= 1}
            onClick={() => patchSearch({ page: data.page - 1 })}
          >
            Prev
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={data.page >= totalPages}
            onClick={() => patchSearch({ page: data.page + 1 })}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={selected != null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden p-0 sm:rounded-lg">
          <div className="border-b px-6 py-4">
            <DialogHeader>
              <DialogTitle>
                Log #{selected?.id} — {selected?.action ?? "unknown"}
              </DialogTitle>
              <DialogDescription>
                page {selected?.page_id ?? "—"} · visit {selected?.visit_id ?? "—"} ·{" "}
                {selected?.created_at}
                {selectedSummary ? (
                  <>
                    {" "}
                    · IP {selectedSummary.ip} · {selectedSummary.country} · webdriver{" "}
                    {selectedSummary.webdriver}
                  </>
                ) : null}
              </DialogDescription>
            </DialogHeader>
          </div>
          <pre className="max-h-[70vh] overflow-auto bg-slate-950 p-4 text-xs leading-relaxed text-slate-100">
            {selectedSummary?.payload
              ? JSON.stringify(selectedSummary.payload, null, 2)
              : selected?.payload}
          </pre>
        </DialogContent>
      </Dialog>
    </div>
  );
}
