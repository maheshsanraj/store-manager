import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/database";

export enum SubscriptionStatus {
  TRIAL = "TRIAL",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
}

export class Tenant extends Model<
  InferAttributes<Tenant>,
  InferCreationAttributes<Tenant>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare email: string;
  declare subscriptionStatus: CreationOptional<SubscriptionStatus>;
  declare shopLimit: CreationOptional<number>;
  declare userLimitPerShop: CreationOptional<number>;
  declare isActive: CreationOptional<boolean>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static associate(models: any) {
    Tenant.hasMany(models.Shop, {
      foreignKey: "tenanntId",
      as: "shops",
      onDelete: "CASCADE",
      hooks: true,
    });
    Tenant.hasMany(models.User, {
      foreignKey: "tenantId",
      as: "users",
      onDelete: "CASCADE",
      hooks: true,
    });
  }
}

Tenant.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    subscriptionStatus: {
      type: DataTypes.ENUM(...Object.values(SubscriptionStatus)),
      defaultValue: SubscriptionStatus.TRIAL,
      allowNull: false,
    },
    shopLimit: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
      allowNull: false,
    },
    userLimitPerShop: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "tenants",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["email"],
      },
      {
        fields: ["isActive"],
      },
    ],
  },
);
