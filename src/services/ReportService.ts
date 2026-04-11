import { ReportRepository } from "../repositories/ReportRepository";

export class ReportService {
  private repo = new ReportRepository();

  async getSummary(query: any) {
    const overallBilling = await this.repo.getTotalBilling(query);
    const overallExpense = await this.repo.getTotalExpense(query);

    const today = this.getTodayRange();

    const todayBilling = await this.repo.getTotalBilling({
      ...query,
      ...today,
    });

    const todayExpense = await this.repo.getTotalExpense({
      ...query,
      ...today,
    });

    return {
      overall: {
        totalBilling: overallBilling,
        totalExpense: overallExpense,
        netProfit: overallBilling - overallExpense,
      },
      today: {
        totalBilling: todayBilling,
        totalExpense: todayExpense,
        netProfit: todayBilling - todayExpense,
      },
    };
  }

  private getTodayRange() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return {
      startDate: start,
      endDate: end,
    };
  }
}