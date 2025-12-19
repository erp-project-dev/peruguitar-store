/* eslint-disable @typescript-eslint/no-explicit-any */

import { ProductService } from "./product.service";
import { ApplicationError } from "../shared/error";

export class ProductImageReorderService {
  private readonly productService = new ProductService();

  async handle(productId: string, images: string[]): Promise<string[]> {
    const { images: originalImages } = await this.productService.findById(
      productId
    );

    this.validateImagesReorder(originalImages, images);

    await this.productService.update(productId, { images });

    return images;
  }

  private validateImagesReorder(
    currentImages: string[],
    nextImages: string[]
  ): void {
    if (currentImages.length !== nextImages.length) {
      throw new ApplicationError(
        "not-found",
        "Image list does not match product images"
      );
    }

    const currentSet = new Set(currentImages);

    for (const img of nextImages) {
      if (!currentSet.has(img)) {
        throw new ApplicationError(
          "not-found",
          `Image does not belong to product: ${img}`
        );
      }
    }
  }
}
