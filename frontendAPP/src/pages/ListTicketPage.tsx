import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';

const ListTicketPage = () => {
  const navigate = useNavigate();
  const [userTickets, setUserTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [listingPrice, setListingPrice] = useState('');
  const [expirationDays, setExpirationDays] = useState('30');

  // Fetch user's unlisted tickets
  useEffect(() => {
    const fetchUserTickets = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }

        const { data: tickets, error } = await supabase
          .from('tickets')
          .select(`
            *,
            events (
              name,
              venue,
              date,
              ticket_price
            )
          `)
          .eq('owner_address', user.user_metadata.walletAddress)
          .eq('status', 'active')
          .not('token_id', 'in', (
            supabase
              .from('listings')
              .select('token_id')
              .eq('status', 'active')
          ));

        if (error) throw error;
        setUserTickets(tickets);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        toast.error('Failed to fetch tickets');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserTickets();
  }, [navigate]);

  const handleListTicket = async () => {
    try {
      if (!selectedTicket || !listingPrice) {
        toast.error('Please select a ticket and set a price');
        return;
      }

      const price = parseFloat(listingPrice);
      if (isNaN(price) || price <= 0) {
        toast.error('Please enter a valid price');
        return;
      }

      const expiration = new Date();
      expiration.setDate(expiration.getDate() + parseInt(expirationDays));

      const { data: listing, error } = await supabase
        .from('listings')
        .insert([
          {
            token_id: selectedTicket.token_id,
            price: price,
            seller_address: selectedTicket.owner_address,
            expiration: expiration.toISOString(),
            status: 'active'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success('Ticket listed successfully!');
      navigate('/marketplace');
    } catch (error) {
      console.error('Error listing ticket:', error);
      toast.error('Failed to list ticket');
    }
  };

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-blue to-cyber-purple bg-clip-text text-transparent mb-8">
        List Your Ticket
      </h1>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {/* Loading skeleton */}
        </div>
      ) : userTickets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-holo-white/70">No tickets available for listing</p>
          <button
            onClick={() => navigate('/marketplace')}
            className="mt-4 px-4 py-2 bg-neon-blue/10 rounded-lg text-neon-blue"
          >
            Browse Marketplace
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Ticket selection */}
          <div className="space-y-2">
            <label className="text-sm text-holo-white/70">Select Ticket</label>
            <div className="grid gap-4">
              {userTickets.map((ticket) => (
                <button
                  key={ticket.token_id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-4 rounded-lg border ${
                    selectedTicket?.token_id === ticket.token_id
                      ? 'border-neon-blue bg-neon-blue/10'
                      : 'border-neon-blue/20 hover:border-neon-blue/40'
                  } transition-colors text-left`}
                >
                  <h3 className="text-holo-white font-medium">
                    {ticket.events.name}
                  </h3>
                  <p className="text-sm text-holo-white/70">
                    Ticket #{ticket.token_id}
                  </p>
                  <p className="text-xs text-holo-white/50">
                    {ticket.events.venue} • {new Date(ticket.events.date).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Price input */}
          <div className="space-y-2">
            <label className="text-sm text-holo-white/70">Listing Price (ETH)</label>
            <input
              type="number"
              value={listingPrice}
              onChange={(e) => setListingPrice(e.target.value)}
              step="0.01"
              min="0"
              className="w-full px-4 py-2 bg-background/60 border border-neon-blue/20 rounded-lg text-holo-white focus:border-neon-blue focus:outline-none"
              placeholder="Enter price in ETH"
            />
          </div>

          {/* Expiration selection */}
          <div className="space-y-2">
            <label className="text-sm text-holo-white/70">Listing Duration</label>
            <select
              value={expirationDays}
              onChange={(e) => setExpirationDays(e.target.value)}
              className="w-full px-4 py-2 bg-background/60 border border-neon-blue/20 rounded-lg text-holo-white focus:border-neon-blue focus:outline-none"
            >
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
              <option value="60">60 days</option>
            </select>
          </div>

          {/* Submit button */}
          <button
            onClick={handleListTicket}
            disabled={!selectedTicket || !listingPrice}
            className="w-full px-4 py-3 bg-gradient-to-r from-neon-blue to-cyber-purple rounded-lg text-white font-medium hover:shadow-lg hover:shadow-neon-blue/50 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            List Ticket
          </button>
        </div>
      )}
    </div>
  );
};

export default ListTicketPage; 