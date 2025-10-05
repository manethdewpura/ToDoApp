import { Pool } from "pg";
import { databaseConfig } from "./config/index.js";

export const pool = new Pool(databaseConfig);

// Test database connection
pool.on("connect", () => {
  console.log("Database connected successfully");
});

pool.on("error", (err: Error) => {
  console.error("Unexpected database error:", err);
  process.exit(-1);
});
