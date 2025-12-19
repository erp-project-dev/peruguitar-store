/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs/promises";
import path from "path";

import { ProductService } from "./product.service";
import { ApplicationError } from "../shared/error";
import { PUBLIC_MERCHANT_DIRECTORY } from "../shared/constants";

export class ProductImageRemoveService {
  private readonly publicCatalogDirectory = path.resolve(
    process.cwd(),
    PUBLIC_MERCHANT_DIRECTORY
  );

  private readonly productService = new ProductService();

  async remove(productId: string, imageName: string): Promise<string[]> {
    const product = await this.productService.findById(productId);

    if (!product.images.includes(imageName)) {
      throw new ApplicationError(
        "not-found",
        "Image does not belong to product"
      );
    }

    const imagePath = path.join(this.publicCatalogDirectory, imageName);

    await this.deleteFileIfExists(imagePath);

    const images = product.images.filter((img) => img !== imageName);

    await this.productService.update(productId, { images });

    return images;
  }

  private async deleteFileIfExists(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (e: any) {
      if (e.code !== "ENOENT") {
        throw e;
      }
    }
  }
}
