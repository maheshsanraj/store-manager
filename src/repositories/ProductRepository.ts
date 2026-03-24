
import { Product } from "../models/product.model";
import { BaseRepository } from "./BaseRepository";

export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super(Product);
  }
}