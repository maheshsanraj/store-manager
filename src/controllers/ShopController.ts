import { NextFunction, Request, Response } from "express";
import { BaseController } from "./BaseController";
import { ShopService } from "../services/ShopService";

export class ShopController extends BaseController {
  private shopService = new ShopService();

  createShop = async (req: Request, res: Response, next: NextFunction) => {
    const data = {
      ...req.body,
      ownerId: req.user!.id,
      tenantId: req.user!.tenantId
    };

    const shop = await this.shopService.createShop(data);
    return this.handleResponse(res, shop, "Shop created successfully");
  };

  getShops = async (req: Request, res: Response, next: NextFunction) => {
    const shops = await this.shopService.getShops({
      role: req.user!.role,
      tenantId: req.user!.tenantId,
      shopId: req.user!.shopId
    });

    return this.handleResponse(res, shops, "Shops fetched successfully");
  };
  getShopById = async (req: Request, res: Response) => {

    const shop = await this.shopService.getShopById(
      req.params.id as string,
      {
        role: req.user!.role,
        tenantId: req.user!.tenantId,
        shopId: req.user!.shopId
      }
    );

    return this.handleResponse(res, shop, "Shop fetched successfully");
  };


  updateShop = async (req: Request, res: Response) => {

    const shop = await this.shopService.updateShop(
      req.params.id as string,
      req.body,
      {
        role: req.user!.role,
        tenantId: req.user!.tenantId,
        shopId: req.user!.shopId
      }
    );

    return this.handleResponse(res, shop, "Shop updated successfully");
  };


  deleteShop = async (req: Request, res: Response) => {
   const data = await this.shopService.deleteShop(
      req.params.id as string,
      {
        role: req.user!.role,
        tenantId: req.user!.tenantId,
        shopId: req.user!.shopId
      }
    );

    return this.handleResponse(res, data, "Shop deleted successfully");
  };
}