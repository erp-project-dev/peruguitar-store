/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs/promises";
import path from "path";

import { MongoRepository } from "../repositories/mongo.repository";
import { Product } from "../domain/product.entity";
import { ProductService } from "./product.service";
import { ApplicationError } from "../shared/error";
import { PUBLIC_MERCHANT_DIRECTORY } from "../shared/constants";
import { ProductSchema } from "../schema/product.schema";

export class ProductImageRemoveService {
  private readonly publicCatalogDirectory = path.resolve(
    process.cwd(),
    PUBLIC_MERCHANT_DIRECTORY
  );

  private readonly repository = new MongoRepository<Product>(
    "catalog",
    ProductSchema
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

    const merchantDirectory = path.join(
      this.publicCatalogDirectory,
      product.merchant_id
    );

    const imagePath = path.join(merchantDirectory, imageName);

    await this.deleteFileIfExists(imagePath);

    const images = product.images.filter((img) => img !== imageName);

    await this.repository.update(productId, { images });

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
