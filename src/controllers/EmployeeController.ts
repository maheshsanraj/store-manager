import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { EmployeeService } from "../services/EmployeeService";
import { UserRole } from "../models/user.model";

export class EmployeeController extends BaseController {
  private employeeService = new EmployeeService();

  createEmployee = async (req: Request, res: Response) => {
    const data = {
      ...req.body,
      shopId: req.user!.shopId,
      tenantId: req.user!.tenantId
    };
    const result = await this.employeeService.createEmployee(data);
    return this.handleResponse(res, result, "Employee created successfully")
  }
  getEmployees = async (req: Request, res: Response) => {

    const { cursor, limit } = req.query;
    const user = req.user!;

    const query: any = {
      cursor,
      limit: Number(limit) || 10
    };

    if (user.role === UserRole.USER) {
      query.tenantId = user.tenantId;
      query.shopId = user.shopId;
    }

    const data = await this.employeeService.getEmployees(query);
    return this.handleResponse(res, data, "Employees fetched successfully");
  };

  updateEmployee = async (req: Request, res: Response) => {

    const { id } = req.params;

    const data = await this.employeeService.updateEmployee(
      id as string,
      req.body,
      req.user!
    );
    return this.handleResponse(res, data, "Employee updated successfully");
  };

  clearEmployees = async (req: Request, res: Response) => {

    const user = req.user!;

    const query: any = {};

    if (user.role === UserRole.USER) {
      query.tenantId = user.tenantId;
      query.shopId = user.shopId;
    }

    const data = await this.employeeService.clearEmployees(query);
    return this.handleResponse(res, data, "Employees cleared successfully");
  };
}