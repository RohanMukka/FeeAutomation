import React from 'react';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import Admin from '../Components/Admin';

test('renders admin login button', () => {
  const history = createMemoryHistory();
  render(<Admin history={history} />);
  expect(screen.getByText(/login/i)).toBeInTheDocument();
});
