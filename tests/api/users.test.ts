import { NextRequest } from 'next/server';
import { DELETE, GET, POST, PUT } from '../../app/api/users/route'; // Adjust based on your path
import db from '../../lib/db'; // Your database module

jest.mock('../../lib/db', () => ({
  query: jest.fn(),
}));

describe('GET /api/users', () => {
  it('should return a list of users', async () => {
    // Mock DB response to return users
    (db.query as jest.Mock).mockResolvedValueOnce({ rows: [] }); // Mock table creation
    (db.query as jest.Mock).mockResolvedValueOnce({
      rows: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' },
      ],
    });

    // Call the handler directly
    const response = await GET();

    // Validate the response status
    expect(response.status).toBe(200);

    // Ensure data is not empty or invalid
    const responseData = await response.json();
    expect(responseData).toEqual([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
    ]);
  });

  it('should return 500 if the database query fails', async () => {
    (db.query as jest.Mock).mockRejectedValueOnce(new Error('Database Error'));

    const response = await GET();

    expect(response.status).toBe(500);

    const responseData = await response.text();
    expect(responseData).toBe('Error fetching users');
  });
});

describe('POST /api/users', () => {
  it('should return an error if name is not provided', async () => {
    // Mock the request to simulate missing 'name' in the body
    const req = {
      json: jest.fn().mockResolvedValueOnce({}),
    } as unknown as NextRequest;

    const res = await POST(req);

    expect(res.status).toBe(400);
    const jsonResponse = await res.json();
    expect(jsonResponse.error).toBe('Name is required');
  });

  it('should return an error if there is a problem creating the table', async () => {
    const req = {
      json: jest.fn().mockResolvedValueOnce({ name: 'John Doe' }),
    } as unknown as NextRequest;

    // Mock db.query to throw an error when creating the table
    (db.query as jest.Mock).mockRejectedValueOnce(new Error('Table creation failed'));

    const res = await POST(req);

    expect(res.status).toBe(500);
    const jsonResponse = await res.json();
    expect(jsonResponse.error).toBe('Error creating table');
  });

  it('should return a success response when user is added', async () => {
    const req = {
      json: jest.fn().mockResolvedValueOnce({ name: 'John Doe' }),
    } as unknown as NextRequest;

    // Mock the CREATE TABLE query
    (db.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
    // Mock the INSERT query
    (db.query as jest.Mock).mockResolvedValueOnce({
      rows: [{ id: 1, name: 'John Doe' }],
    });

    const res = await POST(req);

    expect(res.status).toBe(201);
    const jsonResponse = await res.json();
    expect(jsonResponse.id).toBe(1);
    expect(jsonResponse.name).toBe('John Doe');
  });

  it('should return an error if there is a problem adding the user', async () => {
    const req = {
      json: jest.fn().mockResolvedValueOnce({ name: 'John Doe' }),
    } as unknown as NextRequest;

    // Mock db.query to throw an error when inserting the user
    (db.query as jest.Mock).mockResolvedValueOnce({ rows: [] }); // Mock the CREATE TABLE query
    (db.query as jest.Mock).mockRejectedValueOnce(new Error('User insertion failed'));

    const res = await POST(req);

    // Validate the response
    expect(res.status).toBe(500);
    const jsonResponse = await res.json();
    expect(jsonResponse.error).toBe('Error adding user');
  });
});

describe('PUT /api/users', () => {
  it('should return an error if id or name is not provided', async () => {
    const req = {
      json: jest.fn().mockResolvedValueOnce({}),
    } as unknown as NextRequest;

    const res = await PUT(req);

    expect(res.status).toBe(400);
    const jsonResponse = await res.json();
    expect(jsonResponse.error).toBe('ID and name are required');
  });

  it('should return an error if id is not a valid number', async () => {
    const req = {
      json: jest.fn().mockResolvedValueOnce({ id: 'invalid', name: 'John Doe' }),
    } as unknown as NextRequest;

    const res = await PUT(req);

    expect(res.status).toBe(400);
    const jsonResponse = await res.json();
    expect(jsonResponse.error).toBe('Invalid ID');
  });

  it('should return an error if the user is not found', async () => {
    // Mock the request with valid data but non-existing user
    const req = {
      json: jest.fn().mockResolvedValueOnce({ id: 1, name: 'John Doe' }),
    } as unknown as NextRequest;

    // Mock db.query to return no rows (user not found)
    (db.query as jest.Mock).mockResolvedValueOnce({ rowCount: 0, rows: [] });

    const res = await PUT(req);

    expect(res.status).toBe(404);
    const jsonResponse = await res.json();
    expect(jsonResponse.error).toBe('User not found');
  });

  it('should return a success response when the user is updated', async () => {
    const req = {
      json: jest.fn().mockResolvedValueOnce({ id: 1, name: 'John Doe' }),
    } as unknown as NextRequest;

    // Mock db.query to return the updated user
    (db.query as jest.Mock).mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ id: 1, name: 'John Doe' }],
    });

    const res = await PUT(req);

    expect(res.status).toBe(200);
    const jsonResponse = await res.json();
    expect(jsonResponse.id).toBe(1);
    expect(jsonResponse.name).toBe('John Doe');
  });

  it('should return an error if there is a problem updating the user', async () => {
    // Mock the request with valid data
    const req = {
      json: jest.fn().mockResolvedValueOnce({ id: 1, name: 'John Doe' }),
    } as unknown as NextRequest;

    // Mock db.query to throw an error when updating the user
    (db.query as jest.Mock).mockRejectedValueOnce(new Error('Update failed'));

    const res = await PUT(req);

    // Validate the response
    expect(res.status).toBe(500);
    const jsonResponse = await res.json();
    expect(jsonResponse.error).toBe('Error updating user');
  });
});

describe('DELETE /api/users', () => {
  it('should return an error if id is not provided', async () => {
    // Mock the request with no 'id' in the URL
    const req = {
      url: 'https://yourapi.com/api/users',
    } as unknown as NextRequest;

    const res = await DELETE(req);

    expect(res.status).toBe(400);
    const jsonResponse = await res.json();
    expect(jsonResponse.error).toBe('ID is required');
  });

  it('should return an error if id is not a valid number', async () => {
    // Mock the request with invalid 'id'
    const req = {
      url: 'https://yourapi.com/api/users?id=invalid',
    } as unknown as NextRequest;

    const res = await DELETE(req);

    expect(res.status).toBe(400);
    const jsonResponse = await res.json();
    expect(jsonResponse.error).toBe('Invalid ID');
  });

  it('should return an error if the user is not found', async () => {
    const req = {
      url: 'https://yourapi.com/api/users?id=1',
    } as unknown as NextRequest;

    // Mock db.query to return no rows (user not found)
    (db.query as jest.Mock).mockResolvedValueOnce({ rowCount: 0, rows: [] });

    const res = await DELETE(req);

    expect(res.status).toBe(404);
    const jsonResponse = await res.json();
    expect(jsonResponse.error).toBe('User not found');
  });

  it('should return a success response when the user is deleted', async () => {
    // Mock the request with a valid 'id'
    const req = {
      url: 'https://yourapi.com/api/users?id=1',
    } as unknown as NextRequest;

    // Mock db.query to return the deleted user (simulate successful delete)
    (db.query as jest.Mock).mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ id: 1, name: 'John Doe' }],
    });

    const res = await DELETE(req);

    expect(res.status).toBe(200);
    const jsonResponse = await res.json();
    expect(jsonResponse.message).toBe('User deleted');
  });

  it('should return an error if there is a problem deleting the user', async () => {
    const req = {
      url: 'https://yourapi.com/api/users?id=1',
    } as unknown as NextRequest;

    // Mock db.query to throw an error when deleting the user
    (db.query as jest.Mock).mockRejectedValueOnce(new Error('Delete failed'));

    const res = await DELETE(req);

    expect(res.status).toBe(500);
    const jsonResponse = await res.json();
    expect(jsonResponse.error).toBe('Error deleting user');
  });
});
