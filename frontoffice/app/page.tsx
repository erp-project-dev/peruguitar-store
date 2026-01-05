import Catalog from "@/features/components/Catalog/Catalog";
import Section from "@/features/components/Section";

export default function Home() {
  return (
    <Section width="full">
      <Catalog sort="latest" />
    </Section>
  );
}
