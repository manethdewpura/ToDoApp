import { render, screen } from '@testing-library/react';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('shows empty message and hint', () => {
    render(<EmptyState />);
    expect(screen.getByText(/no tasks yet!/i)).toBeInTheDocument();
    expect(screen.getByText(/add your first task/i)).toBeInTheDocument();
  });
});


