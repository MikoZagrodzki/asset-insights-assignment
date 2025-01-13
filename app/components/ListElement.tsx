import { useState } from 'react';
import { User } from './UsersList';
import { motion } from 'framer-motion';

interface ListElementProps {
  user: User;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  users: User[];
}

function ListElement({ user, setUsers, users }: ListElementProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');

  const handleDeleteUser = async () => {
    if (users.length === 0) {
      alert('No users to delete.');
      return;
    }
    if (users) {
      try {
        const response = await fetch(`/api/users/?id=${user.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete user. Please refresh page.');
        }

        setUsers(users.filter((item: User) => item.id !== user.id));
        setIsEditing(false);
      } catch (error) {
        console.error(error);
        alert('Something went wrong while deleting the user.');
      }
    }
  };

  const handleEditUser = () => {
    setIsEditing(true);
    setNewName(user.name);
  };

  const handleSaveEdit = async () => {
    if (newName === '') {
      handleCancelEdit();
      return;
    }
    if (newName === user.name) {
      handleCancelEdit();
      return;
    }
    try {
      const response = await fetch(`/api/users`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: user.id, name: newName }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const updatedUser: User = await response.json();
      setUsers(users.map((user: User) => (user.id === updatedUser.id ? updatedUser : user)));
      setIsEditing(false);
      setNewName('');
    } catch (error) {
      setNewName('');
      console.error(error);
      alert('Something went wrong while updating the user.');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewName('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSaveEdit();
    }
  };

  return (
    <li className='group flex flex-row relative' key={user.id}>
      {/* Edit user open */}
      {isEditing ? (
        <div className='flex items-center gap-2'>
          <input
            type='text'
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className=' min-w-24  max-w-[150px] text-center rounded px-2'
            onKeyDown={handleKeyDown}
          />
          <button
            className='text-white bg-green-500 hover:shadow-md hover:shadow-white active:brightness-90 duration-300 px-2 rounded'
            onClick={handleSaveEdit}
          >
            Save
          </button>
          <button
            className='text-white bg-red-500 hover:shadow-md hover:shadow-white active:brightness-90 duration-300 px-2 rounded'
            onClick={handleCancelEdit}
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          {/* Regural Li */}
          {user.name}
          {/* Display EDIT/DELETE buttons on Li element hover */}
          <div className='hidden group-hover:flex absolute left-1/2 -translate-x-1/2 transition-all duration-200 flex-row gap-1'>
            <button className='text-black bg-white px-1' onClick={handleEditUser}>
              EDIT
            </button>
            <button className='text-black bg-white px-1' onClick={handleDeleteUser}>
              DELETE
            </button>
          </div>
        </>
      )}
    </li>
  );
}

export default ListElement;
