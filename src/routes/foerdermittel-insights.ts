import { createFileRoute } from "@tanstack/react-router";
import foerdermittelInsightsHtml from "../../public/foerdermittel-insights.html?raw";

/** Static intro HTML at /foerdermittel-insights — no site shell, always noindex. */
export const Route = createFileRoute("/foerdermittel-insights")({
  server: {
    handlers: {
      GET: () =>
        new Response(foerdermittelInsightsHtml, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "X-Robots-Tag": "noindex, nofollow",
          },
        }),
    },
  },
});
