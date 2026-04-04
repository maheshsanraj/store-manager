import { BaseRepository } from "./BaseRepository";
import { EmployeeAttendance } from "../models/employeeAttendance.model";
import { Op } from "sequelize";

interface AttendanceQuery {
  cursor?: string;
  limit?: number;
  tenantId?: string;
  shopId?: string;
  employeeId?: string;
  startDate?: string;
  endDate?: string;
}
export class AttendanceRepository extends BaseRepository<EmployeeAttendance> {
  constructor() {
    super(EmployeeAttendance);
  }
  async getAttendances(query: AttendanceQuery) {
    const {
      cursor,
      limit = 10,
      tenantId,
      shopId,
      employeeId,
      startDate,
      endDate,
    } = query;

    const where: any = {};

    if (cursor) where.id = { [Op.gt]: cursor };
    if (tenantId) where.tenantId = tenantId;
    if (shopId) where.shopId = shopId;
    if (employeeId) where.employeeId = employeeId;
    if (startDate && endDate) {
      where.date = { [Op.between]: [startDate, endDate] };
    }

    const attendances = await this.model.findAll({
      where,
      limit,
      order: [["id", "ASC"]],
    });

    return attendances;
  }
  async clearAttendances(query: {
    tenantId?: string;
    shopId?: string;
    employeeId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const { tenantId, shopId, employeeId, startDate, endDate } = query;

    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (shopId) where.shopId = shopId;
    if (employeeId) where.employeeId = employeeId;
    if (startDate && endDate)
      where.date = { [Op.between]: [startDate, endDate] };

    return this.model.destroy({ where });
  }
  async countPresentDays(employeeId: string, startDate?: Date, endDate?: Date) {
    const where: any = {
      employeeId,
      present: true,
    };

    if (startDate && endDate) {
      where.date = {
        [Op.gte]: new Date(startDate.setHours(0, 0, 0, 0)),
        [Op.lte]: new Date(endDate.setHours(23, 59, 59, 999)),
      };
    }

    return this.model.count({ where });
  }
  async countAbsentDays(employeeId: string, startDate?: Date, endDate?: Date) {
    const where: any = {
      employeeId,
      present: false,
    };

    if (startDate && endDate) {
      where.date = {
        [Op.gte]: new Date(startDate.setHours(0, 0, 0, 0)),
        [Op.lte]: new Date(endDate.setHours(23, 59, 59, 999)),
      };
    }

    return this.model.count({ where });
  }
  async countTotalDays(employeeId: string) {
    return this.model.count({
      where: {
        employeeId,
      },
    });
  }
  async findExistingFull(records: any[]) {
    return this.model.findAll({
      attributes: ["tenantId", "shopId", "employeeId", "date", "present"],
      where: {
        [Op.or]: records,
      },
    });
  }
  async bulkUpsert(data: any[]) {
    return this.model.bulkCreate(data, {
      updateOnDuplicate: ["present", "updatedAt", "markedBy"],
    });
  }
}
