import path from "path";
import { UserRole } from "../models/user.model";
import { ProductRepository } from "../repositories/ProductRepository";
import { BaseService } from "./BaseService";
import fs from 'fs'
import { ShopRepository } from "../repositories/ShopRepository";
export class ProductService extends BaseService<any> {
  private shopRepository: ShopRepository;

  constructor() {
    const repo = new ProductRepository();
    super(repo);
    this.shopRepository = new ShopRepository();

  }

  async createProduct(data: {
    name: string;
    price: number;
    category: string;
    stock?: number;
    tenantId: string;
    shopId: string;
    imageUrl?: string | null;
  }) {

    const now = new Date();

    const name = data.name.trim();

    const existingProduct = await this.repository.findOne({
      where: {
        shopId: data.shopId,
        name: name,
      },
    });

    if (existingProduct) {
      throw new Error("Product with this name already exists in this shop");
    }

    const product = await this.repository.create({
      tenantId: data.tenantId,
      shopId: data.shopId,
      name: name,
      price: data.price,
      category: data.category,
      stock: data.stock ?? 0,
      imageUrl: data.imageUrl ?? null,
      createdAt: now,
      updatedAt: now,
    });

    return product;
  }

  async getProducts(user: {
    role: string;
    tenantId?: string;
    shopId?: string;
  }) {

    switch (user.role) {

      case UserRole.SUPER_ADMIN:
        return this.repository.findAll();

      case UserRole.ADMIN:
        return this.repository.findAll({
          where: { tenantId: user.tenantId }
        });

      case UserRole.USER:
        return this.repository.findAll({
          where: { shopId: user.shopId }
        });

      default:
        return [];
    }
  }

  async updateProduct(
    productId: string,
    data: {
      name?: string;
      price?: number;
      category?: string;
      stock?: number;
      imageUrl?: string;
    },
    user: { tenantId?: string; shopId?: string }
  ) {

    const product = await this.repository.findOne({
      where: {
        id: productId,
        tenantId: user.tenantId,
        shopId: user.shopId
      }
    });

    if (!product) {
      throw new Error("Product not found");
    }
    if (data.imageUrl && product.imageUrl) {

      const oldPath = path.join(
        process.cwd(),
        "src/uploads",
        product.imageUrl.split("/uploads/")[1]
      );

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await product.update({
      ...data,
      updatedAt: new Date()
    });

    return product;
  }

  async deleteProduct(
    productId: string,
    user: { tenantId?: string; shopId?: string }
  ) {

    const product = await this.repository.findOne({
      where: {
        id: productId,
        tenantId: user.tenantId,
        shopId: user.shopId
      }
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.imageUrl) {

      const imagePath = path.join(
        process.cwd(),
        "src/uploads",
        product.imageUrl.split("/uploads/")[1]
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await product.destroy();

    return { deleted: true };
  }
}