"use client";

import Input from "@/app/components/Form/Input";
import Select from "@/app/components/Form/Select";

import { OrderItem } from "@/infrastracture/domain/order.entity";
import { Product } from "@/infrastracture/domain/product.entity";

interface OrderFormItemsProps {
  items: OrderItem[];
  products: Product[];
  currency: string;
  onChange: (items: OrderItem[]) => void;
  readonly?: boolean;
}

export default function OrderFormItems({
  items,
  products,
  currency,
  onChange,
  readonly = false,
}: OrderFormItemsProps) {
  /* ---------- ADD PRODUCT ---------- */
  const addProduct = (productId: string) => {
    if (readonly) return;

    const product = products.find((p) => p._id === productId);
    if (!product) return;

    if (items.some((i) => i.product_id === product._id)) return;

    const price = product.price ?? 0;

    const newItem: OrderItem = {
      type: "store",
      product_id: product._id,
      name: product.name,
      quantity: 1,
      price,
      total: price,
    };

    onChange([...items, newItem]);
  };

  /* ---------- UPDATE ITEM ---------- */
  const updateItem = (index: number, patch: Partial<OrderItem>) => {
    if (readonly) return;

    const updated = [...items];
    const next = { ...updated[index], ...patch };
    next.total = next.quantity * next.price;

    updated[index] = next;
    onChange(updated);
  };

  /* ---------- REMOVE ITEM ---------- */
  const removeItem = (index: number) => {
    if (readonly) return;
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold">Items</h4>

      {/* ---------- ADD PRODUCT ---------- */}
      {!readonly && (
        <Select
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Add product..."
          onChange={(value) => value && addProduct(value)}
          options={products
            .filter((p) => !items.some((i) => i.product_id === p._id))
            .map((p) => ({
              label: p.name,
              value: p._id,
            }))}
        />
      )}

      {items.length === 0 && (
        <div className="text-sm text-neutral-400">No items added yet</div>
      )}

      {items.length > 0 && (
        <div className="border rounded-md overflow-hidden border-neutral-300">
          <table className="w-full text-sm">
            <thead className="bg-neutral-100">
              <tr>
                <th className="px-3 py-2 w-20 text-left">Type</th>
                <th className="px-3 py-2 text-left">Product</th>
                <th className="px-3 py-2 text-right w-20">Qty</th>
                <th className="px-3 py-2 text-right w-28">Price</th>
                <th className="px-3 py-2 text-right w-28">Total</th>
                {!readonly && <th className="w-10"></th>}
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr
                  key={item.product_id}
                  className="border-t border-neutral-300"
                >
                  <td className="px-3 py-2">{item.type}</td>

                  <td className="px-3 py-2">{item.name}</td>

                  <td className="px-3 py-2 text-right">
                    {readonly ? (
                      item.quantity
                    ) : (
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(value) =>
                          updateItem(index, {
                            quantity: Math.max(1, Number(value)),
                          })
                        }
                      />
                    )}
                  </td>

                  <td className="px-3 py-2 text-right">
                    {readonly ? (
                      item.price.toLocaleString("es-PE", {
                        style: "currency",
                        currency,
                      })
                    ) : (
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(value) =>
                          updateItem(index, { price: Number(value) })
                        }
                      />
                    )}
                  </td>

                  <td className="px-3 py-2 text-right font-medium">
                    {item.total.toLocaleString("es-PE", {
                      style: "currency",
                      currency,
                    })}
                  </td>

                  {!readonly && (
                    <td className="px-2 text-center">
                      <button
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                        onClick={() => removeItem(index)}
                      >
                        ✕
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
