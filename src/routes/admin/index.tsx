import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { PAGE_LIST_PER_PAGE_OPTIONS, type PageListPerPage } from "@/lib/page-types";
import { deletePageAction, fetchPages } from "@/lib/pages.server";

const DEFAULT_PER_PAGE: PageListPerPage = 20;
const ALL_VALUE = "__all__";

type PagesSearch = {
  q?: string;
  page?: number;
  perPage?: PageListPerPage;
  territoryId?: number;
  ownerId?: number;
  campaignId?: number;
  publishedFrom?: string;
  publishedTo?: string;
};

function normalizePerPage(value: unknown): PageListPerPage {
  const n = Number(value);
  return (PAGE_LIST_PER_PAGE_OPTIONS as readonly number[]).includes(n)
    ? (n as PageListPerPage)
    : DEFAULT_PER_PAGE;
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
    return result;
  },
  loaderDeps: ({ search }) => ({
    search: search.q?.trim() ?? "",
    page: search.page ?? 1,
    perPage: search.perPage ?? DEFAULT_PER_PAGE,
    territoryId: search.territoryId ?? null,
    ownerId: search.ownerId ?? null,
    campaignId: search.campaignId ?? null,
    publishedFrom: search.publishedFrom ?? null,
    publishedTo: search.publishedTo ?? null,
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
    territories,
    owners,
    campaigns,
  } = Route.useLoaderData();
  const search = Route.useSearch();
  const query = search.q ?? "";
  const navigate = useNavigate({ from: Route.fullPath });
  const router = useRouter();
  const [busyId, setBusyId] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

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

  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const hasFilters = Boolean(
    query.trim() ||
      search.territoryId ||
      search.ownerId ||
      search.campaignId ||
      search.publishedFrom ||
      search.publishedTo,
  );
  const emptyMessage = hasFilters
    ? "No pages match your filters."
    : "No pages yet. Create the first one.";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Landing Pages</h1>
          <p className="text-sm text-muted-foreground">Manage personalized dossier pages.</p>
        </div>
        <Button asChild>
          <Link to="/admin/pages/new">Create New Page</Link>
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <Input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search by name or slug…"
          className="max-w-sm"
          aria-label="Search pages by name or slug"
        />

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

        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Published from</span>
          <Input
            type="date"
            className="w-[10.5rem]"
            value={search.publishedFrom ?? ""}
            onChange={(event) => {
              const publishedFrom = optionalDate(event.target.value);
              void navigate({
                search: (prev) => ({ ...prev, publishedFrom, page: undefined }),
              });
            }}
          />
        </div>
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Published to</span>
          <Input
            type="date"
            className="w-[10.5rem]"
            value={search.publishedTo ?? ""}
            onChange={(event) => {
              const publishedTo = optionalDate(event.target.value);
              void navigate({
                search: (prev) => ({ ...prev, publishedTo, page: undefined }),
              });
            }}
          />
        </div>

        <div className="flex items-center gap-2 pb-0.5">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Per page</span>
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
            <SelectTrigger className="w-[5.5rem]">
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
      </div>

      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Territory</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Visited</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-8 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              pages.map((pageRow) => (
                <TableRow key={pageRow.page_id}>
                  <TableCell>{pageRow.page_id}</TableCell>
                  <TableCell>{pageRow.first_name || "—"}</TableCell>
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
    </div>
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
    <div className="space-y-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <Select
        value={value != null ? String(value) : ALL_VALUE}
        onValueChange={(next) => {
          onChange(next === ALL_VALUE ? undefined : Number(next));
        }}
      >
        <SelectTrigger className="w-[9.5rem]">
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
