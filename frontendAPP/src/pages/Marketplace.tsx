import React from 'react';
import { motion } from 'framer-motion';
import { Tag, Clock, ArrowUpRight } from 'lucide-react';

const Marketplace = () => {
  // Placeholder data - would be fetched from API
  const listings = [
    {
      id: 1,
      eventName: "Cyber Night 2025",
      ticketId: "#1234",
      currentBid: "0.8 ETH",
      timeLeft: "2 days",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1920&q=80",
    },
    {
      id: 2,
      eventName: "Digital Dreams Festival",
      ticketId: "#5678",
      currentBid: "0.5 ETH",
      timeLeft: "4 hours",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80",
    },
    // Add more listings as needed
  ];

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-blue to-cyber-purple bg-clip-text text-transparent">
          Ticket Marketplace
        </h1>
        <button className="px-4 py-2 bg-gradient-to-r from-neon-blue to-cyber-purple rounded-lg text-white font-medium hover:shadow-lg hover:shadow-neon-blue/50 transition-shadow">
          List Ticket
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing, index) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-background/60 backdrop-blur-xl rounded-xl overflow-hidden border border-neon-blue/20 hover:border-neon-blue/40 transition-colors"
          >
            <div className="relative h-48">
              <img
                src={listing.image}
                alt={listing.eventName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-holo-white">
                    {listing.eventName}
                  </h3>
                  <p className="text-sm text-holo-white/70">
                    Ticket {listing.ticketId}
                  </p>
                </div>
                <button className="text-neon-blue hover:text-cyber-purple transition-colors">
                  <ArrowUpRight className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-3 text-sm text-holo-white/70">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-neon-blue" />
                    <span>Current Bid</span>
                  </div>
                  <span className="text-neon-blue font-semibold">
                    {listing.currentBid}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-neon-blue" />
                    <span>Time Left</span>
                  </div>
                  <span>{listing.timeLeft}</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button className="px-4 py-2 bg-neon-blue/10 rounded-lg text-neon-blue font-medium hover:bg-neon-blue/20 transition-colors">
                  Place Bid
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-neon-blue to-cyber-purple rounded-lg text-white font-medium hover:shadow-lg hover:shadow-neon-blue/50 transition-shadow">
                  Buy Now
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;