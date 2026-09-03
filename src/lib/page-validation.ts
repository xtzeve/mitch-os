import { RESERVED_SLUGS } from "@/lib/page-types";

/** German (and similar) letters → ASCII for URL slugs. */
function transliterateForSlug(value: string) {
  return value
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss");
}

export function normalizeSlug(raw: string) {
  return transliterateForSlug(raw.trim().toLowerCase())
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function validateFirstName(firstName: string) {
  const trimmed = firstName.trim();
  if (!trimmed) return "First Name is required.";
  if (trimmed.length > 64) return "First Name must be 64 characters or less.";
  return null;
}

export function validateSlug(slug: string) {
  const normalized = normalizeSlug(slug);
  if (!normalized) return "Slug is required.";
  if (normalized.length < 2) return "Slug must be at least 2 characters.";
  if (normalized.length > 255) return "Slug must be 255 characters or less.";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) {
    return "Slug may only contain lowercase letters, numbers, and hyphens.";
  }
  if (RESERVED_SLUGS.has(normalized)) return `"${normalized}" is reserved.`;
  return null;
}

export type PageGeneralFieldErrors = {
  first_name?: string;
  slug?: string;
};

export function validatePageGeneralFields(firstName: string, slug: string): PageGeneralFieldErrors {
  const errors: PageGeneralFieldErrors = {};
  const firstNameError = validateFirstName(firstName);
  const slugError = validateSlug(slug);
  if (firstNameError) errors.first_name = firstNameError;
  if (slugError) errors.slug = slugError;
  return errors;
}

export function hasPageGeneralFieldErrors(errors: PageGeneralFieldErrors) {
  return Boolean(errors.first_name || errors.slug);
}
