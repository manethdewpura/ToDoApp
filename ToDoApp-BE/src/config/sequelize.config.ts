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
  models: [TaskModel], // Explicitly list models
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

// Sync database (only in development)
export const syncDatabase = async (options?: { force?: boolean; alter?: boolean }): Promise<void> => {
  try {
    const syncOptions = {
      force: options?.force || false,
      alter: options?.alter || false,
    };
    
    await sequelize.sync(syncOptions);
    
    if (syncOptions.force) {
      console.log(`✅ Database synchronized (force - tables dropped and recreated)`);
    } else if (syncOptions.alter) {
      console.log(`✅ Database synchronized (alter - columns updated)`);
    } else {
      console.log(`✅ Database synchronized (safe - creates tables if not exist)`);
    }
  } catch (error) {
    console.error("❌ Error synchronizing database:", error);
    throw error;
  }
};

