import { createFileRoute } from "@tanstack/react-router";
import flightHtml from "../../public/flight/index.html?raw";

/**
 * Serve the Flight Control launcher as raw HTML (no site shell).
 * Icons/manifest still come from public/flight/* static assets.
 * In production, Cloudflare Assets usually serve /flight/ first; this
 * handler covers /flight in local Vite and any Worker-first edge cases.
 */
export const Route = createFileRoute("/flight")({
  server: {
    handlers: {
      GET: () =>
        new Response(flightHtml, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "X-Robots-Tag": "noindex, nofollow",
          },
        }),
    },
  },
});
