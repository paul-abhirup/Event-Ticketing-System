import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuthToken } from '../utils/auth';
import { toast } from 'react-hot-toast';

interface TicketDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenId: number;
}

interface TicketDetails {
  token_id: number;
  owner_address: string;
  event_name: string;
  event_date: string;
  venue: string;
  mint_date: string;
  is_used: boolean;
  ipfs_cid: string;
}

const TicketDetailsModal = ({ isOpen, onClose, tokenId }: TicketDetailsModalProps) => {
  const [ticketDetails, setTicketDetails] = useState<TicketDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      if (!isOpen) return;
      
      try {
        setIsLoading(true);
        const token = getAuthToken();
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets/${tokenId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch ticket details');
        }

        const data = await response.json();
        setTicketDetails(data);
      } catch (error) {
        console.error('Error fetching ticket details:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch ticket details');
        toast.error('Failed to load ticket details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTicketDetails();
  }, [isOpen, tokenId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="fixed left-[35%] top-[20%] -translate-x-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-xl p-8 rounded-2xl border border-neon-blue/30 shadow-xl shadow-neon-blue/10 z-50 w-[90%] max-w-lg max-h-[80vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-holo-white/70 hover:text-holo-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col items-center justify-center pt-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-cyber-purple bg-clip-text text-transparent mb-6">
                Ticket Details
              </h3>

              {isLoading ? (
                <div className="text-holo-white">Loading...</div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : ticketDetails ? (
                <div className="w-full space-y-4">
                  {/* Ticket Image */}
                  <div className="relative h-48 w-full rounded-xl overflow-hidden mb-6">
                    <img
                      src={`https://ipfs.io/ipfs/${ticketDetails.ipfs_cid}`}
                      alt={ticketDetails.event_name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                  </div>

                  {/* Ticket Information */}
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-background/50 border border-neon-blue/10">
                      <p className="text-sm text-holo-white/50">Event Name</p>
                      <p className="text-holo-white font-medium">{ticketDetails.event_name}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-background/50 border border-neon-blue/10">
                      <p className="text-sm text-holo-white/50">Token ID</p>
                      <p className="text-holo-white font-medium">#{ticketDetails.token_id}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-background/50 border border-neon-blue/10">
                      <p className="text-sm text-holo-white/50">Owner</p>
                      <p className="text-holo-white font-medium">
                        {`${ticketDetails.owner_address.slice(0, 6)}...${ticketDetails.owner_address.slice(-4)}`}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-background/50 border border-neon-blue/10">
                      <p className="text-sm text-holo-white/50">Event Date</p>
                      <p className="text-holo-white font-medium">
                        {new Date(ticketDetails.event_date).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-background/50 border border-neon-blue/10">
                      <p className="text-sm text-holo-white/50">Venue</p>
                      <p className="text-holo-white font-medium">{ticketDetails.venue}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-background/50 border border-neon-blue/10">
                      <p className="text-sm text-holo-white/50">Status</p>
                      <p className="text-holo-white font-medium">
                        {ticketDetails.is_used ? 'Used' : 'Valid'}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-background/50 border border-neon-blue/10">
                      <p className="text-sm text-holo-white/50">Mint Date</p>
                      <p className="text-holo-white font-medium">
                        {new Date(ticketDetails.mint_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-holo-white">No ticket details found</div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TicketDetailsModal; 