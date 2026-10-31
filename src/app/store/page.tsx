import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Sora Store | Coming soon",
};

export default function StorePage() {
  return (
    <ComingSoon
      eyebrow="Sora Store"
      title="Ready-made tools"
      description="A marketplace of ready-to-deploy AI tools, templates, and agents built by the Sorateq studio. Launching soon."
    />
  );
}
