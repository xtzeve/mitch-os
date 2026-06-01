import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — MITCH" },
      { name: "description", content: "How MITCH and Pearson Consulting handle your personal data." },
      { property: "og:title", content: "Privacy Policy — MITCH" },
      { property: "og:description", content: "Nature, scope, and purpose of personal data processing on this website." },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[color:var(--background)] flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <article className="container-mitch py-16 md:py-24 max-w-3xl">
          <p className="eyebrow mb-4">Privacy</p>
          <h1 className="font-display text-4xl md:text-5xl tracking-tight mb-10">
            Privacy Policy
          </h1>

          <section className="space-y-3 mb-10">
            <h2 className="font-display text-2xl tracking-tight">1. General Information</h2>
            <p className="leading-relaxed">
              We take the protection of your personal data seriously. This privacy policy
              explains the nature, scope, and purpose of the processing of personal data on
              this website.
            </p>
          </section>

          <section className="space-y-3 mb-10">
            <h2 className="font-display text-2xl tracking-tight">2. Controller</h2>
            <address className="not-italic leading-relaxed">
              Vincent Pearson<br />
              Pearson Consulting<br />
              Westfälische Str. 52<br />
              10711 Berlin<br />
              Germany<br />
              Email:{" "}
              <a
                href="mailto:vp@pearson-consulting.de"
                className="underline hover:text-[color:var(--burnt)]"
              >
                vp@pearson-consulting.de
              </a>
            </address>
          </section>

          <section className="space-y-3 mb-10">
            <h2 className="font-display text-2xl tracking-tight">
              3. Data Collection (Server Log Files)
            </h2>
            <p className="leading-relaxed">
              When you visit this website, information is automatically collected by the
              server. This may include:
            </p>
            <ul className="list-disc pl-6 space-y-1 leading-relaxed">
              <li>IP address</li>
              <li>Date and time of access</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
            </ul>
            <p className="leading-relaxed">
              This data is used solely to ensure the proper functioning and security of the
              website.
            </p>
          </section>

          <section className="space-y-3 mb-10">
            <h2 className="font-display text-2xl tracking-tight">4. Contact</h2>
            <p className="leading-relaxed">
              If you contact us by email, your details will be stored for the purpose of
              processing your request.
            </p>
          </section>

          <section className="space-y-3 mb-10">
            <h2 className="font-display text-2xl tracking-tight">5. Cookies</h2>
            <p className="leading-relaxed">
              This website does not use tracking or marketing cookies. Only technically
              necessary processes may be used to ensure functionality.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl tracking-tight">6. Your Rights</h2>
            <p className="leading-relaxed">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1 leading-relaxed">
              <li>request information about your stored data</li>
              <li>request correction or deletion</li>
              <li>restrict processing</li>
            </ul>
            <p className="leading-relaxed">
              To exercise these rights, please contact us at the email address provided above.
            </p>
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
