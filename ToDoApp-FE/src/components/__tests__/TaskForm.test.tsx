import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from '../TaskForm';

describe('TaskForm', () => {
  it('disables submit when title is empty and enables when filled', async () => {
    const user = userEvent.setup();
    render(<TaskForm onSubmit={async () => {}} />);

    const submit = screen.getByRole('button', { name: /add task/i });
    expect(submit).toBeDisabled();

    await user.type(screen.getByLabelText(/title/i), 'My Task');
    expect(submit).toBeEnabled();
  });

  it('calls onSubmit with trimmed title and description, then clears fields', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<TaskForm onSubmit={onSubmit} />);

    const title = screen.getByLabelText(/title/i);
    const desc = screen.getByLabelText(/description/i);

    await user.type(title, '  My Task  ');
    await user.type(desc, '  Something to do  ');
    await user.click(screen.getByRole('button', { name: /add task/i }));

    expect(onSubmit).toHaveBeenCalledWith('My Task', 'Something to do');

    // fields cleared after successful submit
    expect(title).toHaveValue('');
    expect(desc).toHaveValue('');
  });

  it('shows loading state during submit and prevents double submit', async () => {
    const user = userEvent.setup();
    let resolvePromise: () => void;
    const onSubmit = vi.fn().mockImplementation(
      () => new Promise<void>((resolve) => { resolvePromise = resolve; })
    );
    render(<TaskForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/title/i), 'Once');
    const button = screen.getByRole('button', { name: /add task/i });
    await user.click(button);

    // while loading, button is disabled and shows spinner text
    expect(button).toBeDisabled();
    expect(screen.getByText(/adding/i)).toBeInTheDocument();

    // attempt a second click shouldn't call again
    await user.click(button);
    expect(onSubmit).toHaveBeenCalledTimes(1);

    // finish
    resolvePromise!();
  });

  it('does not submit when title is only whitespace', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/title/i), '   ');
    const button = screen.getByRole('button', { name: /add task/i });
    expect(button).toBeDisabled();
  });
});


