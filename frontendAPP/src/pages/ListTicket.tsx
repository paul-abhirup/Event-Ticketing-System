import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast"; // Make sure to install react-hot-toast if not already installed

interface ListingFormData {
  tokenId: string;
  price: string;
  expiration: string;
}

const ListTicket = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState<ListingFormData>({
    tokenId: "",
    price: "",
    expiration: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Add useEffect to check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Please login first');
      navigate('/login');
    }
  }, [navigate]);

  // Add this useEffect to handle query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenId = params.get('tokenId');
    if (tokenId) {
      setFormData(prev => ({
        ...prev,
        tokenId: tokenId
      }));
    }
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        toast.error('Please login first');
        navigate('/login');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/marketplace/list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          tokenId: parseInt(formData.tokenId),
          price: parseFloat(formData.price),
          expiration: new Date(formData.expiration).toISOString(),
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to list ticket");
      }

      toast.success("Ticket listed successfully!");
      setTimeout(() => {
        navigate("/marketplace");
      }, 1500);
    } catch (error) {
      console.error("Error listing ticket:", error);
      toast.error(error instanceof Error ? error.message : "Failed to list ticket. Please try again.");
      
      // If unauthorized, redirect to login
      if (error instanceof Error && error.message.includes('login')) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-blue to-cyber-purple bg-clip-text text-transparent">
          List Your Ticket
        </h1>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 bg-background/60 backdrop-blur-xl p-6 rounded-xl border border-neon-blue/20"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block text-sm font-medium text-holo-white mb-2">
            Token ID
          </label>
          <input
            type="number"
            name="tokenId"
            value={formData.tokenId}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-background/60 border border-neon-blue/20 rounded-lg focus:outline-none focus:border-neon-blue text-holo-white"
            required
            readOnly={!!location.search}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-holo-white mb-2">
            Price (ETH)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            step="0.001"
            className="w-full px-4 py-2 bg-background/60 border border-neon-blue/20 rounded-lg focus:outline-none focus:border-neon-blue text-holo-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-holo-white mb-2">
            Expiration Date
          </label>
          <input
            type="datetime-local"
            name="expiration"
            value={formData.expiration}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-background/60 border border-neon-blue/20 rounded-lg focus:outline-none focus:border-neon-blue text-holo-white"
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/marketplace")}
            className="flex-1 px-4 py-2 bg-background/60 border border-neon-blue/20 rounded-lg text-neon-blue font-medium hover:bg-neon-blue/10 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-neon-blue to-cyber-purple rounded-lg text-white font-medium hover:shadow-lg hover:shadow-neon-blue/50 transition-shadow disabled:opacity-50"
          >
            {isLoading ? "Listing..." : "List Ticket"}
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default ListTicket; 