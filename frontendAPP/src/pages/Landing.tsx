import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Ticket, Shield, Banknote, Calendar, Zap, Gift, Lock } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import FeatureTile from '../components/FeatureTile';
import BenefitTile from '../components/BenefitTile';
import Footer from '../components/Footer';

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
    </div>
  );
};

export default Landing;