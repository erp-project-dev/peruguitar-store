import { CatalogGetCommand } from "@/features/commands/catalog/index.command";
import { ProductGetCommand } from "@/features/commands/product/index.command";

import { getCatalogImagePath } from "@/features/helpers/product.helper";
import { getBasePath } from "@/features/helpers/path.helper";

import ProductPhoto from "./components/ProductPhoto";
import ProductSpecs from "./components/ProductSpecs";

import { Breadcrumb } from "@/features/components/Breadcrumb";
import ProductCallToAction from "./components/ProductCallToAction/ProductCallToAction";
import ProductDisclaimer from "./components/ProductDisclaimer";
import ProductSimilarLising from "./components/ProductSimilarListing";
import ProductFullDescription from "./components/ProductFullDescription/ProductFullDescription";
import { ProductYoutubeVideo } from "./components/ProductYoutubeVideo";
import ProductSoldNotice from "./components/ProductSoldNotice";

export async function generateStaticParams() {
  const { items } = CatalogGetCommand.handle();

  return items.map((p) => ({
    productId: p.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  try {
    const product = ProductGetCommand.handle(productId);

    return {
      title: `${product.name} - Peru Guitar`,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        images: [
          {
            url: getBasePath(getCatalogImagePath(product.images[0])),
            width: 1200,
            height: 630,
          },
        ],
        url: getBasePath(product.id),
        type: "article",
      },
    };
  } catch {
    return {
      title: "Producto no encontrado - Peru Guitar",
      description: "Este anuncio no está disponible o ha sido removido.",
    };
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  if (!productId) {
    return <div className="text-center text-white py-20">ID inválido.</div>;
  }

  const product = ProductGetCommand.handle(productId);
  if (!product) {
    <div className="text-center text-white py-20">Producto no encontrado.</div>;
  }

  return (
    <section className="max-w-7xl mx-auto flex flex-col space-y-8">
      <Breadcrumb items={[{ label: product.name }]} />

      {product.isSold && <ProductSoldNotice />}

      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-10">
        <div className="space-y-8">
          <ProductPhoto productName={product.name} pics={product.images} />

          <div className="block md:hidden">
            <ProductCallToAction product={product} />
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Descripción</h2>
            <p className="leading-relaxed text-gray-800">
              {product.description}
            </p>
          </div>

          {product.fullDescription && (
            <ProductFullDescription text={product.fullDescription} />
          )}

          {product.brand_id && (
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">Especificaciones</h2>
              <ProductSpecs
                specs={{
                  model: product.model,
                  brand: product.brand?.name,
                  ...product.specs,
                }}
              />
            </div>
          )}

          {product.externalVideoUrl && (
            <ProductYoutubeVideo url={product.externalVideoUrl} />
          )}
        </div>

        <div className="relative hidden md:block">
          <div className="md:sticky md:top-5">
            <ProductCallToAction product={product} />
          </div>
        </div>
      </div>

      <ProductSimilarLising excludedProductId={product.id} />
      <ProductDisclaimer />
    </section>
  );
}
