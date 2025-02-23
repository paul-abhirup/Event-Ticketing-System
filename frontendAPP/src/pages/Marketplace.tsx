import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tag, Clock, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Marketplace = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<{
    id: number;
    token_id: number;
    price: number;
    seller_address: string;
    expiration: string;
    ipfs_cid: string;
  }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch listings from the backend
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          setError('Please login first');
          navigate('/login');
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/marketplace/listings`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to fetch listings' }));
          throw new Error(errorData.message || 'Failed to fetch listings');
        }
        
        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setError(error instanceof Error ? error.message : 'Failed to fetch listings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [navigate]);

  if (error) {
    return (
      <div className="pt-20 px-4 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-20 px-4 text-center">
        Loading listings...
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
              src={`https://ipfs.io/ipfs/${listing.ipfs_cid}`} // Use IPFS hash to fetch image
               alt={`Ticket ${listing.token_id}`}
                className="w-full h-full object-cover"
               />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-holo-white">
                    Ticket #{listing.token_id}
                  </h3>
                  <p className="text-sm text-holo-white/70">
                    Seller: {listing.seller_address}
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
                    <span>Price</span>
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

// `https://ipfs.io/ipfs/bafkreiavmyavtywzr2dmajs6r22u4povkbiubul4ux6jhs26qudz5yy3yy/${listing.image}`;
