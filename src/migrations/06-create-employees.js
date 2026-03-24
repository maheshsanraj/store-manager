"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("employees", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      tenantId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "tenants",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      shopId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "shops",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      dailySalary: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      joiningDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addIndex("employees", ["tenantId"]);
    await queryInterface.addIndex("employees", ["shopId"]);
    await queryInterface.addIndex("employees", ["userId"]);
    await queryInterface.addIndex("employees", ["tenantId", "shopId", "userId"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("employees");
  },
};