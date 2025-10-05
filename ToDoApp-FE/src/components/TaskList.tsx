import type { Task } from '../types';
import { TaskCard } from './TaskCard';
import { EmptyState } from './EmptyState';

interface TaskListProps {
  tasks: Task[];
  onCompleteTask: (taskId: number) => void;
}

export function TaskList({ tasks, onCompleteTask }: TaskListProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Recent Tasks</h2>
        <span className="bg-indigo-100 text-indigo-800 text-sm font-semibold px-3 py-1 rounded-full">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {tasks.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={onCompleteTask}
                index={index}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">
            Showing the 5 most recent incomplete tasks
          </p>
        </>
      )}
    </div>
  );
}
