import { Link } from "@tanstack/react-router";
import wordmark from "@/assets/mitch-wordmark.png";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[color:var(--warmwhite)]/85 border-b border-[color:var(--border)]">
      <div className="container-mitch flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center" aria-label="MITCH OS home">
          <img src={wordmark} alt="MITCH" className="h-10 md:h-12 w-auto" />
        </Link>
      </div>
    </header>
  );
}
