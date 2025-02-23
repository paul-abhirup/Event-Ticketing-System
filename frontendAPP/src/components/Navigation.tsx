// import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Ticket, Store, User, Home } from "lucide-react";
import { useAccount } from "wagmi";

const Navigation = () => {
  const { isConnected } = useAccount();
  const location = useLocation();

  if (!isConnected && location.pathname === "/") return null;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-b border-neon-blue/20 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Ticket className="w-8 h-8 text-neon-blue" />
            <span className="text-xl font-bold bg-gradient-to-r from-neon-blue to-cyber-purple bg-clip-text text-transparent">
              TicketChain
            </span>
          </Link>

          {isConnected && (
            <div className="flex space-x-8">
              <NavLink to="/dashboard" icon={<Home />}>
                Dashboard
              </NavLink>
              <NavLink to="/marketplace" icon={<Store />}>
                Marketplace
              </NavLink>
              <NavLink to="/profile" icon={<User />}>
                Profile
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}

const NavLink = ({ to, children, icon }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
        isActive ? "text-neon-blue" : "text-holo-white/70 hover:text-neon-blue"
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
};

export default Navigation;
