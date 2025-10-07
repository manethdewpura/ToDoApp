import { Sequelize } from "sequelize-typescript";
import { TaskModel } from "../models/task.model.js";
import dotenv from "dotenv";

dotenv.config();

// Get password as string
const getPassword = (): string => {
  return process.env.DB_PASS || "postgres";
};

// Create Sequelize instance with TypeScript models
export const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USER || "postgres",
  password: getPassword(),
  database: process.env.DB_NAME || "todos",
  models: [TaskModel],
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Test database connection
export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("✅ Sequelize database connection established successfully");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    throw error;
  }
};

