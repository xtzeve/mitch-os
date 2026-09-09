import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDurationSec, formatLastVisited } from "@/lib/page-format";
import { fetchPageVisits } from "@/lib/pages.server";
import type { PageVisitRecord } from "@/lib/page-visit-types";

type PageVisitsDialogProps = {
  pageId: number | null;
  pageLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PageVisitsDialog({
  pageId,
  pageLabel,
  open,
  onOpenChange,
}: PageVisitsDialogProps) {
  const [visits, setVisits] = useState<PageVisitRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || pageId == null) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    void fetchPageVisits({ data: { pageId } })
      .then((data) => {
        if (cancelled) return;
        if (!data) {
          setError("Failed to load visits.");
          setVisits([]);
          return;
        }
        setVisits(data.visits);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Failed to load visits.");
          setVisits([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, pageId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-hidden p-0 sm:rounded-lg">
        <div className="border-b px-6 py-4">
          <DialogHeader>
            <DialogTitle>Visits — {pageLabel}</DialogTitle>
            <DialogDescription>
              Each session for this landing page. Only sessions with ≥5s visible time count toward
              the Visited counter (email link scanners usually do not).
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="max-h-[60vh] overflow-auto px-6 py-4">
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
          ) : error ? (
            <p className="py-8 text-center text-sm text-destructive">{error}</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Last seen</TableHead>
                    <TableHead>Ended</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Locale</TableHead>
                    <TableHead>Counted</TableHead>
                    <TableHead>Client</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visits.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                        No visit sessions yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    visits.map((visit) => (
                      <TableRow key={visit.visit_id}>
                        <TableCell>{visit.visit_id}</TableCell>
                        <TableCell>
                          {formatLastVisited(visit.started_at) ?? visit.started_at}
                        </TableCell>
                        <TableCell>
                          {formatLastVisited(visit.last_seen_at) ?? visit.last_seen_at}
                        </TableCell>
                        <TableCell>
                          {visit.ended_at
                            ? (formatLastVisited(visit.ended_at) ?? visit.ended_at)
                            : "—"}
                        </TableCell>
                        <TableCell>{formatDurationSec(visit.duration_sec)}</TableCell>
                        <TableCell>{visit.locale || "—"}</TableCell>
                        <TableCell>
                          {visit.is_bot ? "bot" : visit.counted ? "yes" : "no"}
                        </TableCell>
                        <TableCell className="max-w-[14rem] truncate text-xs text-muted-foreground">
                          {visit.user_agent || "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <div className="flex justify-end border-t px-6 py-3">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
