import { NextRequest, NextResponse } from 'next/server';
import db from '../../../lib/db';

interface AddUserRequest {
  name: string;
}

interface UpdateUserRequest {
  id: number;
  name: string;
}

interface UpdateUserRequest {
  id: number;
  name: string;
}


export async function GET() {
  try {
    await db.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL
        );
      `);
    const result = await db.query('SELECT * FROM users');
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    return new Response('Error fetching users', { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  const { name }: AddUserRequest = await req.json();

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating table' }, { status: 500 });
  }

  try {
    const result = await db.query('INSERT INTO users (name) VALUES ($1) RETURNING *', [name]);
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error adding user' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { id, name }: UpdateUserRequest = await req.json();

  if (!id || !name) {
    return NextResponse.json({ error: 'ID and name are required' }, { status: 400 });
  }

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const result = await db.query('UPDATE users SET name = $1 WHERE id = $2 RETURNING *', [name, id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  if (isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }


  try {
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting user' }, { status: 500 });
  }
}

