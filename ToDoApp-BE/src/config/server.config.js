import dotenv from "dotenv";
dotenv.config();
export const serverConfig = {
    port: parseInt(process.env.PORT || "3000", 10),
    env: process.env.NODE_ENV || "development",
    corsOrigin: process.env.CORS_ORIGIN || "*",
    apiPrefix: process.env.API_PREFIX || "/api",
};