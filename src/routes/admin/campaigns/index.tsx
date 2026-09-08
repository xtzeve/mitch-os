import { createFileRoute, useRouter } from "@tanstack/react-router";
import { CatalogCrudPage } from "@/components/admin/catalog-crud-page";
import { fetchCatalog } from "@/lib/pages.server";

export const Route = createFileRoute("/admin/campaigns/")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }, { title: "Admin — Campaigns" }],
  }),
  loader: async () => fetchCatalog({ data: { kind: "campaign" } }),
  component: CampaignsPage,
});

function CampaignsPage() {
  const items = Route.useLoaderData();
  const router = useRouter();
  return (
    <CatalogCrudPage
      kind="campaign"
      items={items}
      onChanged={async () => {
        await router.invalidate();
      }}
    />
  );
}
