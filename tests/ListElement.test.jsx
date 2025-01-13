/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ListElement from '../app/components/ListElement';

describe('ListElement', () => {
  it('renders the user name correctly', () => {
    const mockSetUsers = jest.fn();
    const mockUsers = [
      { id: 1, name: 'John' },
      { id: 1, name: 'Jane' },
    ];
    const mockUser = mockUsers[1];

    render(<ListElement user={mockUser} setUsers={mockSetUsers} users={mockUsers} />);

    // Check that the user's name is displayed
    expect(screen.getByText('Jane')).toBeInTheDocument();
  });

  it('renders all user names correctly', () => {
    const mockSetUsers = jest.fn();
    const mockUsers = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ];

    // Render the ListElement component with both users
    mockUsers.forEach((user) => {
      render(<ListElement user={user} setUsers={mockSetUsers} users={mockUsers} />);
    });

    // Check that both users are rendered
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
  });

  it('allows editing the user name', async () => {
    const mockSetUsers = jest.fn();
    const mockUsers = [{ id: 1, name: 'John' }];
    const mockUser = mockUsers[0];

    // Mock the fetch call for the PUT request to update the user
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 1, name: 'Jane' }),
    });

    render(<ListElement user={mockUser} setUsers={mockSetUsers} users={mockUsers} />);

    const editButton = screen.getByText('EDIT');
    fireEvent.click(editButton);

    // Type a new name in the input field
    const inputField = screen.getByRole('textbox');
    fireEvent.change(inputField, { target: { value: 'Jane' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    // Wait for the setUsers function to be called and check if it's called with the updated user name
    await waitFor(() => {
      expect(mockSetUsers).toHaveBeenCalledWith([{ id: 1, name: 'Jane' }]);
    });

    // Ensure that fetch was called to update the user
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/users',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ id: 1, name: 'Jane' }),
      })
    );
  });

  it('should keep the original name when edit is cancelled', () => {
    const mockSetUsers = jest.fn();
    const mockUsers = [{ id: 1, name: 'John' }];
    const mockUser = mockUsers[0];

    render(<ListElement user={mockUser} setUsers={mockSetUsers} users={mockUsers} />);

    const editButton = screen.getByText('EDIT');
    fireEvent.click(editButton);

    // Type a new name in the input field
    const inputField = screen.getByRole('textbox');
    fireEvent.change(inputField, { target: { value: 'Jane' } });

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    // Check that the original name persists
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});
