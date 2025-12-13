import { Calendar, MapPin } from "lucide-react";

import { CatalogGetCommand } from "@/app/commands/catalog/index.command";
import { ProductGetCommand } from "@/app/commands/product/index.command";

import ProductGallery from "./components/ProductGallery";
import ProductCallToAction from "./components/ProductCallToAction";
import ProductSpecs from "./components/ProductSpecs";
import {
  explainProductType,
  getCatalogImagePath,
  translateProductType,
} from "../helpers/product.helper";
import ProductStatus from "./components/ProductStatus";
import ProductStoryCardModal from "./components/ProductStoryCardModal";
import { getBasePath } from "../helpers/path.helper";

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
            url: getBasePath(
              getCatalogImagePath(product.merchant.id, product.pic_1)
            ),
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

  const pics = [
    product.pic_1,
    product.pic_2,
    product.pic_3,
    product.pic_4,
    product.pic_5,
    product.pic_6,
  ].filter(Boolean) as string[];

  return (
    <section className="max-w-5xl mx-auto flex flex-col">
      <h1 className="text-5xl font-bold mb-5">{product.name}</h1>

      <ProductGallery
        productName={product.name}
        price={product.price}
        merchantId={product.merchant.id}
        pics={pics}
      />

      <ProductCallToAction
        merchantName={product.merchant.firstName}
        productId={product.id}
        productName={product.name}
        currency={product.currency}
        price={product.price}
        priceType={product.priceType}
        whatsapp={product.merchant.whatsapp}
        country={product.merchant.country}
      />

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
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
      </div>

      <div className="mt-10 max-w-2xl mx-auto text-center py-6 border-y border-gray-400 border-dashed space-y-2">
        <h2 className="text-xl font-semibold uppercase">
          {translateProductType(product.type)}
        </h2>

        <p className="text-gray-600 leading-relaxed italic">
          {explainProductType(product.type)}
        </p>
      </div>

      <ProductSpecs
        model={product.model}
        brand={product.brand.name}
        specs={product.specs}
      />

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-2">
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

          <div className="flex items-center gap-2 text-base">
            <Calendar className="w-5 h-5" />
            <span>
              Desde el {product.publishDate.toLocaleDateString("es-PE")}
            </span>
          </div>

          <p className="italic text-gray-600"></p>
        </div>

        <div className="flex justify-center md:justify-center">
          <ProductStoryCardModal
            imageCardUrl={getCatalogImagePath(
              product.merchant.id,
              product.card_pic
            )}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="max-w-full rounded-md bg-gray-200 mt-10 px-6 py-6 text-center text-sm text-gray-900">
          <p>
            <strong>Peru Guitar</strong> es una plataforma de anuncios
            clasificados. No participamos en la venta ni intermediamos en las
            transacciones de los productos publicados. La responsabilidad de la
            compra y venta recae exclusivamente en el <strong>comprador</strong>{" "}
            y el <strong>vendedor</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}
