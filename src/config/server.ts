import express from "express";
import bodyParser from "body-parser";
import pool from "./db";
import { AwilixContainer } from "awilix";
import mainRoutes from "../routes/routes";
import { errorMiddleware } from "../middlewares/errorMiddleware";

export const startServer = async (container: AwilixContainer) => {
  const app = express();
  app.use(bodyParser.json());

  // Attempt to connect to the database before starting the server
  try {
    await pool.connect();
    console.log("✅ Connected to PostgreSQL Database");

    // Use the main routes file
    app.use("/api", mainRoutes(container));

    app.use(errorMiddleware);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error("❌ Database connection failed", error);
    process.exit(1);
  }
};
