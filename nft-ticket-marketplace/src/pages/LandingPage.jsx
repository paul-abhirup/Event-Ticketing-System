import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Ticket, Coins, ArrowRight, Star, ChevronRight, Github, Twitter, Linkedin } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[rgba(29,32,41,1)]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#0A0A0A] to-[rgba(29,32,41,1)]">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00F5FF] rounded-full filter blur-[128px] opacity-20 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#6C00FF] rounded-full filter blur-[128px] opacity-20 animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <nav className="absolute top-0 left-0 right-0 py-6 flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-space-grotesk font-bold text-[#00F5FF]"
            >
              NFTickets
            </motion.div>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/home')}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-[#00F5FF] to-[#6C00FF] text-white font-medium"
            >
              Launch App
            </motion.button>
          </nav>

          <div className="text-center pt-32">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-7xl font-space-grotesk font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-[#00F5FF] to-[#6C00FF] text-transparent bg-clip-text">
                Revolutionary
              </span>
              <br />
              Event Ticketing Platform
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-[#F0F4FF]/80 max-w-2xl mx-auto mb-12"
            >
              Experience the future of event ticketing with blockchain technology.
              Secure, transparent, and seamless transactions for your entertainment.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4 justify-center"
            >
              <button
                onClick={() => navigate('/home')}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-[#00F5FF] to-[#6C00FF] text-white font-medium flex items-center gap-2 hover:shadow-[0_8px_32px_rgba(0,245,255,0.3)] transition-shadow"
              >
                Get Started <ArrowRight size={20} />
              </button>
              <button className="px-8 py-3 rounded-full border border-[#00F5FF]/20 text-[#F0F4FF] font-medium hover:bg-[#00F5FF]/10 transition-colors">
                Learn More
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[#0A0A0A]/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-space-grotesk font-bold mb-4">
              Why Choose NFTickets?
            </h2>
            <p className="text-[#F0F4FF]/60 max-w-2xl mx-auto">
              Experience the next generation of event ticketing with our cutting-edge blockchain technology
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="text-[#00F5FF] w-8 h-8" />,
                title: "Secure Transactions",
                description: "Every ticket purchase is secured by blockchain technology, eliminating fraud and counterfeiting."
              },
              {
                icon: <Ticket className="text-[#00F5FF] w-8 h-8" />,
                title: "Easy Transfer",
                description: "Transfer tickets seamlessly with our user-friendly platform, all validated on the blockchain."
              },
              {
                icon: <Coins className="text-[#00F5FF] w-8 h-8" />,
                title: "Smart Marketplace",
                description: "Buy and sell tickets in our decentralized marketplace with real-time pricing and instant transfers."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-[#0A0A0A] p-8 rounded-2xl border border-[#00F5FF]/10 hover:border-[#00F5FF]/30 transition-colors"
              >
                <div className="bg-[#00F5FF]/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-space-grotesk font-bold mb-4">{feature.title}</h3>
                <p className="text-[#F0F4FF]/60">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-space-grotesk font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-[#F0F4FF]/60 max-w-2xl mx-auto">
              Join thousands of satisfied users who have revolutionized their event experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Thompson",
                role: "Event Organizer",
                comment: "NFTickets has transformed how we handle event ticketing. The security and ease of use are unmatched."
              },
              {
                name: "Sarah Chen",
                role: "Regular Concert-goer",
                comment: "I love how easy it is to buy and transfer tickets. The blockchain verification gives me peace of mind."
              },
              {
                name: "Marcus Rodriguez",
                role: "Venue Manager",
                comment: "The real-time tracking and verification features have made our operations much more efficient."
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-[#0A0A0A] p-8 rounded-2xl border border-[#00F5FF]/10"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#00F5FF] text-[#00F5FF]" />
                  ))}
                </div>
                <p className="text-[#F0F4FF]/80 mb-6">{testimonial.comment}</p>
                <div>
                  <p className="font-space-grotesk font-bold">{testimonial.name}</p>
                  <p className="text-[#F0F4FF]/60 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#0A0A0A]/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-space-grotesk font-bold mb-6">
              Ready to Experience the Future of Ticketing?
            </h2>
            <p className="text-xl text-[#F0F4FF]/60 mb-8">
              Join thousands of users who have already transformed their event experience
            </p>
            <button
              onClick={() => navigate('/home')}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[#00F5FF] to-[#6C00FF] text-white font-medium flex items-center gap-2 mx-auto hover:shadow-[0_8px_32px_rgba(0,245,255,0.3)] transition-shadow"
            >
              Get Started Now <ChevronRight size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] py-12 border-t border-[#00F5FF]/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-space-grotesk font-bold text-[#00F5FF] mb-4">NFTickets</h3>
              <p className="text-[#F0F4FF]/60">Revolutionizing event ticketing with blockchain technology</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-[#F0F4FF]/60">
                <li>Features</li>
                <li>Security</li>
                <li>Marketplace</li>
                <li>Pricing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-[#F0F4FF]/60">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <div className="flex gap-4">
                <Github className="w-6 h-6 text-[#F0F4FF]/60 hover:text-[#00F5FF] cursor-pointer" />
                <Twitter className="w-6 h-6 text-[#F0F4FF]/60 hover:text-[#00F5FF] cursor-pointer" />
                <Linkedin className="w-6 h-6 text-[#F0F4FF]/60 hover:text-[#00F5FF] cursor-pointer" />
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-[#00F5FF]/10 text-center text-[#F0F4FF]/60">
            <p>© 2024 NFTickets. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;