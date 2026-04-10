"use strict";

require("dotenv").config();

const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPin = await bcrypt.hash(process.env.ADMIN_PIN, 10);

    const existingAdmin = await queryInterface.rawSelect(
      "users",
      {
        where: { mobileNumber: process.env.ADMIN_MOBILE },
      },
      ["id"]
    );

    if (!existingAdmin) {
      await queryInterface.bulkInsert("users", [
        {
          id: uuidv4(),
          name: process.env.ADMIN_NAME,
          mobileNumber: process.env.ADMIN_MOBILE,
          email: process.env.ADMIN_EMAIL,
          pin: hashedPin,
          role: process.env.ADMIN_ROLE || "SUPER_ADMIN",
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
      mobileNumber: process.env.ADMIN_MOBILE,
    });
  },
};