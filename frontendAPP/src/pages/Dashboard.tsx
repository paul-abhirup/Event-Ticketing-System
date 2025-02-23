import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Clock } from 'lucide-react';

const Dashboard = () => {
  // Placeholder data - would be fetched from API
  const events = [
    {
      id: 1,
      name: "Cyber Night 2025",
      date: "2025-04-15",
      location: "Neo Tokyo Arena",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1920&q=80",
      attendees: 2500,
      price: "0.5 ETH"
    },
    {
      id: 2,
      name: "Digital Dreams Festival",
      date: "2025-05-01",
      location: "Virtual Reality Plaza",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80",
      attendees: 1800,
      price: "0.3 ETH"
    },
    // Add more events as needed
  ];

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold bg-gradient-to-r from-neon-blue to-cyber-purple bg-clip-text text-transparent mb-8"
      >
        Upcoming Events
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-background/60 backdrop-blur-xl rounded-xl overflow-hidden border border-neon-blue/20 hover:border-neon-blue/40 transition-colors"
          >
            <div className="relative h-48">
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-holo-white mb-2">
                {event.name}
              </h3>
              <div className="space-y-2 text-sm text-holo-white/70">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-neon-blue" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-neon-blue" />
                  <span>{event.attendees} attendees</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-neon-blue" />
                  <span>{event.location}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-lg font-semibold text-neon-blue">
                  {event.price}
                </span>
                <button className="px-4 py-2 bg-gradient-to-r from-neon-blue to-cyber-purple rounded-lg text-white font-medium hover:shadow-lg hover:shadow-neon-blue/50 transition-shadow">
                  Buy Ticket
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;