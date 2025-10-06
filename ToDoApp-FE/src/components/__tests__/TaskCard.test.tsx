import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from '../TaskCard';
import type { Task } from '../../types';

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: 1,
  title: 'Test Task',
  description: 'Do something',
  isCompleted: false,
  createdAt: new Date('2024-01-01T12:00:00Z').toISOString(),
  ...overrides,
});

describe('TaskCard', () => {
  it('renders title, optional description and created date', () => {
    const task = makeTask();
    render(<TaskCard task={task} onComplete={() => {}} index={0} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Do something')).toBeInTheDocument();
    expect(screen.getByText(/Created:/)).toBeInTheDocument();
  });

  it('omits description paragraph when description is empty', () => {
    const task = makeTask({ description: '' });
    render(<TaskCard task={task} onComplete={() => {}} index={0} />);
    expect(screen.queryByText('Do something')).not.toBeInTheDocument();
  });

  it('invokes onComplete with task id when button clicked', () => {
    const task = makeTask({ id: 42 });
    const onComplete = vi.fn();
    render(<TaskCard task={task} onComplete={onComplete} index={2} />);
    const button = screen.getByRole('button', { name: /mark as complete/i });
    fireEvent.click(button);
    expect(onComplete).toHaveBeenCalledWith(42);
  });
});


