import { CategoryFindCommand } from "@/features/commands/category/find.command";
import { CategoryGetCommand } from "@/features/commands/category/index.command";
import { Breadcrumb } from "@/features/components/Breadcrumb";
import Catalog from "@/features/components/Catalog/Catalog";
import HeroHeader from "@/features/components/HeroHeader";
import Section from "@/features/components/Section";
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
    description: category.description,
    openGraph: {
      title: `${category.name} - Peru Guitar`,
      description: category.description,
      url: getBasePath(`catalogo/${category.id}`),
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
    <>
      <HeroHeader
        title={category.name}
        description={category.description}
        backgroundUrl={getParentCategoryImage(`${categoryId}_bg`)}
      />

      <Section>
        <Breadcrumb
          items={[
            { href: "/catalogo", label: "Catálogo" },
            { label: category.name },
          ]}
        />
        <Catalog parentCategoryId={categoryId} sort="latest" cols={4} />
      </Section>
    </>
  );
}
