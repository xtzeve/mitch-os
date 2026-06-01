import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/legal-notice")({
  head: () => ({
    meta: [
      { title: "Legal Notice — MITCH" },
      { name: "description", content: "Legal notice (Impressum) for MITCH, a service by Pearson Consulting." },
      { property: "og:title", content: "Legal Notice — MITCH" },
      { property: "og:description", content: "Legal notice (Impressum) in accordance with § 5 TMG." },
    ],
  }),
  component: LegalNoticePage,
});

function LegalNoticePage() {
  return (
    <div className="min-h-screen bg-[color:var(--background)] flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <article className="container-mitch py-16 md:py-24 max-w-3xl">
          <p className="eyebrow mb-4">Impressum</p>
          <h1 className="font-display text-4xl md:text-5xl tracking-tight mb-10">
            Legal Notice
          </h1>

          <section className="space-y-3 mb-10">
            <h2 className="font-display text-2xl tracking-tight">
              Information in accordance with § 5 TMG
            </h2>
            <address className="not-italic text-[color:var(--foreground)] leading-relaxed">
              Vincent Pearson<br />
              Pearson Consulting<br />
              Westfälische Str. 52<br />
              10711 Berlin<br />
              Germany
            </address>
            <p className="leading-relaxed">
              Phone:{" "}
              <a href="tel:+493050958030" className="underline hover:text-[color:var(--burnt)]">
                +49 30 50958030
              </a>
              <br />
              Email:{" "}
              <a
                href="mailto:vp@pearson-consulting.de"
                className="underline hover:text-[color:var(--burnt)]"
              >
                vp@pearson-consulting.de
              </a>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl tracking-tight">
              Responsible for content in accordance with § 55 para. 2 RStV
            </h2>
            <address className="not-italic text-[color:var(--foreground)] leading-relaxed">
              Vincent Pearson<br />
              Westfälische Str. 52<br />
              10711 Berlin<br />
              Germany
            </address>
          </section>

          <div className="mt-16">
            <Link
              to="/"
              className="text-sm underline text-[color:var(--muted-foreground)] hover:text-[color:var(--burnt)]"
            >
              ← Back to home
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
