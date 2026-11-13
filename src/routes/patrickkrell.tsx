import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/patrickkrell")({
  head: () => ({
    meta: [{ title: "Intro für Startpunkt" }],
  }),
  component: PatrickKrellPage,
});

function PatrickKrellPage() {
  useEffect(() => {
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <iframe
      title="Intro für Startpunkt"
      src="/patrickkrell.html"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        border: 0,
        display: "block",
        background: "#0A0A0B",
      }}
    />
  );
}
