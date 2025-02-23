// src/components/UserMenu.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserMenu = () => {
  return (
    <div className="relative group">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 rounded-lg bg-[#141414] border border-[#00F5FF]/20"
      >
        <User size={20} className="text-[#00F5FF]" />
      </motion.button>
      <div className="absolute right-0 mt-2 w-48 py-2 bg-[#0A0A0A] rounded-lg border border-[#00F5FF]/10 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
        <Link to="/profile" className="block px-4 py-2 hover:bg-[#141414]">Profile</Link>
        <Link to="/tickets" className="block px-4 py-2 hover:bg-[#141414]">My Tickets</Link>
        <Link to="/marketplace" className="block px-4 py-2 hover:bg-[#141414]">Marketplace</Link>
      </div>
    </div>
  );
};

export default UserMenu;