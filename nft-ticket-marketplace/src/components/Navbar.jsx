// src/components/Navbar.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import UserMenu from './UserMenu.jsx';

const Navbar = () => {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-[#0A0A0A] border-b border-[#00F5FF]/10 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-['Space_Grotesk'] font-bold text-[#00F5FF]"
        >
          NFTickets
        </motion.div>
        <div className="flex gap-6 items-center">
          {isConnected ? (
            <UserMenu />
          ) : (
            <ConnectWalletButton onConnect={() => setIsConnected(true)} />
          )}
        </div>
      </div>
    </nav>
  );
};

const ConnectWalletButton = ({ onConnect }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-6 py-3 bg-gradient-to-r from-[#00F5FF] to-[#6C00FF] rounded-lg font-['Inter'] font-medium shadow-[0_8px_32px_rgba(0,245,255,0.3)] flex items-center gap-2"
      onClick={onConnect}
    >
      <Wallet size={20} />
      Connect Wallet
    </motion.button>
  );
};

export default Navbar;