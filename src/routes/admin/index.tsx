import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { formatPublishedDate, formatVisitedCell } from "@/lib/page-format";
import {
  PAGE_LIST_DEFAULT_SORT_BY,
  PAGE_LIST_DEFAULT_SORT_DIR,
  PAGE_LIST_PER_PAGE_OPTIONS,
  PAGE_LIST_SORT_FIELDS,
  type PageListPerPage,
  type PageListSortDir,
  type PageListSortField,
} from "@/lib/page-types";
import { deletePageAction, fetchPages } from "@/lib/pages.server";
import { PageVisitsDialog } from "@/components/admin/page-visits-dialog";
import { PageXlsxUploadDialog } from "@/components/admin/page-xlsx-upload-dialog";
import { PAGE_XLSX_EXPORT_HEADERS, pagesToXlsxExportRows } from "@/lib/page-xlsx-import";
import { cn } from "@/lib/utils";

const DEFAULT_PER_PAGE: PageListPerPage = 20;
const ALL_VALUE = "__all__";

type PagesSearch = {
  q?: string;
  page?: number;
  perPage?: PageListPerPage;
  lastName?: string;
  company?: string;
  territoryId?: number;
  ownerId?: number;
  campaignId?: number;
  publishedFrom?: string;
  publishedTo?: string;
  sortBy?: PageListSortField;
  sortDir?: PageListSortDir;
};

function normalizePerPage(value: unknown): PageListPerPage {
  const n = Number(value);
  return (PAGE_LIST_PER_PAGE_OPTIONS as readonly number[]).includes(n)
    ? (n as PageListPerPage)
    : DEFAULT_PER_PAGE;
}

function normalizeSortBy(value: unknown): PageListSortField {
  return (PAGE_LIST_SORT_FIELDS as readonly string[]).includes(String(value))
    ? (value as PageListSortField)
    : PAGE_LIST_DEFAULT_SORT_BY;
}

function normalizeSortDir(value: unknown): PageListSortDir {
  return value === "asc" || value === "desc" ? value : PAGE_LIST_DEFAULT_SORT_DIR;
}

function optionalPositiveInt(value: unknown): number | undefined {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : undefined;
}

function optionalDate(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : undefined;
}

function sortSearchParams(sortBy: PageListSortField, sortDir: PageListSortDir) {
  const isDefault =
    sortBy === PAGE_LIST_DEFAULT_SORT_BY && sortDir === PAGE_LIST_DEFAULT_SORT_DIR;
  return {
    sortBy: isDefault ? undefined : sortBy,
    sortDir: isDefault ? undefined : sortDir,
  };
}

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }, { title: "Admin — Pages" }],
  }),
  validateSearch: (search: Record<string, unknown>): PagesSearch => {
    const result: PagesSearch = {};
    if (typeof search.q === "string" && search.q.trim()) result.q = search.q;
    const page = Math.max(1, Math.floor(Number(search.page)) || 1);
    if (page > 1) result.page = page;
    const perPage = normalizePerPage(search.perPage);
    if (perPage !== DEFAULT_PER_PAGE) result.perPage = perPage;
    if (typeof search.lastName === "string" && search.lastName.trim()) {
      result.lastName = search.lastName.trim();
    }
    if (typeof search.company === "string" && search.company.trim()) {
      result.company = search.company.trim();
    }
    const territoryId = optionalPositiveInt(search.territoryId);
    if (territoryId) result.territoryId = territoryId;
    const ownerId = optionalPositiveInt(search.ownerId);
    if (ownerId) result.ownerId = ownerId;
    const campaignId = optionalPositiveInt(search.campaignId);
    if (campaignId) result.campaignId = campaignId;
    const publishedFrom = optionalDate(search.publishedFrom);
    if (publishedFrom) result.publishedFrom = publishedFrom;
    const publishedTo = optionalDate(search.publishedTo);
    if (publishedTo) result.publishedTo = publishedTo;
    const sortBy = normalizeSortBy(search.sortBy);
    const sortDir = normalizeSortDir(search.sortDir);
    if (sortBy !== PAGE_LIST_DEFAULT_SORT_BY || sortDir !== PAGE_LIST_DEFAULT_SORT_DIR) {
      result.sortBy = sortBy;
      result.sortDir = sortDir;
    }
    return result;
  },
  loaderDeps: ({ search }) => ({
    search: search.q?.trim() ?? "",
    page: search.page ?? 1,
    perPage: search.perPage ?? DEFAULT_PER_PAGE,
    lastName: search.lastName ?? null,
    company: search.company ?? null,
    territoryId: search.territoryId ?? null,
    ownerId: search.ownerId ?? null,
    campaignId: search.campaignId ?? null,
    publishedFrom: search.publishedFrom ?? null,
    publishedTo: search.publishedTo ?? null,
    sortBy: search.sortBy ?? PAGE_LIST_DEFAULT_SORT_BY,
    sortDir: search.sortDir ?? PAGE_LIST_DEFAULT_SORT_DIR,
  }),
  loader: async ({ deps }) => fetchPages({ data: deps }),
  component: AdminPagesList,
});

function AdminPagesList() {
  const {
    items: pages,
    total,
    page,
    perPage,
    totalPages,
    sortBy,
    sortDir,
    territories,
    owners,
    campaigns,
  } = Route.useLoaderData();
  const search = Route.useSearch();
  const query = search.q ?? "";
  const lastNameFilter = search.lastName ?? "";
  const companyFilter = search.company ?? "";
  const navigate = useNavigate({ from: Route.fullPath });
  const router = useRouter();
  const [busyId, setBusyId] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState(query);
  const [lastNameInput, setLastNameInput] = useState(lastNameFilter);
  const [companyInput, setCompanyInput] = useState(companyFilter);
  const [visitsPageId, setVisitsPageId] = useState<number | null>(null);
  const [visitsPageLabel, setVisitsPageLabel] = useState("");
  const [xlsxOpen, setXlsxOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set());

  const pageIds = useMemo(() => pages.map((row) => row.page_id), [pages]);
  const selectedOnPageCount = pageIds.filter((id) => selectedIds.has(id)).length;
  const allOnPageSelected = pageIds.length > 0 && selectedOnPageCount === pageIds.length;
  const someOnPageSelected = selectedOnPageCount > 0 && !allOnPageSelected;

  useEffect(() => {
    setSelectedIds(new Set());
  }, [page, perPage, query, lastNameFilter, companyFilter, sortBy, sortDir, search.territoryId, search.ownerId, search.campaignId, search.publishedFrom, search.publishedTo]);

  const toggleRowSelected = (pageId: number, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(pageId);
      else next.delete(pageId);
      return next;
    });
  };

  const toggleSelectAllOnPage = (checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const id of pageIds) {
        if (checked) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  };

  const selectedPages = useMemo(
    () => pages.filter((row) => selectedIds.has(row.page_id)),
    [pages, selectedIds],
  );

  const exportSelectedXlsx = async () => {
    if (selectedPages.length === 0) return;
    const count = selectedPages.length;
    const fileName = `landing-pages-export-${new Date().toISOString().slice(0, 10)}.xlsx`;
    try {
      const XLSX = await import("xlsx");
      const origin =
        typeof window !== "undefined" ? window.location.origin : "https://mitch-os.com";
      const rows = pagesToXlsxExportRows(selectedPages, origin);
      const sheet = XLSX.utils.json_to_sheet(rows, {
        header: [...PAGE_XLSX_EXPORT_HEADERS],
      });
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, sheet, "Sheet1");
      XLSX.writeFile(workbook, fileName);
      setSelectedIds(new Set());
      toast.success("Export complete", {
        description: `Downloaded ${fileName} (${count} row${count === 1 ? "" : "s"}).`,
      });
    } catch {
      toast.error("Export failed", {
        description: "Could not create the XLSX file. Try again.",
      });
    }
  };

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    setLastNameInput(lastNameFilter);
  }, [lastNameFilter]);

  useEffect(() => {
    setCompanyInput(companyFilter);
  }, [companyFilter]);

  useEffect(() => {
    const trimmed = searchInput.trim();
    if (trimmed === query) return;

    const timer = window.setTimeout(() => {
      void navigate({
        search: (prev) => ({
          ...prev,
          q: trimmed || undefined,
          page: undefined,
        }),
        replace: true,
      });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [navigate, query, searchInput]);

  useEffect(() => {
    const trimmed = lastNameInput.trim();
    if (trimmed === lastNameFilter) return;

    const timer = window.setTimeout(() => {
      void navigate({
        search: (prev) => ({
          ...prev,
          lastName: trimmed || undefined,
          page: undefined,
        }),
        replace: true,
      });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [lastNameFilter, lastNameInput, navigate]);

  useEffect(() => {
    const trimmed = companyInput.trim();
    if (trimmed === companyFilter) return;

    const timer = window.setTimeout(() => {
      void navigate({
        search: (prev) => ({
          ...prev,
          company: trimmed || undefined,
          page: undefined,
        }),
        replace: true,
      });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [companyFilter, companyInput, navigate]);

  const toggleSort = (field: PageListSortField) => {
    const nextDir: PageListSortDir =
      sortBy === field ? (sortDir === "asc" ? "desc" : "asc") : "desc";
    void navigate({
      search: (prev) => ({
        ...prev,
        ...sortSearchParams(field, nextDir),
        page: undefined,
      }),
    });
  };

  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const hasFilters = Boolean(
    query.trim() ||
      lastNameFilter ||
      companyFilter ||
      search.territoryId ||
      search.ownerId ||
      search.campaignId ||
      search.publishedFrom ||
      search.publishedTo,
  );
  const emptyMessage = hasFilters
    ? "No pages match your filters."
    : "No pages yet. Create the first one.";

  const resetFilters = () => {
    setSearchInput("");
    setLastNameInput("");
    setCompanyInput("");
    void navigate({
      search: (prev) => ({
        sortBy: prev.sortBy,
        sortDir: prev.sortDir,
        perPage: prev.perPage,
      }),
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Landing Pages</h1>
          <p className="text-sm text-muted-foreground">Manage personalized dossier pages.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedPages.length > 0 ? (
            <Button type="button" variant="secondary" onClick={() => void exportSelectedXlsx()}>
              Export XLSX ({selectedPages.length})
            </Button>
          ) : null}
          <Button type="button" variant="outline" onClick={() => setXlsxOpen(true)}>
            Upload xlsx
          </Button>
          <Button asChild>
            <Link to="/admin/pages/new">Create New Page</Link>
          </Button>
        </div>
      </div>

      <div className="mb-4 rounded-lg border bg-background p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
            <span className="text-xs font-medium text-muted-foreground">Search</span>
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Name, company or slug…"
              aria-label="Search pages by name, company or slug"
            />
          </div>
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Last name</span>
            <Input
              value={lastNameInput}
              onChange={(event) => setLastNameInput(event.target.value)}
              placeholder="Last name…"
              aria-label="Filter by last name"
            />
          </div>
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Company</span>
            <Input
              value={companyInput}
              onChange={(event) => setCompanyInput(event.target.value)}
              placeholder="Company…"
              aria-label="Filter by company"
            />
          </div>
          <FilterSelect
            label="Territory"
            value={search.territoryId}
            options={territories}
            onChange={(territoryId) => {
              void navigate({
                search: (prev) => ({ ...prev, territoryId, page: undefined }),
              });
            }}
          />
          <FilterSelect
            label="Owner"
            value={search.ownerId}
            options={owners}
            onChange={(ownerId) => {
              void navigate({
                search: (prev) => ({ ...prev, ownerId, page: undefined }),
              });
            }}
          />

          <FilterSelect
            label="Campaign"
            value={search.campaignId}
            options={campaigns}
            onChange={(campaignId) => {
              void navigate({
                search: (prev) => ({ ...prev, campaignId, page: undefined }),
              });
            }}
          />
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Published from</span>
            <Input
              type="date"
              value={search.publishedFrom ?? ""}
              onChange={(event) => {
                const publishedFrom = optionalDate(event.target.value);
                void navigate({
                  search: (prev) => ({ ...prev, publishedFrom, page: undefined }),
                });
              }}
            />
          </div>
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Published to</span>
            <Input
              type="date"
              value={search.publishedTo ?? ""}
              onChange={(event) => {
                const publishedTo = optionalDate(event.target.value);
                void navigate({
                  search: (prev) => ({ ...prev, publishedTo, page: undefined }),
                });
              }}
            />
          </div>
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Per page</span>
            <Select
              value={String(perPage)}
              onValueChange={(value) => {
                const next = normalizePerPage(value);
                void navigate({
                  search: (prev) => ({
                    ...prev,
                    perPage: next === DEFAULT_PER_PAGE ? undefined : next,
                    page: undefined,
                  }),
                });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_LIST_PER_PAGE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end sm:col-span-2 lg:col-span-2">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={!hasFilters}
              onClick={resetFilters}
            >
              Reset filters
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 pr-0">
                <Checkbox
                  checked={allOnPageSelected ? true : someOnPageSelected ? "indeterminate" : false}
                  onCheckedChange={(value) => toggleSelectAllOnPage(value === true)}
                  aria-label="Select all on this page"
                  disabled={pages.length === 0}
                />
              </TableHead>
              <SortableHead
                label="ID"
                field="id"
                activeField={sortBy}
                direction={sortDir}
                onSort={toggleSort}
              />
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Territory</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Campaign</TableHead>
              <SortableHead
                label="Published"
                field="published"
                activeField={sortBy}
                direction={sortDir}
                onSort={toggleSort}
              />
              <SortableHead
                label="Visited"
                field="visited"
                activeField={sortBy}
                direction={sortDir}
                onSort={toggleSort}
              />
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="py-8 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              pages.map((pageRow) => (
                <TableRow key={pageRow.page_id}>
                  <TableCell className="pr-0">
                    <Checkbox
                      checked={selectedIds.has(pageRow.page_id)}
                      onCheckedChange={(value) =>
                        toggleRowSelected(pageRow.page_id, value === true)
                      }
                      aria-label={`Select page #${pageRow.page_id}`}
                    />
                  </TableCell>
                  <TableCell>{pageRow.page_id}</TableCell>
                  <TableCell>{pageRow.first_name || "—"}</TableCell>
                  <TableCell>{pageRow.last_name || "—"}</TableCell>
                  <TableCell>{pageRow.company || "—"}</TableCell>
                  <TableCell>{pageRow.slug || "—"}</TableCell>
                  <TableCell>{pageRow.territory_name || "—"}</TableCell>
                  <TableCell>{pageRow.owner_name || "—"}</TableCell>
                  <TableCell>{pageRow.campaign_name || "—"}</TableCell>
                  <TableCell>{formatPublishedDate(pageRow.published)}</TableCell>
                  <TableCell>
                    {formatVisitedCell(pageRow.visited, pageRow.last_visited)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setVisitsPageId(pageRow.page_id);
                          setVisitsPageLabel(
                            pageRow.first_name || pageRow.slug || `#${pageRow.page_id}`,
                          );
                        }}
                      >
                        Visits
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          to="/admin/pages/$pageId"
                          params={{ pageId: String(pageRow.page_id) }}
                        >
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={busyId === pageRow.page_id}
                        onClick={async () => {
                          if (!window.confirm(`Delete page #${pageRow.page_id}?`)) return;
                          setBusyId(pageRow.page_id);
                          try {
                            await deletePageAction({ data: { pageId: pageRow.page_id } });
                            await router.invalidate();
                          } finally {
                            setBusyId(null);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {total === 0 ? "0 results" : `Showing ${from}–${to} of ${total}`}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => {
              void navigate({
                search: (prev) => ({
                  ...prev,
                  page: page <= 2 ? undefined : page - 1,
                }),
              });
            }}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground tabular-nums">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => {
              void navigate({
                search: (prev) => ({
                  ...prev,
                  page: page + 1,
                }),
              });
            }}
          >
            Next
          </Button>
        </div>
      </div>

      <PageVisitsDialog
        pageId={visitsPageId}
        pageLabel={visitsPageLabel}
        open={visitsPageId != null}
        onOpenChange={(open) => {
          if (!open) setVisitsPageId(null);
        }}
      />
      <PageXlsxUploadDialog
        open={xlsxOpen}
        onOpenChange={setXlsxOpen}
        territories={territories}
        owners={owners}
        onUploaded={async () => {
          await router.invalidate();
        }}
      />
    </div>
  );
}

function SortableHead({
  label,
  field,
  activeField,
  direction,
  onSort,
}: {
  label: string;
  field: PageListSortField;
  activeField: PageListSortField;
  direction: PageListSortDir;
  onSort: (field: PageListSortField) => void;
}) {
  const active = activeField === field;
  const Icon = !active ? ArrowUpDown : direction === "asc" ? ArrowUp : ArrowDown;

  return (
    <TableHead>
      <button
        type="button"
        onClick={() => onSort(field)}
        className={cn(
          "inline-flex items-center gap-1 font-medium hover:text-foreground",
          active ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {label}
        <Icon className="h-3.5 w-3.5" />
      </button>
    </TableHead>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value?: number;
  options: Array<{ id: number; name: string }>;
  onChange: (value: number | undefined) => void;
}) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Select
        value={value != null ? String(value) : ALL_VALUE}
        onValueChange={(next) => {
          onChange(next === ALL_VALUE ? undefined : Number(next));
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>All</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.id} value={String(option.id)}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
