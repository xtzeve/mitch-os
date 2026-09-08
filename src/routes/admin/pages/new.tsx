import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { emptyFormData, PageForm } from "@/components/admin/page-form";
import { createPageAction, fetchNewPageForm } from "@/lib/pages.server";
import type { PageFormData } from "@/lib/page-types";

export const Route = createFileRoute("/admin/pages/new")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }, { title: "Admin — New Page" }],
  }),
  loader: async () => fetchNewPageForm(),
  component: AdminNewPage,
});

function AdminNewPage() {
  const { territories, owners, campaigns } = Route.useLoaderData();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (nextForm: PageFormData) => {
    setSaving(true);
    setError(null);
    try {
      await createPageAction({ data: { form: nextForm } });
      await navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create page.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageForm
        pageId={null}
        initialData={emptyFormData()}
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
