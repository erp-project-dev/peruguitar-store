import { CategoryFindCommand } from "@/features/commands/category/find.command";
import { CategoryGetCommand } from "@/features/commands/category/index.command";
import { Breadcrumb } from "@/features/components/Breadcrumb";
import Catalog from "@/features/components/Catalog/Catalog";
import { getParentCategoryImage } from "@/features/helpers/category.helper";
import { getBasePath } from "@/features/helpers/path.helper";
import { Category } from "@/features/types/category.type";

export async function generateStaticParams() {
  const categories = CategoryGetCommand.handle({
    onlyParents: true,
    onlyInCatalog: true,
  });

  return categories.map((c) => ({
    categoryId: c.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;

  const category = CategoryFindCommand.handle(categoryId);

  if (!category) {
    return {
      title: "Categoría no encontrada - Peru Guitar",
      description: "Esta categoría no está disponible.",
    };
  }

  return {
    title: `${category.name} - Peru Guitar`,
    description: `Explora ${category.name} disponibles en Peru Guitar.`,
    openGraph: {
      title: `${category.name} - Peru Guitar`,
      description: `Explora ${category.name} disponibles en Peru Guitar.`,
      url: getBasePath(`/catalogo/${category.id}`),
      type: "website",
      images: [
        {
          url: getBasePath(getParentCategoryImage(categoryId)),
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  const category = CategoryFindCommand.handle(categoryId) as Category;

  return (
    <section className="max-w-7xl mx-auto flex flex-col space-y-8">
      <Breadcrumb
        items={[
          { href: "/catalogo", label: "Catálogo" },
          { label: category.name },
        ]}
      />

      <h1 className="text-3xl font-bold mb-0">{category.name}</h1>
      <h2 className="">{category.description}</h2>

      <Catalog parentCategoryId={categoryId} sort="latest" cols={4} />
    </section>
  );
}
