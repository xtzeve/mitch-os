/** Format SQLite datetime / ISO for admin "Visited" cell. */
export function formatLastVisited(value: string | null | undefined): string | null {
  if (!value) return null;
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const date = new Date(normalized.endsWith("Z") ? normalized : `${normalized}Z`);
  if (Number.isNaN(date.getTime())) {
    const fallback = new Date(value);
    if (Number.isNaN(fallback.getTime())) return value;
    return formatVisitedTimestamp(fallback);
  }
  return formatVisitedTimestamp(date);
}

function formatVisitedTimestamp(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  })
    .format(date)
    .replace(",", "");
}

export function formatVisitedCell(
  visited: number,
  lastVisited: string | null | undefined,
): string {
  const count = Number.isFinite(visited) ? visited : 0;
  const label = count === 1 ? "1 visit" : `${count} visits`;
  const when = formatLastVisited(lastVisited);
  return when ? `${label} · ${when}` : label;
}

export function formatPublishedDate(value: string | null | undefined): string {
  if (!value) return "—";
  const dateOnly = value.slice(0, 10);
  const date = new Date(`${dateOnly}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
