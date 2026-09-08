export type PageDescriptionFields = {
  greeting: string;
  why_body: string;
  why_claim: string;
  preview_intro: string;
  four_thing_1: string;
  four_thing_2: string;
  four_thing_3: string;
  four_thing_4: string;
  structure_intro: string;
  mechanism_p1: string;
  mechanism_p2: string;
  mechanism_p3: string;
  unseen_p1: string;
  unseen_p2: string;
  cta_phone: string;
  cta_label: string;
  cta_alt: string;
};

export type PageDescriptionRecord = PageDescriptionFields & {
  page_id: number;
  language_id: number;
};

export type PageRecord = {
  page_id: number;
  first_name: string;
  slug: string;
  territory_id: number | null;
  owner_id: number | null;
  campaign_id: number | null;
  territory_name: string | null;
  owner_name: string | null;
  campaign_name: string | null;
  published: string | null;
  visited: number;
  last_visited: string | null;
  date_added: string;
  date_modified: string;
};

export type PageWithDescriptions = PageRecord & {
  descriptions: Record<number, PageDescriptionRecord>;
};

export type LanguageRecord = {
  language_id: number;
  code: string;
  name: string;
  status: number;
};

export const LANGUAGE_EN = 1;
export const LANGUAGE_DE = 2;

export const PAGE_LIST_PER_PAGE_OPTIONS = [10, 20, 50, 100] as const;
export type PageListPerPage = (typeof PAGE_LIST_PER_PAGE_OPTIONS)[number];

export const PAGE_LIST_SORT_FIELDS = ["id", "published", "visited"] as const;
export type PageListSortField = (typeof PAGE_LIST_SORT_FIELDS)[number];
export type PageListSortDir = "asc" | "desc";

export const PAGE_LIST_DEFAULT_SORT_BY: PageListSortField = "visited";
export const PAGE_LIST_DEFAULT_SORT_DIR: PageListSortDir = "desc";

export const RESERVED_SLUGS = new Set([
  "admin",
  "de",
  "api",
  "assets",
  "privacy-policy",
  "legal-notice",
  "favicon.ico",
  "robots.txt",
]);

export const PAGE_DESCRIPTION_COLUMNS = [
  "greeting",
  "why_body",
  "why_claim",
  "preview_intro",
  "four_thing_1",
  "four_thing_2",
  "four_thing_3",
  "four_thing_4",
  "structure_intro",
  "mechanism_p1",
  "mechanism_p2",
  "mechanism_p3",
  "unseen_p1",
  "unseen_p2",
  "cta_phone",
  "cta_label",
  "cta_alt",
] as const satisfies ReadonlyArray<keyof PageDescriptionFields>;

export type PageFormDescription = PageDescriptionFields;

export type PageFormData = {
  first_name: string;
  slug: string;
  territory_id: number | null;
  owner_id: number | null;
  campaign_id: number | null;
  published: string | null;
  page_description: Record<number, PageFormDescription>;
};
