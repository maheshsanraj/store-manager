import { Router } from "express";
import userRoutes from "./user.routes";
import tenantRoutes from "./tenant.routes";
import shopRoutes from "./shop.routes";
import productRoutes from "./product.routes";
import billingRoutes from "./billing.routes";
import employeeRoutes from "./employee.routes";
import employeeTransactionRoutes from "./employeeTransaction.routes";
import attendanceRoutes from "./attendance.routes";
import expenseRoutes from "./expense.routes";

class BaseRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Health check
    this.router.get("/health", (req, res) => {
      res.status(200).json({
        success: true,
        message: "Server is running",
      });
    });

    this.router.use("/users", userRoutes);
    this.router.use("/tenants", tenantRoutes);
    this.router.use('/shops', shopRoutes);
    this.router.use('/products', productRoutes);
    this.router.use('/billings', billingRoutes);
    this.router.use('/employees', employeeRoutes);
    this.router.use('/attendances', attendanceRoutes);
    this.router.use('/employee-transactions', employeeTransactionRoutes);
    this.router.use('/expenses', expenseRoutes);
  }
}

export default new BaseRoutes().router;