import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Copy, ExternalLink } from 'lucide-react';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';
import { getAuthToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import TicketQRModal from '../components/TicketQRModal';
import TicketDetailsModal from '../components/TicketDetailsModal';

interface UserTicket {
  token_id: number;
  event_id: number;
  owner_address: string;
  event_name: string;
  event_date: string;
  ipfs_cid: string;
  venue: string;
  mint_date: string;
  is_used: boolean;
}

const Profile = () => {
  const { address } = useAccount();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<UserTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserTickets = async () => {
      if (!address) return;

      try {
        const token = getAuthToken();
        const normalizedAddress = address.toLowerCase();
        console.log('Fetching tickets for address:', normalizedAddress);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${normalizedAddress}/tickets`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          credentials: 'include',
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Error response:', errorData);
          throw new Error(errorData.message || 'Failed to fetch tickets');
        }

        const data = await response.json();
        console.log('Fetched tickets:', data);
        
        if (Array.isArray(data) && data.length === 0) {
          console.log('No tickets found for address:', normalizedAddress);
        }
        
        setTickets(data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch tickets');
        toast.error('Failed to load tickets');
      } finally {
        setIsLoading(false);
      }
    };

    if (address) {
      fetchUserTickets();
    } else {
      setIsLoading(false);
    }
  }, [address]);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard');
    }
  };

  const handleListTicket = (tokenId: number) => {
    navigate(`/list-ticket?tokenId=${tokenId}`);
  };

  const handleViewQR = (ticket: UserTicket) => {
    setSelectedTicket(ticket);
    setIsQRModalOpen(true);
  };

  const handleTicketClick = (tokenId: number) => {
    setSelectedTicketId(tokenId);
    setIsDetailsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="pt-20 px-4 text-center">
        Loading tickets...
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 px-4 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

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
          {tickets.map((ticket, index) => (
            <motion.div
              key={ticket.token_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-background/60 backdrop-blur-xl rounded-xl overflow-hidden border border-neon-blue/20 hover:border-neon-blue/40 transition-colors"
            >
              <div className="relative h-48">
                <img
                  src={`https://ipfs.io/ipfs/${ticket.ipfs_cid}`}
                  alt={ticket.event_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-holo-white">
                      {ticket.event_name}
                    </h3>
                    <p className="text-sm text-holo-white/70">
                      Ticket #{ticket.token_id}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleTicketClick(ticket.token_id)}
                    className="text-neon-blue hover:text-cyber-purple transition-colors"
                  >
                    <ExternalLink className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex items-center text-sm text-holo-white/70 mb-4">
                  <Ticket className="w-4 h-4 mr-2 text-neon-blue" />
                  <span>{new Date(ticket.event_date).toLocaleDateString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleViewQR(ticket)}
                    className="px-4 py-2 bg-neon-blue/10 rounded-lg text-neon-blue font-medium hover:bg-neon-blue/20 transition-colors"
                  >
                    View QR
                  </button>
                  <button 
                    onClick={() => handleListTicket(ticket.token_id)}
                    className="px-4 py-2 bg-gradient-to-r from-neon-blue to-cyber-purple rounded-lg text-white font-medium hover:shadow-lg hover:shadow-neon-blue/50 transition-shadow"
                  >
                    List for Sale
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* QR Modal */}
      {selectedTicket && (
        <TicketQRModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          ticketData={{
            owner_address: selectedTicket.owner_address,
            event_id: selectedTicket.event_id.toString(),
            event_name: selectedTicket.event_name
          }}
        />
      )}

      {/* Details Modal */}
      {selectedTicketId && (
        <TicketDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          tokenId={selectedTicketId}
        />
      )}
    </div>
  );
};

export default Profile;