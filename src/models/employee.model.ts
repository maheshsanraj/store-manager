import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/database";

export class Employee extends Model<
  InferAttributes<Employee>,
  InferCreationAttributes<Employee>
> {
  declare id: CreationOptional<string>;
  declare tenantId: string;
  declare shopId: string;
  declare userId: string;

  declare dailySalary: number;
  declare joiningDate: Date;
  declare isActive: CreationOptional<boolean>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static associate(models: any) {
    Employee.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE"
    });
    Employee.belongsTo(models.Shop, {
      foreignKey: "shopId",
      as: "shop",
      onDelete: "CASCADE"
    });
    Employee.belongsTo(models.Tenant, {
      foreignKey: "tenantId",
      as: "tenant",
      onDelete: "CASCADE"
    });
    Employee.hasMany(models.EmployeeTransaction, {
      foreignKey: "employeeId",
      as: "transactions",
      onDelete: "CASCADE"
    });

    Employee.hasMany(models.EmployeeAttendance, {
      foreignKey: "employeeId",
      as: "attendance",
      onDelete: "CASCADE"
    });
  }

}


Employee.init(
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    dailySalary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    joiningDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "employees",
    timestamps: true,

    indexes: [
      {
        fields: ["tenantId"],
      },
      {
        fields: ["shopId"],
      },
      {
        fields: ["userId"],
      },
      {
        fields: ["tenantId", "shopId", "userId"],
      },
    ],
  }
);

