import { createFileRoute } from "@tanstack/react-router";
import { getHomeMeta } from "@/lib/home-i18n";
import wordmark from "@/assets/mitch-wordmark.png";
import { MitchOSPage } from "../index";

export const Route = createFileRoute("/de/")({
  head: () => getHomeMeta("de", wordmark),
  component: HomePageDe,
});

function HomePageDe() {
  return <MitchOSPage locale="de" />;
}
