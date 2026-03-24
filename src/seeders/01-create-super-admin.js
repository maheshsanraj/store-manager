"use strict";

const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPin = await bcrypt.hash("123456", 10);

    const existingAdmin = await queryInterface.rawSelect(
      "users",
      {
        where: { mobileNumber: "9352363057" },
      },
      ["id"]
    );

    if (!existingAdmin) {
      await queryInterface.bulkInsert("users", [
        {
          id: uuidv4(),
          name: "Super Admin",
          mobileNumber: "9352363057",
          pin: hashedPin,
          role: "SUPER_ADMIN",
          isActive: true,
          tokenVersion: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", {
      mobileNumber: "9352363057",
    });
  },
};