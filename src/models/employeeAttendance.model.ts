import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/database";

export class EmployeeAttendance extends Model<
  InferAttributes<EmployeeAttendance>,
  InferCreationAttributes<EmployeeAttendance>
> {
  declare id: CreationOptional<string>;

  declare tenantId: string;
  declare shopId: string;

  declare employeeId: string;
  declare markedBy: string;

  declare date: string;
  declare present: boolean;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static associate(models: any) {
    EmployeeAttendance.belongsTo(models.Employee, {
      foreignKey: "employeeId",
      as: "employee",
      onDelete: "CASCADE"
    });

    EmployeeAttendance.belongsTo(models.Shop, {
      foreignKey: "shopId",
      as: "shop",
      onDelete: "CASCADE"
    });

    EmployeeAttendance.belongsTo(models.User, {
      foreignKey: "markedBy",
      as: "markedByUser",
      onDelete: "CASCADE"
    });

  }
}

EmployeeAttendance.init(
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
    markedBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    present: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    tableName: "employee_attendance",
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
  }
);