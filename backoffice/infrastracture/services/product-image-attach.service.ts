import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

import { MongoRepository } from "../repositories/mongo.repository";
import { Product } from "../domain/product.entity";

import { ProductImagesSchema, ProductSchema } from "../schema/product.schema";
import { ProductService } from "./product.service";
import { ZodError } from "zod";
import { ApplicationError } from "../shared/error";
import { getZodMessage } from "../helpers/zod.helper";
import { PUBLIC_MERCHANT_DIRECTORY } from "../shared/constants";

type NewImageFile = {
  newName: string;
  file: File;
};

export class ProductImageAttachService {
  private readonly publicCatalogDirectory = path.resolve(
    process.cwd(),
    PUBLIC_MERCHANT_DIRECTORY
  );

  private readonly repository = new MongoRepository<Product>(
    "catalog",
    ProductSchema
  );

  private readonly productService = new ProductService();
  private readonly optzRatio = 0.05;

  async attach(productId: string, files: File[]): Promise<string[]> {
    const product = await this.productService.findById(productId);

    // 01. Prepare + validate images
    const newImages = this.prepareNewImages(productId, files);
    const images = [...product.images, ...newImages.map((i) => i.newName)];

    this.validateImages(images);

    // 02. Ensure merchant directory
    await this.createDirectoryIfNotExists(product.merchant_id);

    // 03. Move + optimize images
    await this.moveImages(product.merchant_id, newImages);

    // 04. Persist product images
    await this.repository.update(productId, { images });

    return images;
  }

  private validateImages(images: string[]) {
    try {
      ProductImagesSchema.parse(images);
    } catch (e) {
      if (e instanceof ZodError) {
        throw new ApplicationError("schema-invalid", getZodMessage(e));
      }
      throw e;
    }
  }

  private prepareNewImages(productId: string, files: File[]): NewImageFile[] {
    return files.map((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
      const shortId = crypto.randomUUID().split("-")[0];

      return {
        newName: `${productId}-${shortId}.${extension}`,
        file,
      };
    });
  }

  private async moveImages(
    merchantId: string,
    files: NewImageFile[]
  ): Promise<void> {
    const merchantDirectory = path.join(
      this.publicCatalogDirectory,
      merchantId
    );

    for (const { newName, file } of files) {
      const destinationPath = path.join(merchantDirectory, newName);

      const originalBuffer = Buffer.from(await file.arrayBuffer());
      const originalSize = originalBuffer.length;

      const ext = path.extname(newName).toLowerCase();

      let optimizedBuffer: Buffer;

      if (ext === ".png") {
        optimizedBuffer = await sharp(originalBuffer)
          .png({ compressionLevel: 9 })
          .toBuffer();
      } else {
        optimizedBuffer = await sharp(originalBuffer)
          .jpeg({ quality: 80, mozjpeg: true })
          .toBuffer();
      }

      const optimizedSize = optimizedBuffer.length;
      const ratio = (originalSize - optimizedSize) / originalSize;

      const finalBuffer =
        ratio >= this.optzRatio ? optimizedBuffer : originalBuffer;

      await fs.writeFile(destinationPath, finalBuffer);
    }
  }

  private async createDirectoryIfNotExists(merchantId: string): Promise<void> {
    const merchantDirectory = path.join(
      this.publicCatalogDirectory,
      merchantId
    );

    try {
      const stats = await fs.stat(merchantDirectory);

      if (!stats.isDirectory()) {
        throw new Error("Path exists but is not a directory");
      }
    } catch {
      await fs.mkdir(merchantDirectory, { recursive: true });
    }
  }
}
