// src/components/Layout.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[rgba(29,32,41,1)] text-[#F0F4FF] font-['IBM_Plex_Sans']">
      <Navbar />
      <main className="pt-20">
        {children}
      </main>
    </div>
  );
};

export default Layout;