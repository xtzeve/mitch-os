import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageForm } from "@/components/admin/page-form";
import { fetchPage, savePageAction } from "@/lib/pages.server";
import type { PageFormData } from "@/lib/page-types";

export const Route = createFileRoute("/admin/pages/$pageId")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }, { title: "Admin — Edit Page" }],
  }),
  loader: async ({ params }) => {
    const pageId = Number(params.pageId);
    if (!Number.isFinite(pageId)) throw notFound();
    const form = await fetchPage({ data: { pageId } });
    if (!form) throw notFound();
    return { pageId, form };
  },
  component: AdminEditPage,
});

function AdminEditPage() {
  const { pageId, form } = Route.useLoaderData();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (nextForm: PageFormData) => {
    setSaving(true);
    setError(null);
    try {
      await savePageAction({ data: { pageId, form: nextForm } });
      await navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save page.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <PageForm
        pageId={pageId}
        initialData={form}
        onSave={handleSave}
        saving={saving}
        error={error}
      />
    </div>
  );
}
