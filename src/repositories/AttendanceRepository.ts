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
    const { cursor, limit = 10, tenantId, shopId, employeeId, startDate, endDate } = query;

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
  async clearAttendances(query: { tenantId?: string; shopId?: string; employeeId?: string; startDate?: string; endDate?: string }) {
    const { tenantId, shopId, employeeId, startDate, endDate } = query;

    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (shopId) where.shopId = shopId;
    if (employeeId) where.employeeId = employeeId;
    if (startDate && endDate) where.date = { [Op.between]: [startDate, endDate] };

    return this.model.destroy({ where });
  }
}