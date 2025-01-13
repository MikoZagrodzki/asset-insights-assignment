'use client';
import Image from 'next/image';
import { useState } from 'react';
import UsersList from './components/UsersList';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-around h-screen'>

      <motion.h1
        initial={{ opacity: 0, y: '-500%' }}
        animate={{ opacity: 1, y: '0%' }}
        transition={{ duration: 0.3 }}
        className='text-2xl font-extrabold text-center'
      >
        User Management System
      </motion.h1>

      <UsersList />

      <motion.p initial={{ opacity: 0, y: '500%' }} animate={{ opacity: 1, y: '0%' }} transition={{ duration: 0.3 }} className='text-center text-sm'>
        Assignment completed by Miko Zagrodzki
      </motion.p>

    </div>
  );
}
