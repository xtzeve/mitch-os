import { createFileRoute } from "@tanstack/react-router";
import { IntroPresentation } from "@/components/intro/intro-presentation";
import { introCopy } from "@/components/intro/intro-copy";

export const Route = createFileRoute("/de/intro")({
  head: () => ({
    meta: [{ title: introCopy.de.docTitle }],
  }),
  component: IntroPageDe,
});

function IntroPageDe() {
  return <IntroPresentation locale="de" />;
}
