import { BaseService } from "./BaseService";
import { AttendanceRepository } from "../repositories/AttendanceRepository";
import { EmployeeAttendance } from "../models/employeeAttendance.model";
import { v4 as uuidv4 } from "uuid";

export class AttendanceService extends BaseService<any> {

  constructor() {
    const repo = new AttendanceRepository();
    super(repo);
  }
  async bulkCreateAttendance(attendances: EmployeeAttendance[]) {
    const formattedData = attendances.map(item => ({
      id: item.id ?? uuidv4(),

      tenantId: item.tenantId,
      shopId: item.shopId,
      employeeId: item.employeeId,
      markedBy: item.markedBy,

      date: item.date,

      present: !!item.present,

      createdAt: item.createdAt ?? new Date(),
      updatedAt: item.updatedAt ?? new Date(),
    }));

    return this.repository.bulkCreate(formattedData);
  }
  async getAttendances(query: any) {
    const attendances = await this.repository.getAttendances(query);
    const nextCursor = attendances.length > 0 ? attendances[attendances.length - 1].id : null;

    return {
      attendances,
      nextCursor,
      hasMore: attendances.length === (query.limit || 10),
    };
  }

  async clearAttendances(query: any) {
    const deletedCount = await this.repository.clearAttendances(query);
    return { deletedCount };
  }
}