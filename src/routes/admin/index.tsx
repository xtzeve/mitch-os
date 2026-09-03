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
import {
  PAGE_LIST_PER_PAGE_OPTIONS,
  PAGE_STATUS_PUBLISHED,
  type PageListPerPage,
} from "@/lib/page-types";
import { adminLogoutAction, createPageAction, deletePageAction, fetchPages } from "@/lib/pages.server";

const DEFAULT_PER_PAGE: PageListPerPage = 20;

type PagesSearch = {
  q?: string;
  page?: number;
  perPage?: PageListPerPage;
};

function normalizePerPage(value: unknown): PageListPerPage {
  const n = Number(value);
  return (PAGE_LIST_PER_PAGE_OPTIONS as readonly number[]).includes(n)
    ? (n as PageListPerPage)
    : DEFAULT_PER_PAGE;
}

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }, { title: "Admin — Pages" }],
  }),
  validateSearch: (search: Record<string, unknown>): PagesSearch => {
    const result: PagesSearch = {};
    if (typeof search.q === "string" && search.q.trim()) {
      result.q = search.q;
    }
    const page = Math.max(1, Math.floor(Number(search.page)) || 1);
    if (page > 1) result.page = page;
    const perPage = normalizePerPage(search.perPage);
    if (perPage !== DEFAULT_PER_PAGE) result.perPage = perPage;
    return result;
  },
  loaderDeps: ({ search }) => ({
    search: search.q?.trim() ?? "",
    page: search.page ?? 1,
    perPage: search.perPage ?? DEFAULT_PER_PAGE,
  }),
  loader: async ({ deps }) => fetchPages({ data: deps }),
  component: AdminPagesList,
});

function AdminPagesList() {
  const { items: pages, total, page, perPage, totalPages } = Route.useLoaderData();
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
  const emptyMessage = query.trim()
    ? "No pages match your search."
    : "No pages yet. Create the first one.";

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Landing Pages</h1>
          <p className="text-sm text-muted-foreground">Manage personalized dossier pages.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/admin/users">Users</Link>
          </Button>
          <Button
            onClick={async () => {
              const { pageId } = await createPageAction();
              await navigate({ to: "/admin/pages/$pageId", params: { pageId: String(pageId) } });
            }}
          >
            Create New Page
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              await adminLogoutAction();
              await navigate({ to: "/admin/login" });
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search by name or slug…"
          className="max-w-sm"
          aria-label="Search pages by name or slug"
        />
        <div className="flex items-center gap-2">
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
              <TableHead>Status</TableHead>
              <TableHead>Visited</TableHead>
              <TableHead>Modified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              pages.map((pageRow) => (
                <TableRow key={pageRow.page_id}>
                  <TableCell>{pageRow.page_id}</TableCell>
                  <TableCell>{pageRow.first_name || "—"}</TableCell>
                  <TableCell>{pageRow.slug || "—"}</TableCell>
                  <TableCell>
                    {pageRow.status === PAGE_STATUS_PUBLISHED ? "Published" : "Draft"}
                  </TableCell>
                  <TableCell>{pageRow.visited}</TableCell>
                  <TableCell>{pageRow.date_modified}</TableCell>
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
