import { Breadcrumb } from "@/features/components/Breadcrumb";
import Catalog from "@/features/components/Catalog/Catalog";
import HeroHeader from "@/features/components/HeroHeader";
import Section from "@/features/components/Section";
import { getParentCategoryImage } from "@/features/helpers/category.helper";
import { getBasePath } from "@/features/helpers/path.helper";

export async function generateMetadata() {
  return {
    title: "Catálogo - Peru Guitar",
    description:
      "Explora guitarras, pedales, servicios y artículos disponibles en Peru Guitar.",
    openGraph: {
      title: "Catálogo - Peru Guitar",
      description:
        "Explora guitarras, pedales, servicios y artículos disponibles en Peru Guitar.",
      url: getBasePath("catalogo"),
      type: "website",
      images: [
        {
          url: getBasePath(getParentCategoryImage("guitar")),
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default function CatalogPage() {
  return (
    <>
      <HeroHeader
        title="Catálogo"
        description="Explora instrumentos, pedales, servicios y artículos para guitarristas."
        backgroundUrl={getParentCategoryImage("guitar_bg")}
      />

      <Section>
        <Breadcrumb items={[{ label: "Catálogo" }]} />
        <Catalog sort="latest" cols={4} />
      </Section>
    </>
  );
}
