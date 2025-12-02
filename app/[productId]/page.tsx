import { MapPin } from "lucide-react";

import { CatalogHandler } from "@/app/handlers/catalog/index.handler";
import { ProductHandler } from "@/app/handlers/product/index.handler";

import ProductGallery from "./components/ProductGallery";
import ProductCallToAction from "./components/ProductCallToAction";
import ProductSpecs from "./components/ProductSpecs";
import { getCatalogImagePath } from "../helpers/product.helper";
import ProductStatus from "./components/ProductStatus";
import ProductStoryCardModal from "./components/ProductStoryCardModal";
import { getPublicPath } from "../helpers/path.helper";

export async function generateStaticParams() {
  const { items } = CatalogHandler();

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
    const product = ProductHandler(productId);

    return {
      title: `${product.name} - Peru Guitar`,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        images: [
          {
            url: getPublicPath(
              getCatalogImagePath(product.merchant.id, product.pic_1)
            ),
            width: 1200,
            height: 630,
          },
        ],
        url: getPublicPath(product.id),
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

  let product = null;
  try {
    product = ProductHandler(productId);
  } catch {
    return (
      <div className="text-center text-white py-20">
        Producto no encontrado.
      </div>
    );
  }

  const pics = [
    product.pic_1,
    product.pic_2,
    product.pic_3,
    product.pic_4,
    product.pic_5,
    product.pic_6,
  ].filter(Boolean) as string[];

  return (
    <div className="max-w-5xl mx-auto flex flex-col">
      <h1 className="text-5xl font-bold mb-5">{product.name}</h1>

      <ProductGallery
        productName={product.name}
        price={product.price}
        merchantId={product.merchant.id}
        pics={pics}
      />

      <ProductCallToAction
        merchantName={product.merchant.firstName}
        productName={product.name}
        price={product.price}
        priceType={product.priceType}
        whatsapp={product.merchant.whatsapp}
      />

      <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Descripción</h2>
          <p className="leading-relaxed">{product.description}</p>
        </div>

        <div className="space-y-3">
          <ProductStatus
            status={product.status}
            statusScore={product.statusScore}
          />
        </div>
      </section>

      <ProductSpecs
        model={product.model}
        brand={product.brand}
        specs={product.specs}
      />

      <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Publicado por</h2>

          <p>
            {product.merchant.fullName} (@{product.merchant.id})
          </p>

          <div className="flex items-center gap-2 text-base">
            <MapPin className="w-5 h-5" />
            <span>
              {product.merchant.country}, {product.merchant.state},{" "}
              {product.merchant.city}
            </span>
          </div>
        </div>

        <div className="flex justify-center md:justify-center">
          <ProductStoryCardModal
            imageCardUrl={getCatalogImagePath(
              product.merchant.id,
              product.card_pic
            )}
          />
        </div>
      </section>
    </div>
  );
}
