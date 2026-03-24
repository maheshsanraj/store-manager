import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface ExpenseAttributes {
  id: string;
  tenantId: string;
  shopId: string;
  title: string;
  amount: number;
  date: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type ExpenseCreationAttributes = Optional<ExpenseAttributes, "id">;

export class Expense
  extends Model<ExpenseAttributes, ExpenseCreationAttributes>
  implements ExpenseAttributes {
  public id!: string;
  public tenantId!: string;
  public shopId!: string;
  public title!: string;
  public amount!: number;
  public date!: string;
  public createdBy!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  static associate(models: any) {

    Expense.belongsTo(models.Shop, {
      foreignKey: "shopId",
      as: "shop",
      onDelete: "CASCADE",
    });

    Expense.belongsTo(models.User, {
      foreignKey: "createdBy",
      as: "creator",
      onDelete: "CASCADE",
    });

    Expense.belongsTo(models.Tenant, {
      foreignKey: "tenantId",
      as: "tenant",
      onDelete: "CASCADE",
    });

  }
}

Expense.init(
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
    title: {
      type: DataTypes.STRING,
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
    tableName: "expenses",
    timestamps: true,
    indexes: [
      { fields: ["tenantId", "shopId", "date"] },
      { fields: ["date"] },
      { fields: ["tenantId", "date"] },
    ],
  }
);