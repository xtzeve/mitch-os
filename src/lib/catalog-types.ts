export type CatalogKind = "territory" | "owner" | "campaign";

export type CatalogRecord = {
  id: number;
  name: string;
  date_added: string;
  date_modified: string;
};

export const CATALOG_META = {
  territory: {
    table: "territory",
    idColumn: "territory_id",
    label: "Territory",
    labelPlural: "Territories",
  },
  owner: {
    table: "owner",
    idColumn: "owner_id",
    label: "Owner",
    labelPlural: "Owners",
  },
  campaign: {
    table: "campaign",
    idColumn: "campaign_id",
    label: "Campaign",
    labelPlural: "Campaigns",
  },
} as const satisfies Record<
  CatalogKind,
  { table: string; idColumn: string; label: string; labelPlural: string }
>;
