import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, History, TrendingUp, User, Calendar } from 'lucide-react';

interface Bid {
  amount: number;
  bidder_address: string;
  created_at: string;
}

interface BidHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenId: number;
}

const BidHistoryModal = ({ isOpen, onClose, tokenId }: BidHistoryModalProps) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBidHistory = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auction/${tokenId}/bids`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch bid history');
        }

        const data = await response.json();
        setBids(data);
      } catch (error) {
        console.error('Error fetching bid history:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch bid history');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchBidHistory();
    }
  }, [tokenId, isOpen]);

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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-background/90 backdrop-blur-xl p-6 rounded-2xl border border-neon-blue/30 shadow-xl shadow-neon-blue/10 z-50"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <History className="w-6 h-6 text-cyber-purple" />
                <h3 className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-cyber-purple bg-clip-text text-transparent">
                  Bid History
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-holo-white/70" />
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-blue"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">{error}</div>
            ) : bids.length === 0 ? (
              <div className="text-center text-holo-white/50 py-8">No bids yet</div>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {bids.map((bid, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-background/60 border border-neon-blue/20 rounded-lg p-4 space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2 text-holo-white/70">
                        <TrendingUp className="w-4 h-4 text-cyber-purple" />
                        <span className="text-lg font-semibold text-cyber-purple">
                          {bid.amount} ETH
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-holo-white/50">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(bid.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-holo-white/70">
                      <User className="w-4 h-4 text-neon-blue" />
                      <span>
                        {bid.bidder_address.slice(0, 6)}...{bid.bidder_address.slice(-4)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BidHistoryModal; 