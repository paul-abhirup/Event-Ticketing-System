import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';

interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBidSuccess: () => void;
  tokenId: number;
  currentPrice: number;
  highestBid?: {
    amount: number;
    bidder_address: string;
  };
  walletAddress: string;
}

const BidModal = ({ isOpen, onClose, onBidSuccess, tokenId, currentPrice, highestBid, walletAddress }: BidModalProps) => {
  const [bidAmount, setBidAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const minimumBid = highestBid ? highestBid.amount + 0.01 : currentPrice + 0.01;

  const handleSubmitBid = async () => {
    try {
      setIsSubmitting(true);
      const amount = parseFloat(bidAmount);
      
      if (isNaN(amount) || amount <= minimumBid) {
        toast.error('Bid must be higher than current price');
        return;
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      // First, check if user already has a bid
      const { data: existingBid, error: fetchError } = await supabase
        .from('bids')
        .select('*')
        .eq('token_id', tokenId)
        .eq('bidder_address', walletAddress)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows found
        throw new Error(fetchError.message);
      }

      let bidResult;
      if (existingBid) {
        // Update existing bid
        bidResult = await supabase
          .from('bids')
          .update({
            amount: amount,
            updated_at: new Date().toISOString()
          })
          .eq('token_id', tokenId)
          .eq('bidder_address', walletAddress);
      } else {
        // Insert new bid
        bidResult = await supabase
          .from('bids')
          .insert([
            {
              token_id: tokenId,
              bidder_address: walletAddress,
              amount: amount,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]);
      }

      if (bidResult.error) {
        throw new Error(bidResult.error.message);
      }

      // Then notify the backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auction/bid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          tokenId,
          bidAmount: amount
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to place bid');
      }

      toast.success(existingBid ? 'Bid updated successfully!' : 'Bid placed successfully!');
      onBidSuccess();
    } catch (error) {
      console.error('Bid error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to place bid');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            className="fixed left-[35%] top-[30%] -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-background/90 backdrop-blur-xl p-6 rounded-2xl border border-neon-blue/30 shadow-xl shadow-neon-blue/10 z-50"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-cyber-purple bg-clip-text text-transparent">
                Place Bid
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-holo-white/70" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-holo-white/70">
                  <span>Listing Price:</span>
                  <span className="text-neon-blue">{currentPrice} ETH</span>
                </div>

                {highestBid && (
                  <div className="flex justify-between text-sm text-holo-white/70">
                    <span>Current Highest Bid:</span>
                    <div className="text-right">
                      <div className="text-cyber-purple">{highestBid.amount} ETH</div>
                      <div className="text-xs text-holo-white/50">
                        by {highestBid.bidder_address.slice(0, 6)}...
                        {highestBid.bidder_address.slice(-4)}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between text-sm text-holo-white/70">
                  <span>Minimum Bid:</span>
                  <span className="text-neon-blue">{minimumBid} ETH</span>
                </div>
              </div>

              <div className="relative">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`Enter bid amount (min. ${minimumBid} ETH)`}
                  step="0.01"
                  min={minimumBid}
                  className="w-full px-4 py-2 bg-background/60 border border-neon-blue/20 rounded-lg text-holo-white focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue/50"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-holo-white/50">
                  ETH
                </span>
              </div>

              <div className="flex items-start space-x-2 text-sm text-holo-white/50">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>
                  Your bid must be higher than the current price. Bids are binding and cannot be withdrawn.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-background/60 border border-neon-blue/20 rounded-lg text-holo-white hover:bg-background/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitBid}
                  disabled={isSubmitting || !bidAmount || parseFloat(bidAmount) <= minimumBid}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-neon-blue to-cyber-purple rounded-lg text-white font-medium hover:shadow-lg hover:shadow-neon-blue/50 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Placing Bid...' : 'Place Bid'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BidModal; 