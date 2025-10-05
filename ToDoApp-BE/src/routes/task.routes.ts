import { Router } from "express";
import { taskController } from "../controllers/index.js";
import { asyncHandler } from "../middleware/index.js";

const router = Router();

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Public
 */
router.post("/", asyncHandler(taskController.createTask.bind(taskController)));

/**
 * @route   GET /api/tasks
 * @desc    Get recent non-completed tasks (last 5)
 * @access  Public
 */
router.get("/", asyncHandler(taskController.getRecentTasks.bind(taskController)));

/**
 * @route   GET /api/tasks/:id
 * @desc    Get task by ID
 * @access  Public
 */
router.get("/:id", asyncHandler(taskController.getTaskById.bind(taskController)));

/**
 * @route   PATCH /api/tasks/:id/complete
 * @desc    Mark task as completed
 * @access  Public
 */
router.patch(
  "/:id/complete",
  asyncHandler(taskController.completeTask.bind(taskController))
);

export default router;

