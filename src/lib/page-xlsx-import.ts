import { normalizeSlug, validateFirstName, validateSlug } from "@/lib/page-validation";

export type PageXlsxRawRow = {
  rowNumber: number;
  first_name: string;
  last_name: string;
  company: string;
  campaign: string;
  url: string;
};

export type PageXlsxResolvedRow = PageXlsxRawRow & {
  slug: string;
  campaign_id: number | null;
  status: "ok" | "duplicate" | "invalid";
  reason: string | null;
};

function cellString(value: unknown): string {
  if (value == null) return "";
  return String(value).trim();
}

function headerKey(value: unknown): string {
  return cellString(value)
    .toLowerCase()
    .replace(/[\s_]+/g, "")
    .replace(/[^a-z]/g, "");
}

/** Accepts first_name and common aliases (incl. legacy misspelled header). */
function mapHeaderIndex(headers: unknown[]) {
  const map: Partial<Record<"first_name" | "last_name" | "company" | "campaign" | "url", number>> =
    {};
  headers.forEach((header, index) => {
    const key = headerKey(header);
    if (key === "firstname" || key === "firtsname" || key === "name") map.first_name = index;
    else if (key === "lastname" || key === "surname") map.last_name = index;
    else if (key === "company" || key === "organisation" || key === "organization") {
      map.company = index;
    } else if (key === "campaign") map.campaign = index;
    else if (key === "url" || key === "link" || key === "linkedin") map.url = index;
  });
  return map;
}

export function parsePageXlsxAoA(rows: unknown[][]): PageXlsxRawRow[] {
  if (!rows.length) return [];
  const headerRow = rows[0] ?? [];
  const cols = mapHeaderIndex(headerRow);
  if (cols.first_name == null) {
    throw new Error('Missing "first_name" column.');
  }

  const out: PageXlsxRawRow[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i] ?? [];
    const first_name = cellString(row[cols.first_name]);
    const last_name = cols.last_name != null ? cellString(row[cols.last_name]) : "";
    const company = cols.company != null ? cellString(row[cols.company]) : "";
    const campaign = cols.campaign != null ? cellString(row[cols.campaign]) : "";
    const url = cols.url != null ? cellString(row[cols.url]) : "";
    if (!first_name && !last_name && !company && !campaign && !url) continue;
    out.push({
      rowNumber: i + 1,
      first_name,
      last_name,
      company,
      campaign,
      url,
    });
  }
  return out;
}

function buildSlugCandidate(firstName: string, lastName?: string) {
  if (lastName?.trim()) {
    return normalizeSlug(`${firstName.trim()} ${lastName.trim()}`);
  }
  return normalizeSlug(firstName);
}

/**
 * Slug rules:
 * 1) first_name
 * 2) if taken → first_name + last_name
 * 3) if still taken → duplicate (highlighted), no further inventing
 */
export function resolvePageXlsxRows(input: {
  rows: PageXlsxRawRow[];
  existingSlugs: Iterable<string>;
  campaignNameToId: Map<string, number>;
}): PageXlsxResolvedRow[] {
  const taken = new Set(
    [...input.existingSlugs].map((slug) => normalizeSlug(slug)).filter(Boolean),
  );
  const batchUsed = new Set<string>();

  return input.rows.map((row) => {
    const firstError = validateFirstName(row.first_name);
    if (firstError) {
      return {
        ...row,
        slug: "",
        campaign_id: null,
        status: "invalid" as const,
        reason: firstError,
      };
    }

    const campaignKey = row.campaign.trim().toLowerCase();
    const campaign_id = campaignKey
      ? (input.campaignNameToId.get(campaignKey) ?? null)
      : null;

    let slug = buildSlugCandidate(row.first_name);
    const baseSlug = slug;
    const baseTaken = taken.has(slug) || batchUsed.has(slug);
    let appendedLastName = false;

    if (baseTaken) {
      const withLast = buildSlugCandidate(row.first_name, row.last_name);
      if (withLast && withLast !== slug) {
        slug = withLast;
        appendedLastName = true;
      }
    }

    const slugError = validateSlug(slug);
    if (slugError) {
      return {
        ...row,
        slug,
        campaign_id,
        status: "invalid",
        reason: slugError,
      };
    }

    if (taken.has(slug) || batchUsed.has(slug)) {
      return {
        ...row,
        slug,
        campaign_id,
        status: "duplicate",
        reason: appendedLastName
          ? `Slug "${slug}" already exists (even after appending last name to "${baseSlug}").`
          : baseTaken && !row.last_name.trim()
            ? `Slug "${slug}" already exists. Add a last name to differentiate.`
            : `Slug "${slug}" already exists.`,
      };
    }

    batchUsed.add(slug);
    const notes: string[] = [];
    if (appendedLastName) {
      notes.push(`Used "${slug}" because "${baseSlug}" already exists.`);
    }
    if (campaignKey && campaign_id == null) {
      notes.push(`Campaign "${row.campaign}" not found — will be saved without campaign.`);
    }
    return {
      ...row,
      slug,
      campaign_id,
      status: "ok",
      reason: notes.length ? notes.join(" ") : null,
    };
  });
}

/** Same headers as the sample import file. */
export const PAGE_XLSX_EXPORT_HEADERS = [
  "first_name",
  "last_name",
  "company",
  "campaign",
  "Url",
] as const;

export function buildLandingPageUrl(origin: string, slug: string) {
  const base = origin.replace(/\/+$/, "");
  const cleanSlug = slug.replace(/^\/+/, "");
  return `${base}/${cleanSlug}`;
}

export type PageXlsxExportSource = {
  first_name: string;
  last_name: string | null;
  company: string | null;
  campaign_name: string | null;
  slug: string;
};

export function pagesToXlsxExportRows(
  pages: PageXlsxExportSource[],
  origin: string,
): Array<Record<(typeof PAGE_XLSX_EXPORT_HEADERS)[number], string>> {
  return pages.map((page) => ({
    first_name: page.first_name ?? "",
    last_name: page.last_name ?? "",
    company: page.company ?? "",
    campaign: page.campaign_name ?? "",
    Url: buildLandingPageUrl(origin, page.slug),
  }));
}
