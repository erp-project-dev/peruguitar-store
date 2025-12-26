import { Breadcrumb } from "@/features/components/Breadcrumb";
import Catalog from "@/features/components/Catalog/Catalog";
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
      url: getBasePath("/catalogo"),
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
    <section className="max-w-7xl mx-auto flex flex-col space-y-8">
      <Breadcrumb items={[{ label: "Catálogo" }]} />

      <div>
        <h1 className="text-3xl font-bold">Catálogo</h1>
        <p className="text-gray-600">
          Explora instrumentos, pedales, servicios y artículos para
          guitarristas.
        </p>
      </div>

      <Catalog sort="latest" cols={4} />
    </section>
  );
}
