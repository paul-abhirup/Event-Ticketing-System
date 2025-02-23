import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Ticket, Shield, Banknote, Calendar, Zap, Gift, Lock, MapPin, Clock } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import PaymentModal from '../components/PaymentModal';
import FeatureTile from '../components/FeatureTile';
import BenefitTile from '../components/BenefitTile';
import Footer from '../components/Footer';
import { toast } from 'react-hot-toast';

interface Event {
  id: number;
  name: string;
  date: string;
  venue: string;
  price: number;
  image_url: string;
}

const Landing = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const [benefitsRef, benefitsInView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const benefitsControls = useAnimation();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<{
    id: number;
    price: number;
  } | null>(null);

  // Example upcoming events data
  const upcomingEvents: Event[] = [
    {
      id: 1,
      name: "Cyber Music Festival 2024",
      date: "2024-04-15",
      venue: "Neo Tokyo Arena",
      price: 0.5,
      image_url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      name: "Digital Art Exhibition",
      date: "2024-04-20",
      venue: "Virtual Gallery",
      price: 0.3,
      image_url: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      name: "Tech Conference 2024",
      date: "2024-05-01",
      venue: "Cyber Convention Center",
      price: 0.8,
      image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"
    }
  ];

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  useEffect(() => {
    if (benefitsInView) {
      benefitsControls.start('visible');
    }
  }, [benefitsControls, benefitsInView]);

  const handleEnterPlatform = () => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('token');
    
    // Navigate to dashboard if authenticated, otherwise to login
    navigate(isAuthenticated ? '/dashboard' : '/login');
  };

  const handleBuyNow = (event: Event) => {
    try {
      setSelectedTicket({
        id: event.id,
        price: event.price
      });
      setIsPaymentModalOpen(true);
    } catch (error) {
      console.error('Buy now error:', error);
      toast.error('Failed to process purchase');
    }
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedTicket(null);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Move background gradient lower in DOM */}
      
      {/* Hero Content - Add relative positioning and higher z-index */}
      <div className="relative z-20 h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Ticket className="w-20 h-20 text-neon-blue" />
          </motion.div>

          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-neon-blue to-cyber-purple bg-clip-text text-transparent"
            >
              TicketChain
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl text-holo-white/80 max-w-2xl mx-auto"
            >
              The future of event ticketing is here. Secure, transparent, and powered by blockchain technology.
            </motion.p>
          </div>

          {/* Add pointer-events-auto to ensure button is clickable */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEnterPlatform}
            className="mt-8 px-8 py-4 bg-gradient-to-r from-neon-blue to-cyber-purple rounded-lg text-xl font-bold shadow-lg hover:shadow-neon-blue/50 transition-shadow pointer-events-auto cursor-pointer"
          >
            Enter Platform
          </motion.button>
        </div>
      </div>

      {/* Background gradient - Move to bottom and lower z-index */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-background via-cyber-purple/20 to-background animate-gradient-xy pointer-events-none" />

      {/* How It Works Section */}
      <motion.section
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={{
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.8,
              staggerChildren: 0.2
            }
          },
          hidden: {
            opacity: 0,
            y: 50
          }
        }}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 py-32"
      >
        <motion.h2
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 20 }
          }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          How It Works
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          <FeatureTile
            Icon={Ticket}
            title="Buy Tickets as NFTs"
            description="Purchase tickets securely using crypto or fiat"
            delay={0.2}
          />
          <FeatureTile
            Icon={Shield}
            title="Secure Storage"
            description="Tickets are stored in your wallet securely"
            delay={0.4}
          />
          <FeatureTile
            Icon={Banknote}
            title="Easy Transfer & Resale"
            description="Sell or transfer tickets via our marketplace"
            delay={0.6}
          />
          <FeatureTile
            Icon={Calendar}
            title="Attend the Event"
            description="Scan your NFT QR code for entry"
            delay={0.8}
          />
        </div>
      </motion.section>

      {/* Security & Benefits Section */}
      <motion.section
        ref={benefitsRef}
        initial="hidden"
        animate={benefitsControls}
        variants={{
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.8,
              staggerChildren: 0.2
            }
          },
          hidden: {
            opacity: 0,
            y: 50
          }
        }}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 py-32"
      >
        <motion.h2
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 20 }
          }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Security & Benefits
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <BenefitTile
            Icon={Shield}
            title="Blockchain-Powered Authenticity"
            description="Ensure ticket validity with blockchain technology"
            delay={0.2}
          />
          <BenefitTile
            Icon={Zap}
            title="Instant Transfers & Resales"
            description="Seamlessly transfer or resell your tickets"
            delay={0.4}
          />
          <BenefitTile
            Icon={Lock}
            title="No Scalping, No Fraud!"
            description="Smart contracts prevent unauthorized resales"
            delay={0.6}
          />
          <BenefitTile
            Icon={Gift}
            title="Perks & Loyalty Rewards"
            description="Earn rewards for being an active community member"
            delay={0.8}
          />
        </div>
      </motion.section>

      {/* Footer */}
      <Footer />

      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80')] opacity-10 mix-blend-overlay" />

      {/* Upcoming Events Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-neon-blue to-cyber-purple bg-clip-text text-transparent mb-12">
            Upcoming Events
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-background/60 backdrop-blur-xl rounded-xl overflow-hidden border border-neon-blue/20 hover:border-neon-blue/40 transition-colors"
              >
                <div className="relative h-48">
                  <img
                    src={event.image_url}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-holo-white mb-2">
                    {event.name}
                  </h3>

                  <div className="space-y-2 text-sm text-holo-white/70 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-neon-blue" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-neon-blue" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-neon-blue" />
                      <span>{event.price} ETH</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button 
                      className="px-4 py-2 bg-neon-blue/10 rounded-lg text-neon-blue font-medium hover:bg-neon-blue/20 transition-colors"
                    >
                      Learn More
                    </button>
                    <button 
                      onClick={() => handleBuyNow(event)}
                      className="px-4 py-2 bg-gradient-to-r from-neon-blue to-cyber-purple rounded-lg text-white font-medium hover:shadow-lg hover:shadow-neon-blue/50 transition-shadow"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {selectedTicket && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={handleClosePaymentModal}
          amount={selectedTicket.price}
          ticketId={selectedTicket.id}
        />
      )}
    </div>
  );
};

export default Landing;