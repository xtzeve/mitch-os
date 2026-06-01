import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--border)] mt-20 md:mt-32">
      <div className="container-mitch py-12 md:py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl tracking-tight">
            MITCH <span className="italic text-[color:var(--burnt)]">OS</span>
          </p>
          <p className="mt-3 text-sm text-[color:var(--muted-foreground)] max-w-md">
            The pipeline that converts itself. A MITCH company.
          </p>
        </div>
        <div className="text-sm space-y-2">
          <p className="eyebrow mb-3">Company</p>
          <a
            href="mailto:info@mitchos.com"
            className="block text-[color:var(--muted-foreground)] hover:text-[color:var(--burnt)] transition-colors"
          >
            info@mitchos.com
          </a>
        </div>
        <div className="text-sm space-y-2">
          <p className="eyebrow mb-3">Legal</p>
          <Link
            to="/legal-notice"
            className="block text-[color:var(--muted-foreground)] hover:text-[color:var(--burnt)] transition-colors"
          >
            Legal Notice
          </Link>
          <Link
            to="/privacy-policy"
            className="block text-[color:var(--muted-foreground)] hover:text-[color:var(--burnt)] transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
      <div className="border-t border-[color:var(--border)]">
        <div className="container-mitch py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs text-[color:var(--muted-foreground)]">
          <p>MITCH OS is a service by Pearson Consulting.</p>
          <p>© {new Date().getFullYear()} — All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
