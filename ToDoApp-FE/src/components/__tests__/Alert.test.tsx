import { render, screen, fireEvent } from '@testing-library/react';
import { Alert } from '../Alert';

describe('Alert', () => {
  it('renders success variant with message', () => {
    render(<Alert type="success" message="Saved successfully" />);
    expect(screen.getByText(/saved successfully/i)).toBeInTheDocument();
    // success icon is present (by role not available; check by title prop on button absence)
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders error variant and close button calls onClose', () => {
    const onClose = vi.fn();
    render(<Alert type="error" message="Something went wrong" onClose={onClose} />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});


