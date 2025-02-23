import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TicketQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketData: {
    owner_address: string;
    event_id: string;
    event_name: string;
  };
}

const TicketQRModal = ({ isOpen, onClose, ticketData }: TicketQRModalProps) => {
  // Create ticket info string
  const ticketInfo = JSON.stringify({
    owner: ticketData.owner_address,
    event_id: ticketData.event_id,
    event: ticketData.event_name
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Modal - Adjusted positioning further up and to the right */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="fixed left-[35%] top-[20%] -translate-x-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-xl p-8 rounded-2xl border border-neon-blue/30 shadow-xl shadow-neon-blue/10 z-50 w-[90%] max-w-lg max-h-[80vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-holo-white/70 hover:text-holo-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Content - Adjusted spacing */}
            <div className="flex flex-col items-center justify-center pt-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-cyber-purple bg-clip-text text-transparent mb-4">
                Ticket QR Code
              </h3>
              
              <div className="bg-white p-6 rounded-xl shadow-lg mb-4">
                <QRCodeSVG
                  value={ticketInfo}
                  size={220} // Slightly reduced size
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="w-full max-w-sm space-y-2 text-center">
                <div className="p-2 rounded-lg bg-background/50 border border-neon-blue/10">
                  <p className="text-sm text-holo-white/50">Event</p>
                  <p className="text-holo-white font-medium">{ticketData.event_name}</p>
                </div>
                
                <div className="p-2 rounded-lg bg-background/50 border border-neon-blue/10">
                  <p className="text-sm text-holo-white/50">Owner</p>
                  <p className="text-holo-white font-medium">
                    {`${ticketData.owner_address.slice(0, 6)}...${ticketData.owner_address.slice(-4)}`}
                  </p>
                </div>
                
                <div className="p-2 rounded-lg bg-background/50 border border-neon-blue/10">
                  <p className="text-sm text-holo-white/50">Event ID</p>
                  <p className="text-holo-white font-medium">{ticketData.event_id}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TicketQRModal; 