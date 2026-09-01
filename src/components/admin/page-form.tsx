import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { LanguageTabs } from "@/components/admin/language-tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_PAGE_DESCRIPTION_EN } from "@/lib/page-defaults";
import {
  hasPageGeneralFieldErrors,
  validatePageGeneralFields,
  type PageGeneralFieldErrors,
} from "@/lib/page-validation";
import {
  LANGUAGE_DE,
  LANGUAGE_EN,
  PAGE_STATUS_DRAFT,
  PAGE_STATUS_PUBLISHED,
  type PageFormData,
  type PageDescriptionFields,
} from "@/lib/page-types";

type PageFormProps = {
  pageId: number;
  initialData: PageFormData;
  onSave: (form: PageFormData) => Promise<void>;
  saving?: boolean;
  error?: string | null;
};

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

export function PageForm({ pageId, initialData, onSave, saving, error }: PageFormProps) {
  const [form, setForm] = useState(initialData);
  const [languageId, setLanguageId] = useState(LANGUAGE_EN);
  const [activeTab, setActiveTab] = useState("general");
  const [fieldErrors, setFieldErrors] = useState<PageGeneralFieldErrors>({});
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
          <h1 className="text-2xl font-semibold">Edit Page #{pageId}</h1>
          <p className="text-sm text-muted-foreground">OpenCart-style tabs with EN/DE content.</p>
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

      {error ? <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p> : null}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex h-auto flex-wrap">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="intro">Intro</TabsTrigger>
          <TabsTrigger value="why">Why</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="mechanism">Mechanism + CTA</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="first_name">
                First Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="first_name"
                value={form.first_name}
                onChange={(event) => {
                  setForm({ ...form, first_name: event.target.value });
                  if (fieldErrors.first_name) {
                    setFieldErrors((current) => ({ ...current, first_name: undefined }));
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
                  setForm({ ...form, slug: event.target.value });
                  if (fieldErrors.slug) {
                    setFieldErrors((current) => ({ ...current, slug: undefined }));
                  }
                }}
                placeholder="alex"
                aria-invalid={Boolean(fieldErrors.slug)}
              />
              {fieldErrors.slug ? (
                <p className="text-sm text-destructive">{fieldErrors.slug}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={String(form.status)}
                onValueChange={(value) => setForm({ ...form, status: Number(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(PAGE_STATUS_DRAFT)}>Draft</SelectItem>
                  <SelectItem value={String(PAGE_STATUS_PUBLISHED)}>Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="intro" className="pt-4">
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
        </TabsContent>

        <TabsContent value="why" className="pt-4">
          <LanguageTabs activeLanguageId={languageId} onChange={setLanguageId} />
          <div className="space-y-4">
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
        </TabsContent>

        <TabsContent value="preview" className="pt-4">
          <LanguageTabs activeLanguageId={languageId} onChange={setLanguageId} />
          <div className="space-y-4">
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
        </TabsContent>

        <TabsContent value="structure" className="pt-4">
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
              Structure parts (Overview, Triggers, Intel, Campaign) are static template copy in i18n files.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="mechanism" className="pt-4">
          <LanguageTabs activeLanguageId={languageId} onChange={setLanguageId} />
          <div className="space-y-4">
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
        </TabsContent>
      </Tabs>
    </form>
  );
}

export function emptyFormData(): PageFormData {
  return {
    first_name: "",
    slug: "",
    status: PAGE_STATUS_DRAFT,
    page_description: {
      [LANGUAGE_EN]: {
        greeting: "",
        why_body: "",
        why_claim: "",
        preview_intro: "",
        four_thing_1: "",
        four_thing_2: "",
        four_thing_3: "",
        four_thing_4: "",
        structure_intro: "",
        mechanism_p1: "",
        mechanism_p2: "",
        mechanism_p3: "",
        unseen_p1: "",
        unseen_p2: "",
        cta_phone: "",
        cta_label: "",
        cta_alt: "",
      },
      [LANGUAGE_DE]: {
        greeting: "",
        why_body: "",
        why_claim: "",
        preview_intro: "",
        four_thing_1: "",
        four_thing_2: "",
        four_thing_3: "",
        four_thing_4: "",
        structure_intro: "",
        mechanism_p1: "",
        mechanism_p2: "",
        mechanism_p3: "",
        unseen_p1: "",
        unseen_p2: "",
        cta_phone: "",
        cta_label: "",
        cta_alt: "",
      },
    },
  };
}
