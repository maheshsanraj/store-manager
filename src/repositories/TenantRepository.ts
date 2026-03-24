import { Tenant } from "../models/tenant.model"
import { BaseRepository } from "./BaseRepository";

export class TenantRepository extends BaseRepository<Tenant> {
  constructor() {
    super(Tenant);
  }
  
}