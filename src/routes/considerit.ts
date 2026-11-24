import { createFileRoute } from "@tanstack/react-router";
import consideritHtml from "../../public/considerit.html?raw";

/** Static intro HTML at /considerit — no site shell, always noindex. */
export const Route = createFileRoute("/considerit")({
  server: {
    handlers: {
      GET: () =>
        new Response(consideritHtml, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "X-Robots-Tag": "noindex, nofollow",
          },
        }),
    },
  },
});
