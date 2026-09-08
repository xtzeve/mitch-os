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
    const data = await fetchPage({ data: { pageId } });
    if (!data) throw notFound();
    return { pageId, ...data };
  },
  component: AdminEditPage,
});

function AdminEditPage() {
  const { pageId, form, territories, owners, campaigns } = Route.useLoaderData();
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
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageForm
        pageId={pageId}
        initialData={form}
        territories={territories}
        owners={owners}
        campaigns={campaigns}
        onSave={handleSave}
        saving={saving}
        error={error}
      />
    </div>
  );
}
