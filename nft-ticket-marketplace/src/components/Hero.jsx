// src/components/Hero.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';

const Hero = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#0A0A0A] to-[rgba(29,32,41,1)]"
    >
      <div className="container mx-auto px-4 flex flex-col items-center text-center">
        <motion.h1
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="text-5xl md:text-6xl font-['Space_Grotesk'] font-bold mb-6 bg-gradient-to-r from-[#00F5FF] to-[#6C00FF] text-transparent bg-clip-text"
        >
          The Future of Event Ticketing
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-[#F0F4FF]/80 max-w-2xl mb-8"
        >
          Secure, transparent, and seamless ticket trading powered by blockchain technology
        </motion.p>
        <ConnectWalletButton className="scale-110" />
      </div>
    </motion.div>
  );
};

const ConnectWalletButton = ({ className = '' }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-6 py-3 bg-gradient-to-r from-[#00F5FF] to-[#6C00FF] rounded-lg font-['Inter'] font-medium shadow-[0_8px_32px_rgba(0,245,255,0.3)] flex items-center gap-2 ${className}`}
    >
      <Wallet size={20} />
      Connect Wallet
    </motion.button>
  );
};

export default Hero;