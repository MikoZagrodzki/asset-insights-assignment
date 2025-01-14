/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UsersList from '../app/components/UsersList';
import '@testing-library/jest-dom';

// Mock the fetch API calls
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('UsersList', () => {
  beforeEach(() => {
    global.alert = jest.fn();
    global.fetch = jest.fn();
    Element.prototype.scrollIntoView = jest.fn();
  });

  afterAll(() => {
    // Reset mock after all tests are done
    jest.restoreAllMocks();
  });

  it('shows "No users found" when the API returns an empty array', async () => {
    // Mock fetch to simulate an empty response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]), 
    });

    render(<UsersList />);

    await waitFor(() => screen.getByText('No users found'));

    expect(screen.getByText('No users found')).toBeInTheDocument();
  });

  it('renders user details when the API returns a user', async () => {
    // Mock fetch to simulate a response with a user
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' },
        ]),
    });

    render(<UsersList />);

    await waitFor(() => screen.getByText('John'));
    await waitFor(() => screen.getByText('John'));

    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('renders error message when API call fails', async () => {
    // Mock fetch to simulate a response fail
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.reject(new Error('API call failed')),
    });

    // Mock console.error to not print out error for cleaner console
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<UsersList />);

    await waitFor(() => screen.getByText('Error. Please refresh the page.'));

    expect(screen.getByText('Error. Please refresh the page.')).toBeInTheDocument();

    // Restore console.error
    consoleErrorMock.mockRestore();
  });

  
  it('should fetch users initially and add a user after clicking "Add User"', async () => {
    // Mock the initial fetch to get users (first API call)
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, name: 'John' }] 
    } as Response);
  
    // Mock the fetch call to add a user (second API call)
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 2, name: 'Jane' }) 
    } as Response);
  
    render(<UsersList />);
  
    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument(); 
    });
  
    // Find the input field and the "Add User" button
    const inputField = screen.getByPlaceholderText('Enter User Name') as HTMLInputElement;
    const addUserButton = screen.getByText('Add User');
  
    // Simulate typing in the input field
    fireEvent.change(inputField, { target: { value: 'Jane' } });
  
    expect(inputField.value).toBe('Jane');
  
    fireEvent.click(addUserButton);
  
    // Wait for the second fetch to add the user and the UI to update
    await waitFor(() => {
      expect(screen.getByText('Jane')).toBeInTheDocument();
    });
  
    // Ensure the input field is cleared after adding the user
    expect(inputField.value).toBe(''); 
  });
  

  it('renders user details and calls scrollIntoView when the API returns users', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' },
        ]),
    });

    render(<UsersList />);

    await waitFor(() => screen.getByText('John'));

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();

    // Check that scrollIntoView was called when users were rendered
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });

  it('should fetch users initially and scroll to the end after adding a new user', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, name: 'John' }],
    } as Response);

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 2, name: 'Jane' }),
    } as Response);

    render(<UsersList />);

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });

    const inputField = screen.getByPlaceholderText('Enter User Name') as HTMLInputElement;
    const addUserButton = screen.getByText('Add User');

    fireEvent.change(inputField, { target: { value: 'Jane' } });
    fireEvent.click(addUserButton);

    await waitFor(() => {
      expect(screen.getByText('Jane')).toBeInTheDocument();
    });

    // Verify scrollIntoView is called after adding the new user
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });

});
