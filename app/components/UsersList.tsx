import React, { useEffect, useRef, useState } from 'react';
import ListElement from './ListElement';
import { motion } from 'framer-motion';

export type User = { id: number; name: string };

function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [initialMessage, setInitialMessage] = useState<string>('Loading List..');

  // Initial data being fetch
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/users');
        if (!response || !response.ok) {
          throw new Error();
        }
        const data: User[] = await response.json();
        if (data.length === 0) {
          setInitialMessage('No users found');
        } else {
          setUsers(data);
        }
      } catch (error: any) {
        console.error(error);
        setInitialMessage('Error. Please refresh the page.');
        alert(error.message || 'Something went wrong while fetching users. Please refresh the ppage.');
      }
    }

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!users || users.length === 0) {
      setInitialMessage('No users found');
    }
  }, [users]);

  // Automaticaly scrolls to the last list's element
  const listEndRef = useRef<HTMLLIElement | null>(null);
  useEffect(() => {
    if (listEndRef.current) {
      listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [users]);

  const handleAddUser = async () => {
    if (!inputValue) {
      alert('Please enter a user name');
      return;
    }
    // Check if name is not spaces only
    if (!inputValue.trim()) {
      alert('Please enter a valid user name');
      return;
    }
    // Check if name contains only valid characters
    const validNameRegex = /^[a-zA-Z0-9 ]+$/;
    if (!validNameRegex.test(inputValue)) {
      alert('Please enter a name without special characters');
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: inputValue.trim() }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong while adding the user. Please try again.');
      }

      const newUser: User = await response.json();
      setUsers([...users, newUser]);
      setInputValue('');
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  // Form submit when ENTER press
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleAddUser();
    }
  };

  return (
    <motion.div
      className='flex flex-col items-center border border-gray-500 max-h-[50%] w-[90%] gap-4 sm:max-w-4xl shadow shadow-white rounded'
      initial={{ opacity: 0, scale: '0%' }}
      animate={{ opacity: 1, scale: '100%' }}
      transition={{ duration: 0.5 }}
    >
      <h1 className='p-2 font-bold text-lg'>User List</h1>
      <ol className='flex flex-col items-center overflow-y-auto border w-[95%] gap-1 rounded py-2 sm:my-2'>
        {!users || users.length === 0 ? (
          <p>{initialMessage}</p>
        ) : (
          users.map((user, index) => {
            return <ListElement key={`User ${index + 1}`} user={user} setUsers={setUsers} users={users} />;
          })
        )}
        {/* When list overflows it will automatically scroll to the last element - dummy Li below */}
        <li ref={listEndRef} className=''></li>
      </ol>
      <div className='flex flex-row gap-2 pb-4 '>
        <input
          className='px-1 rounded'
          placeholder='Enter User Name'
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        ></input>
        <button
          className=' px-1 bg-white text-black rounded font-bold duration-300 hover:shadow-md hover:shadow-[#ababab] active:brightness-90 active:duration-200'
          onClick={handleAddUser}
        >
          Add User
        </button>
      </div>
    </motion.div>
  );
}

export default UsersList;
