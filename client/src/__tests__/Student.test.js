import React from 'react';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import Student from '../Components/Student';

test('renders student login button', () => {
  const history = createMemoryHistory();
  render(<Student history={history} />);
  expect(screen.getByText(/login/i)).toBeInTheDocument();
});
