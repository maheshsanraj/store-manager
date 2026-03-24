import { Shop } from "../models/shop.model";
import { BaseRepository } from "./BaseRepository";

export class ShopRepository extends BaseRepository<Shop> {
  constructor() {
    super(Shop);
  }
}