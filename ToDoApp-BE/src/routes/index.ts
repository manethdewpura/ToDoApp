import { Router } from "express";
import taskRoutes from "./task.routes.js";

const router = Router();

// Health check route
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Task routes (using Sequelize TypeScript ORM)
router.use("/tasks", taskRoutes);

export default router;

