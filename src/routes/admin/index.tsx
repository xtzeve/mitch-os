import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PAGE_STATUS_PUBLISHED } from "@/lib/page-types";
import { adminLogoutAction, createPageAction, deletePageAction, fetchPages } from "@/lib/pages.server";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }, { title: "Admin — Pages" }],
  }),
  loader: async () => fetchPages(),
  component: AdminPagesList,
});

function AdminPagesList() {
  const pages = Route.useLoaderData();
  const navigate = useNavigate();
  const router = useRouter();
  const [busyId, setBusyId] = useState<number | null>(null);

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

      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Modified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No pages yet. Create the first one.
                </TableCell>
              </TableRow>
            ) : (
              pages.map((page) => (
                <TableRow key={page.page_id}>
                  <TableCell>{page.page_id}</TableCell>
                  <TableCell>{page.first_name || "—"}</TableCell>
                  <TableCell>{page.slug || "—"}</TableCell>
                  <TableCell>
                    {page.status === PAGE_STATUS_PUBLISHED ? "Published" : "Draft"}
                  </TableCell>
                  <TableCell>{page.date_modified}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/admin/pages/$pageId" params={{ pageId: String(page.page_id) }}>
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={busyId === page.page_id}
                        onClick={async () => {
                          if (!window.confirm(`Delete page #${page.page_id}?`)) return;
                          setBusyId(page.page_id);
                          try {
                            await deletePageAction({ data: { pageId: page.page_id } });
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
    </div>
  );
}
