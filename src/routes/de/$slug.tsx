import { createFileRoute, notFound } from "@tanstack/react-router";
import { LandingPageLayout } from "@/components/landing/landing-page-layout";
import { getLandingShareMeta } from "@/lib/landing-i18n";
import { LANGUAGE_DE, RESERVED_SLUGS } from "@/lib/page-types";
import { fetchPublishedLanding } from "@/lib/pages.server";
import { absoluteSiteUrl } from "@/lib/site-meta";
import wordmark from "@/assets/mitch-wordmark.png";
import landingFonts from "@/components/landing/landing-fonts.css?url";

const landingFontLinks = [
  { rel: "stylesheet", href: landingFonts },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous" as const,
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Sans+Condensed:wght@600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap",
  },
];

export const Route = createFileRoute("/de/$slug")({
  beforeLoad: ({ params }) => {
    const slug = params.slug.toLowerCase();
    if (RESERVED_SLUGS.has(slug)) {
      throw notFound();
    }
  },
  loader: async ({ params }) => {
    const page = await fetchPublishedLanding({
      data: { slug: params.slug, languageId: LANGUAGE_DE },
    });
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData }) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      ...getLandingShareMeta("de", absoluteSiteUrl(wordmark)),
    ],
    links: landingFontLinks,
  }),
  component: DeSlugLandingPage,
});

function DeSlugLandingPage() {
  const content = Route.useLoaderData();
  return <LandingPageLayout locale="de" content={content} />;
}
