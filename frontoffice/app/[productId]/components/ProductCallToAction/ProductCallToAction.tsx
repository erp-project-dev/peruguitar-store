import { ProductPageViewModel } from "@/features/commands/product/index.type";
import {
  getCatalogImagePath,
  translatePriceType,
  translateProductCondition,
  translateProductConditionScore,
} from "@/features/helpers/product.helper";

import ProductStoryCard from "./components/ProductStoryCard";
import ProductWhatsappButton from "./components/ProductWhatsapButton";
import ProductMerchantInfo from "./components/ProductMerchantInfo";
import ProductConditionInfo from "./components/ProductConditionInfo";

interface ProductCallToActionProps {
  product: ProductPageViewModel;
}

export default function ProductCallToAction(props: ProductCallToActionProps) {
  const { product } = props;

  return (
    <aside className="self-start space-y-6 rounded-xl bg-gray-100 p-6 md:shadow-[0_4px_12px_rgba(55,65,81,0.15)]">
      <div className="space-y-1">
        <h1
          className={`text-3xl font-bold leading-8 ${
            product.isSold ? "line-through" : ""
          }`}
        >
          {product.name}
        </h1>

        <div className="flex gap-2 items-center">
          {product.price && product.price_type && (
            <>
              <p
                className={`text-2xl font-semibold dashed ${
                  product.isSold ? "line-through" : ""
                }`}
              >
                {product.price.toLocaleString("es-PE", {
                  style: "currency",
                  currency: product.currency,
                })}
              </p>
              <span>—</span>
              <span className="text-gray-700 italic">
                {translatePriceType(product.price_type)}
              </span>
            </>
          )}
        </div>
      </div>

      <ProductWhatsappButton
        merchantCountry={product.merchant.country}
        merchantName={product.merchant.firstName}
        phoneNumber={product.merchant.whatsapp}
        productId={product.id}
        productName={product.name}
        disabled={product.isSold}
      />

      {product.condition && product.condition_score && (
        <ProductConditionInfo
          label={translateProductCondition(product.condition)}
          description={translateProductConditionScore(product.condition_score)}
          score={product.condition_score}
        />
      )}

      <div className="border-t border-b border-dashed border-gray-300 pt-4 pb-4">
        <div className="grid grid-cols-[3fr_1fr] items-center gap-4 text-sm text-gray-700">
          <ProductMerchantInfo
            fullName={product.merchant.fullName}
            country={product.merchant.country}
            state={product.merchant.state}
            city={product.merchant.city}
            publishDate={product.publishDate}
          />

          {!product.isSold && (
            <ProductStoryCard
              imageCardUrl={getCatalogImagePath(product.card_pic)}
            />
          )}
        </div>
      </div>

      {product.type && (
        <p className="text-sm text-gray-600 leading-relaxed">
          <strong className="uppercase">{product.type.name}</strong>:{" "}
          {product.type.description}
        </p>
      )}
    </aside>
  );
}
