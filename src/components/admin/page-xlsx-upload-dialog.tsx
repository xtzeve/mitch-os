import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type { CatalogRecord } from "@/lib/catalog-types";
import {
  checkPageXlsxImportAction,
  uploadPageXlsxImportAction,
} from "@/lib/pages.server";
import { parsePageXlsxAoA, type PageXlsxRawRow, type PageXlsxResolvedRow } from "@/lib/page-xlsx-import";
import { cn } from "@/lib/utils";

type PageXlsxUploadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  territories: CatalogRecord[];
  owners: CatalogRecord[];
  onUploaded: () => void | Promise<void>;
};

const NONE = "__none__";

export function PageXlsxUploadDialog({
  open,
  onOpenChange,
  territories,
  owners,
  onUploaded,
}: PageXlsxUploadDialogProps) {
  const [territoryId, setTerritoryId] = useState<number | null>(null);
  const [ownerId, setOwnerId] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rawRows, setRawRows] = useState<PageXlsxRawRow[]>([]);
  const [resolved, setResolved] = useState<PageXlsxResolvedRow[] | null>(null);
  const [skipped, setSkipped] = useState<PageXlsxResolvedRow[] | null>(null);
  const [createdCount, setCreatedCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"check" | "upload" | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  useEffect(() => {
    if (!open) return;
    setTerritoryId(null);
    setOwnerId(null);
    setFileName(null);
    setRawRows([]);
    setResolved(null);
    setSkipped(null);
    setCreatedCount(null);
    setError(null);
    setBusy(null);
    setFileInputKey((key) => key + 1);
  }, [open]);

  const summary = useMemo(() => {
    if (!resolved) return null;
    return {
      ok: resolved.filter((row) => row.status === "ok").length,
      duplicate: resolved.filter((row) => row.status === "duplicate").length,
      invalid: resolved.filter((row) => row.status === "invalid").length,
    };
  }, [resolved]);

  const parseFile = async (file: File) => {
    setError(null);
    setResolved(null);
    setSkipped(null);
    setCreatedCount(null);
    const XLSX = await import("xlsx");
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) throw new Error("Workbook has no sheets.");
    const sheet = workbook.Sheets[sheetName];
    const aoa = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: "",
      raw: false,
    }) as unknown[][];
    const rows = parsePageXlsxAoA(aoa);
    if (!rows.length) throw new Error("No data rows found in the file.");
    setFileName(file.name);
    setRawRows(rows);
  };

  const payload = () => {
    if (territoryId == null || ownerId == null) {
      throw new Error("Select Territory and Owner.");
    }
    if (!rawRows.length) throw new Error("Choose an .xlsx file first.");
    return {
      territoryId,
      ownerId,
      rows: rawRows,
    };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-hidden p-0 sm:rounded-lg">
        <div className="border-b px-6 py-4">
          <DialogHeader>
            <DialogTitle>Upload XLSX</DialogTitle>
            <DialogDescription>
              Columns: first_name, last_name, company, campaign, Url. Territory and
              Owner from the selects below apply to every row. Check list only validates slugs;
              Upload creates pages.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-4 overflow-y-auto px-6 py-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Territory</Label>
              <Select
                value={territoryId != null ? String(territoryId) : NONE}
                onValueChange={(value) =>
                  setTerritoryId(value === NONE ? null : Number(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select territory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Select…</SelectItem>
                  {territories.map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Owner</Label>
              <Select
                value={ownerId != null ? String(ownerId) : NONE}
                onValueChange={(value) => setOwnerId(value === NONE ? null : Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Select…</SelectItem>
                  {owners.map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="xlsx-file">XLSX file</Label>
              <Input
                key={fileInputKey}
                id="xlsx-file"
                type="file"
                accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  void parseFile(file).catch((err) => {
                    setFileName(null);
                    setRawRows([]);
                    setError(err instanceof Error ? err.message : "Failed to read file.");
                  });
                }}
              />
              {fileName ? (
                <p className="text-xs text-muted-foreground">
                  {fileName} · {rawRows.length} row{rawRows.length === 1 ? "" : "s"}
                </p>
              ) : null}
            </div>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          {summary ? (
            <p className="text-sm text-muted-foreground">
              Check result: <span className="text-foreground">{summary.ok} ok</span>
              {summary.duplicate ? (
                <>
                  {" "}
                  · <span className="text-destructive">{summary.duplicate} duplicate</span>
                </>
              ) : null}
              {summary.invalid ? (
                <>
                  {" "}
                  · <span className="text-destructive">{summary.invalid} invalid</span>
                </>
              ) : null}
            </p>
          ) : null}

          {createdCount != null ? (
            <p className="text-sm">
              Created <strong>{createdCount}</strong> page{createdCount === 1 ? "" : "s"}.
              {skipped && skipped.length > 0
                ? ` ${skipped.length} row(s) were not added.`
                : null}
            </p>
          ) : null}

          {resolved && resolved.length > 0 ? (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Row</TableHead>
                    <TableHead>First</TableHead>
                    <TableHead>Last</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resolved.map((row) => (
                    <TableRow
                      key={`${row.rowNumber}-${row.slug}`}
                      className={cn(
                        row.status === "duplicate" || row.status === "invalid"
                          ? "bg-destructive/10"
                          : undefined,
                      )}
                    >
                      <TableCell className="font-mono text-xs">{row.rowNumber}</TableCell>
                      <TableCell>{row.first_name || "—"}</TableCell>
                      <TableCell>{row.last_name || "—"}</TableCell>
                      <TableCell>{row.company || "—"}</TableCell>
                      <TableCell>{row.campaign || "—"}</TableCell>
                      <TableCell className="font-mono text-xs">{row.slug || "—"}</TableCell>
                      <TableCell className="text-xs font-medium uppercase">{row.status}</TableCell>
                      <TableCell className="max-w-[16rem] text-xs text-muted-foreground">
                        {row.reason || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : null}

          {skipped && skipped.length > 0 && createdCount != null ? (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Not added (duplicates / invalid)</h3>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Row</TableHead>
                      <TableHead>First</TableHead>
                      <TableHead>Last</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {skipped.map((row) => (
                      <TableRow key={`skip-${row.rowNumber}`} className="bg-destructive/10">
                        <TableCell className="font-mono text-xs">{row.rowNumber}</TableCell>
                        <TableCell>{row.first_name || "—"}</TableCell>
                        <TableCell>{row.last_name || "—"}</TableCell>
                        <TableCell>{row.company || "—"}</TableCell>
                        <TableCell className="font-mono text-xs">{row.slug || "—"}</TableCell>
                        <TableCell className="text-xs">{row.reason || row.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t px-6 py-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={busy != null}
            onClick={async () => {
              setBusy("check");
              setError(null);
              setSkipped(null);
              setCreatedCount(null);
              try {
                const result = await checkPageXlsxImportAction({ data: payload() });
                if (!result.success) {
                  setError(result.error ?? "Check failed.");
                  setResolved(null);
                  return;
                }
                setResolved(result.rows);
              } catch (err) {
                setError(err instanceof Error ? err.message : "Check failed.");
              } finally {
                setBusy(null);
              }
            }}
          >
            {busy === "check" ? "Checking…" : "Check list"}
          </Button>
          <Button
            type="button"
            disabled={busy != null}
            onClick={async () => {
              setBusy("upload");
              setError(null);
              try {
                const result = await uploadPageXlsxImportAction({ data: payload() });
                if (!result.success) {
                  setError(result.error ?? "Upload failed.");
                  return;
                }
                setResolved(result.rows);
                setSkipped(result.skipped);
                setCreatedCount(result.createdCount);
                await onUploaded();
              } catch (err) {
                setError(err instanceof Error ? err.message : "Upload failed.");
              } finally {
                setBusy(null);
              }
            }}
          >
            {busy === "upload" ? "Uploading…" : "Upload"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
