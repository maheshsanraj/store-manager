import app from "./app";
import { sequelize } from "./config/database";

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      console.log("Database synced (development mode)");
    }

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
};

startServer();