import React from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

const TicketDetails = () => {
  const { id } = useParams();

  // Placeholder data - would be fetched from API based on id
  const ticket = {
    id: id,
    eventName: "Cyber Night 2025",
    date: "2025-04-15",
    time: "20:00",
    location: "Neo Tokyo Arena",
    section: "A",
    row: "12",
    seat: "24",
    tokenId: "1234",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1920&q=80",
  };

  const qrData = JSON.stringify({
    ticketId: ticket.id,
    tokenId: ticket.tokenId,
    eventName: ticket.eventName,
    date: ticket.date,
  });

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Ticket Information */}
        <div className="bg-background/60 backdrop-blur-xl rounded-xl border border-neon-blue/20 p-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-blue to-cyber-purple bg-clip-text text-transparent mb-6">
            {ticket.eventName}
          </h1>

          <div className="space-y-4 mb-8">
            <div className="flex items-center text-holo-white/70">
              <Calendar className="w-5 h-5 mr-3 text-neon-blue" />
              <span>{ticket.date}</span>
            </div>
            <div className="flex items-center text-holo-white/70">
              <Clock className="w-5 h-5 mr-3 text-neon-blue" />
              <span>{ticket.time}</span>
            </div>
            <div className="flex items-center text-holo-white/70">
              <MapPin className="w-5 h-5 mr-3 text-neon-blue" />
              <span>{ticket.location}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-neon-blue/10 rounded-lg p-4">
              <div className="text-sm text-holo-white/70">Section</div>
              <div className="text-xl font-semibold text-neon-blue">{ticket.section}</div>
            </div>
            <div className="bg-neon-blue/10 rounded-lg p-4">
              <div className="text-sm text-holo-white/70">Row</div>
              <div className="text-xl font-semibold text-neon-blue">{ticket.row}</div>
            </div>
            <div className="bg-neon-blue/10 rounded-lg p-4">
              <div className="text-sm text-holo-white/70">Seat</div>
              <div className="text-xl font-semibold text-neon-blue">{ticket.seat}</div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button className="flex-1 px-4 py-2 bg-neon-blue/10 rounded-lg text-neon-blue font-medium hover:bg-neon-blue/20 transition-colors">
              Transfer Ticket
            </button>
            <button className="flex-1 px-4 py-2 bg-gradient-to-r from-neon-blue to-cyber-purple rounded-lg text-white font-medium hover:shadow-lg hover:shadow-neon-blue/50 transition-shadow">
              List for Sale
            </button>
          </div>
        </div>

        {/* QR Code */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-background/60 backdrop-blur-xl rounded-xl border border-neon-blue/20 p-8 flex flex-col items-center justify-center"
        >
          <div className="bg-white p-4 rounded-xl mb-6">
            <QRCodeSVG
              value={qrData}
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="text-sm text-holo-white/70 text-center">
            Scan this QR code at the venue for entry
          </p>
          <p className="text-xs text-holo-white/50 text-center mt-2">
            Token ID: #{ticket.tokenId}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TicketDetails;