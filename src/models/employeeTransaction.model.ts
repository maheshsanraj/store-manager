import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export enum EmployeeTransactionType {
  ADVANCE = "advance",
  BONUS = "bonus",
}

interface EmployeeTransactionAttributes {
  id: string;
  tenantId: string;
  shopId: string;
  employeeId: string;
  type: EmployeeTransactionType;
  amount: number;
  date: string;
  createdBy: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type EmployeeTransactionCreationAttributes = Optional<
  EmployeeTransactionAttributes,
  "id" | "description"
>;

export class EmployeeTransaction
  extends Model<
    EmployeeTransactionAttributes,
    EmployeeTransactionCreationAttributes
  >
  implements EmployeeTransactionAttributes
{
  public id!: string;
  public tenantId!: string;
  public shopId!: string;
  public employeeId!: string;
  public type!: EmployeeTransactionType;
  public amount!: number;
  public date!: string;
  public createdBy!: string;
  public description?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  static associate(models: any) {
    EmployeeTransaction.belongsTo(models.Employee, {
      foreignKey: "employeeId",
      as: "employee",
      onDelete: "CASCADE",
    });

    EmployeeTransaction.belongsTo(models.Shop, {
      foreignKey: "shopId",
      as: "shop",
      onDelete: "CASCADE",
    });

    EmployeeTransaction.belongsTo(models.User, {
      foreignKey: "createdBy",
      as: "creator",
      onDelete: "CASCADE",
    });
  }
}

EmployeeTransaction.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    tenantId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    shopId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    employeeId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("advance", "bonus", "salary_paid"),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "employee_transactions",
    timestamps: true,
    indexes: [
      {
        fields: ["tenantId", "shopId", "date"],
      },
      {
        fields: ["employeeId", "date"],
      },
      {
        fields: ["tenantId", "employeeId"],
      },
    ],
  },
);
