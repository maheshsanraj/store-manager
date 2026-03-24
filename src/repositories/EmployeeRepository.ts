import db from "../models";
import { Employee } from "../models/employee.model";
import { BaseRepository } from "./BaseRepository";
import { Op, Transaction } from "sequelize";

export class EmployeeRepository extends BaseRepository<Employee> {
  constructor() {
    super(Employee);
  }

  async createEmployee(
    data: Employee,
    transaction: Transaction
  ) {
    return this.model.create(data, { transaction });
  }
  async findEmployeeByUserId(
    userId: string,
    tenantId: string,
    shopId: string
  ) {
    return this.model.findOne({
      where: {
        userId,
        tenantId,
        shopId,
      },
    });
  }
  async getEmployees(query: any) {

    const where: any = {};

    if (query.tenantId) where.tenantId = query.tenantId;
    if (query.shopId) where.shopId = query.shopId;

    if (query.cursor) {
      where.id = {
        [Op.gt]: query.cursor
      };
    }

    return this.model.findAll({
      where,
      limit: query.limit,
      order: [["id", "ASC"]],
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["id", "name", "mobileNumber"]
        }
      ]
    });

  }

  async clearEmployees(query: any) {

    return this.model.destroy({
      where: {
        tenantId: query.tenantId,
        shopId: query.shopId
      }
    });

  }
}