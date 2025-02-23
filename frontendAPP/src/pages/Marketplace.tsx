import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tag, Clock, ArrowUpRight, ExternalLink, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TicketDetailsModal from '../components/TicketDetailsModal';
import PaymentModal from '../components/PaymentModal';
import { toast } from "react-hot-toast";
import BidModal from '../components/BidModal';
import { supabase } from '../lib/supabaseClient';
import BidHistoryModal from '../components/BidHistoryModal';

const Marketplace = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<{
    id: number;
    token_id: number;
    price: number;
    seller_address: string;
    expiration: string;
    ipfs_cid: string;
    highest_bid?: {
      amount: number;
      bidder_address: string;
    };
  }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<{
    token_id: number;
    price: number;
  } | null>(null);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [selectedBidTicket, setSelectedBidTicket] = useState<{
    tokenId: number;
    price: number;
  } | null>(null);
  const [userWalletAddress, setUserWalletAddress] = useState<string>('');
  const [isBidHistoryModalOpen, setIsBidHistoryModalOpen] = useState(false);
  const [selectedHistoryTokenId, setSelectedHistoryTokenId] = useState<number | null>(null);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchListings = async (retryCount = 0) => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('Please login first');
        navigate('/login');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/marketplace/listings`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (response.status === 429) {
        if (retryCount < 3) { // Try up to 3 times
          await delay(1000 * (retryCount + 1)); // Exponential backoff
          return fetchListings(retryCount + 1);
        }
        throw new Error('Too many requests. Please try again later.');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }
      
      const data = await response.json();
      
      // Then fetch highest bids from Supabase directly
      const { data: bids, error: bidsError } = await supabase
        .from('bids')
        .select('*')
        .order('amount', { ascending: false });

      if (bidsError) {
        console.error('Error fetching bids:', bidsError);
      }

      // Map bids to listings
      const listingsWithBids = data.map((listing: any) => {
        const highestBid = bids?.find(bid => bid.token_id === listing.token_id);
        return {
          ...listing,
          highest_bid: highestBid ? {
            amount: highestBid.amount,
            bidder_address: highestBid.bidder_address
          } : undefined
        };
      });

      setListings(listingsWithBids);
      setError(null); // Clear any existing errors
    } catch (error) {
      console.error("Error fetching listings:", error);
      setError(error instanceof Error ? error.message : 'Failed to fetch listings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchListings();
  }, [navigate]);

  // Supabase real-time subscription for bids
  useEffect(() => {
    const subscription = supabase
      .channel('bid-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bids',
        },
        async (payload) => {
          console.log('New bid received:', payload);
          const newBid = payload.new;
          
          // Fetch the latest bids to ensure we have the correct highest bid
          const { data: latestBids, error: bidsError } = await supabase
            .from('bids')
            .select('*')
            .eq('token_id', newBid.token_id)
            .order('amount', { ascending: false })
            .limit(1);

          if (bidsError) {
            console.error('Error fetching latest bid:', bidsError);
            return;
          }

          const highestBid = latestBids?.[0];
          
          if (highestBid) {
            setListings(prevListings => 
              prevListings.map(listing => {
                if (listing.token_id === newBid.token_id) {
                  return {
                    ...listing,
                    highest_bid: {
                      amount: highestBid.amount,
                      bidder_address: highestBid.bidder_address
                    }
                  };
                }
                return listing;
              })
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Add this effect to get the user's wallet address
  useEffect(() => {
    const getUserWallet = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user?.user_metadata?.walletAddress) {
        setUserWalletAddress(user.user_metadata.walletAddress);
      }
    };
    getUserWallet();
  }, []);

  const handleTicketClick = (tokenId: number) => {
    setSelectedTicketId(tokenId);
    setIsDetailsModalOpen(true);
  };

  const handleBuyNow = (listing: { token_id: number; price: number }) => {
    try {
      setSelectedListing(listing);
      setIsPaymentModalOpen(true);
    } catch (error) {
      console.error('Buy now error:', error);
      toast.error('Failed to process purchase');
    }
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedListing(null);
  };

  const handlePlaceBid = (listing: { token_id: number; price: number }) => {
    setSelectedBidTicket({
      tokenId: listing.token_id,
      price: listing.price
    });
    setIsBidModalOpen(true);
  };

  const handleCloseBidModal = () => {
    setIsBidModalOpen(false);
    setSelectedBidTicket(null);
  };

  const handleBidSuccess = () => {
    fetchListings();
    handleCloseBidModal();
  };

  const handleViewBidHistory = (tokenId: number) => {
    setSelectedHistoryTokenId(tokenId);
    setIsBidHistoryModalOpen(true);
  };

  if (error) {
    return (
      <div className="pt-20 px-4 text-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchListings();
            }}
            className="mt-4 px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-20 px-4 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-neon-blue/20 rounded mx-auto"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-background/60 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Marketplace Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-blue to-cyber-purple bg-clip-text text-transparent">
          Ticket Marketplace
        </h1>
        <button
          onClick={() => navigate("/list-ticket")}
          className="px-4 py-2 bg-gradient-to-r from-neon-blue to-cyber-purple rounded-lg text-white font-medium hover:shadow-lg hover:shadow-neon-blue/50 transition-shadow"
        >
          List Ticket
        </button>
      </motion.div>

      {/* Marketplace Listings */}
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
                src={`https://ipfs.io/ipfs/${listing.ipfs_cid}`}
                alt={`Ticket ${listing.token_id}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
              
              {/* Add Highest Bid Banner */}
              {listing.highest_bid && (
                <div className="absolute top-4 right-4 bg-cyber-purple/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-cyber-purple/50 shadow-lg">
                  <p className="text-white text-sm font-medium">
                    Highest bid: {listing.highest_bid.amount} ETH
                  </p>
                </div>
              )}

              {/* Add Bid History Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewBidHistory(listing.token_id);
                }}
                className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm p-2 rounded-full border border-neon-blue/50 shadow-lg hover:bg-background/70 transition-colors"
              >
                <History className="w-5 h-5 text-neon-blue" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-holo-white">
                    Ticket #{listing.token_id}
                  </h3>
                  <p className="text-sm text-holo-white/70">
                    Seller: {listing.seller_address.slice(0, 6)}...{listing.seller_address.slice(-4)}
                  </p>
                  {/* Add Bid Status */}
                  {listing.highest_bid ? (
                    <p className="mt-1 text-sm text-cyber-purple">
                      Current highest: {listing.highest_bid.amount} ETH
                      <span className="text-xs text-holo-white/50 block">
                        by {listing.highest_bid.bidder_address.slice(0, 6)}...
                        {listing.highest_bid.bidder_address.slice(-4)}
                      </span>
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-holo-white/50">
                      No bids yet
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => handleTicketClick(listing.token_id)}
                  className="text-neon-blue hover:text-cyber-purple transition-colors"
                >
                  <ExternalLink className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-3 text-sm text-holo-white/70">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-neon-blue" />
                    <span>List Price</span>
                  </div>
                  <span className="text-neon-blue font-semibold">
                    {listing.price} ETH
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-neon-blue" />
                    <span>Expires</span>
                  </div>
                  <span>{new Date(listing.expiration).toLocaleString()}</span>
                </div>

                {/* Add Bid Progress */}
                {listing.highest_bid && (
                  <div className="mt-2 pt-2 border-t border-neon-blue/10">
                    <div className="flex justify-between items-baseline text-xs text-holo-white/50 mb-1">
                      <span>List Price</span>
                      <span>Highest Bid</span>
                    </div>
                    <div className="relative h-2 bg-background/40 rounded-full overflow-hidden">
                      <div 
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-neon-blue to-cyber-purple rounded-full"
                        style={{ 
                          width: `${Math.min((listing.highest_bid.amount / listing.price) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handlePlaceBid(listing)}
                  className="px-4 py-2 bg-neon-blue/10 rounded-lg text-neon-blue font-medium hover:bg-neon-blue/20 transition-colors"
                >
                  Place Bid
                </button>
                <button 
                  onClick={() => handleBuyNow(listing)}
                  className="px-4 py-2 bg-gradient-to-r from-neon-blue to-cyber-purple rounded-lg text-white font-medium hover:shadow-lg hover:shadow-neon-blue/50 transition-shadow"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add the details modal */}
      {selectedTicketId && (
        <TicketDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          tokenId={selectedTicketId}
        />
      )}

      {/* Add Payment Modal */}
      {selectedListing && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={handleClosePaymentModal}
          amount={selectedListing.price}
          ticketId={selectedListing.token_id}
        />
      )}

      {/* Add Bid Modal */}
      {selectedBidTicket && (
        <BidModal
          isOpen={isBidModalOpen}
          onClose={handleCloseBidModal}
          onBidSuccess={handleBidSuccess}
          tokenId={selectedBidTicket.tokenId}
          currentPrice={selectedBidTicket.price}
          highestBid={listings.find(l => l.token_id === selectedBidTicket.tokenId)?.highest_bid}
          walletAddress={userWalletAddress}
        />
      )}

      {/* Add the BidHistoryModal */}
      {selectedHistoryTokenId && (
        <BidHistoryModal
          isOpen={isBidHistoryModalOpen}
          onClose={() => {
            setIsBidHistoryModalOpen(false);
            setSelectedHistoryTokenId(null);
          }}
          tokenId={selectedHistoryTokenId}
        />
      )}
    </div>
  );
};

export default Marketplace;

// `https://ipfs.io/ipfs/bafkreiavmyavtywzr2dmajs6r22u4povkbiubul4ux6jhs26qudz5yy3yy/${listing.image}`;
