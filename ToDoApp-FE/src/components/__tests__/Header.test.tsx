import { render, screen } from '@testing-library/react';
import { Header } from '../Header';

describe('Header', () => {
  it('renders title and subtitle', () => {
    render(<Header />);
    expect(screen.getByRole('heading', { level: 1, name: /toDo app/i })).toBeInTheDocument();
    expect(screen.getByText(/stay organized and productive/i)).toBeInTheDocument();
  });
});


