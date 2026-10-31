import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Sorateq Labs | Coming soon",
};

export default function LabsPage() {
  return (
    <ComingSoon
      eyebrow="Sorateq Labs"
      title="Experiments in progress"
      description="Sorateq Labs is where we test new AI ideas before they become products. Prototypes, open experiments, and research notes will live here."
    />
  );
}
