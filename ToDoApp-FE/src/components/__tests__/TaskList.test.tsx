import { render, screen } from '@testing-library/react';
import { TaskList } from '../TaskList';
import type { Task } from '../../types';

const makeTask = (id: number, overrides: Partial<Task> = {}): Task => ({
  id,
  title: `Task ${id}`,
  description: `Desc ${id}`,
  isCompleted: false,
  createdAt: new Date(2024, 0, id).toISOString(),
  ...overrides,
});

describe('TaskList', () => {
  it('renders EmptyState when no tasks', () => {
    render(<TaskList tasks={[]} onCompleteTask={() => {}} />);
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
  });

  it('renders count badge with pluralization', () => {
    render(<TaskList tasks={[makeTask(1)]} onCompleteTask={() => {}} />);
    expect(screen.getByText(/1 task/)).toBeInTheDocument();

    render(<TaskList tasks={[makeTask(1), makeTask(2)]} onCompleteTask={() => {}} />);
    expect(screen.getByText(/2 tasks/)).toBeInTheDocument();
  });

  it('renders TaskCard items and helper text', () => {
    const tasks = [makeTask(1), makeTask(2), makeTask(3)];
    render(<TaskList tasks={tasks} onCompleteTask={() => {}} />);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
    expect(screen.getByText(/showing the 5 most recent incomplete tasks/i)).toBeInTheDocument();
  });
});


