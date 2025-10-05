import type { Task } from "../types";
import { FaRegCheckCircle } from "react-icons/fa";

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: number) => void;
  index: number;
}

export function TaskCard({ task, onComplete, index }: TaskCardProps) {
  return (
    <div
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all bg-gradient-to-r from-white to-gray-50 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 break-words">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-gray-600 text-sm mb-2 break-words">
              {task.description}
            </p>
          )}
          <p className="text-xs text-gray-400">
            Created: {new Date(task.createdAt).toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => onComplete(task.id)}
          className="flex-shrink-0 flex items-center justify-center hover:text-green-600 text-green-500 w-20 h-10  transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          title="Mark as complete"
        >
          <FaRegCheckCircle className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
