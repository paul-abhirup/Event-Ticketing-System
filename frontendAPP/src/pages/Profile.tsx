import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Copy, ExternalLink } from 'lucide-react';
import { useAccount } from 'wagmi';

const Profile = () => {
  const { address } = useAccount();

  // Placeholder data - would be fetched from API
  const userTickets = [
    {
      id: 1,
      eventName: "Cyber Night 2025",
      ticketId: "#1234",
      date: "2025-04-15",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1920&q=80",
    },
    // Add more tickets as needed
  ];

  const copyAddress = () => {
    navigator.clipboard.writeText(address || '');
    // You would typically show a toast notification here
  };

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background/60 backdrop-blur-xl rounded-xl border border-neon-blue/20 p-8 mb-8"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-blue to-cyber-purple bg-clip-text text-transparent">
            My Profile
          </h1>
          <button
            onClick={copyAddress}
            className="flex items-center space-x-2 px-4 py-2 bg-neon-blue/10 rounded-lg text-neon-blue hover:bg-neon-blue/20 transition-colors"
          >
            <span className="hidden sm:inline">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-holo-white mb-6">My Tickets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userTickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-background/60 backdrop-blur-xl rounded-xl overflow-hidden border border-neon-blue/20 hover:border-neon-blue/40 transition-colors"
            >
              <div className="relative h-48">
                <img
                  src={ticket.image}
                  alt={ticket.eventName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-holo-white">
                      {ticket.eventName}
                    </h3>
                    <p className="text-sm text-holo-white/70">
                      Ticket {ticket.ticketId}
                    </p>
                  </div>
                  <button className="text-neon-blue hover:text-cyber-purple transition-colors">
                    <ExternalLink className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex items-center text-sm text-holo-white/70 mb-4">
                  <Ticket className="w-4 h-4 mr-2 text-neon-blue" />
                  <span>{ticket.date}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="px-4 py-2 bg-neon-blue/10 rounded-lg text-neon-blue font-medium hover:bg-neon-blue/20 transition-colors">
                    View QR
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-neon-blue to-cyber-purple rounded-lg text-white font-medium hover:shadow-lg hover:shadow-neon-blue/50 transition-shadow">
                    Transfer
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;