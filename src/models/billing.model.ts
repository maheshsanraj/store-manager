import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface BillingAttributes {
  id: string;
  tenantId: string;
  shopId: string;
  name: string;
  price: number;
  quantity: number;
  totalAmount: number;
  date: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BillingCreationAttributes
  extends Optional<BillingAttributes, "id"> { }

export class Billing
  extends Model<BillingAttributes, BillingCreationAttributes>
  implements BillingAttributes {
  public id!: string;
  public tenantId!: string;
  public shopId!: string;
  public name!: string;
  public price!: number;
  public quantity!: number;
  public totalAmount!: number;
  public date!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  static associate(models: any) {

    Billing.belongsTo(models.Shop, {
      foreignKey: "shopId",
      as: "shop",
      onDelete: "CASCADE",
    });

    Billing.belongsTo(models.Tenant, {
      foreignKey: "tenantId",
      as: "tenant",
      onDelete: "CASCADE",
    });

  }
}

Billing.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tenantId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    shopId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
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
    tableName: "billings",
    timestamps: true,
  }
);