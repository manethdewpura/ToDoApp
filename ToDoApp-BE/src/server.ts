import "reflect-metadata";
import express from "express";
import cors from "cors";
import { serverConfig, testConnection } from "./config/index.js";
import routes from "./routes/index.js";
import {
  errorHandler,
  notFoundHandler,
  requestLogger,
} from "./middleware/index.js";
import { logger } from "./utils/index.js";

const app = express();

// Middleware
app.use(cors({ origin: serverConfig.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (only in development)
if (serverConfig.env === "development") {
  app.use(requestLogger);
}

// Routes
app.use(serverConfig.apiPrefix, routes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Initialize Sequelize and start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Start server
    const server = app.listen(serverConfig.port, () => {
      logger.info(`Server is running on port ${serverConfig.port}`);
      logger.info(`Environment: ${serverConfig.env}`);
      logger.info(`API Prefix: ${serverConfig.apiPrefix}`);
      logger.info(`Using: Sequelize TypeScript ORM`);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      logger.info("SIGTERM signal received: closing HTTP server");
      server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      logger.info("SIGINT signal received: closing HTTP server");
      server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
