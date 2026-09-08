import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { LanguageTabs } from "@/components/admin/language-tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_DESCRIPTIONS_BY_LANGUAGE, DEFAULT_PAGE_DESCRIPTION_EN } from "@/lib/page-defaults";
import {
  hasPageGeneralFieldErrors,
  normalizeSlug,
  validatePageGeneralFields,
  type PageGeneralFieldErrors,
} from "@/lib/page-validation";
import {
  LANGUAGE_DE,
  LANGUAGE_EN,
  type PageFormData,
  type PageDescriptionFields,
} from "@/lib/page-types";
import type { CatalogRecord } from "@/lib/catalog-types";
import { cn } from "@/lib/utils";

type PageFormProps = {
  pageId: number | null;
  initialData: PageFormData;
  territories: CatalogRecord[];
  owners: CatalogRecord[];
  campaigns: CatalogRecord[];
  onSave: (form: PageFormData) => Promise<void>;
  saving?: boolean;
  error?: string | null;
};

const SECTION_TABS = [
  { id: "general", label: "General" },
  { id: "intro", label: "Intro" },
  { id: "why", label: "Why" },
  { id: "preview", label: "Preview" },
  { id: "structure", label: "Structure" },
  { id: "mechanism", label: "Mechanism + CTA" },
] as const;

type SectionId = (typeof SECTION_TABS)[number]["id"];

const NONE_VALUE = "__none__";

function updateDescriptionField(
  form: PageFormData,
  languageId: number,
  field: keyof PageDescriptionFields,
  value: string,
): PageFormData {
  return {
    ...form,
    page_description: {
      ...form.page_description,
      [languageId]: {
        ...form.page_description[languageId],
        [field]: value,
      },
    },
  };
}

export function PageForm({
  pageId,
  initialData,
  territories,
  owners,
  campaigns,
  onSave,
  saving,
  error,
}: PageFormProps) {
  const [form, setForm] = useState(initialData);
  const [languageId, setLanguageId] = useState(LANGUAGE_EN);
  const [activeTab, setActiveTab] = useState<SectionId>("general");
  const [fieldErrors, setFieldErrors] = useState<PageGeneralFieldErrors>({});
  const [slugManual, setSlugManual] = useState(Boolean(initialData.slug.trim()));
  const description =
    form.page_description[languageId] ??
    (languageId === LANGUAGE_DE
      ? form.page_description[LANGUAGE_DE]
      : DEFAULT_PAGE_DESCRIPTION_EN);

  const previewLinks = useMemo(() => {
    const slug = form.slug.trim();
    if (!slug) return null;
    return {
      en: `/${slug}`,
      de: `/de/${slug}`,
    };
  }, [form.slug]);

  const setDescriptionField = (field: keyof PageDescriptionFields, value: string) => {
    setForm((current) => updateDescriptionField(current, languageId, field, value));
  };

  const runGeneralValidation = () => {
    const errors = validatePageGeneralFields(form.first_name, form.slug);
    setFieldErrors(errors);
    return !hasPageGeneralFieldErrors(errors);
  };

  return (
    <form
      className="space-y-6"
      noValidate
      onSubmit={async (event) => {
        event.preventDefault();
        if (!runGeneralValidation()) {
          setActiveTab("general");
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        setFieldErrors({});
        await onSave(form);
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {pageId == null ? "Create Page" : `Edit Page #${pageId}`}
          </h1>
          <p className="text-sm text-muted-foreground">
            Content sections are in the left panel. Set Published to make the page live.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" asChild>
            <Link to="/admin">Back</Link>
          </Button>
          {previewLinks ? (
            <>
              <Button type="button" variant="outline" asChild>
                <a href={previewLinks.en} target="_blank" rel="noreferrer">
                  Preview EN
                </a>
              </Button>
              <Button type="button" variant="outline" asChild>
                <a href={previewLinks.de} target="_blank" rel="noreferrer">
                  Preview DE
                </a>
              </Button>
            </>
          ) : null}
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {error ? (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      ) : null}

      <div className="flex flex-col gap-6 md:flex-row">
        <aside className="w-full shrink-0 md:w-52">
          <nav className="flex flex-row gap-1 overflow-x-auto md:flex-col md:overflow-visible">
            {SECTION_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "rounded-md px-3 py-2 text-left text-sm font-medium whitespace-nowrap transition-colors",
                  activeTab === tab.id
                    ? "bg-slate-900 text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1 space-y-4">
          {activeTab === "general" ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first_name">
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="first_name"
                    value={form.first_name}
                    onChange={(event) => {
                      const firstName = event.target.value;
                      setForm((current) => ({
                        ...current,
                        first_name: firstName,
                        slug: slugManual ? current.slug : normalizeSlug(firstName),
                      }));
                      if (fieldErrors.first_name || (!slugManual && fieldErrors.slug)) {
                        setFieldErrors((current) => ({
                          ...current,
                          first_name: undefined,
                          ...(slugManual ? {} : { slug: undefined }),
                        }));
                      }
                    }}
                    aria-invalid={Boolean(fieldErrors.first_name)}
                  />
                  {fieldErrors.first_name ? (
                    <p className="text-sm text-destructive">{fieldErrors.first_name}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">
                    Slug (URL) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(event) => {
                      setSlugManual(true);
                      setForm({ ...form, slug: event.target.value });
                      if (fieldErrors.slug) {
                        setFieldErrors((current) => ({ ...current, slug: undefined }));
                      }
                    }}
                    placeholder="max-mueller"
                    aria-invalid={Boolean(fieldErrors.slug)}
                  />
                  {fieldErrors.slug ? (
                    <p className="text-sm text-destructive">{fieldErrors.slug}</p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <CatalogSelect
                  label="Territory"
                  value={form.territory_id}
                  options={territories}
                  onChange={(territory_id) => setForm({ ...form, territory_id })}
                />
                <CatalogSelect
                  label="Owner"
                  value={form.owner_id}
                  options={owners}
                  onChange={(owner_id) => setForm({ ...form, owner_id })}
                />
                <CatalogSelect
                  label="Campaign"
                  value={form.campaign_id}
                  options={campaigns}
                  onChange={(campaign_id) => setForm({ ...form, campaign_id })}
                />
                <div className="space-y-2">
                  <Label htmlFor="published">Published</Label>
                  <Input
                    id="published"
                    type="date"
                    value={form.published ?? ""}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        published: event.target.value ? event.target.value.slice(0, 10) : null,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Empty = not live. Set a date to publish the public URL.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "intro" ? (
            <div className="space-y-4">
              <LanguageTabs activeLanguageId={languageId} onChange={setLanguageId} />
              <div className="space-y-2">
                <Label htmlFor="greeting">Greeting</Label>
                <Textarea
                  id="greeting"
                  rows={3}
                  value={description.greeting}
                  onChange={(event) => setDescriptionField("greeting", event.target.value)}
                />
              </div>
            </div>
          ) : null}

          {activeTab === "why" ? (
            <div className="space-y-4">
              <LanguageTabs activeLanguageId={languageId} onChange={setLanguageId} />
              <div className="space-y-2">
                <Label htmlFor="why_body">Body</Label>
                <Textarea
                  id="why_body"
                  rows={5}
                  value={description.why_body}
                  onChange={(event) => setDescriptionField("why_body", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="why_claim">Claim line</Label>
                <Textarea
                  id="why_claim"
                  rows={2}
                  value={description.why_claim}
                  onChange={(event) => setDescriptionField("why_claim", event.target.value)}
                />
              </div>
            </div>
          ) : null}

          {activeTab === "preview" ? (
            <div className="space-y-4">
              <LanguageTabs activeLanguageId={languageId} onChange={setLanguageId} />
              <div className="space-y-2">
                <Label htmlFor="preview_intro">Intro</Label>
                <Textarea
                  id="preview_intro"
                  rows={4}
                  value={description.preview_intro}
                  onChange={(event) => setDescriptionField("preview_intro", event.target.value)}
                />
              </div>
              {[1, 2, 3, 4].map((index) => {
                const field = `four_thing_${index}` as keyof PageDescriptionFields;
                return (
                  <div className="space-y-2" key={field}>
                    <Label htmlFor={field}>Four thing {index}</Label>
                    <Textarea
                      id={field}
                      rows={3}
                      value={description[field]}
                      onChange={(event) => setDescriptionField(field, event.target.value)}
                    />
                  </div>
                );
              })}
            </div>
          ) : null}

          {activeTab === "structure" ? (
            <div className="space-y-4">
              <LanguageTabs activeLanguageId={languageId} onChange={setLanguageId} />
              <div className="space-y-2">
                <Label htmlFor="structure_intro">Intro</Label>
                <Textarea
                  id="structure_intro"
                  rows={4}
                  value={description.structure_intro}
                  onChange={(event) => setDescriptionField("structure_intro", event.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Structure parts (Overview, Triggers, Intel, Campaign) are static template copy in
                  i18n files.
                </p>
              </div>
            </div>
          ) : null}

          {activeTab === "mechanism" ? (
            <div className="space-y-4">
              <LanguageTabs activeLanguageId={languageId} onChange={setLanguageId} />
              {[1, 2, 3].map((index) => {
                const field = `mechanism_p${index}` as keyof PageDescriptionFields;
                return (
                  <div className="space-y-2" key={field}>
                    <Label htmlFor={field}>Mechanism paragraph {index}</Label>
                    <Textarea
                      id={field}
                      rows={4}
                      value={description[field]}
                      onChange={(event) => setDescriptionField(field, event.target.value)}
                    />
                  </div>
                );
              })}
              {[1, 2].map((index) => {
                const field = `unseen_p${index}` as keyof PageDescriptionFields;
                return (
                  <div className="space-y-2" key={field}>
                    <Label htmlFor={field}>Unseen paragraph {index}</Label>
                    <Textarea
                      id={field}
                      rows={4}
                      value={description[field]}
                      onChange={(event) => setDescriptionField(field, event.target.value)}
                    />
                  </div>
                );
              })}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="cta_phone">CTA phone</Label>
                  <Input
                    id="cta_phone"
                    value={description.cta_phone}
                    onChange={(event) => setDescriptionField("cta_phone", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta_label">CTA label</Label>
                  <Input
                    id="cta_label"
                    value={description.cta_label}
                    onChange={(event) => setDescriptionField("cta_label", event.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="cta_alt">CTA alt text</Label>
                  <Textarea
                    id="cta_alt"
                    rows={2}
                    value={description.cta_alt}
                    onChange={(event) => setDescriptionField("cta_alt", event.target.value)}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </form>
  );
}

function CatalogSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: number | null;
  options: CatalogRecord[];
  onChange: (value: number | null) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select
        value={value != null ? String(value) : NONE_VALUE}
        onValueChange={(next) => onChange(next === NONE_VALUE ? null : Number(next))}
      >
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE_VALUE}>— None —</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.id} value={String(option.id)}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function emptyFormData(): PageFormData {
  return {
    first_name: "",
    slug: "",
    territory_id: null,
    owner_id: null,
    campaign_id: null,
    published: null,
    page_description: {
      [LANGUAGE_EN]: { ...DEFAULT_DESCRIPTIONS_BY_LANGUAGE[LANGUAGE_EN] },
      [LANGUAGE_DE]: { ...DEFAULT_DESCRIPTIONS_BY_LANGUAGE[LANGUAGE_DE] },
    },
  };
}
