import { createFileRoute } from "@tanstack/react-router";
import { IntroPresentation } from "@/components/intro/intro-presentation";
import { introCopy } from "@/components/intro/intro-copy";

export const Route = createFileRoute("/intro")({
  head: () => ({
    meta: [{ title: introCopy.en.docTitle }],
  }),
  component: IntroPage,
});

function IntroPage() {
  return <IntroPresentation locale="en" />;
}
