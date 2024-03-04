import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserHome from './user-home'; // Adjust the path as necessary
import { BrowserRouter } from 'react-router-dom';

// Mocking fetch calls
beforeAll(() => {
  global.fetch = jest.fn();
  window.alert = jest.fn();
});

beforeEach(() => {
  fetch.mockClear();
  localStorage.setItem('user', JSON.stringify({
    user_id: '1',
    username: 'TestUser',
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    organization_id: '1',
    user_role: 'employee'
  }));

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(/* Mocked fetch response */),
    })
  );
});

afterAll(() => {
  localStorage.clear();
});

function renderUserHome() {
  return render(
    <BrowserRouter>
      <UserHome />
    </BrowserRouter>
  );
}



test('displays user info after loading', async () => {
  fetch.mockResolvedValueOnce({
    json: async () => ([]), // Mock empty badges data
  });

  renderUserHome();

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  expect(screen.getByText(/welcome, TestUser!/i)).toBeInTheDocument();
});

test('displays badges after successful fetch', async () => {
  fetch.mockResolvedValueOnce({
    json: async () => ([{ badge_id: '1', badge_name: 'Test Badge', image_path: '/path/to/image' }]),
  });

  renderUserHome();

  await waitFor(() => expect(screen.getByText(/test badge/i)).toBeInTheDocument());
});

test('generatePassword function generates a valid password', async () => {
  render(
    <BrowserRouter>
      <UserHome />
    </BrowserRouter>
  );

  // Trigger password generation
  const generatePasswordButton = screen.getByRole('button', { name: /Generate Password/i });
  fireEvent.click(generatePasswordButton);

  await waitFor(() => {
    const generatedPasswordElement = screen.getByTestId('generatedPassword'); // Ensure your component has a data-testid="generatedPassword" on the element displaying the password
    const generatedPassword = generatedPasswordElement.textContent;
    
    // Perform a statistical check over multiple iterations, if feasible, or adjust your testing strategy as mentioned.
    expect(generatedPassword).toMatch(new RegExp('(?:[A-Z].*[0-9])|(?:[0-9].*[A-Z])')); // Simplified check example
    // Continue with other checks as necessary
  });
});

// Add more tests as needed, for example, testing error states, interactions, etc.
