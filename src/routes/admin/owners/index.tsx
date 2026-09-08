import { createFileRoute, useRouter } from "@tanstack/react-router";
import { CatalogCrudPage } from "@/components/admin/catalog-crud-page";
import { fetchCatalog } from "@/lib/pages.server";

export const Route = createFileRoute("/admin/owners/")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }, { title: "Admin — Owners" }],
  }),
  loader: async () => fetchCatalog({ data: { kind: "owner" } }),
  component: OwnersPage,
});

function OwnersPage() {
  const items = Route.useLoaderData();
  const router = useRouter();
  return (
    <CatalogCrudPage
      kind="owner"
      items={items}
      onChanged={async () => {
        await router.invalidate();
      }}
    />
  );
}
