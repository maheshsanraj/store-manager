import fs from "fs";
import path from "path";
import { Sequelize, Model } from "sequelize";
import { sequelize } from "../config/database";

const basename = path.basename(__filename);

interface DbInterface {
  [key: string]: any;
  sequelize: Sequelize;
}

const db = {} as DbInterface;

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      (file.endsWith(".ts") || file.endsWith(".js"))
    );
  })
  .forEach((file) => {
    const module = require(path.join(__dirname, file));

    Object.keys(module).forEach((key) => {
      const model = module[key];

      if (model.prototype instanceof Model) {
        db[model.name] = model;
      }
    });
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

export default db;