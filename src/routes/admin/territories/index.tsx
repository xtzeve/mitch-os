import { createFileRoute, useRouter } from "@tanstack/react-router";
import { CatalogCrudPage } from "@/components/admin/catalog-crud-page";
import { fetchCatalog } from "@/lib/pages.server";

export const Route = createFileRoute("/admin/territories/")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }, { title: "Admin — Territories" }],
  }),
  loader: async () => fetchCatalog({ data: { kind: "territory" } }),
  component: TerritoriesPage,
});

function TerritoriesPage() {
  const items = Route.useLoaderData();
  const router = useRouter();
  return (
    <CatalogCrudPage
      kind="territory"
      items={items}
      onChanged={async () => {
        await router.invalidate();
      }}
    />
  );
}
