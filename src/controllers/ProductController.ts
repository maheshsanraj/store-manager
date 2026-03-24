import { NextFunction, Request, Response } from "express";
import { BaseController } from "./BaseController";
import { ProductService } from "../services/ProductService";

export class ProductController extends BaseController {
  private productService = new ProductService();

  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      throw new Error("Product image is required");
    }
    const imageUrl = `${process.env.SERVER_URL}/uploads/${req.file.filename}`;

    const product = await this.productService.createProduct({
      ...req.body,
      tenantId: req.user.tenantId,
      shopId: req.user.shopId,
      imageUrl
    });

    return this.handleResponse(res, product, "Product created successfully");
  };

  getProducts = async (req: Request, res: Response, next: NextFunction) => {
    const products = await this.productService.getProducts({
      role: req.user.role,
      tenantId: req.user.tenantId,
      shopId: req.user.shopId
    });

    return this.handleResponse(res, products, "Shops fetched successfully");
  };

  updateProduct = async (req: Request, res: Response) => {
    let imageUrl: string | undefined;

    if (req.file) {
      imageUrl = `${process.env.SERVER_URL}/uploads/${req.file.filename}`;
    }

    const product = await this.productService.updateProduct(
      req.params.id as string,
      {
        ...req.body,
        imageUrl
      },
      req.user
    );

    return this.handleResponse(res, product, "Product updated successfully");
  };

  deleteProduct = async (req: Request, res: Response) => {

    const product = await this.productService.deleteProduct(
      req.params.id as string,
      req.user
    );

    return this.handleResponse(res, product, "Product deleted successfully");
  };
}