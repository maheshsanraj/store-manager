"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tenants", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      subscriptionStatus: {
        type: Sequelize.ENUM("TRIAL", "ACTIVE", "SUSPENDED"),
        allowNull: false,
        defaultValue: "TRIAL",
      },
      shopLimit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 2,
      },
      userLimitPerShop: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 10,
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

    await queryInterface.addIndex("tenants", ["email"], {
      unique: true,
      name: "tenants_email_unique",
    });
    await queryInterface.addIndex("tenants", ["isActive"], {
      name: "tenants_isActive_index",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("tenants");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_tenants_subscriptionStatus";'
    );
  },
};