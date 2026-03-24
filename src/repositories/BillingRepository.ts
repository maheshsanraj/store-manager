import { Op } from "sequelize";
import { Billing } from "../models/billing.model";
import { BaseRepository } from "./BaseRepository";

interface BillingQuery {
  cursor?: string;
  limit?: number;
  tenantId?: string;
  shopId?: string;
  startDate?: string;
  endDate?: string;
}

export class BillingRepository extends BaseRepository<Billing> {
  constructor() {
    super(Billing);
  }

  async getBillings(query: BillingQuery) {
    const {
      cursor,
      limit = 10,
      tenantId,
      shopId,
      startDate,
      endDate,
    } = query;

    const where: any = {};

    if (cursor) {
      where.id = { [Op.gt]: cursor };
    }

    if (tenantId) {
      where.tenantId = tenantId;
    }

    if (shopId) {
      where.shopId = shopId;
    }

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    const billings = await this.model.findAll({
      where,
      limit,
      order: [["id", "ASC"]],
    });

    return billings;
  }

  async clearBillings(query: {
    tenantId?: string;
    shopId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const { tenantId, shopId, startDate, endDate } = query;

    const where: any = {};

    if (tenantId) {
      where.tenantId = tenantId;
    }

    if (shopId) {
      where.shopId = shopId;
    }

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate],
      };
    }

    return this.model.destroy({ where });
  }
  async getBillingsStats(query: {
    tenantId?: string;
    shopId?: string;
    startDate?: string;
    endDate?: string;
  }) {

    const { tenantId, shopId, startDate, endDate } = query;

    const where: any = {};

    if (tenantId) {
      where.tenantId = tenantId;
    }

    if (shopId) {
      where.shopId = shopId;
    }

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate],
      };
    }
    const sequelize = this.model.sequelize!;
    const result = await this.model.findOne({
      where,
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "totalBillings"],
        [sequelize.fn("SUM", sequelize.col("totalAmount")), "totalAmount"]
      ],
      raw: true
    });

    return result;
  }
}