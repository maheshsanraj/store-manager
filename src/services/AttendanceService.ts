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
    const keys = attendances.map((item) => ({
      tenantId: item.tenantId,
      shopId: item.shopId,
      employeeId: item.employeeId,
      date: item.date,
    }));

    const existing = await this.repository.findExistingFull(keys);

    const existingMap = new Map<string, any>();

    for (const e of existing) {
      const key = `${e.tenantId}_${e.shopId}_${e.employeeId}_${e.date}`;
      existingMap.set(key, e);
    }

    let createdCount = 0;
    let updatedCount = 0;
    let changedCount = 0;
    let unchangedCount = 0;

    const formattedData = attendances.map((item) => {
      const key = `${item.tenantId}_${item.shopId}_${item.employeeId}_${item.date}`;
      const existingRecord = existingMap.get(key);

      if (existingRecord) {
        updatedCount++;

        if (existingRecord.present !== item.present) {
          changedCount++;
        } else {
          unchangedCount++;
        }
      } else {
        createdCount++;
      }

      return {
        id: item.id ?? uuidv4(),
        tenantId: item.tenantId,
        shopId: item.shopId,
        employeeId: item.employeeId,
        markedBy: item.markedBy,
        date: item.date,
        present: !!item.present,
        createdAt: item.createdAt ?? new Date(),
        updatedAt: new Date(),
      };
    });

    await this.repository.bulkUpsert(formattedData);

    let message = `${createdCount} created, ${changedCount} updated, ${unchangedCount} already marked`;

    if (createdCount > 0 && updatedCount === 0) {
      message = "Attendance created successfully";
    }

    return {
      message,
      summary: {
        created: createdCount,
        updated: updatedCount,
        changed: changedCount,
        unchanged: unchangedCount,
      },
    };
  }
  async getAttendances(query: any) {
    const attendances = await this.repository.getAttendances(query);
    const nextCursor =
      attendances.length > 0 ? attendances[attendances.length - 1].id : null;

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
