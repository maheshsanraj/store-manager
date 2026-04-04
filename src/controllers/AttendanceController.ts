import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { AttendanceService } from "../services/AttendanceService";
import { UserRole } from "../models/user.model";

export class AttendanceController extends BaseController {
  private attendanceService = new AttendanceService();

  bulkCreateAttendance = async (req: Request, res: Response) => {
    const { attendances } = req.body!;
    const result =
      await this.attendanceService.bulkCreateAttendance(attendances);
    const { message, ...data } = result;
    return this.handleResponse(res, data, message);
  };
  getAttendances = async (req: Request, res: Response) => {
    const { cursor, limit, shopId, employeeId, startDate, endDate } = req.query;

    const user = req.user!;

    let query: any = {
      cursor,
      limit: Number(limit) || 10,
    };

    if (user.role === UserRole.USER) {
      query.tenantId = user.tenantId;
      query.shopId = user.shopId;

      const today = new Date().toISOString().split("T")[0];

      query.startDate = startDate || today;
      query.endDate = endDate || today;

      if (employeeId) {
        query.employeeId = employeeId;
      }
    }

    if (user.role === UserRole.ADMIN) {
      query.tenantId = user.tenantId;

      if (!shopId) {
        return this.handleResponse(res, null, "shopId is required for admin");
      }

      query.shopId = shopId;

      if (startDate && endDate) {
        query.startDate = startDate;
        query.endDate = endDate;
      }

      if (employeeId) {
        query.employeeId = employeeId;
      }
    }
    console.log(query);
    const data = await this.attendanceService.getAttendances(query);

    return this.handleResponse(res, data, "Attendances fetched successfully");
  };
  clearAttendances = async (req: Request, res: Response) => {
    const { tenantId, shopId, employeeId, startDate, endDate } = req.query;

    const user = req.user!;

    let query: any = {};

    if (user.role === UserRole.USER) {
      query.tenantId = user.tenantId;
      query.shopId = user.shopId;

      if (employeeId) {
        query.employeeId = employeeId;
      }

      if (startDate && endDate) {
        query.startDate = startDate;
        query.endDate = endDate;
      }
    }

    if (user.role === UserRole.ADMIN) {
      if (!shopId) {
        return this.handleResponse(res, null, "shopId is required for admin");
      }

      query.tenantId = tenantId;
      query.shopId = shopId;

      if (employeeId) {
        query.employeeId = employeeId;
      }

      if (startDate && endDate) {
        query.startDate = startDate;
        query.endDate = endDate;
      }
    }

    const data = await this.attendanceService.clearAttendances(query);

    return this.handleResponse(res, data, "Attendances cleared successfully");
  };
}
