import { MapPin } from "lucide-react";

import { CatalogHandler } from "@/app/handlers/catalog/index.handler";
import { ProductHandler } from "@/app/handlers/product/index.handler";

import ProductGallery from "./components/Gallery";
import ProductPurchaseInfo from "./components/PurchaseInfo";
import ProductSpecs from "./components/Specs";
import { getCatalogImagePath } from "../helpers/product.helper";

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
            url: `https://peruguitar.com/${getCatalogImagePath(
              product.merchant.id,
              product.pic_1
            )}`,
            width: 1200,
            height: 630,
          },
        ],
        url: `https://peruguitar.com/${product.id}`,
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
    product.pic_6,
  ].filter(Boolean) as string[];

  return (
    <div className="max-w-5xl mx-auto px-4 flex flex-col pb-20">
      <h1 className="text-5xl font-bold mb-5">{product.name}</h1>

      <ProductGallery merchantId={product.merchant.id} pics={pics} />

      <ProductPurchaseInfo
        merchantName={product.merchant.firstName}
        productName={product.name}
        price={product.price}
        score={product.statusScore}
        status={product.status}
        whatsapp={product.merchant.whatsapp}
      />

      <section className="max-w-5xl mx-auto mt-10 space-y-3">
        <h2 className="text-2xl font-semibold">Descripción</h2>
        <p className="leading-relaxed">{product.description}</p>
      </section>

      <ProductSpecs
        model={product.model}
        brand={product.brand}
        specs={product.specs}
      />

      <section className="mt-12 space-y-3">
        <h2 className="text-2xl font-semibold">Publicado por</h2>

        <p className="text-lg font-medium">
          {product.merchant.fullName} (@{product.merchant.id})
        </p>

        <div className="flex items-center gap-2 text-base">
          <MapPin className="w-5 h-5" />
          <span>
            {product.merchant.country}, {product.merchant.state},{" "}
            {product.merchant.city}
          </span>
        </div>
      </section>
    </div>
  );
}
