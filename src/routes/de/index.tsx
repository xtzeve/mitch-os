import { createFileRoute } from "@tanstack/react-router";
import { getHomeMeta } from "@/lib/home-i18n";
import { MitchOSPage } from "../index";

export const Route = createFileRoute("/de/")({
  head: () => getHomeMeta("de"),
  component: HomePageDe,
});

function HomePageDe() {
  return <MitchOSPage locale="de" />;
}
