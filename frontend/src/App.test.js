import { render, screen } from '@testing-library/react';
import App from './App';


import { render, screen } from '@testing-library/react';
import App from './App';

test('renders App and checks for Nav component', () => {
  render(<App />);
  const navElement = screen.getByText(/Login/i); // Assuming "Login" link text is part of your Nav component
  expect(navElement).toBeInTheDocument();
});