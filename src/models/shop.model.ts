import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/database";

export class Shop extends Model<
  InferAttributes<Shop>,
  InferCreationAttributes<Shop>
> {
  declare id: CreationOptional<string>;
  declare tenantId: string;
  declare name: string;
  declare ownerId: string | null;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static associate(models: any) {
    Shop.hasMany(models.User, {
      foreignKey: "shopId",
      as: "users",
      onDelete: "CASCADE",
    });
    Shop.hasMany(models.Employee, {
      foreignKey: "shopId",
      as: "employees",
      onDelete: "CASCADE",
    });
    Shop.hasMany(models.Product, {
      foreignKey: "shopId",
      as: "products",
      onDelete: "CASCADE",
      hooks: true,
    });
    Shop.hasMany(models.Expense, {
      foreignKey: "shopId",
      as: "expenses",
      onDelete: "CASCADE",
    });
    Shop.hasMany(models.Billing, {
      foreignKey: "shopId",
      as: "billings",
      onDelete: "CASCADE",
    });
    Shop.belongsTo(models.Tenant, {
      foreignKey: "tenantId",
      as: "tenant",
      onDelete: "CASCADE",
    });
  }
}

Shop.init(
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.UUID,
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
    tableName: "shops",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["tenantId", "name"],
        name: "shops_tenant_name_unique",
      },
      {
        fields: ["tenantId"],
      },
    ],
  },
);
